const axios = require('axios')
const fs = require('fs'); 
const path = require('path');
const chalk = require('chalk')
const ora = require('ora'); 
const notion_md = require('../modules/notion_md');
const TUI = require('../../tui/component/keyboard');
const inquiry = require('../modules/inquirer');
const filePath = path.join(__dirname,'./rulesOfConversion.json')
const rawData = fs.readFileSync(filePath,'utf-8');
const rulesOfAccess= JSON.parse(rawData)

require('dotenv').config({ path: path.resolve(__dirname, '../../configurations/.env') });
const token = process.env.API_KEY 


const cachePath = path.resolve(__dirname, '../.cache/databaseKey.json');
let existingData = {};
try {
  existingData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  
} catch (error) {
}


const DatabaseAPI = {
  databaseSchema: {
    "database_id": "default_id",
    "parent_id": "default_parent_id",
    "properties": {},
    "databaseURL": null,
    "timing": {
      "state": false,
      "day": "default_day",
      "time": "default_time",
      "frequency": "default_frequency"
    },
    "file_location": null,
    "github_repo": null,
    "template": null,
    "export": {
      "state": false,
      "format": "default_format",
      "compression": false,
      "Multiple": false
    },
    "conditions" : {},
    "displayProperties" : null,
    "AccessibilityRules" : []
  },
  headers : { 
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
    "Notion-Version": "2022-02-22" 
  },
  responseDatabase: async (databaseID, name) => {
    const spinner = ora('Fetching database information...').start();
    try {
      const readUrl = `https://api.notion.com/v1/databases/${databaseID}`;
      const response = await axios({
        method: 'GET',
        url: readUrl,
        headers: DatabaseAPI.headers,
      });
      if (response.status === 200) {
        spinner.succeed('Response Received: 200'); 
        const data = response.data;
        const DbName = (name || data['title'][0]['plain_text']).split(" ").join("_");
        console.log(`Database Entry Created: ${chalk.italic(DbName)}`);
        const template = { ...DatabaseAPI.databaseSchema };
        template.database_id = data['id'];
        template.parent_id = data['parent']['page_id'];
        template.properties = data['properties'];
        [template.displayProperties, template.AccessibilityRules] =  await DatabaseAPI.establishDisplay(data['properties'],databaseID)
        const CacheValue = template;

        const databaseInfo = {
          [DbName]: CacheValue,
        };

        const filePath = path.resolve(__dirname, '../.cache/databaseKey.json');
        let existingData = {};
        try {
          existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
        }
        const mergedData = { ...existingData, ...databaseInfo };
         fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2), 'utf8');

        return databaseInfo
      } else {
        spinner.fail('Database Not Found'); 
        return "Database Not Found";
      }
    } catch (error) {
      spinner.fail('Error fetching data'); 
      console.error('Error:', error);
      throw error;
    }
  },
  resolveDatabaseIdentity : async(databaseName,databaseID)=>{
    const dbName = databaseName || Object.keys(existingData).find(key => existingData[key].database_id.replace(/-/g, '')==databaseID);
    const id = databaseID || existingData[databaseName].database_id
    return [dbName,id]
  },
  establishDisplay : async(obj,database_id) =>{
    const key = Object.keys(obj)
    try {
      let numbers = await TUI.MultipleChoiceMenu(key)
      for (const num of numbers) {
        if (num < 1 || num > key.length) {
          throw new Error('Invalid property number: ' + num);
        }
      }
      let [displayArr, Accessibility] = await DatabaseAPI.establishAccess(numbers,database_id)
      return [displayArr,Accessibility];
    } catch (error) {
      console.error(error.message);
    }  
  },
  establishAccess: async (arr, databaseID) => {
    try {
      const results = await DatabaseAPI.readDatabase(databaseID, null, 1);
      const properties = results[0]['properties'];
  
      const accessRules = {};
  
      // Find the properties with type "title" in the original array
      const titleProperties = arr.filter(key => properties[key].type === 'title');
  
      // Remove the title properties from the original array
      arr = arr.filter(key => properties[key].type !== 'title');
  
      // If there are no title properties in the original array, find one in the properties and add it to the titleProperties array
      if (titleProperties.length === 0) {
        for (const key in properties) {
          if (properties[key].type === 'title') {
            titleProperties.push(key);
            break;
          }
        }
      }
  
      // Push the title properties forward in the array
      arr = [...titleProperties, ...arr];
  
      for (const key of arr) {
        const type = properties[key].type;
        const rule = rulesOfAccess[type];
        if (rule) {
          accessRules[key] = rule;
        }
      }
  
      const formattedAccessRules = {};
      for (const key in accessRules) {
        formattedAccessRules[key] = accessRules[key].access;
      }
  
      return [arr, formattedAccessRules];
    } catch (error) {
      console.error(error);
      return [[], {}];
    }
  },
   confgSettings: async (settingName, databaseName,databaseID=undefined) => {
    try {
      const filePath = path.resolve(__dirname, '../.cache/databaseKey.json');
      let existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (databaseID!=undefined){
        let [databaseName, id] = await DatabaseAPI.resolveDatabaseIdentity(databaseName, databaseID);
      }
      const obj = existingData[databaseName];
  
      if (obj && obj[settingName] !== undefined) {
        console.log(`Current value of '${settingName}': ${obj[settingName]}`);
        const NewValue = inquiry.question('Enter the new value: ');

        obj[settingName] = NewValue;

        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
        console.log(`Value of '${settingName}' updated to '${NewValue}'.`);
      } else {
        console.error(`Invalid key provided: '${settingName}'`);
      }
    } catch (error) {
      throw error;
    }
  },
  establishSettings : async (databaseName,databaseID) =>{
    const [dbName, id] = await DatabaseAPI.resolveDatabaseIdentity(databaseName, databaseID);
    const defaultProperties = {
      "database_id": "default_id",
      "parent_id": "default_parent_id",
      "properties": {},
    };
  
    const customProperties = {};
    let schema = existingData[dbName]
    for (const key in schema) {
      if (!defaultProperties.hasOwnProperty(key)) {
        customProperties[key] = schema[key];
      }
    }
  
  let values = Object.keys(customProperties);
  while(true){
    let index =await TUI.SingleChoiceMenu(values)
    if(index<0){
      break;
    }
    else{
      await DatabaseAPI.confgSettings(values[index],dbName)
    }
  }

  },
  readDatabase: async (databaseID,databaseName=null,ItemNumber=100,requireFormating=false,extract=false) => {
    try {
      const [dbName,id] = await DatabaseAPI.resolveDatabaseIdentity(databaseName,databaseID)
      const response = await axios({ 
        method: "POST",
        url: `https://api.notion.com/v1/databases/${id}/query`,
        headers : DatabaseAPI.headers,
        sorts: [
        ],
        data : {page_size : ItemNumber, filter : extract ? existingData[databaseName].conditions : undefined},
      
      })
      const results = response.data['results'];

      if (requireFormating){
        const displayProperties = existingData[dbName]["displayProperties"];
        const AccessibilityRules = existingData[dbName]["AccessibilityRules"];
  
        function getValueByAccessRules(obj, accessRules) {
          let value = obj;
        
          for (const key of accessRules) {
            if (value && value[key] !== undefined) {
              value = value[key];
        
              if (Array.isArray(value)) {

                value = value.map(item => (item && item.name) || (item.text['content'] )).join(', ');

                return value=='' ? 'wrong format' : value
              }
            } else {
              value = '-';
              break;
            }
          }
        
          return value;
        }
        let display =[]
        let exportIDs =[]
        results.forEach(data=>{
          if(extract){
            let pageID = data.id.replace(/-/g, '')
            exportIDs.push(pageID)
          }
          let prop = data.properties
          let filteredProp = []
          displayProperties.forEach(key => {
            if (prop[key]) {
              filteredProp.push(getValueByAccessRules(prop[key],AccessibilityRules[key]))
            }
          });
          display.push(filteredProp)
        })
        const table = [];
        display.forEach(rowData => {
          const row = {};
          displayProperties.forEach((property, index) => {
            row[property] = rowData[index];
          });
          table.push(row);
        });

        console.table(table);
        if(extract){
          for(i=0 ; i<=display.length; i++){
            await DatabaseAPI.readPage(exportIDs[i],display[i][0],existingData[databaseName].file_location,databaseName)
          }
        }
        return table
      } else {
        return results
      }

    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  },

  readPage : async(pageID,title,fileLocation,dbName) =>{


    try {
      const response = await axios({
        method: 'GET',
        url: `https://api.notion.com/v1/blocks/${pageID}/children?page_size=100`,
        headers: DatabaseAPI.headers,
      });

      const pageContent = response.data['results'];
      const blocksArray = await DatabaseAPI.processBlocks(pageContent,DatabaseAPI.headers);
      notion_md.convertor(blocksArray,title,fileLocation,dbName);
      return true
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
 retrieveChildBlock : async(blockID)=> {
    try {
      const response = await axios({
        method: 'GET',
        url: `https://api.notion.com/v1/blocks/${blockID}/children`,
        headers: DatabaseAPI.headers,
      });
      const content = response.data;
      return content;
    } catch (error) {
      throw error;
    }
  },
  nestingLevel : 0,
  processBlocks: async (blocks) => {
    const blocksArray = [];

    for (const block of blocks) {
      if (block.has_children) {
        blocksArray.push({ ...block, incremental: 0 });
        DatabaseAPI.nestingLevel++;
        const childBlocks = await DatabaseAPI.retrieveChildBlock(block.id);

        childBlocks.results.forEach((childBlock) => {
          childBlock.incremental = DatabaseAPI.nestingLevel;
        });

        blocksArray.push(...await DatabaseAPI.processBlocks(childBlocks.results));
        DatabaseAPI.nestingLevel--; 
      } else {
        block.incremental = DatabaseAPI.nestingLevel;
        blocksArray.push(block);
      }
    }

    return blocksArray;
  }
}


module.exports = DatabaseAPI
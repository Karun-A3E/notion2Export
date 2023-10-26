const axios = require('axios')
const fs = require('fs'); 
const path = require('path');
const chalk = require('chalk')
const ora = require('ora'); 
const notion_md = require('../modules/notion_md');
const TUI = require('../../tui/component/keyboard')
const filePath = path.join(__dirname,'./rulesOfConversion.json')
const rawData = fs.readFileSync(filePath,'utf-8');
const rulesOfAccess= JSON.parse(rawData)

require('dotenv').config({ path: path.resolve(__dirname, '../../configurations/.env') });
const token = process.env.API_KEY 


const inquirer =require('../modules/inquirer')

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
  establishDisplay : async(obj,database_id) =>{
    const key = Object.keys(obj);
    key.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    }); 
    // console.log(key)
    await TUI.MultipleChoiceMenu(key)
    try {
      const userAnswer = inquirer.question('Enter the properties with number seperated by "," : ',true,/^\d+(,\d+)*$/);
      const numbers = userAnswer.split(',').map((num) => parseInt(num.trim()));

      for (const num of numbers) {
        if (num < 1 || num > key.length) {
          throw new Error('Invalid property number: ' + num);
        }
      }
      const selectedKeys = numbers.map((num) => key[num - 1]);
      const Accessibility = await DatabaseAPI.establishAccess(selectedKeys,database_id)
      return [selectedKeys,Accessibility];
    } catch (error) {
      console.error(error.message);
    }  
  },
  establishAccess : async (arr,databaseID) => {
      try {
        const results = await DatabaseAPI.readDatabase(databaseID, null, 1);
        const properties = results[0]['properties'];
    
        const accessRules = {};
    
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
    
        return formattedAccessRules;
      } catch (error) {
        console.error(error);
        return {};
      }
  },
    
  readDatabase: async (databaseID,databaseName=null,filters,ItemNumber=100,requireFormating=false,extract=false) => {
    try {
      const filePath = path.resolve(__dirname, '../.cache/databaseKey.json');
      let existingData = {};
      try {
        existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
      } catch (error) {
      }
      const dbName = databaseName || Object.keys(existingData).find(key => existingData[key].database_id.replace(/-/g, '')==databaseID);
      const id = databaseID || existingData[databaseName].database_id

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
            await DatabaseAPI.readPage(exportIDs[i],display[i][0],existingData[databaseName].file_location)
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

  readPage : async(pageID,title,fileLocation) =>{


    try {
      const response = await axios({
        method: 'GET',
        url: `https://api.notion.com/v1/blocks/${pageID}/children?page_size=100`,
        headers: DatabaseAPI.headers,
      });

      const pageContent = response.data['results'];
      const blocksArray = await DatabaseAPI.processBlocks(pageContent,DatabaseAPI.headers);
      notion_md.convertor(blocksArray,title,fileLocation);
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
const axios = require('axios')
const fs = require('fs'); 
const path = require('path');
const chalk = require('chalk')
const ora = require('ora'); 
const notion_md = require('../modules/notion_md')


//!--------TESTING --NEED TO REMOVE
require('dotenv').config({ path: path.resolve(__dirname, '../../configurations/.env') });
const token = process.env.API_KEY 
let headers= { 
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token,
  "Notion-Version": "2022-02-22" 
}
//!--------TESTING --NEED TO REMOVE



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
    "conditions" : {}
  },
  responseDatabase: async (databaseID, headers, name) => {
    const spinner = ora('Fetching database information...').start();
    try {
      const readUrl = `https://api.notion.com/v1/databases/${databaseID}`;
      const response = await axios({
        method: 'GET',
        url: readUrl,
        headers: headers,
      });
      if (response.status === 200) {
        spinner.succeed('Response Received: 200'); 
        const data = response.data;
        const DbName = name || data['title'][0]['plain_text'];
        console.log(`Database Entry Created: ${chalk.italic(DbName)}`);
        const template = { ...DatabaseAPI.databaseSchema };
        template.database_id = data['id'];
        template.parent_id = data['parent']['page_id'];
        template.properties = data['properties'];
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
        return true;
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
  readDatabase: async (databaseID, headers) => {
    try {
      const response = await axios({ 
        method: "POST",
        url: `https://api.notion.com/v1/databases/${databaseID}/query`,
        headers : headers,
        sorts: [
        ],
        data : {},
        filters : []
    

      })
        const data = response.data;
        return data
      // need to work on the filtering, sorting options and make it more dynamic
    } catch (error) {
        console.error('Error:', error.message);
      throw error;
    }
  },
  readPage : async(pageID,headers)=> {
    try {
      const response = await axios({
        method: "GET",
        url: `https://api.notion.com/v1/blocks/${pageID}/children?page_size=100`,
        headers: headers,
      });
  
      const pageContent = response.data['results'];
      const blocksArray = [];
  
      for (const block of pageContent) {
        console.log(block.id)
        if (block.has_children) {
          console.log(block.id)
          let childBlocks = await DatabaseAPI.retrieveChildBlock(block.id, headers);
          blocksArray.push(childBlocks)
        }
        else{
          blocksArray.push(block);
        }
      }
      notion_md.convertor(blocksArray)

    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  retrieveChildBlock : async(blockID,headers) =>{
    try {
      const response = await axios({
        method : "GET",
        url : `https://api.notion.com/v1/blocks/${blockID}/children`,
        headers : headers
      });
      const content = response.data
      return content
    } catch (error) {
      throw error
    }
  }

}


module.exports = DatabaseAPI
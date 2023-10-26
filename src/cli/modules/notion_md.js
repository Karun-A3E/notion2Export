const fs = require('fs')
const path = require('path');

const filePath = path.join(__dirname,'./rulesConversion.json')
const rawData = fs.readFileSync(filePath,'utf-8');
const rulesOfAccess= JSON.parse(rawData)

const notion_md = {

  convertor :(conversionArray, title, file_location, dbName) => {
    const contentOfArray = conversionArray.map((item) => {
      if (item.object === 'list') {
        return item.results.map((listItem) => ({
          [listItem.type]: listItem[listItem.type],
          increment: listItem.incremental,
        }));
      } else {
        return { [item.type]: item[item.type], increment: item.incremental };
      }
    });
  
    const flatContentArray = [].concat(...contentOfArray);
  
    const convertedContent = flatContentArray.map((item) =>
      notion_md.AccessAndConvert(item)
    );
  
    const contentString = convertedContent.join('\n');
    const filePath = path.join(file_location, `${title}.md`);
    const logDirectory = path.join(__dirname, '../../configurations/logs');
    const logPath = path.join(logDirectory, `${dbName}.log`);
  
    // Check if the logs directory exists and create it if not
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
  
    fs.writeFileSync(filePath, contentString);
  
    // Create or append to the log file
    const logMessage = `File saved as ${filePath} at ${new Date().toLocaleString()}\n`;
    if (fs.existsSync(logPath)) {
      fs.appendFileSync(logPath, logMessage);
    } else {
      fs.writeFileSync(logPath, logMessage);
    }
  
    console.log(`File saved as ${filePath}`);
  },  
 AccessAndConvert : (obj) => {
    let incremental = obj.increment
    const blockType = Object.keys(obj)[0];
    const rules = rulesOfAccess[blockType];
    if (rules) {
      const accessPath = rules.access;
      let content = obj[blockType];
      for (const key of accessPath) {
        if (Array.isArray(key)) {
          if (Array.isArray(content)) {
            content = content.map((item) => {
              if (typeof item === 'object' && item !== null) {
                return key.reduce((acc, subKey) => (acc && acc[subKey] !== undefined ? acc[subKey] : undefined), item);
              } else {
                return item; 
              }
            });
          } else if (typeof content === 'object' && content !== null) {
            content = key.reduce((acc, subKey) => (acc && acc[subKey] !== undefined ? acc[subKey] : undefined), content);
          } else {
            content = undefined; 
          }
        } else {
          content = content && content[key] !== undefined ? content[key] : undefined;
        }
        if (content === undefined) {
          break; 
        }
      }
      if (content !== undefined) {
        const conversionStart = rules.conversionStart;
        const conversionEnd = rules.conversionEnd;
        const tabs = blockType=='image' ? '' : '\t'.repeat(incremental) // Create tabs based on the incremental value
       
        return tabs + conversionStart + content + conversionEnd;
      
      }
    }
  
    return '';
  }
};

module.exports = notion_md
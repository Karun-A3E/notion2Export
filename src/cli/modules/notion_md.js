const fs = require('fs')
const path = require('path');

const filePath = path.join(__dirname,'./rulesConversion.json')
const rawData = fs.readFileSync(filePath,'utf-8');
const rulesOfAccess= JSON.parse(rawData)

const notion_md = {
  convertor: (conversionArray) => {
    const contentOfArray = conversionArray.map((item) => {
      if (item.object === 'list') {
        return item.results.map((listItem) => ({ [listItem.type]: listItem[listItem.type] }));
      } else {
        return { [item.type]: item[item.type] };
      }
    });

    const flatContentArray = [].concat(...contentOfArray);

    const convertedContent = flatContentArray.map((item) =>
      notion_md.AccessAndConvert(item)
    );
    const contentString = convertedContent.join('\n');
    fs.writeFileSync('tmp.md', contentString);
  },
 AccessAndConvert : (obj) => {
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
        return conversionStart + content + conversionEnd;
      }
    }
  
    return '';
  }
};

module.exports = notion_md
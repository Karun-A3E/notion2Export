const fs = require('fs')
const path = require('path');

const filePath = path.join(__dirname,'./rulesConversion.json')
const rawData = fs.readFileSync(filePath,'utf-8');
const rulesOfAccess= JSON.parse(rawData)

const notion_md = {
  // convertor: (conversionArray,title,file_location) => {
  //   const contentOfArray = conversionArray.map((item) => {
  //     if (item.object === 'list') {
  //       return item.results.map((listItem) => ({ [listItem.type]: listItem[listItem.type],increment : listItem.incremental }));
  //     } else {
  //       return { [item.type]: item[item.type],increment : item.incremental };
  //     }
  //   });

  //   const flatContentArray = [].concat(...contentOfArray);
  //   console.log(contentOfArray)
  //   const convertedContent = flatContentArray.map((item) =>
  //     notion_md.AccessAndConvert(item)
  //   );
  //   const contentString = convertedContent.join('\n');
  //   fs.writeFileSync('tmp.md', contentString);
  // },
  convertor : (conversionArray, title, file_location) => {
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
    const filePath = `${file_location}/${title}.md`;
  
    fs.writeFileSync(filePath, contentString);
  
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
        const tabs = '\t'.repeat(incremental); // Create tabs based on the incremental value
        return tabs + conversionStart + content + conversionEnd;
      
      }
    }
  
    return '';
  }
};

module.exports = notion_md
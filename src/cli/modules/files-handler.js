const path = require('path');
const fs = require('fs')
const { exec } = require('child_process');// 
const inquiry = require('./inquirer')
const chalk = require('chalk')
// 
const set_up = {
  /**
   * @function
   * @name test
   * @description Used to test the set-up and perform serialized functions.
   */
  test: () => {
    // Implementation of the test function
  },
  required_files: async () => {
    const filePath = path.resolve(__dirname, '../../configurations', '.env');
    if (fs.existsSync(filePath)) {
      console.log('File exists');
      return true;
    } else {
      try {
        let api_key = await inquiry.question('Enter API Key : ', false, null);
        exec(`echo API_Key = "${api_key}" > ${filePath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(chalk.red('Error creating the file:', error));
          } else {
            console.log(chalk.green('File created successfully.'));
          }
        });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  }
};

set_up.required_files()
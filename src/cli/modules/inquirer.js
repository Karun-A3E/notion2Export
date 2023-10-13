const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const defaultRegex = /^\w+$/;

const inquiry = {
  question: (questionString, regexRequired, questionRegex,callAnotherFunc=false,followUpModule,functName) => {
    return new Promise((resolve, reject) => {
      rl.question(questionString, (answer) => {
        const regex = regexRequired ? new RegExp(questionRegex) : new RegExp(defaultRegex);
        rl.close();
        if (regex.test(answer)) {
          if (callAnotherFunc==true) {
            inquiry.callFunction(followUpModule,functName)
          }
          resolve(answer);
        } else {
          reject(false);
        }
      });
    });
  },
  callFunction : (followUpModule,functName) =>{
    const moduleHandler = require(followUpModule);
    console.log('Calling function:', functName);
    moduleHandler[functName]();
  }
};


module.exports = inquiry
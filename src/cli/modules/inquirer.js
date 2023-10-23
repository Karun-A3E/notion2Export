const readlineSync = require('readline-sync')

const defaultRegex = /^\w+$/;

const inquiry = {
  question : (questionString, regexRequired, questionRegex, callAnotherFunc = false, followUpModule, functName) => {
    const answer = readlineSync.question(questionString);
    const regex = regexRequired ? new RegExp(questionRegex) : new RegExp(defaultRegex);
    if (regex.test(answer)) {
      if (callAnotherFunc) {
        inquiry.callFunction(followUpModule, functName);
      }
      return answer;
    } else {
      throw new Error('Input does not match the expected format.');
    }
  },
  callFunction : (followUpModule,functName) =>{
    const moduleHandler = require(followUpModule);
    console.log('Calling function:', functName);
    moduleHandler[functName]();
  }
};

module.exports = inquiry
const readlineSync = require('readline-sync')

const defaultRegex = /^\w+$/;

const inquiry = {
  question: (questionString, regexRequired, questionRegex, callAnotherFunc = false, followUpModule, functName) => {
    const answer = readlineSync.question(questionString);

    if (regexRequired) {
      const regex = new RegExp(questionRegex);
      if (!regex.test(answer)) {
        throw new Error('Input does not match the expected format.');
      }
    }

    if (callAnotherFunc) {
      inquiry.callFunction(followUpModule, functName);
    }

    return answer;
  },
  callFunction : (followUpModule,functName) =>{
    const moduleHandler = require(followUpModule);
    console.log('Calling function:', functName);
    moduleHandler[functName]();
  }
};

module.exports = inquiry
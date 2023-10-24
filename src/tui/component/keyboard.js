const term = require('terminal-kit').terminal;

const showMenu = (items) => new Promise((resolve, reject) => {
  term.singleColumnMenu(items, (error, response) => {
    if (error) {
      reject(error);
    } else {
      resolve(response);
    }
  });
});

(async () => {
  //array options
  const items = ['a. 1', 'b. 2', 'c. 3'];
  console.log('Testing Menu.');
  try {
    const response = await showMenu(items);
    //Options
    term.eraseLineAfter.cyan(
      `#${response.selectedIndex} selected: ${response.selectedText} (${response.x},${response.y})\n`
    );
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
})();

const terminate = async () => {
    term.grabInput(false);
    term.clear(); // Clear the screen
    await new Promise(resolve => setTimeout(() => resolve(), 100));
    process.exit();
  };
  
  term.on('key', (name, matches, data) => {
    console.log("'key' event:", name);
    if (name === 'CTRL_C') {
      terminate();
    }
  });
  
  

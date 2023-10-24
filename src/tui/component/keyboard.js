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
    console.log('Testing Menu.');
    // Array options
    const items = ['a. 1', 'b. 2', 'c. 3', 'Done'];
    try {
        const response = await showMenu(items);
        // Options
        term.eraseLineAfter.cyan(
            `#${response.selectedIndex} selected: ${response.selectedText} (${response.x},${response.y})\n`
        );
        if (response.selectedText == "Done") {
            console.log("Hello World");
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
})();

const terminate = async () => {
    term.grabInput(false);
    // Clear the screen
    term.clear();
    await new Promise(resolve => setTimeout(() => resolve(), 100));
    process.exit();
};

term.on('key', (name, matches, data) => {
    if (name === 'CTRL_C') {
        terminate();
    }
});
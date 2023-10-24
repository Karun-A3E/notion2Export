const term = require('terminal-kit').terminal;

const showMenu = (items) => new Promise((resolve, reject) => {
    items.push("Done")
    term.singleColumnMenu(items, (error, response) => {
        if (error) {
            reject(error);
        } else {
            resolve(response);
        }
    });
});

const terminate = async () => {
    term.grabInput(false);
    term.clear();
    await new Promise(resolve => setTimeout(() => resolve(), 100));
    process.exit();
};

term.on('key', async (name, matches, data) => {
    if (name === 'CTRL_C') {
        await terminate();
    }
});

const TerminalUI = {
    SingleChoiceMenu: async (items) => {
        console.log('Testing Menu.');
        try {
            const response = await showMenu(items);
            term.eraseLineAfter.cyan(
                `#${response.selectedIndex} selected: ${response.selectedText} (${response.x},${response.y})\n`
            );
            if (response.selectedText !== "Done") {
                console.log("Exit Program");
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            process.exit();
        }
    },
    MultipleChoiceMenu: () => {
        console.log("Hello World");
    }
};

TerminalUI.SingleChoiceMenu(["Hello", "World"])
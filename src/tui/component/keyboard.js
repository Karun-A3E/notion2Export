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

const toggleSelected = (item, selected) => {
    return selected ? `[x] ${item}` : `[ ] ${item}`;
};

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
    SingleChoiceMenu: async (items, string) => {
        term.clear();
        if (!Array.isArray(items)) {
            items = ["Add", "Your", "Own", "Input"];
        }
        items.push("Done");
        console.log(string || "Customize your own prompt");
        try {
            const response = await showMenu(items);
            term.eraseLineAfter.cyan(
                `#${response.selectedIndex} selected: ${response.selectedText} (${response.x},${response.y})\n`
            );
            if (response.selectedText === "Done") {
                console.log("Exit Program");
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            process.exit();
        }
    },
    MultipleChoiceMenu: async (items, string) => {
        term.clear();
        if (!Array.isArray(items)) {
            items = ["Add", "Your", "Own", "Input"];
        }
        items.push("Done");
        const selectedIndices = new Set();

        const updateMenu = () => {
            term.clear();
            console.log(string || "Select multiple options (Press 'Done' to finish):");
            term.singleColumnMenu(items.map((item, index) => toggleSelected(item, selectedIndices.has(index))), (error, response) => {
                if (error) {
                    console.error('Error:', error);
                    process.exit();
                } else {
                    if (response.selectedIndex !== items.length - 1) {
                        if (selectedIndices.has(response.selectedIndex)) {
                            selectedIndices.delete(response.selectedIndex);
                        } else {
                            selectedIndices.add(response.selectedIndex);
                        }
                        updateMenu();
                    } else {
                        // Exit Program
                        term.eraseLineAfter.cyan(`Selected indices: [${[...selectedIndices]}]\n`);
                        process.exit();
                    }
                }
            });
        };
        updateMenu();
    }
};

TerminalUI.MultipleChoiceMenu();
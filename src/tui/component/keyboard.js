const term = require('terminal-kit').terminal;

const showMenu = async (items) => {
  return new Promise((resolve, reject) => {
    term.singleColumnMenu(items, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

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

    const updateMenu = async () => {
      term.clear();
      console.log(string || "Customize your own prompt");
      try {
        const response = await showMenu(items.map((item, index) => toggleSelected(item, selectedIndices.has(index))));
        if (response.selectedIndex !== items.length - 1) {
          if (selectedIndices.has(response.selectedIndex)) {
            selectedIndices.delete(response.selectedIndex);
          } else {
            selectedIndices.add(response.selectedIndex);
          }
          await updateMenu();
        } else {
          // Exit Program
          term.eraseLineAfter.cyan(`selected : ${[...selectedIndices]}\n`);
          process.exit();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    await updateMenu();
  }
};

module.exports = TerminalUI

console.log(TerminalUI.SingleChoiceMenu())
const readline = require('readline');
const { ChangeDetector } = require('../workflows/dashboard/change-detector');

module.exports = {
  command: 'watch',
  description: 'Watch plan files for changes and refresh dashboards automatically.',
  aliases: [],
  async execute({ projectRoot }) {
    const detector = new ChangeDetector(projectRoot, {
      onPrompt: ({ message }) => promptYesNo(message)
    });
    await detector.start();

    console.log('Watching plan files for changes. Press Ctrl+C to exit.');

    return new Promise((resolve) => {
      process.on('SIGINT', async () => {
        await detector.stop();
        resolve({
          success: true,
          message: 'Watcher stopped.',
          recommendation: '/Progress'
        });
      });
    });
  }
};

function promptYesNo(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`${message} (y/n) `, (answer) => {
      rl.close();
      resolve(/^y(es)?$/i.test(answer.trim()));
    });
  });
}


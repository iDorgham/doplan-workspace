const fs = require('fs');
const path = require('path');

function loadCommandModules(projectRoot) {
  const commandsDir = path.join(projectRoot, '.cursor', 'commands');
  const files = fs.readdirSync(commandsDir);
  const modules = [];

  for (const file of files) {
    if (file === 'core') continue;
    if (!file.endsWith('-command.js')) continue;
    const absPath = path.join(commandsDir, file);
    const commandModule = require(absPath);
    if (!commandModule || typeof commandModule.execute !== 'function') {
      throw new Error(`Command module ${file} must export an object with an execute function.`);
    }
    const commandName = commandModule.command || file.replace('-command.js', '');
    modules.push({
      name: commandName,
      module: commandModule
    });
  }

  return modules;
}

module.exports = {
  loadCommandModules
};


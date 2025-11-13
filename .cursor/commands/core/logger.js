const fs = require('fs/promises');
const path = require('path');

class Logger {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.logsDir = path.join(projectRoot, '.cursor', 'logs');
  }

  async log(file, entry) {
    await fs.mkdir(this.logsDir, { recursive: true });
    const filePath = path.join(this.logsDir, file);
    const current = await this.read(file) ;
    current.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
    await fs.writeFile(filePath, JSON.stringify(current, null, 2));
  }

  async read(file) {
    const filePath = path.join(this.logsDir, file);
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}

module.exports = {
  Logger
};


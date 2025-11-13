const path = require('path');
const chokidar = require('chokidar');
const { AutoUpdater } = require('./auto-updater');
const { Logger } = require('../../commands/core/logger');

class ChangeDetector {
  constructor(projectRoot, { onPrompt } = {}) {
    this.projectRoot = projectRoot;
    this.onPrompt = onPrompt || (() => Promise.resolve(true));
    this.watcher = null;
    this.autoUpdater = new AutoUpdater(projectRoot);
    this.logger = new Logger(projectRoot);
  }

  async start() {
    const planPath = path.join(this.projectRoot, 'plan');
    this.watcher = chokidar.watch(
      [
        path.join(planPath, '**/progress.json'),
        path.join(planPath, '**/phase-progress.json'),
        path.join(planPath, '**/*.md')
      ],
      {
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 200,
          pollInterval: 100
        }
      }
    );

    this.watcher.on('change', (filePath) => this.handleChange(filePath));
    this.watcher.on('add', (filePath) => this.handleChange(filePath));
  }

  async handleChange(filePath) {
    const shouldSync = await this.onPrompt({
      filePath,
      message: `Detected changes in ${path.relative(this.projectRoot, filePath)}. Sync to dashboards and state?`
    });

    if (!shouldSync) return;

    await this.autoUpdater.refreshAll();
    await this.logger.log('lifecycle.json', {
      action: 'sync',
      file: path.relative(this.projectRoot, filePath)
    });
  }

  async stop() {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
  }
}

module.exports = {
  ChangeDetector
};


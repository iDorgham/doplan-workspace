const path = require('path');
const { AutoUpdater } = require('../workflows/dashboard/auto-updater');

module.exports = {
  command: 'progress',
  description: 'Refresh dashboards and report overall progress.',
  aliases: ['status'],
  async execute({ projectRoot }) {
    const autoUpdater = new AutoUpdater(projectRoot);
    const { phases } = await autoUpdater.refreshAll();

    const totalFeatures = phases.reduce((acc, phase) => acc + phase.features.length, 0);
    const completedFeatures = phases.reduce(
      (acc, phase) =>
        acc + phase.features.filter((feature) => feature.status === 'Completed').length,
      0
    );

    const message = [
      'Progress dashboard updated.',
      `- Phases: ${phases.length}`,
      `- Features complete: ${completedFeatures}/${totalFeatures}`,
      `- Dashboard: ${path.join('plan', 'Progress-Dashboard.md')}`
    ].join('\n');

    return {
      success: true,
      message,
      outputPath: path.join(projectRoot, 'plan', 'Progress-Dashboard.md'),
      recommendation: '/Next'
    };
  }
};


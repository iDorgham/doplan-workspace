const path = require('path');
const fs = require('fs/promises');
const { AutoUpdater } = require('../workflows/dashboard/auto-updater');
const { Logger } = require('./core/logger');

module.exports = {
  command: 'capacity',
  description: 'Analyse workload distribution and produce a capacity plan.',
  aliases: [],
  async execute({ projectRoot, flags }) {
    const autoUpdater = new AutoUpdater(projectRoot);
    const { phases } = await autoUpdater.refreshAll();
    const logger = new Logger(projectRoot);

    const capacity = calculateCapacity(phases);
    const outputPath = await writeCapacityReport(projectRoot, capacity, flags['week-start']);
    await logger.log('lifecycle.json', {
      action: 'capacity',
      totalHours: capacity.totalHours,
      owners: capacity.owners
    });

    return {
      success: true,
      message: `Capacity report generated with ${capacity.totalHours} total hours.`,
      outputPath,
      recommendation: '/Next'
    };
  }
};

function calculateCapacity(phases) {
  const owners = new Map();
  let totalHours = 0;

  phases.forEach((phase) => {
    phase.features.forEach((feature) => {
      const owner = feature.data?.owner || 'Unassigned';
      const hours = feature.data?.estimatedHours || 0;
      totalHours += hours;
      owners.set(owner, (owners.get(owner) || 0) + hours);
    });
  });

  return {
    totalHours,
    owners: Array.from(owners.entries()).map(([owner, hours]) => ({ owner, hours })),
    phases: phases.map((phase) => ({
      name: phase.name,
      hours: phase.features.reduce((acc, feature) => acc + (feature.data?.estimatedHours || 0), 0)
    }))
  };
}

async function writeCapacityReport(projectRoot, capacity, weekStart) {
  const reportDir = path.join(projectRoot, 'plan', 'reports');
  await fs.mkdir(reportDir, { recursive: true });
  const filePath = path.join(reportDir, 'capacity.md');

  const lines = [
    '# Capacity Report',
    '',
    `*Generated: ${new Date().toISOString()}*`,
    weekStart ? `Week starting: ${weekStart}` : '',
    '',
    `## Total Estimated Hours: ${capacity.totalHours}`,
    '',
    '## Allocation by Owner',
    '',
    '| Owner | Hours |',
    '| --- | --- |',
    ...capacity.owners.map((entry) => `| ${entry.owner} | ${entry.hours} |`),
    '',
    '## Allocation by Phase',
    '',
    '| Phase | Hours |',
    '| --- | --- |',
    ...capacity.phases.map((phase) => `| ${phase.name} | ${phase.hours} |`)
  ].filter(Boolean);

  await fs.writeFile(filePath, lines.join('\n'), 'utf8');
  return filePath;
}


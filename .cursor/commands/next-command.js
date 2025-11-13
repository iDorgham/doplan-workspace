const path = require('path');
const { AutoUpdater } = require('../workflows/dashboard/auto-updater');

module.exports = {
  command: 'next',
  description: 'Recommend the next actionable task or feature.',
  aliases: [],
  async execute({ projectRoot, state }) {
    const autoUpdater = new AutoUpdater(projectRoot);
    const { phases } = await autoUpdater.refreshAll();

    const nextItem = findNextItem(phases);

    if (!nextItem) {
      return {
        success: true,
        message: 'All phases complete! Proceed to /Test or /Deploy.',
        recommendation: '/Test',
        statePatch: {
          stage: 'READY_FOR_TEST'
        }
      };
    }

    const message = [
      `Next focus: ${nextItem.type === 'feature' ? 'Feature' : 'Phase'} ${nextItem.name}`,
      `Status: ${nextItem.status}`,
      `Progress: ${nextItem.progress}%`,
      `Docs: ${path.relative(projectRoot, nextItem.docPath)}`
    ].join('\n');

    return {
      success: true,
      message,
      recommendation: nextItem.recommendation,
      statePatch: {
        currentPhase: nextItem.phaseIndex + 1,
        currentFeature: nextItem.featureIndex !== undefined ? nextItem.featureIndex + 1 : null
      }
    };
  }
};

function findNextItem(phases) {
  for (let i = 0; i < phases.length; i += 1) {
    const phase = phases[i];
    if (phase.status !== 'Completed') {
      for (let j = 0; j < phase.features.length; j += 1) {
        const feature = phase.features[j];
        if (feature.status !== 'Completed') {
          return {
            type: 'feature',
            name: `${phase.name} → ${feature.name}`,
            status: feature.status,
            progress: feature.progress,
            docPath: path.join('plan', phase.folder, feature.folder, 'plan.md'),
            recommendation: '/Test',
            phaseIndex: i,
            featureIndex: j
          };
        }
      }
      return {
        type: 'phase',
        name: phase.name,
        status: phase.status,
        progress: phase.progress,
        docPath: path.join('plan', phase.folder, 'phase-plan.md'),
        recommendation: '/Test',
        phaseIndex: i
      };
    }
  }
  return null;
}


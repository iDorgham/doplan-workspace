const path = require('path');
const fs = require('fs/promises');
const { AutoUpdater } = require('../workflows/dashboard/auto-updater');
const { Logger } = require('./core/logger');

const AUDIENCES = ['exec', 'product', 'dev'];

module.exports = {
  command: 'digest',
  description: 'Produce stakeholder digests with highlights, risks, and next steps.',
  aliases: [],
  async execute({ projectRoot, flags }) {
    const audiences = flags.audience ? flags.audience.split(',') : AUDIENCES;
    const autoUpdater = new AutoUpdater(projectRoot);
    const { phases } = await autoUpdater.refreshAll();
    const logger = new Logger(projectRoot);

    const summary = summarisePhases(phases);
    const digestDir = await writeDigests(projectRoot, audiences, summary);
    await logger.log('lifecycle.json', {
      action: 'digest',
      audiences,
      output: path.relative(projectRoot, digestDir)
    });

    return {
      success: true,
      message: `Digest created for ${audiences.join(', ')}.`,
      outputPath: digestDir,
      recommendation: '/Next'
    };
  }
};

function summarisePhases(phases) {
  const highlights = [];
  const risks = [];
  const nextSteps = [];

  phases.forEach((phase) => {
    const completedFeatures = phase.features.filter((feature) => feature.status === 'Completed');
    if (completedFeatures.length) {
      highlights.push(
        `${phase.name}: ${completedFeatures.length} feature(s) complete (${completedFeatures
          .map((f) => f.name)
          .join(', ')})`
      );
    }

    const blocked = phase.features.filter((feature) => feature.status === 'Blocked');
    if (blocked.length) {
      risks.push(
        `${phase.name}: Blocked features → ${blocked.map((f) => f.name).join(', ')}`
      );
    }

    const inProgress = phase.features.filter(
      (feature) => feature.status === 'In Progress' || feature.progress < 100
    );
    if (inProgress.length) {
      nextSteps.push(
        `${phase.name}: Continue with ${inProgress
          .slice(0, 3)
          .map((f) => f.name)
          .join(', ')}`
      );
    }
  });

  return {
    highlights,
    risks,
    nextSteps
  };
}

async function writeDigests(projectRoot, audiences, summary) {
  const baseDir = path.join(projectRoot, 'plan', 'digests', getDateSlug(new Date()));
  await fs.mkdir(baseDir, { recursive: true });

  await Promise.all(
    audiences.map(async (audience) => {
      const content = buildDigestForAudience(audience, summary);
      const file = path.join(baseDir, `${audience}.md`);
      await fs.writeFile(file, content, 'utf8');
    })
  );

  return baseDir;
}

function buildDigestForAudience(audience, summary) {
  const intro =
    audience === 'exec'
      ? 'High-level progress overview'
      : audience === 'product'
      ? 'Product and experience update'
      : 'Engineering delivery notes';

  return [
    `# DoPlan Digest — ${audience.toUpperCase()}`,
    '',
    `_${intro}_`,
    '',
    '## Highlights',
    summary.highlights.length ? summary.highlights.map((line) => `- ${line}`).join('\n') : '- None recorded.',
    '',
    '## Risks',
    summary.risks.length ? summary.risks.map((line) => `- ${line}`).join('\n') : '- No risks flagged.',
    '',
    '## Next Steps',
    summary.nextSteps.length
      ? summary.nextSteps.map((line) => `- ${line}`).join('\n')
      : '- Continue monitoring progress.',
    '',
    '## Requests / Decisions Needed',
    '- [ ] Decision 1',
    '- [ ] Decision 2'
  ].join('\n');
}

function getDateSlug(date) {
  return date.toISOString().slice(0, 10);
}


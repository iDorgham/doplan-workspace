const fs = require('fs/promises');
const path = require('path');
const { Logger } = require('./core/logger');

module.exports = {
  command: 'idea',
  description: 'Run the DoPlan idea interview and capture requirements.',
  aliases: [],
  async execute({ projectRoot, flags, stateManager, agentInsights }) {
    const mode = flags.simple ? 'simple' : 'detailed';
    const scopeMode = flags.scope || 'undecided';

    const notesPath = path.join(projectRoot, 'idea-notes.md');
    const contextPath = path.join(projectRoot, '.cursor', 'context', 'idea-summary.json');
    const logger = new Logger(projectRoot);

    const template = await buildTemplate({ mode, scopeMode });
    await fs.writeFile(notesPath, template, 'utf8');

    const ideaSummary = {
      mode,
      scopeMode,
      agentSummary: agentInsights.summary,
      lastUpdated: new Date().toISOString()
    };
    await fs.mkdir(path.dirname(contextPath), { recursive: true });
    await fs.writeFile(contextPath, JSON.stringify(ideaSummary, null, 2));
    await logger.log('lifecycle.json', {
      action: 'idea',
      mode,
      scopeMode
    });

    const statePatch = {
      stage: 'IDEA',
      ideaData: {
        mode,
        scopeMode,
        notesPath
      }
    };

    return {
      success: true,
      message: `Idea interview scaffold created (${mode} mode). Fill in ${path.relative(projectRoot, notesPath)}.`,
      outputPath: notesPath,
      recommendation: '/Plan',
      statePatch
    };
  }
};

async function buildTemplate({ mode, scopeMode }) {
  const lines = [
    '# Idea Notes',
    '',
    `*Mode: ${mode}*`,
    `*Scope preference: ${scopeMode}*`,
    '',
    '## Vision & Problem',
    '- Elevator pitch:',
    '- Problem statement:',
    '- Current alternatives:',
    '',
    '## Audience & Stakeholders',
    '- Primary users:',
    '- Secondary stakeholders:',
    '- Compliance considerations:',
    '',
    '## Value Proposition',
    '- Aha moment:',
    '- Key metrics:',
    '- Differentiators:',
    '',
    '## Features',
    '- Must-have features:',
    '- Nice-to-have features:',
    '- Integrations:',
    '',
    '## Admin & Ops',
    '- Admin dashboard requirements:',
    '- Reporting / analytics needs:',
    '',
    '## Experience & Design',
    '- First-time user flow:',
    '- Visual tone / references:',
    '',
    '## Technical',
    '- Preferred stack:',
    '- Existing assets to integrate:',
    '- Hosting / deployment preferences:',
    '',
    '## Timeline & Business',
    '- Launch target:',
    '- Team & skill levels:',
    '- Budget considerations:',
    '',
    '## Research & Enhancements',
    '- Competitor list:',
    '- Improvement ideas:',
    '- Extra deliverables:',
    '',
    '## Risks & Constraints',
    '- Known risks:',
    '- Hard constraints:',
    '- Must-avoid items:',
    '',
    '## MVP vs Future',
    '- MVP focus items:',
    '- Future phase items:',
    '',
    '## Decisions & Next Steps',
    '- Outstanding questions:',
    '- Approvals required:'
  ];

  if (mode === 'simple') {
    lines.splice(
      4,
      0,
      'Use the checklists provided in the Simple Mode guide:',
      '- [ ] Complete user type checklist',
      '- [ ] Select launch timeline',
      '- [ ] Confirm design vibe',
      '- [ ] Decide on tech stack assistance',
      ''
    );
  }

  return lines.join('\n');
}


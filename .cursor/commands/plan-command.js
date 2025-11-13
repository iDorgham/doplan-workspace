const fs = require('fs/promises');
const path = require('path');
const { PlanStructureGenerator } = require('../workflows/generators/plan-structure-generator');
const { SpecGenerator } = require('../workflows/generators/spec-generator');
const { AutoUpdater } = require('../workflows/dashboard/auto-updater');
const { McpEngine } = require('./core/mcp-engine');
const { Logger } = require('./core/logger');

module.exports = {
  command: 'plan',
  description: 'Generate the project plan, structure, and dashboards.',
  aliases: [],
  async execute({ projectRoot, state, flags, agentInsights }) {
    const ideaNotesPath = state.ideaData?.notesPath || path.join(projectRoot, 'idea-notes.md');
    const ideaExists = await fileExists(ideaNotesPath);
    if (!ideaExists && !flags['allow-empty']) {
      return {
        success: false,
        message: 'Idea notes not found. Run /Idea first or pass --allow-empty to use defaults.'
      };
    }

    const logger = new Logger(projectRoot);
    const ideaSummary = await buildIdeaSummary(ideaNotesPath, state.ideaData);
    const generator = new PlanStructureGenerator(projectRoot);
    const specGenerator = new SpecGenerator(projectRoot);

    const phaseInput = await loadPhaseInput(projectRoot, flags.phases);
    const phasesPayload = await generator.generatePlan({
      phases: phaseInput,
      idea: ideaSummary,
      stack: flags.stack ? parseStackFlag(flags.stack) : {}
    });

    // Generate specs if missing (spec generator ensures idempotent writing)
    for (const phase of phasesPayload.phases) {
      const phaseNumber = phasesPayload.phases.indexOf(phase) + 1;
      for (const feature of phase.features || []) {
        const featureNumber = (phase.features || []).indexOf(feature) + 1;
        const featureDir = path.join(
          projectRoot,
          'plan',
          `${String(phaseNumber).padStart(2, '0')}-${generator.slugify(phase.name)}`,
          `${String(featureNumber).padStart(2, '0')}-${generator.slugify(feature.name)}`
        );
        await specGenerator.generateFromFeature(featureDir, {
          phaseNumber,
          featureNumber,
          featureName: generator.titleCase(feature.name),
          scenarios: feature.scenarios || []
        });
      }
    }

    const autoUpdater = new AutoUpdater(projectRoot);
    await autoUpdater.refreshAll();

    const mcpEngine = new McpEngine(projectRoot);
    const suggestedServers = await mcpEngine.suggestServers({
      stack: flags.stack ? parseStackFlag(flags.stack) : {},
      needs: ideaSummary.needs
    });

    if (flags['accept-mcp'] && suggestedServers.length) {
      await mcpEngine.registerServers(suggestedServers);
    }

    await createContextFile(projectRoot, {
      idea: ideaSummary,
      stack: flags.stack ? parseStackFlag(flags.stack) : {},
      suggestedServers
    });

    await logger.log('lifecycle.json', {
      action: 'plan',
      details: {
        phases: phasesPayload.phases.length,
        features: phasesPayload.phases.reduce(
          (acc, phase) => acc + (phase.features || []).length,
          0
        )
      }
    });

    if (suggestedServers.length) {
      await logger.log('mcp-usage.json', {
        action: 'suggest',
        servers: suggestedServers.map((server) => server.name)
      });
    }

    const message = [
      'Plan generated successfully.',
      `- Phases: ${phasesPayload.phases.length}`,
      `- Features: ${phasesPayload.phases.reduce(
        (acc, phase) => acc + (phase.features || []).length,
        0
      )}`,
      suggestedServers.length
        ? `- Suggested MCP servers: ${suggestedServers.map((s) => s.name).join(', ')}`
        : '- No MCP server suggestions.'
    ].join('\n');

    return {
      success: true,
      message,
      outputPath: path.join(projectRoot, 'plan'),
      recommendation: '/Next',
      statePatch: {
        stage: 'PLANNING',
        currentPhase: 1,
        currentFeature: 1,
        ideaData: {
          ...state.ideaData,
          summary: ideaSummary
        }
      },
      agentSummary: agentInsights.summary
    };
  }
};

async function buildIdeaSummary(ideaNotesPath, ideaData) {
  const summary = {
    mode: ideaData?.mode || 'detailed',
    scopeMode: ideaData?.scopeMode || 'undecided',
    needs: []
  };

  try {
    const content = await fs.readFile(ideaNotesPath, 'utf8');
    if (content.toLowerCase().includes('competitor')) {
      summary.needs.push('competitor-research');
    }
    if (content.toLowerCase().includes('admin dashboard')) {
      summary.needs.push('admin-dashboard');
    }
    summary.valueProposition = extractLine(content, 'aha moment') || null;
    return summary;
  } catch {
    return summary;
  }
}

async function loadPhaseInput(projectRoot, phasesFlag) {
  if (!phasesFlag) return [];
  const absolute = path.isAbsolute(phasesFlag)
    ? phasesFlag
    : path.join(projectRoot, phasesFlag);
  try {
    const raw = await fs.readFile(absolute, 'utf8');
    if (absolute.endsWith('.json')) {
      return JSON.parse(raw);
    }
    if (absolute.endsWith('.yaml') || absolute.endsWith('.yml')) {
      const { parse } = require('yaml');
      return parse(raw);
    }
    return [];
  } catch {
    return [];
  }
}

async function createContextFile(projectRoot, context) {
  const contextDir = path.join(projectRoot, '.cursor', 'context');
  await fs.mkdir(contextDir, { recursive: true });
  const filePath = path.join(contextDir, 'context.md');
  const lines = [
    '# DoPlan Context',
    '',
    `*Generated: ${new Date().toISOString()}*`,
    '',
    '## Idea Summary',
    `- Mode: ${context.idea.mode}`,
    `- Scope: ${context.idea.scopeMode}`,
    '',
    '## Stack',
    context.stack.frontend ? `- Frontend: ${context.stack.frontend}` : '- Frontend: TBD',
    context.stack.backend ? `- Backend: ${context.stack.backend}` : '- Backend: TBD',
    context.stack.database ? `- Database: ${context.stack.database}` : '- Database: TBD',
    '',
    '## MCP Recommendations',
    ...(context.suggestedServers.length
      ? context.suggestedServers.map(
          (server) =>
            `- ${server.name}: ${server.description} (tools: ${server.tools.join(', ')})`
        )
      : ['- None at this time.'])
  ];
  await fs.writeFile(filePath, lines.join('\n'), 'utf8');
  return filePath;
}

function extractLine(content, label) {
  const regex = new RegExp(`${label}\\s*:\\s*(.+)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

function parseStackFlag(flagValue = '') {
  return flagValue.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}


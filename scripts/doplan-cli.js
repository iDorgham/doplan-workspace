#!/usr/bin/env node
const path = require('path');
const { CommandRouter } = require('../.cursor/commands/core/command-router');
const { green, red, yellow, cyan } = require('colorette');

async function main() {
  const [, , rawCommand, ...rest] = process.argv;

  if (!rawCommand) {
    console.error(red('No DoPlan command supplied. Try `npm run doplan:plan`.'));
    process.exit(1);
  }

  const command = rawCommand.toLowerCase();
  const projectRoot = path.resolve(__dirname, '..');

  const router = new CommandRouter({ projectRoot });

  try {
    const result = await router.execute(command, rest, { entryPoint: 'cli' });
    renderResult(result);
  } catch (error) {
    console.error(red(`DoPlan command failed: ${error.message}`));
    if (process.env.DOPLAN_DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

function renderResult(result) {
  if (!result) {
    console.log(yellow('Command executed but returned no result payload.'));
    return;
  }

  const status = result.success === false ? red('failed') : green('succeeded');
  console.log(`${cyan(result.command)} ${status}`);

  if (result.message) {
    console.log(result.message);
  }

  if (result.agentInsights?.summary) {
    console.log(`\n${yellow('Agent Insights:')}\n${result.agentInsights.summary}`);
  }

  if (result.recommendation) {
    console.log(`\n${cyan('Next Action:')} ${result.recommendation}`);
  }

  if (result.outputPath) {
    console.log(`\nArtifacts: ${result.outputPath}`);
  }
}

main();


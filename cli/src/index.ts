#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { setupCommand } from './commands/setup';
import { ideaCommand } from './commands/idea';
import { planCommand } from './commands/plan';
import { nextCommand } from './commands/next';
import { progressCommand } from './commands/progress';
import { testCommand } from './commands/test';
import { runCommand } from './commands/run';
import { deployCommand } from './commands/deploy';
import { capacityCommand } from './commands/capacity';
import { digestCommand } from './commands/digest';
import { telemetryCommand } from './commands/telemetry';
import { pluginCommand } from './commands/plugin';
import { mcpCommand } from './commands/mcp';
import { partyCommand } from './commands/party';
import { watchCommand } from './commands/watch';
import { readFileSync } from 'fs';
import { join } from 'path';

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);
const version = packageJson.version;

const program = new Command();

program
  .name('doplan')
  .description('DoPlan CLI - Command-line interface for DoPlan workflow')
  .version(version);

// Global options
program
  .option('--cwd <path>', 'Change working directory', process.cwd())
  .option('--no-spinner', 'Disable spinner animations')
  .option('--json', 'Output as JSON');

// Register all commands
initCommand(program);
setupCommand(program);
ideaCommand(program);
planCommand(program);
nextCommand(program);
progressCommand(program);
testCommand(program);
runCommand(program);
deployCommand(program);
capacityCommand(program);
digestCommand(program);
telemetryCommand(program);
pluginCommand(program);
mcpCommand(program);
partyCommand(program);
watchCommand(program);

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: any) => {
  console.error(error.message || 'An unexpected error occurred');
  if (error.code !== undefined) {
    process.exit(error.code);
  } else {
    process.exit(1);
  }
});

program.parse();


import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function testCommand(program: Command) {
  program
    .command('test')
    .description('Run test suite for current feature or phase')
    .option('--feature <name>', 'Test specific feature')
    .option('--phase <name>', 'Test specific phase')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('test', { ...options, ...config });
    });
}


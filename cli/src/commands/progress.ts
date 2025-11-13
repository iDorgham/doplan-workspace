import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function progressCommand(program: Command) {
  program
    .command('progress')
    .alias('status')
    .description('View progress dashboard and refresh status')
    .option('--brief', 'Show brief summary only')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('progress', { ...options, ...config });
    });
}


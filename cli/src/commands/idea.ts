import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function ideaCommand(program: Command) {
  program
    .command('idea')
    .description('Capture app idea and requirements')
    .option('--simple', 'Use simplified interview mode for non-developers')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('idea', { ...options, ...config });
    });
}


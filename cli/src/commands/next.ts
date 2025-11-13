import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function nextCommand(program: Command) {
  program
    .command('next')
    .description('Get next recommended action based on current progress')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('next', { ...options, ...config });
    });
}


import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function setupCommand(program: Command) {
  program
    .command('setup')
    .description('Bootstrap environment: install dependencies, verify Node version, configure Git, seed .env')
    .option('--skip-deps', 'Skip dependency installation')
    .option('--skip-git', 'Skip Git configuration')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('setup', { ...options, ...config });
    });
}


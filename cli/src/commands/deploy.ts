import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function deployCommand(program: Command) {
  program
    .command('deploy')
    .description('Deploy application to production')
    .option('--skip-tests', 'Skip test execution before deployment')
    .option('--env <env>', 'Deployment environment', 'production')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('deploy', { ...options, ...config });
    });
}


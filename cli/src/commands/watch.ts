import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function watchCommand(program: Command) {
  program
    .command('watch')
    .description('Watch for changes and auto-update dashboards')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('watch', { ...options, ...config });
    });
}


import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function digestCommand(program: Command) {
  program
    .command('digest')
    .description('Generate stakeholder digest summaries')
    .option('--audience <audience>', 'Target audience (exec, product, dev)', 'exec')
    .option('--preview', 'Preview digest in terminal without writing files')
    .option('--write', 'Write digest files to plan/digests/')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('digest', { ...options, ...config });
    });
}


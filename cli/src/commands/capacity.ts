import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function capacityCommand(program: Command) {
  program
    .command('capacity')
    .description('Generate workload report and capacity planning')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('capacity', { ...options, ...config });
    });
}

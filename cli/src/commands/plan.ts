import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function planCommand(program: Command) {
  program
    .command('plan')
    .description('Generate project plan, specs, dashboards, and MCP suggestions')
    .option('--party', 'Enable multi-agent collaboration mode')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('plan', { ...options, ...config });
    });
}

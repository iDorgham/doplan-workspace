import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function runCommand(program: Command) {
  program
    .command('run')
    .description('Run application locally')
    .option('--port <port>', 'Port to run on', '3000')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('run', { ...options, ...config });
    });
}

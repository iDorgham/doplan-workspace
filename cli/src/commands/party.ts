import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function partyCommand(program: Command) {
  program
    .command('party')
    .description('Enable multi-agent collaboration mode for complex decisions')
    .argument('[command]', 'Command to run with party mode', 'next')
    .action(async (command, options) => {
      const config = loadConfig(program.opts());
      await executeCommand('party', { command, ...options, ...config });
    });
}


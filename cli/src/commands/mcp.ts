import { Command } from 'commander';
import { loadConfig } from '../config';
import { executeCommand } from '../utils/command-executor';

export function mcpCommand(program: Command) {
  const mcpCmd = program.command('mcp').description('Manage MCP servers');

  mcpCmd
    .command('suggest')
    .description('Show MCP server suggestions based on current stack')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('mcp', { action: 'suggest', ...options, ...config });
    });

  mcpCmd
    .command('apply <server>')
    .description('Apply and register an MCP server')
    .action(async (server, options) => {
      const config = loadConfig(program.opts());
      await executeCommand('mcp', { action: 'apply', server, ...options, ...config });
    });

  mcpCmd
    .command('list')
    .description('List registered MCP servers')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      await executeCommand('mcp', { action: 'list', ...options, ...config });
    });
}

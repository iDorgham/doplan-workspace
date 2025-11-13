const path = require('path');
const fs = require('fs/promises');
const { McpEngine } = require('./core/mcp-engine');
const { Logger } = require('./core/logger');

module.exports = {
  command: 'mcp',
  description: 'Manage MCP server configuration (list, suggest, apply).',
  aliases: [],
  async execute({ projectRoot, rawArgs, flags, state }) {
    const action = rawArgs[0] || 'list';
    const engine = new McpEngine(projectRoot);
    const logger = new Logger(projectRoot);

    if (action === 'list') {
      const manifest = await engine.loadManifest();
      const message = manifest.servers.length
        ? manifest.servers.map(formatServer).join('\n')
        : 'No MCP servers registered.';
      const payload = {
        success: true,
        message,
        recommendation: manifest.servers.length ? '/Plan' : 'Use `/MCP suggest` after planning.'
      };
      await logger.log('mcp-usage.json', { action: 'list', count: manifest.servers.length });
      return payload;
    }

    if (action === 'suggest') {
      const suggestions = await engine.suggestServers({
        stack: flags.stack ? parseStackFlag(flags.stack) : state.ideaData?.summary?.stack || {},
        needs: state.ideaData?.summary?.needs || []
      });
      if (!suggestions.length) {
        return {
          success: true,
          message: 'No additional MCP suggestions at this time.',
          recommendation: '/Next'
        };
      }
      if (flags.apply) {
        await engine.registerServers(suggestions);
      }
      const message = [
        'Suggested MCP servers:',
        ...suggestions.map((server) => `- ${formatServer(server)}`),
        flags.apply ? 'Registered automatically.' : 'Run `/MCP apply <name>` to register.'
      ].join('\n');
      await logger.log('mcp-usage.json', {
        action: 'suggest',
        servers: suggestions.map((server) => server.name),
        autoApplied: Boolean(flags.apply)
      });

      return {
        success: true,
        message,
        recommendation: '/Plan'
      };
    }

    if (action === 'apply') {
      const serverPath = rawArgs[1];
      if (!serverPath) {
        return {
          success: false,
          message: 'Usage: /MCP apply <config-file|server-name>'
        };
      }

      if (serverPath.endsWith('.json') || serverPath.endsWith('.yaml') || serverPath.endsWith('.yml')) {
        const absolute = path.isAbsolute(serverPath)
          ? serverPath
          : path.join(projectRoot, serverPath);
        const server = await loadServerFromFile(absolute);
        await engine.registerServers([server]);
        await logger.log('mcp-usage.json', { action: 'apply', servers: [server.name] });
        return {
          success: true,
          message: `Registered MCP server from ${serverPath}`,
          recommendation: '/Plan'
        };
      }

      const manifest = await engine.loadManifest();
      const existing = manifest.servers.find((server) => server.name === serverPath);
      if (existing) {
        await logger.log('mcp-usage.json', { action: 'apply', servers: [existing.name], note: 'already-registered' });
        return {
          success: true,
          message: `MCP server ${serverPath} already registered.`,
          recommendation: '/Next'
        };
      }

      return {
        success: false,
        message: `Unknown server ${serverPath}. Provide a config file or run /MCP suggest first.`
      };
    }

    await logger.log('mcp-usage.json', { action: 'error', command: rawArgs.join(' ') });

    return {
      success: false,
      message: `Unsupported MCP action: ${action}`
    };
  }
};

function formatServer(server) {
  return `${server.name} — ${server.description} (tools: ${(server.tools || []).join(', ') || 'n/a'})`;
}

function parseStackFlag(flagValue = '') {
  return flagValue.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
}

async function loadServerFromFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  if (filePath.endsWith('.json')) {
    return JSON.parse(raw);
  }
  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    const { parse } = require('yaml');
    return parse(raw);
  }
  throw new Error(`Unsupported MCP config extension: ${filePath}`);
}


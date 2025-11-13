const fs = require('fs/promises');
const path = require('path');

class McpEngine {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.manifestPath = path.join(projectRoot, '.cursor', 'config', 'mcp-manifest.json');
  }

  async loadManifest() {
    try {
      const raw = await fs.readFile(this.manifestPath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return { servers: [] };
    }
  }

  async saveManifest(manifest) {
    await fs.mkdir(path.dirname(this.manifestPath), { recursive: true });
    await fs.writeFile(this.manifestPath, JSON.stringify(manifest, null, 2));
    return manifest;
  }

  async suggestServers({ stack = {}, needs = [] }) {
    const manifest = await this.loadManifest();
    const suggestions = [];

    const addSuggestion = (server) => {
      if (!manifest.servers.find((existing) => existing.name === server.name)) {
        suggestions.push(server);
      }
    };

    if (needs.includes('competitor-research')) {
      addSuggestion({
        name: 'spec-research',
        description: 'Competitor research and spec drafting',
        tools: ['competitor_scan', 'idea_enhancer'],
        recommendedFor: ['idea', 'plan']
      });
    }

    if (stack?.frontend === 'nextjs') {
      addSuggestion({
        name: 'nextjs-helper',
        description: 'Scaffold Next.js routes and components',
        tools: ['route_map', 'component_suggester'],
        recommendedFor: ['development']
      });
    }

    return suggestions;
  }

  async registerServers(servers) {
    if (!servers || !servers.length) return this.loadManifest();
    const manifest = await this.loadManifest();
    const map = new Map(manifest.servers.map((server) => [server.name, server]));
    servers.forEach((server) => map.set(server.name, server));
    manifest.servers = Array.from(map.values());
    return this.saveManifest(manifest);
  }
}

module.exports = {
  McpEngine
};


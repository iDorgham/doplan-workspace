const fs = require('fs/promises');
const path = require('path');

class AgentOrchestrator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.agentsDir = path.join(projectRoot, '.cursor', 'agents');
    this.cache = null;
  }

  async loadAgents() {
    if (this.cache) return this.cache;
    try {
      const entries = await fs.readdir(this.agentsDir, { withFileTypes: true });
      const agents = [];
      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
        const content = await fs.readFile(path.join(this.agentsDir, entry.name), 'utf8');
        agents.push({
          id: entry.name.replace(/\.md$/, ''),
          name: this.extractHeading(content) || entry.name.replace(/\.md$/, ''),
          content
        });
      }
      this.cache = agents;
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.cache = [];
      } else {
        throw error;
      }
    }
    return this.cache;
  }

  extractHeading(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
  }

  async selectAgentsForCommand(command) {
    const agents = await this.loadAgents();
    const map = {
      setup: ['scrum', 'devops'],
      idea: ['product', 'architect'],
      plan: ['product', 'architect', 'scrum'],
      next: ['scrum', 'developer'],
      progress: ['scrum'],
      test: ['tester'],
      run: ['developer', 'devops'],
      deploy: ['devops', 'tester'],
      capacity: ['scrum', 'developer'],
      digest: ['product', 'scrum'],
      mcp: ['architect', 'developer']
    };

    const wanted = map[command] || ['developer'];
    return agents.filter((agent) => wanted.includes(agent.id));
  }

  async getPerspectives(command, context) {
    const selected = await this.selectAgentsForCommand(command);
    if (!selected.length) {
      return {
        perspectives: [],
        summary: `No agent profiles defined for ${command}`
      };
    }

    const perspectives = selected.map((agent) => ({
      agent: agent.name,
      insight: this.generateInsight(agent, command, context)
    }));

    return {
      perspectives,
      summary: this.summarisePerspectives(perspectives)
    };
  }

  generateInsight(agent, command, context) {
    const hints = [
      `Focus: ${command}`,
      `Stage: ${context.state?.stage ?? 'unknown'}`,
      `Goal: ${context.goal ?? 'n/a'}`
    ];
    return `${agent.name} recommends reviewing ${hints.join(', ')}.`;
  }

  summarisePerspectives(perspectives) {
    if (!perspectives.length) return 'No agent perspectives available.';
    return perspectives.map((p) => `${p.agent}: ${p.insight}`).join('\n');
  }
}

module.exports = {
  AgentOrchestrator
};


const path = require('path');
const { loadCommandModules } = require('./command-registry');
const { StateManager } = require('./state-manager');
const { AgentOrchestrator } = require('./agent-orchestrator');

class CommandRouter {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.stateManager = options.stateManager || new StateManager(this.projectRoot);
    this.orchestrator = options.agentOrchestrator || new AgentOrchestrator(this.projectRoot);
    this.commands = new Map();
    this.loadCommands();
  }

  loadCommands() {
    const modules = loadCommandModules(this.projectRoot);
    modules.forEach(({ name, module }) => {
      this.commands.set(name, module);
      if (Array.isArray(module.aliases)) {
        module.aliases.forEach((alias) => this.commands.set(alias, module));
      }
    });
  }

  async execute(commandName, args = [], opts = {}) {
    if (!commandName) {
      throw new Error('Command name is required.');
    }

    const command = this.commands.get(commandName);
    if (!command) {
      throw Object.assign(new Error(`Unknown DoPlan command: ${commandName}`), {
        code: 'DOPLAN_UNKNOWN_COMMAND'
      });
    }

    const state = await this.stateManager.load();
    const flags = this.parseFlags(args);
    const context = {
      projectRoot: this.projectRoot,
      state,
      flags,
      rawArgs: args,
      options: opts
    };

    const agentInsights = await this.orchestrator.getPerspectives(command.command || commandName, {
      state,
      goal: command.description || ''
    });

    const result = await command.execute({
      ...context,
      stateManager: this.stateManager,
      agentOrchestrator: this.orchestrator,
      agentInsights
    });

    if (result?.statePatch) {
      const patch = {
        ...result.statePatch,
        lastCommand: command.command || commandName,
        completedCommands: this.calculateCompletedCommands(command.command || commandName, state)
      };
      await this.stateManager.patch(patch);
    }

    return {
      command: command.command || commandName,
      ...result,
      agentInsights
    };
  }

  parseFlags(args) {
    const flags = {};
    args.forEach((entry) => {
      if (entry.startsWith('--')) {
        const [key, value] = entry.slice(2).split('=');
        flags[key] = value === undefined ? true : value;
      }
    });
    return flags;
  }

  calculateCompletedCommands(commandName, state) {
    const completed = new Set(state.completedCommands || []);
    completed.add(commandName);
    return Array.from(completed);
  }
}

module.exports = {
  CommandRouter
};


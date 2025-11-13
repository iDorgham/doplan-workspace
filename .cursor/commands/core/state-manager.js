const fs = require('fs/promises');
const path = require('path');

const STATE_FILE = path.join('.cursor', 'config', 'state.json');

class StateManager {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.statePath = path.join(projectRoot, STATE_FILE);
    this.cache = null;
  }

  async load() {
    if (this.cache) return this.cache;
    try {
      const raw = await fs.readFile(this.statePath, 'utf8');
      this.cache = JSON.parse(raw);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.cache = {
          stage: 'INIT',
          currentPhase: null,
          currentFeature: null,
          ideaData: null,
          completedCommands: [],
          lastCommand: null,
          lastUpdated: null
        };
        await this.save(this.cache);
      } else {
        throw error;
      }
    }
    return this.cache;
  }

  async save(nextState) {
    this.cache = {
      ...nextState,
      lastUpdated: new Date().toISOString()
    };
    await fs.mkdir(path.dirname(this.statePath), { recursive: true });
    await fs.writeFile(this.statePath, JSON.stringify(this.cache, null, 2));
    return this.cache;
  }

  async patch(patchData) {
    const current = await this.load();
    const merged = {
      ...current,
      ...patchData,
      completedCommands: this.mergeCommands(
        current.completedCommands,
        patchData.completedCommands
      ),
      lastCommand: patchData.lastCommand || current.lastCommand
    };
    return this.save(merged);
  }

  mergeCommands(existing = [], incoming = []) {
    const set = new Set(existing);
    (incoming || []).forEach((cmd) => set.add(cmd));
    return Array.from(set);
  }
}

module.exports = {
  StateManager
};


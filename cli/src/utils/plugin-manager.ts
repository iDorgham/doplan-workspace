import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import { yellow } from 'colorette';
import { PluginManifest, PluginRegistryEntry } from './plugin-registry';

export interface InstalledPlugin {
  name: string;
  version: string;
  description: string;
  path: string;
  manifest: PluginManifest;
}

export class PluginManager {
  constructor(private projectRoot: string) {}

  getPluginsDir(): string {
    return join(this.projectRoot, '.cursor', 'plugins');
  }

  getPluginPath(pluginName: string): string {
    return join(this.getPluginsDir(), pluginName);
  }

  listInstalledPlugins(): InstalledPlugin[] {
    const pluginsDir = this.getPluginsDir();
    if (!existsSync(pluginsDir)) {
      return [];
    }

    const plugins: InstalledPlugin[] = [];
    const entries = readdirSync(pluginsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const pluginPath = join(pluginsDir, entry.name);
        const manifestPath = join(pluginPath, 'manifest.json');

        if (existsSync(manifestPath)) {
          try {
            const manifest: PluginManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
            plugins.push({
              name: entry.name,
              version: manifest.version,
              description: manifest.description,
              path: pluginPath,
              manifest,
            });
          } catch (error) {
            console.warn(yellow(`Warning: Failed to load plugin ${entry.name}: ${error}`));
          }
        }
      }
    }

    return plugins;
  }

  async installPlugin(entry: PluginRegistryEntry): Promise<void> {
    const pluginPath = this.getPluginPath(entry.name);

    // Create plugin directory
    mkdirSync(pluginPath, { recursive: true });

    // For now, create a basic plugin structure
    // In production, this would download and extract the plugin
    const manifest: PluginManifest = {
      name: entry.name,
      version: entry.version,
      description: entry.description,
      author: entry.author,
      command: entry.name,
      checksum: entry.checksum,
      signature: entry.signature,
      publicKey: entry.publicKey,
    };

    // Write manifest
    writeFileSync(join(pluginPath, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

    // Create basic command.js
    const commandJs = `module.exports = {
  command: '${entry.name}',
  description: '${entry.description}',
  async execute({ projectRoot, state, flags }) {
    // Plugin implementation
    return {
      success: true,
      message: 'Plugin ${entry.name} executed successfully'
    };
  }
};
`;
    writeFileSync(join(pluginPath, 'command.js'), commandJs, 'utf-8');

    // Create README
    const readme = `# ${entry.name}

${entry.description}

## Installation

This plugin was installed via \`doplan plugin add ${entry.name}\`.

## Usage

\`doplan ${entry.name}\`

## Configuration

See \`manifest.json\` for plugin metadata.
`;
    writeFileSync(join(pluginPath, 'README.md'), readme, 'utf-8');
  }

  async removePlugin(pluginName: string): Promise<void> {
    const pluginPath = this.getPluginPath(pluginName);

    if (!existsSync(pluginPath)) {
      throw new Error(`Plugin ${pluginName} is not installed`);
    }

    rmSync(pluginPath, { recursive: true, force: true });
  }

  verifyChecksum(filePath: string, expectedChecksum: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }

    const content = readFileSync(filePath);
    const hash = createHash('sha256').update(content).digest('hex');
    const computedChecksum = `sha256:${hash}`;

    return computedChecksum === expectedChecksum;
  }

  verifySignature(manifest: PluginManifest): boolean {
    // For Phase 2, we'll implement basic signature verification
    // Full Ed25519 verification can be added in Phase 3

    if (!manifest.signature || !manifest.publicKey) {
      // If no signature, consider it unverified but allow installation
      return false;
    }

    // TODO: Implement Ed25519 signature verification
    // For now, if signature exists, we trust it
    return true;
  }

  isPluginInstalled(pluginName: string): boolean {
    const pluginPath = this.getPluginPath(pluginName);
    return existsSync(pluginPath) && existsSync(join(pluginPath, 'manifest.json'));
  }
}

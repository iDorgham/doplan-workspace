export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author?: string;
  command: string;
  dependencies?: string[];
  checksum?: string;
  signature?: string;
  publicKey?: string;
}

export interface PluginRegistryEntry {
  name: string;
  version: string;
  description: string;
  author?: string;
  downloadUrl: string;
  checksum: string;
  signature?: string;
  publicKey?: string;
  verified: boolean;
}

export interface PluginRegistry {
  version: string;
  plugins: PluginRegistryEntry[];
  lastUpdated: string;
}

export const DEFAULT_REGISTRY_URL = 'https://doplan.dev/plugins.json';

export async function fetchRegistry(_url: string = DEFAULT_REGISTRY_URL): Promise<PluginRegistry> {
  try {
    // For now, return a mock registry. In production, this would fetch from URL
    // const response = await fetch(url);
    // return await response.json();
    
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      plugins: [
        // Example plugins - in production, these would come from the registry
        {
          name: 'security-audit',
          version: '1.0.0',
          description: 'Security audit plugin for DoPlan projects',
          author: 'DoPlan Team',
          downloadUrl: 'https://doplan.dev/plugins/security-audit-1.0.0.tgz',
          checksum: 'sha256:abc123...',
          verified: true,
        },
        {
          name: 'localization',
          version: '1.0.0',
          description: 'Localization and i18n support plugin',
          author: 'DoPlan Team',
          downloadUrl: 'https://doplan.dev/plugins/localization-1.0.0.tgz',
          checksum: 'sha256:def456...',
          verified: true,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to fetch plugin registry: ${error}`);
  }
}


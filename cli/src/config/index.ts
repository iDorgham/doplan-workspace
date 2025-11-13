import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { green, yellow } from 'colorette';

export interface DoPlanConfig {
  projectRoot: string;
  noSpinner?: boolean;
  telemetry?: {
    enabled: boolean;
    endpoint?: string;
  };
  assistants?: {
    default?: 'claude' | 'gemini' | 'openai' | 'none';
    claude?: {
      apiKey?: string;
      model?: string;
    };
    gemini?: {
      apiKey?: string;
      model?: string;
    };
  };
  plugins?: {
    registry?: string;
    verifySignatures?: boolean;
  };
}

const defaultConfig: DoPlanConfig = {
  projectRoot: '.',
  noSpinner: false,
  telemetry: {
    enabled: false,
  },
  assistants: {
    default: 'none',
  },
  plugins: {
    registry: 'https://doplan.dev/plugins.json',
    verifySignatures: true,
  },
};

export function loadConfig(cliOptions: Record<string, any>): DoPlanConfig {
  const projectRoot = cliOptions.cwd || process.cwd();
  const configPath = join(projectRoot, 'doplan.config.json');

  let fileConfig: Partial<DoPlanConfig> = {};

  if (existsSync(configPath)) {
    try {
      const configContent = readFileSync(configPath, 'utf-8');
      fileConfig = JSON.parse(configContent);
      console.log(green('✓ Loaded doplan.config.json'));
    } catch (error) {
      console.warn(yellow(`⚠ Failed to parse doplan.config.json: ${error}`));
    }
  }

  // Merge: defaults < file config < CLI options
  const merged: DoPlanConfig = {
    ...defaultConfig,
    ...fileConfig,
    projectRoot: cliOptions.cwd || fileConfig.projectRoot || defaultConfig.projectRoot,
    noSpinner: cliOptions.noSpinner ?? fileConfig.noSpinner ?? defaultConfig.noSpinner,
  };

  // Warn on unknown properties if schema validation is enabled
  if (process.env.DOPLAN_VALIDATE_CONFIG === 'true') {
    validateConfig(merged);
  }

  return merged;
}

function validateConfig(config: DoPlanConfig): void {
  // Basic validation - can be expanded with JSON schema validator
  const knownKeys = ['projectRoot', 'noSpinner', 'telemetry', 'assistants', 'plugins'];
  const configKeys = Object.keys(config);

  const unknownKeys = configKeys.filter((key) => !knownKeys.includes(key));
  if (unknownKeys.length > 0) {
    console.warn(yellow(`⚠ Unknown config keys: ${unknownKeys.join(', ')}`));
  }
}


import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const TELEMETRY_CONFIG_PATH = join(homedir(), '.doplanrc');

export interface TelemetryConfig {
  enabled: boolean;
  lastPrompted?: string;
}

export interface TelemetryEvent {
  command: string;
  duration: number;
  version: string;
  success: boolean;
  timestamp: string;
}

let telemetryEnabled: boolean | null = null;
let configCache: TelemetryConfig | null = null;

export function loadTelemetryConfig(): TelemetryConfig {
  if (configCache) {
    return configCache;
  }

  const defaultConfig: TelemetryConfig = {
    enabled: false,
  };

  if (!existsSync(TELEMETRY_CONFIG_PATH)) {
    configCache = defaultConfig;
    return defaultConfig;
  }

  try {
    const content = readFileSync(TELEMETRY_CONFIG_PATH, 'utf-8');
    configCache = { ...defaultConfig, ...JSON.parse(content) };
    return configCache!;
  } catch (error) {
    configCache = defaultConfig;
    return defaultConfig;
  }
}

export function saveTelemetryConfig(config: TelemetryConfig): void {
  try {
    writeFileSync(TELEMETRY_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    configCache = config;
  } catch (error) {
    // Silently fail if we can't write config
  }
}

export function isTelemetryEnabled(): boolean {
  if (telemetryEnabled !== null) {
    return telemetryEnabled;
  }

  const config = loadTelemetryConfig();
  telemetryEnabled = config.enabled;
  return telemetryEnabled;
}

export function setTelemetryEnabled(enabled: boolean): void {
  const config = loadTelemetryConfig();
  config.enabled = enabled;
  config.lastPrompted = new Date().toISOString();
  saveTelemetryConfig(config);
  telemetryEnabled = enabled;
}

export async function promptForTelemetry(): Promise<boolean> {
  const config = loadTelemetryConfig();
  
  // Don't prompt if already enabled or if prompted recently (within 30 days)
  if (config.enabled) {
    return true;
  }

  if (config.lastPrompted) {
    const lastPrompted = new Date(config.lastPrompted);
    const daysSincePrompt = (Date.now() - lastPrompted.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePrompt < 30) {
      return false; // Don't prompt again for 30 days
    }
  }

  // Prompt user
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log('\n' + '─'.repeat(60));
    console.log('DoPlan Telemetry');
    console.log('─'.repeat(60));
    console.log('Help improve DoPlan by sharing anonymous usage data.');
    console.log('This includes: command name, duration, version, success status.');
    console.log('No personal data or code is collected.');
    console.log('─'.repeat(60));
    
    rl.question('Enable telemetry? (y/N): ', (answer) => {
      const enabled = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
      setTelemetryEnabled(enabled);
      
      if (enabled) {
        console.log('✓ Telemetry enabled. Thank you for helping improve DoPlan!');
      } else {
        console.log('Telemetry disabled. You can enable it later with `doplan telemetry --enable`');
      }
      
      rl.close();
      resolve(enabled);
    });
  });
}

export async function recordEvent(event: TelemetryEvent): Promise<void> {
  if (!isTelemetryEnabled()) {
    return;
  }

  // For now, log locally. In the future, this could send to a telemetry endpoint
  const logPath = join(homedir(), '.doplan-telemetry.log');
  const logEntry = JSON.stringify(event) + '\n';
  
  try {
    writeFileSync(logPath, logEntry, { flag: 'a' });
  } catch (error) {
    // Silently fail if we can't write telemetry
  }
}

export function getVersion(): string {
  try {
    const { readFileSync } = require('fs');
    const { join } = require('path');
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, '../../package.json'), 'utf-8')
    );
    return packageJson.version || 'unknown';
  } catch {
    return 'unknown';
  }
}


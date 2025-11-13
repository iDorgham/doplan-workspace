import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import { loadConfig } from '../../config';

const testDir = join(__dirname, '../fixtures/config-test');
const configPath = join(testDir, 'doplan.config.json');

describe('Configuration Loading', () => {
  beforeEach(() => {
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (existsSync(configPath)) {
      unlinkSync(configPath);
    }
  });

  it('should load default config when no file exists', () => {
    const config = loadConfig({ cwd: testDir });
    expect(config.projectRoot).toBe(testDir);
    expect(config.noSpinner).toBe(false);
    expect(config.telemetry?.enabled).toBe(false);
  });

  it('should load config from doplan.config.json', () => {
    const testConfig = {
      noSpinner: true,
      telemetry: {
        enabled: true,
      },
    };
    writeFileSync(configPath, JSON.stringify(testConfig, null, 2));

    const config = loadConfig({ cwd: testDir });
    expect(config.noSpinner).toBe(true);
    expect(config.telemetry?.enabled).toBe(true);
  });

  it('should merge CLI options with file config', () => {
    const testConfig = {
      noSpinner: false,
    };
    writeFileSync(configPath, JSON.stringify(testConfig, null, 2));

    const config = loadConfig({ cwd: testDir, noSpinner: true });
    expect(config.noSpinner).toBe(true); // CLI option should override
  });

  it('should handle invalid JSON gracefully', () => {
    writeFileSync(configPath, '{ invalid json }');
    
    // Should not throw, should use defaults
    const config = loadConfig({ cwd: testDir });
    expect(config).toBeDefined();
  });
});


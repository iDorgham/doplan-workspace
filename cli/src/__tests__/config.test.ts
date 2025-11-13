import { describe, it, expect } from 'vitest';
import { loadConfig } from '../config';

describe('Config Loading', () => {
  it('should load default config when no file exists', () => {
    const config = loadConfig({ cwd: '/tmp/nonexistent' });
    expect(config.projectRoot).toBe('/tmp/nonexistent');
    expect(config.noSpinner).toBe(false);
  });

  it('should merge CLI options with defaults', () => {
    const config = loadConfig({ cwd: '/tmp', noSpinner: true });
    expect(config.noSpinner).toBe(true);
  });
});


import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const cliPath = join(__dirname, '../../../dist/index.js');
const fixtureDir = join(__dirname, '../fixtures/test-workspace');

describe('CLI Integration Tests', () => {
  beforeAll(() => {
    // Create fixture workspace
    if (existsSync(fixtureDir)) {
      rmSync(fixtureDir, { recursive: true, force: true });
    }
    mkdirSync(fixtureDir, { recursive: true });
    
    // Create minimal .cursor structure
    mkdirSync(join(fixtureDir, '.cursor', 'config'), { recursive: true });
    mkdirSync(join(fixtureDir, '.cursor', 'commands'), { recursive: true });
    mkdirSync(join(fixtureDir, 'scripts'), { recursive: true });
    
    // Create minimal state.json
    writeFileSync(
      join(fixtureDir, '.cursor', 'config', 'state.json'),
      JSON.stringify({ stage: 'INIT', lastUpdated: new Date().toISOString() }, null, 2)
    );
    
    // Create minimal doplan-cli.js
    writeFileSync(
      join(fixtureDir, 'scripts', 'doplan-cli.js'),
      `#!/usr/bin/env node
const command = process.argv[2] || 'help';
console.log(JSON.stringify({ command, success: true, message: 'Test command executed' }));
`
    );
  });

  afterAll(() => {
    // Cleanup
    if (existsSync(fixtureDir)) {
      rmSync(fixtureDir, { recursive: true, force: true });
    }
  });

  it('should show help when no command provided', () => {
    const output = execSync(`node ${cliPath} --help`, { encoding: 'utf-8', cwd: fixtureDir });
    expect(output).toContain('DoPlan CLI');
    expect(output).toContain('Commands:');
  });

  it('should show version', () => {
    const output = execSync(`node ${cliPath} --version`, { encoding: 'utf-8', cwd: fixtureDir });
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('should handle setup command', () => {
    const output = execSync(`node ${cliPath} setup --help`, { encoding: 'utf-8', cwd: fixtureDir });
    expect(output).toContain('setup');
    expect(output).toContain('Bootstrap environment');
  });

  it('should handle idea command', () => {
    const output = execSync(`node ${cliPath} idea --help`, { encoding: 'utf-8', cwd: fixtureDir });
    expect(output).toContain('idea');
    expect(output).toContain('Capture app idea');
  });

  it('should handle plan command', () => {
    const output = execSync(`node ${cliPath} plan --help`, { encoding: 'utf-8', cwd: fixtureDir });
    expect(output).toContain('plan');
    expect(output).toContain('Generate project plan');
  });

  it('should handle --cwd option', () => {
    const output = execSync(
      `node ${cliPath} --cwd ${fixtureDir} --help`,
      { encoding: 'utf-8' }
    );
    expect(output).toContain('DoPlan CLI');
  });

  it('should handle --json option', () => {
    // This test verifies the option is accepted (actual JSON output depends on command)
    const output = execSync(`node ${cliPath} --json --help`, { encoding: 'utf-8', cwd: fixtureDir });
    expect(output).toBeTruthy();
  });
});


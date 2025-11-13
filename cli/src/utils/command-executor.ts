import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { green, red, yellow } from 'colorette';
import ora from 'ora';
import { DoPlanConfig } from '../config';

const execAsync = promisify(exec);

export interface CommandOptions extends DoPlanConfig {
  [key: string]: any;
}

export async function executeCommand(
  command: string,
  options: CommandOptions
): Promise<void> {
  const { projectRoot, noSpinner, json } = options;
  const workspacePath = join(projectRoot, '.cursor');
  const scriptPath = join(projectRoot, 'scripts', 'doplan-cli.js');

  // Check if workspace exists
  const { existsSync } = await import('fs');
  if (!existsSync(workspacePath)) {
    console.error(red('✗ DoPlan workspace not found. Run `doplan init` first.'));
    process.exit(1);
  }

  // Build command arguments
  const args: string[] = [command];
  Object.entries(options).forEach(([key, value]) => {
    if (key !== 'projectRoot' && key !== 'noSpinner' && key !== 'json' && value !== undefined) {
      if (typeof value === 'boolean' && value) {
        args.push(`--${key}`);
      } else if (typeof value !== 'boolean') {
        args.push(`--${key}`, String(value));
      }
    }
  });

  const commandStr = `node ${scriptPath} ${args.join(' ')}`;
  const spinner = noSpinner ? null : ora(`Running ${command}...`).start();

  try {
    const { stdout, stderr } = await execAsync(commandStr, {
      cwd: projectRoot,
      env: { ...process.env, DOPLAN_CLI: 'true' },
    });

    if (spinner) spinner.succeed(green(`✓ ${command} completed`));

    if (json) {
      // Try to parse and format JSON output
      try {
        const jsonOutput = JSON.parse(stdout);
        console.log(JSON.stringify(jsonOutput, null, 2));
      } catch {
        console.log(stdout);
      }
    } else {
      if (stdout) console.log(stdout);
      if (stderr) console.warn(yellow(stderr));
    }
  } catch (error: any) {
    if (spinner) spinner.fail(red(`✗ ${command} failed`));
    console.error(red(`Error: ${error.message}`));
    if (error.stdout) console.error(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(error.code || 1);
  }
}


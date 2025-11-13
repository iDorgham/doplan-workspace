import { Command } from 'commander';
import { loadConfig } from '../config';
import { green, red, yellow, cyan } from 'colorette';
import ora from 'ora';
import { existsSync, mkdirSync, writeFileSync, copyFileSync } from 'fs';
import { join, resolve } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { readdir } from 'fs/promises';

const execAsync = promisify(exec);

interface InitOptions {
  name?: string;
  stack?: string;
  git?: boolean;
  'skip-git'?: boolean;
  install?: boolean;
  'skip-install'?: boolean;
  setup?: boolean;
  'skip-setup'?: boolean;
  cwd?: string;
}

const STACK_PRESETS = [
  { name: 'React + TypeScript', value: 'react-ts' },
  { name: 'Vue.js + TypeScript', value: 'vue-ts' },
  { name: 'Node.js + Express', value: 'node-express' },
  { name: 'Next.js', value: 'nextjs' },
  { name: 'SvelteKit', value: 'sveltekit' },
  { name: 'Vanilla JavaScript', value: 'vanilla-js' },
  { name: 'Python + FastAPI', value: 'python-fastapi' },
  { name: 'Custom/Other', value: 'custom' },
];

async function prompt(question: string): Promise<string> {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function copyDirectory(src: string, dest: string): Promise<void> {
  await mkdirSync(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function getTemplatePath(): string {
  // Try multiple paths to find the template directory
  
  // 1. Development: CLI is in the workspace (cli/ directory)
  const devPath = resolve(__dirname, '../../..');
  if (existsSync(join(devPath, '.cursor'))) {
    return devPath;
  }
  
  // 2. Installed via npm: Look for templates in CLI package
  // In production, templates should be bundled with the CLI
  const cliPackagePath = resolve(__dirname, '../..');
  const templatesPath = join(cliPackagePath, 'templates');
  if (existsSync(templatesPath)) {
    return cliPackagePath;
  }
  
  // 3. Fallback: Use current working directory's parent
  // This assumes we're running from the workspace root
  const cwdParent = resolve(process.cwd(), '..');
  if (existsSync(join(cwdParent, '.cursor'))) {
    return cwdParent;
  }
  
  // 4. Last resort: return null and use minimal structure
  return '';
}

async function initializeProject(options: InitOptions): Promise<void> {
  const { name, stack, git, 'skip-git': skipGit, install, 'skip-install': skipInstall, setup, 'skip-setup': skipSetup, cwd } = options;
  
  let projectName = name;
  let selectedStack = stack;
  
  // Handle skip flags: if skip-* is true, set to false and don't prompt
  let initGit: boolean | undefined = skipGit ? false : (git !== undefined ? git : undefined);
  let runInstall: boolean | undefined = skipInstall ? false : (install !== undefined ? install : undefined);
  let runSetup: boolean | undefined = skipSetup ? false : (setup !== undefined ? setup : undefined);

  // Interactive prompts if not provided
  if (!projectName) {
    projectName = await prompt(cyan('Project name: '));
    if (!projectName) {
      console.error(red('✗ Project name is required'));
      process.exit(1);
    }
  }

  if (!selectedStack) {
    console.log(cyan('\nStack presets:'));
    STACK_PRESETS.forEach((preset, index) => {
      console.log(`  ${index + 1}. ${preset.name}`);
    });
    const stackInput = await prompt(cyan('\nSelect stack (1-8) or press Enter for Custom: '));
    const stackIndex = parseInt(stackInput) - 1;
    selectedStack = stackIndex >= 0 && stackIndex < STACK_PRESETS.length
      ? STACK_PRESETS[stackIndex].value
      : 'custom';
  }

  // Only prompt if not explicitly set (skip flags already set to false)
  if (initGit === undefined) {
    const gitInput = await prompt(cyan('Initialize Git repository? (Y/n): '));
    initGit = gitInput.toLowerCase() !== 'n';
  }

  if (runInstall === undefined) {
    const installInput = await prompt(cyan('Run npm install? (Y/n): '));
    runInstall = installInput.toLowerCase() !== 'n';
  }

  if (runSetup === undefined) {
    const setupInput = await prompt(cyan('Run doplan setup? (Y/n): '));
    runSetup = setupInput.toLowerCase() !== 'n';
  }

  const projectRoot = cwd ? resolve(cwd) : resolve(process.cwd(), projectName);
  const templateRoot = getTemplatePath();

  // Check if directory already exists
  if (existsSync(projectRoot)) {
    const files = await readdir(projectRoot);
    if (files.length > 0) {
      const overwrite = await prompt(yellow(`Directory ${projectRoot} exists and is not empty. Continue? (y/N): `));
      if (overwrite.toLowerCase() !== 'y') {
        console.log(red('✗ Initialization cancelled'));
        process.exit(0);
      }
    }
  }

  const spinner = ora('Initializing DoPlan workspace...').start();

  try {
    // Create project directory
    await mkdirSync(projectRoot, { recursive: true });

    // Copy .cursor directory
    if (templateRoot) {
      const cursorSource = join(templateRoot, '.cursor');
      const cursorDest = join(projectRoot, '.cursor');
      
      if (existsSync(cursorSource)) {
        spinner.text = 'Copying .cursor directory...';
        await copyDirectory(cursorSource, cursorDest);
      } else {
        spinner.warn(yellow('Template .cursor directory not found. Creating minimal structure...'));
        await createMinimalStructure(projectRoot);
      }
    } else {
      spinner.text = 'Creating minimal DoPlan structure...';
      await createMinimalStructure(projectRoot);
    }

    // Copy scripts directory
    if (templateRoot) {
      const scriptsSource = join(templateRoot, 'scripts');
      const scriptsDest = join(projectRoot, 'scripts');
      
      if (existsSync(scriptsSource)) {
        spinner.text = 'Copying scripts...';
        await copyDirectory(scriptsSource, scriptsDest);
      } else {
        await mkdirSync(scriptsDest, { recursive: true });
        await createDoplanCliScript(scriptsDest);
      }
    } else {
      await mkdirSync(join(projectRoot, 'scripts'), { recursive: true });
      await createDoplanCliScript(join(projectRoot, 'scripts'));
    }

    // Create package.json
    spinner.text = 'Creating package.json...';
    const packageJson = createPackageJson(projectName, selectedStack);
    writeFileSync(join(projectRoot, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Create .gitignore if it doesn't exist
    const gitignorePath = join(projectRoot, '.gitignore');
    if (!existsSync(gitignorePath)) {
      const gitignoreContent = `node_modules/
.env
.DS_Store
plan/
.cursor/logs/
.cursor/context/idea-summary.json
`;
      writeFileSync(gitignorePath, gitignoreContent);
    }

    // Initialize Git if requested
    if (initGit) {
      spinner.text = 'Initializing Git repository...';
      try {
        await execAsync('git init', { cwd: projectRoot });
        await execAsync('git add .', { cwd: projectRoot });
        await execAsync('git commit -m "Initial commit: DoPlan workspace"', { cwd: projectRoot }).catch(() => {
          // Ignore if no files to commit
        });
      } catch (error) {
        spinner.warn(yellow('Git initialization failed (this is okay if Git is not installed)'));
      }
    }

    spinner.succeed(green('✓ DoPlan workspace initialized'));

    // Run npm install if requested
    if (runInstall) {
      const installSpinner = ora('Installing dependencies...').start();
      try {
        await execAsync('npm install', { cwd: projectRoot });
        installSpinner.succeed(green('✓ Dependencies installed'));
      } catch (error: any) {
        installSpinner.fail(red('✗ Failed to install dependencies'));
        console.error(yellow('You can run `npm install` manually later'));
      }
    }

    // Run doplan setup if requested
    if (runSetup) {
      console.log(cyan('\nRunning doplan setup...'));
      try {
        await execAsync('npx doplan-cli@alpha setup', { cwd: projectRoot });
      } catch (error: any) {
        console.warn(yellow('Setup command failed. You can run `doplan setup` manually later'));
      }
    }

    console.log(green(`\n✓ Project "${projectName}" initialized successfully!`));
    console.log(cyan(`\nNext steps:`));
    console.log(`  cd ${projectName}`);
    if (!runInstall) {
      console.log(`  npm install`);
    }
    if (!runSetup) {
      console.log(`  doplan setup`);
    }
    console.log(`  doplan idea`);
    console.log(`  doplan plan`);

  } catch (error: any) {
    spinner.fail(red('✗ Initialization failed'));
    console.error(red(`Error: ${error.message}`));
    if (process.env.DOPLAN_DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function createMinimalStructure(projectRoot: string): Promise<void> {
  const cursorDir = join(projectRoot, '.cursor');
  const dirs = [
    join(cursorDir, 'commands', 'core'),
    join(cursorDir, 'config'),
    join(cursorDir, 'rules', 'commands'),
    join(cursorDir, 'workflows', 'generators'),
    join(cursorDir, 'panels'),
    join(cursorDir, 'logs'),
    join(cursorDir, 'templates', 'digests'),
  ];

  for (const dir of dirs) {
    await mkdirSync(dir, { recursive: true });
  }

  // Create minimal state.json
  writeFileSync(
    join(cursorDir, 'config', 'state.json'),
    JSON.stringify({ stage: 'INIT', lastUpdated: new Date().toISOString() }, null, 2)
  );
}

async function createDoplanCliScript(scriptsDir: string): Promise<void> {
  const scriptContent = `#!/usr/bin/env node
const path = require('path');
const { CommandRouter } = require('../.cursor/commands/core/command-router');

async function main() {
  const [, , rawCommand, ...rest] = process.argv;
  if (!rawCommand) {
    console.error('No DoPlan command supplied.');
    process.exit(1);
  }
  const command = rawCommand.toLowerCase();
  const projectRoot = path.resolve(__dirname, '..');
  const router = new CommandRouter({ projectRoot });
  try {
    await router.execute(command, rest, { entryPoint: 'cli' });
  } catch (error) {
    console.error(\`DoPlan command failed: \${error.message}\`);
    process.exit(1);
  }
}

main();
`;
  writeFileSync(join(scriptsDir, 'doplan-cli.js'), scriptContent);
}

function createPackageJson(projectName: string, stack: string): any {
  const stackDescriptions: Record<string, string> = {
    'react-ts': 'React + TypeScript',
    'vue-ts': 'Vue.js + TypeScript',
    'node-express': 'Node.js + Express',
    'nextjs': 'Next.js',
    'sveltekit': 'SvelteKit',
    'vanilla-js': 'Vanilla JavaScript',
    'python-fastapi': 'Python + FastAPI',
    'custom': 'Custom',
  };
  
  return {
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '0.1.0',
    description: `DoPlan workspace for ${projectName} (${stackDescriptions[stack] || stack})`,
    type: 'commonjs',
    scripts: {
      'doplan:setup': 'node scripts/doplan-cli.js setup',
      'doplan:idea': 'node scripts/doplan-cli.js idea',
      'doplan:plan': 'node scripts/doplan-cli.js plan',
      'doplan:next': 'node scripts/doplan-cli.js next',
      'doplan:progress': 'node scripts/doplan-cli.js progress',
      'doplan:test': 'node scripts/doplan-cli.js test',
      'doplan:run': 'node scripts/doplan-cli.js run',
      'doplan:deploy': 'node scripts/doplan-cli.js deploy',
      'doplan:capacity': 'node scripts/doplan-cli.js capacity',
      'doplan:digest': 'node scripts/doplan-cli.js digest',
      'doplan:mcp': 'node scripts/doplan-cli.js mcp',
      'doplan:party': 'node scripts/doplan-cli.js party',
      'doplan:watch': 'node scripts/doplan-cli.js watch',
    },
    dependencies: {
      chokidar: '^3.5.3',
      colorette: '^2.0.20',
      yaml: '^2.5.1',
    },
  };
}

export function initCommand(program: Command) {
  program
    .command('init')
    .description('Initialize a new DoPlan workspace')
    .option('--name <name>', 'Project name (non-interactive mode)')
    .option('--stack <stack>', 'Stack preset (react-ts, vue-ts, node-express, nextjs, sveltekit, vanilla-js, python-fastapi, custom)')
    .option('--git', 'Initialize Git repository')
    .option('--skip-git', 'Skip Git initialization')
    .option('--install', 'Run npm install')
    .option('--skip-install', 'Skip npm install')
    .option('--setup', 'Run doplan setup after initialization')
    .option('--skip-setup', 'Skip doplan setup')
    .option('--cwd <path>', 'Target directory (default: current directory + project name)')
    .action(async (options: InitOptions) => {
      const config = loadConfig(program.opts());
      await initializeProject({ ...options, ...config });
    });
}


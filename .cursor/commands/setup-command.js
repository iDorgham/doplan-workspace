const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const { Logger } = require('./core/logger');

module.exports = {
  command: 'setup',
  description: 'Bootstrap the local environment (deps, Node version, Git remote, env files).',
  aliases: ['init'],
  async execute({ projectRoot, flags }) {
    const tasks = [];
    const logger = new Logger(projectRoot);

    tasks.push(await checkNodeVersion());
    if (!flags['skip-install']) {
      tasks.push(await installDependencies(projectRoot, flags['package-manager']));
    }
    tasks.push(await ensureGitRemote(projectRoot, flags));
    tasks.push(await seedEnvFile(projectRoot));

    const failed = tasks.filter((task) => !task.success);

    const message = [
      'Setup summary:',
      ...tasks.map((task) => `- ${task.label}: ${task.success ? '✅' : `❌ ${task.error}`}`)
    ].join('\n');

    await logger.log('lifecycle.json', {
      action: 'setup',
      results: tasks.map((task) => ({
        label: task.label,
        success: task.success
      }))
    });

    return {
      success: failed.length === 0,
      message,
      recommendation: failed.length === 0 ? '/Idea' : 'Resolve failures then rerun /Setup',
      statePatch: failed.length === 0 ? { stage: 'ONBOARDED' } : {}
    };
  }
};

async function checkNodeVersion() {
    const requiredMajor = 20;
    const currentMajor = Number(process.versions.node.split('.')[0]);
    const success = currentMajor >= requiredMajor;
    return {
      label: `Node.js version (${process.versions.node})`,
      success,
      error: success ? null : `Requires Node ${requiredMajor}+`
    };
}

async function installDependencies(projectRoot, packageManager = 'npm') {
  const lockFile =
    packageManager === 'pnpm'
      ? 'pnpm-lock.yaml'
      : packageManager === 'yarn'
      ? 'yarn.lock'
      : 'package-lock.json';

  const hasLock = await fileExists(path.join(projectRoot, lockFile));
  if (!hasLock && packageManager !== 'npm') {
    return {
      label: `Install dependencies with ${packageManager}`,
      success: false,
      error: `${lockFile} not found.`
    };
  }

  try {
    await runCommand(packageManager, ['install'], projectRoot);
    return { label: 'Install dependencies', success: true };
  } catch (error) {
    return { label: 'Install dependencies', success: false, error: error.message };
  }
}

async function ensureGitRemote(projectRoot, flags) {
  const gitDir = path.join(projectRoot, '.git');
  const hasGit = await directoryExists(gitDir);
  if (!hasGit) {
    return { label: 'Git remote', success: false, error: 'No Git repository found.' };
  }

  try {
    const remotes = await runCommand('git', ['remote', '-v'], projectRoot);
    if (remotes.stdout.trim()) {
      return { label: 'Git remote', success: true };
    }
  } catch (error) {
    return { label: 'Git remote', success: false, error: error.message };
  }

  if (flags['remote-url']) {
    try {
      await runCommand('git', ['remote', 'add', 'origin', flags['remote-url']], projectRoot);
      return { label: 'Git remote', success: true };
    } catch (error) {
      return { label: 'Git remote', success: false, error: error.message };
    }
  }

  return {
    label: 'Git remote',
    success: false,
    error: 'No remote configured. Provide --remote-url to add one.'
  };
}

async function seedEnvFile(projectRoot) {
  const envExample = path.join(projectRoot, '.env.example');
  const envFile = path.join(projectRoot, '.env');

  const exampleExists = await fileExists(envExample);
  if (!exampleExists) {
    return { label: 'Environment template', success: true };
  }

  const envExists = await fileExists(envFile);
  if (envExists) {
    return { label: 'Environment template', success: true };
  }

  try {
    const content = await fs.readFile(envExample, 'utf8');
    await fs.writeFile(envFile, content, 'utf8');
    return { label: 'Environment template', success: true };
  } catch (error) {
    return { label: 'Environment template', success: false, error: error.message };
  }
}

async function fileExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function directoryExists(target) {
  try {
    const stat = await fs.stat(target);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(stderr.trim() || `Command failed: ${command} ${args.join(' ')}`));
      }
    });
  });
}


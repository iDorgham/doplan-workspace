const { spawn } = require('child_process');

module.exports = {
  command: 'test',
  description: 'Run the configured test suite.',
  aliases: [],
  async execute({ projectRoot, flags }) {
    const script = flags.script || 'test';
    const success = await runNpmScript(script, projectRoot);

    return {
      success,
      message: success
        ? `Test script "${script}" completed successfully.`
        : `Test script "${script}" failed.`,
      recommendation: success ? '/Run' : 'Fix failing tests then rerun /Test',
      statePatch: success ? { stage: 'TESTED' } : {}
    };
  }
};

function runNpmScript(script, cwd) {
  return new Promise((resolve) => {
    const child = spawn('npm', ['run', script], {
      cwd,
      stdio: 'inherit'
    });
    child.on('close', (code) => resolve(code === 0));
  });
}


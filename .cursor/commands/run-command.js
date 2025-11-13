const { spawn } = require('child_process');

module.exports = {
  command: 'run',
  description: 'Start the application locally.',
  aliases: ['start'],
  async execute({ projectRoot, flags }) {
    const script = flags.script || 'dev';
    const success = await runNpmScript(script, projectRoot);

    return {
      success,
      message: success
        ? `Application script "${script}" finished.`
        : `Application script "${script}" exited with errors.`,
      recommendation: success ? '/Next' : 'Review logs, fix issues, then rerun /Run'
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


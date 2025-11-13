const { spawn } = require('child_process');

module.exports = {
  command: 'deploy',
  description: 'Execute deployment pipeline with optional pre-checks.',
  aliases: [],
  async execute({ projectRoot, flags }) {
    if (!flags['skip-tests']) {
      const testsPassed = await runNpmScript(flags['test-script'] || 'test', projectRoot);
      if (!testsPassed) {
        return {
          success: false,
          message: 'Deployment halted. Tests failed. Use --skip-tests to override (not recommended).',
          recommendation: 'Fix failing tests, rerun /Test then /Deploy'
        };
      }
    }

    const buildScript = flags['build-script'] || 'build';
    const deployScript = flags['deploy-script'] || 'deploy';

    const buildResult = await runNpmScript(buildScript, projectRoot);
    if (!buildResult) {
      return {
        success: false,
        message: `Build script "${buildScript}" failed. Deployment aborted.`,
        recommendation: 'Fix build issues then rerun /Deploy'
      };
    }

    const deployResult = await runNpmScript(deployScript, projectRoot);
    return {
      success: deployResult,
      message: deployResult
        ? 'Deployment succeeded.'
        : `Deployment script "${deployScript}" failed.`,
      recommendation: deployResult ? '/Digest' : 'Review deployment logs and retry',
      statePatch: deployResult ? { stage: 'DEPLOYED' } : {}
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


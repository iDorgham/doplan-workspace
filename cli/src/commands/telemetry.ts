import { Command } from 'commander';
import { green, red, yellow, cyan } from 'colorette';
import {
  setTelemetryEnabled,
  loadTelemetryConfig,
} from '../utils/telemetry';

export function telemetryCommand(program: Command) {
  program
    .command('telemetry')
    .description('Manage telemetry settings')
    .option('--enable', 'Enable telemetry')
    .option('--disable', 'Disable telemetry')
    .option('--status', 'Show current telemetry status')
    .action(async (options) => {
      if (options.enable) {
        setTelemetryEnabled(true);
        console.log(green('✓ Telemetry enabled'));
        console.log(cyan('Thank you for helping improve DoPlan!'));
      } else if (options.disable) {
        setTelemetryEnabled(false);
        console.log(yellow('Telemetry disabled'));
      } else if (options.status) {
        const config = loadTelemetryConfig();
        const status = config.enabled ? green('enabled') : red('disabled');
        console.log(`Telemetry is currently ${status}`);
        
        if (config.lastPrompted) {
          const lastPrompted = new Date(config.lastPrompted);
          console.log(`Last prompted: ${lastPrompted.toLocaleDateString()}`);
        }
      } else {
        // Show status by default
        const config = loadTelemetryConfig();
        const status = config.enabled ? green('enabled') : red('disabled');
        console.log(`Telemetry is currently ${status}`);
        console.log('');
        console.log('Usage:');
        console.log('  doplan telemetry --enable   Enable telemetry');
        console.log('  doplan telemetry --disable  Disable telemetry');
        console.log('  doplan telemetry --status   Show status');
      }
    });
}


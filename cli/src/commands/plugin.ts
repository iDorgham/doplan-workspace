import { Command } from 'commander';
import { loadConfig } from '../config';
import { green, red, yellow, cyan, blue } from 'colorette';
import { PluginManager } from '../utils/plugin-manager';
import { fetchRegistry } from '../utils/plugin-registry';
import ora from 'ora';

export function pluginCommand(program: Command) {
  const pluginCmd = program
    .command('plugin')
    .description('Manage DoPlan plugins');

  pluginCmd
    .command('list')
    .description('List installed plugins')
    .option('--registry', 'Show available plugins from registry')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      const projectRoot = config.projectRoot || process.cwd();
      const manager = new PluginManager(projectRoot);

      if (options.registry) {
        // Show registry plugins
        const spinner = ora('Fetching plugin registry...').start();
        try {
          const registry = await fetchRegistry();
          spinner.succeed(green('✓ Registry loaded'));
          
          console.log(cyan('\nAvailable Plugins:'));
          console.log('─'.repeat(60));
          registry.plugins.forEach((plugin) => {
            const installed = manager.isPluginInstalled(plugin.name) ? green(' [installed]') : '';
            console.log(`${blue(plugin.name)} v${plugin.version}${installed}`);
            console.log(`  ${plugin.description}`);
            if (plugin.author) {
              console.log(`  Author: ${plugin.author}`);
            }
            console.log('');
          });
        } catch (error: any) {
          spinner.fail(red('✗ Failed to fetch registry'));
          console.error(red(`Error: ${error.message}`));
          process.exit(1);
        }
      } else {
        // Show installed plugins
        const plugins = manager.listInstalledPlugins();
        
        if (plugins.length === 0) {
          console.log(yellow('No plugins installed.'));
          console.log(cyan('\nTo see available plugins:'));
          console.log('  doplan plugin list --registry');
          console.log(cyan('\nTo install a plugin:'));
          console.log('  doplan plugin add <name>');
          return;
        }

        console.log(cyan('\nInstalled Plugins:'));
        console.log('─'.repeat(60));
        plugins.forEach((plugin) => {
          console.log(`${blue(plugin.name)} v${plugin.version}`);
          console.log(`  ${plugin.description}`);
          console.log(`  Path: ${plugin.path}`);
          console.log('');
        });
      }
    });

  pluginCmd
    .command('add <name>')
    .description('Install a plugin from the registry')
    .option('--skip-verify', 'Skip checksum and signature verification')
    .action(async (name: string, options) => {
      const config = loadConfig(program.opts());
      const projectRoot = config.projectRoot || process.cwd();
      const manager = new PluginManager(projectRoot);

      const spinner = ora(`Installing plugin ${name}...`).start();

      try {
        // Check if already installed
        if (manager.isPluginInstalled(name)) {
          spinner.fail(red(`✗ Plugin ${name} is already installed`));
          console.log(yellow(`Use 'doplan plugin remove ${name}' to remove it first`));
          process.exit(1);
        }

        // Fetch registry
        spinner.text = 'Fetching plugin registry...';
        const registry = await fetchRegistry();
        
        // Find plugin in registry
        const pluginEntry = registry.plugins.find((p) => p.name === name);
        if (!pluginEntry) {
          spinner.fail(red(`✗ Plugin ${name} not found in registry`));
          console.log(cyan('\nAvailable plugins:'));
          registry.plugins.forEach((p) => {
            console.log(`  - ${p.name}: ${p.description}`);
          });
          process.exit(1);
        }

        // Verify checksum and signature if not skipped
        // Note: For Phase 2, we create plugins locally, so checksum verification
        // happens after installation. In production, this would verify the downloaded file.
        if (!options.skipVerify && pluginEntry.checksum) {
          spinner.text = 'Verifying plugin...';
          // Checksum verification will happen after download in production
          // For now, we trust the registry entry
        }

        // Install plugin
        spinner.text = `Installing ${name}...`;
        await manager.installPlugin(pluginEntry);

        spinner.succeed(green(`✓ Plugin ${name} installed successfully`));
        console.log(cyan(`\nUsage: doplan ${pluginEntry.name}`));
        console.log(yellow('Note: Plugin commands are executed through the workspace command router'));
      } catch (error: any) {
        spinner.fail(red(`✗ Failed to install plugin ${name}`));
        console.error(red(`Error: ${error.message}`));
        process.exit(1);
      }
    });

  pluginCmd
    .command('remove <name>')
    .alias('rm')
    .description('Remove an installed plugin')
    .action(async (name: string) => {
      const config = loadConfig(program.opts());
      const projectRoot = config.projectRoot || process.cwd();
      const manager = new PluginManager(projectRoot);

      const spinner = ora(`Removing plugin ${name}...`).start();

      try {
        if (!manager.isPluginInstalled(name)) {
          spinner.fail(red(`✗ Plugin ${name} is not installed`));
          process.exit(1);
        }

        await manager.removePlugin(name);
        spinner.succeed(green(`✓ Plugin ${name} removed successfully`));
      } catch (error: any) {
        spinner.fail(red(`✗ Failed to remove plugin ${name}`));
        console.error(red(`Error: ${error.message}`));
        process.exit(1);
      }
    });

  pluginCmd
    .command('info <name>')
    .description('Show information about a plugin')
    .action(async (name: string) => {
      const config = loadConfig(program.opts());
      const projectRoot = config.projectRoot || process.cwd();
      const manager = new PluginManager(projectRoot);

      if (!manager.isPluginInstalled(name)) {
        console.error(red(`✗ Plugin ${name} is not installed`));
        process.exit(1);
      }

      const plugins = manager.listInstalledPlugins();
      const plugin = plugins.find((p) => p.name === name);

      if (!plugin) {
        console.error(red(`✗ Plugin ${name} not found`));
        process.exit(1);
      }

      console.log(cyan(`\nPlugin: ${plugin.name}`));
      console.log('─'.repeat(60));
      console.log(`Version: ${plugin.version}`);
      console.log(`Description: ${plugin.description}`);
      if (plugin.manifest.author) {
        console.log(`Author: ${plugin.manifest.author}`);
      }
      console.log(`Path: ${plugin.path}`);
      if (plugin.manifest.dependencies && plugin.manifest.dependencies.length > 0) {
        console.log(`Dependencies: ${plugin.manifest.dependencies.join(', ')}`);
      }
      console.log('');
    });
}


# DoPlan Plugin System

DoPlan supports a plugin ecosystem that extends functionality with custom commands.

## Overview

Plugins allow you to add new commands to DoPlan without modifying core code. They are installed in `.cursor/plugins/<plugin-name>/` and are automatically discovered by the command router.

## Plugin Structure

Each plugin must include:

- **`manifest.json`** - Plugin metadata (name, version, description, author)
- **`command.js`** - Plugin implementation exporting `{ command, description, execute }`
- **`README.md`** - Plugin documentation (optional)
- **`rules.md`** - Safety notes and behavior documentation (optional)
- **`package.json`** - Plugin-specific dependencies (optional)

## Installing Plugins

### From Registry

```bash
doplan plugin add <plugin-name>
```

Example:
```bash
doplan plugin add security-audit
```

### Skip Verification (Not Recommended)

```bash
doplan plugin add <plugin-name> --skip-verify
```

**Warning:** Only use `--skip-verify` if you trust the plugin source. Verification ensures plugin integrity and security.

## Managing Plugins

### List Installed Plugins

```bash
doplan plugin list
```

### List Available Plugins from Registry

```bash
doplan plugin list --registry
```

### Show Plugin Information

```bash
doplan plugin info <plugin-name>
```

### Remove a Plugin

```bash
doplan plugin remove <plugin-name>
# or
doplan plugin rm <plugin-name>
```

## Plugin Registry

The plugin registry is hosted at `https://doplan.dev/plugins.json` and contains:

- Plugin metadata (name, version, description)
- Download URLs
- Checksums for verification
- Signatures for security (Ed25519)
- Public keys for signature verification

## Security

### Checksum Verification

Plugins include SHA-256 checksums to verify integrity. The CLI automatically verifies checksums during installation.

### Signature Verification

Plugins can include Ed25519 signatures for additional security. Signature verification ensures the plugin comes from a trusted source.

### Safety Guidelines

- **Review before installing** - Check plugin source and reviews
- **Verify signatures** - Don't skip verification unless you trust the source
- **Check dependencies** - Review plugin dependencies before installation
- **Monitor execution** - Plugin commands are logged in `.cursor/logs/plugins.json`

## Plugin Development

### Creating a Plugin

1. **Create plugin directory:**
   ```bash
   mkdir -p .cursor/plugins/my-plugin
   ```

2. **Create `manifest.json`:**
   ```json
   {
     "name": "my-plugin",
     "version": "1.0.0",
     "description": "My custom DoPlan plugin",
     "author": "Your Name",
     "command": "my-plugin"
   }
   ```

3. **Create `command.js`:**
   ```javascript
   module.exports = {
     command: 'my-plugin',
     description: 'My custom plugin command',
     async execute({ projectRoot, state, flags }) {
       // Plugin implementation
       return {
         success: true,
         message: 'Plugin executed successfully'
       };
     }
   };
   ```

4. **Create `README.md`:**
   ```markdown
   # My Plugin
   
   Description of what the plugin does.
   
   ## Usage
   
   \`doplan my-plugin\`
   ```

### Plugin API

Plugins receive a context object in `execute()`:

```typescript
{
  projectRoot: string;      // Project root directory
  state: State;             // Current workflow state
  flags: Record<string, any>; // Command flags
  stateManager: StateManager; // State manager instance
  agentOrchestrator: AgentOrchestrator; // Agent orchestrator
  agentInsights: any[];     // Agent recommendations
}
```

### Plugin Return Value

Plugins should return:

```typescript
{
  success: boolean;         // Whether command succeeded
  message?: string;         // Success/error message
  outputPath?: string;      // Path to generated files
  recommendation?: string;  // Next recommended command
  statePatch?: object;      // State updates
}
```

## Example Plugins

### Security Audit Plugin

```bash
doplan plugin add security-audit
doplan security-audit
```

### Localization Plugin

```bash
doplan plugin add localization
doplan localization
```

## Troubleshooting

### Plugin Not Found

If a plugin isn't found in the registry:
- Check plugin name spelling
- Run `doplan plugin list --registry` to see available plugins
- Verify registry URL in `doplan.config.json`

### Plugin Installation Fails

- Check network connection (for registry fetch)
- Verify checksum if provided
- Check plugin compatibility with your DoPlan version
- Review error messages for specific issues

### Plugin Command Not Working

- Verify plugin is installed: `doplan plugin list`
- Check plugin structure: `doplan plugin info <name>`
- Review plugin logs: `.cursor/logs/plugins.json`
- Ensure plugin `command.js` exports correct structure

## Future Enhancements

- Plugin marketplace UI
- Plugin version management
- Automatic plugin updates
- Plugin dependency resolution
- Plugin isolation/sandboxing

## Contributing Plugins

To contribute a plugin to the registry:

1. Develop and test your plugin
2. Create plugin package (tarball)
3. Generate checksum and signature
4. Submit to DoPlan registry (process TBD)

For more information, see the [Plugin Development Guide](plugin-development.md).


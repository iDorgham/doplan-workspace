# DoPlan CLI Installation Guide

## Prerequisites

- Node.js 20 or newer
- npm or yarn package manager
- Git (for workspace initialization)

## Installation Methods

### Method 1: Global Installation (Recommended)

```bash
npm install -g @doplan/cli
```

After installation, verify:

```bash
doplan --version
```

### Method 2: Local Development

Clone the repository and build locally:

```bash
git clone <repository-url>
cd doplan-workspace/cli
npm install
npm run build
npm link  # Optional: link globally for development
```

### Method 3: Using npx (No Installation)

```bash
npx @doplan/cli setup
npx @doplan/cli idea
```

## Verification

Test the installation:

```bash
doplan --help
doplan --version
```

You should see:
- Help menu with all available commands
- Version number (e.g., `0.1.0-alpha`)

## Configuration

### Project-Level Configuration

Create `doplan.config.json` in your project root:

```json
{
  "projectRoot": ".",
  "noSpinner": false,
  "telemetry": {
    "enabled": false,
    "endpoint": "https://telemetry.doplan.dev"
  },
  "assistants": {
    "default": "none",
    "claude": {
      "apiKey": "your-api-key",
      "model": "claude-3-5-sonnet-20241022"
    },
    "gemini": {
      "apiKey": "your-api-key",
      "model": "gemini-pro"
    }
  }
}
```

### Global Configuration

CLI respects workspace configuration in `.cursor/config/workflow-config.json`.

## Troubleshooting

### Command Not Found

**Problem:** `doplan: command not found`

**Solutions:**
1. Check npm global bin is in PATH:
   ```bash
   npm config get prefix
   # Add to PATH: ~/.npm-global/bin (or similar)
   ```

2. Use npx instead:
   ```bash
   npx @doplan/cli <command>
   ```

3. Reinstall globally:
   ```bash
   npm uninstall -g @doplan/cli
   npm install -g @doplan/cli
   ```

### Permission Errors

**Problem:** `EACCES: permission denied`

**Solutions:**
1. Use npm config prefix (recommended):
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH
   npm install -g @doplan/cli
   ```

2. Use sudo (not recommended):
   ```bash
   sudo npm install -g @doplan/cli
   ```

### Build Errors

**Problem:** TypeScript compilation fails

**Solutions:**
1. Ensure Node.js 20+:
   ```bash
   node -v  # Should show v20.x.x or higher
   ```

2. Clean and rebuild:
   ```bash
   cd cli
   rm -rf node_modules dist
   npm install
   npm run build
   ```

### Workspace Not Found

**Problem:** `DoPlan workspace not found`

**Solutions:**
1. Ensure you're in a DoPlan workspace directory
2. Run `doplan setup` to initialize workspace
3. Check `.cursor/` directory exists
4. Use `--cwd` option to specify workspace path:
   ```bash
   doplan --cwd /path/to/workspace setup
   ```

## Uninstallation

```bash
npm uninstall -g @doplan/cli
```

## Next Steps

After installation:

1. **Initialize workspace:**
   ```bash
   doplan setup
   ```

2. **Start idea capture:**
   ```bash
   doplan idea
   ```

3. **Generate plan:**
   ```bash
   doplan plan
   ```

4. **View progress:**
   ```bash
   doplan status
   ```

For more information, see the [CLI Roadmap](cli-roadmap.md) and [Main README](../README.md).


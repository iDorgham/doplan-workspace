# DoPlan CLI

TypeScript/Node CLI for DoPlan workflow automation.

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
```

## Installation (Future)

```bash
npm install -g @doplan/cli
```

## Usage

```bash
doplan setup
doplan idea
doplan plan
doplan next
doplan status
```

## Configuration

Create `doplan.config.json` in your project root:

```json
{
  "projectRoot": ".",
  "noSpinner": false,
  "telemetry": {
    "enabled": false
  }
}
```


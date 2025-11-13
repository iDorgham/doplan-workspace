# Plugin Ecosystem Rules

## Structure

- Plugins live under `.cursor/plugins/<plugin-name>/`.
- Each plugin must include:
  - `command.js` exporting `{ command, description, execute }`.
  - Optional `rules.md` describing special behaviour or safety notes.
  - Optional `package.json` for plugin-specific dependencies.
  - `manifest.json` describing metadata (name, version, description).

## Loading

- The command loader should auto-discover plugins on startup.
- Command names must be unique; collisions should warn the user and prefer the core command.
- Plugins may declare dependencies (e.g., other commands or scripts). Validate these before execution.

## Safety

- Plugins run with the same permissions as core commands. Treat untrusted plugins carefully.
- Require explicit user confirmation before running newly added plugins.
- Log plugin execution in `.cursor/logs/plugins.json` with command, args, success flag, and timing.

## Documentation

- Plugins must document inputs, outputs, and side effects.
- Update README sections when new first-party plugins are added.

## Updates

- Keep plugins self-contained. Avoid modifying core workflow files directly from a plugin.
- Encourage semantic versioning for plugin manifests to track compatibility.


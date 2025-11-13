# DoPlan CLI Roadmap (Phase Two)

## Goals

- Package DoPlan as an installable CLI (`npx doplan`).
- Provide quick project bootstrap (`doplan init`) that clones the `.cursor` suite.
- Ship command auto-completion and rich terminal output.

## Planned Commands

- `doplan init` – bootstrap a new repo with the DoPlan workflow.
- `doplan plan` – run planning from the terminal with interactive prompts.
- `doplan status` – summarize progress dashboards in the terminal.
- `doplan digest --audience exec` – render digest previews directly in the console.
- `doplan mcp suggest` – inline MCP recommendations with approval prompts.

## Technical Requirements

- Bundle current `scripts/doplan-cli.js` with an argument parser (commander / yargs).
- Add configuration file (`doplan.config.json`) to override defaults without editing `.cursor`.
- Support plugin discovery via a registry file (e.g., `https://doplan.dev/plugins.json`).
- Implement telemetry (opt-in) to understand command usage.

## Timeline

| Phase | Deliverable | Target |
| --- | --- | --- |
| Alpha | CLI wrapper around existing commands | +2 weeks |
| Beta | Init + status commands, plugin registry | +5 weeks |
| GA | Packaging, docs, telemetry toggle, installer | +8 weeks |

## Risks

- Dependency sprawl: keep CLI lightweight (prefer lazy imports).
- Version skew between CLI and workspace definitions.
- Plugin security: implement signature verification for distributed plugins.

## Next Steps

1. Finalise core workspace (current phase).
2. Draft CLI UX spec and confirm command set with stakeholders.
3. Build alpha CLI on top of `scripts/doplan-cli.js`.
4. Create automated tests to ensure parity between slash commands and CLI commands.


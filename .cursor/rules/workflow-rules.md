# DoPlan Workflow Rules

These rules govern how Cursor should operate within the DoPlan workspace.

## Core Principles

- Keep the workflow command-driven with mirrored CLI and slash commands.
- Always load context from `.cursor/context/context.md` and state from `.cursor/config/state.json` before giving recommendations.
- After each command completes, recommend the next best action using the agent insights and state.

## Command Flow

1. `/Setup` (or `npm run doplan:setup`) must pass before `/Idea` in new projects.
2. `/Idea` captures requirements. Use `/Idea --simple` for non-technical stakeholders.
3. `/Plan` generates the plan structure, specs, and dashboards; it also refreshes MCP suggestions and context.
4. `/Next` reads progress and suggests the next focus item.
5. `/Progress` regenerates dashboards and panel feeds.
6. `/Test` → `/Run` → `/Deploy` enforce the quality gates before shipping.
7. `/Capacity` and `/Digest` provide planning and stakeholder outputs.
8. `/MCP` manages server recommendations and registration.
9. `/Watch` runs the lifecycle change detector to keep dashboards and state in sync.
10. `/Party` surfaces insights from every agent for deep-dive decisions.

## State Management

- State lives exclusively in `.cursor/config/state.json`. Do not maintain alternate state stores.
- Every command must patch state via the `StateManager`. Include the command in `completedCommands`.
- When state and documentation differ, prompt the user (via change detector) to reconcile them.

## Progress Tracking

- `plan/Main-Tasks.md` and `plan/Progress-Dashboard.md` are source-of-truth documents for the team.
- The auto-updater must run after plan generation, `/Progress`, `/Next`, `/Test`, `/Run`, `/Deploy`, `/Capacity`, and `/Digest`.
- IDE panels (`.cursor/panels/*.json`) must be regenerated with each progress refresh.

## MCP Integration

- Suggest MCP servers during `/Plan` based on stack, idea enhancements, and requested research.
- Record MCP usage in `plan/mcp-report.md`.
- Require user confirmation before registering or executing new MCP servers.

## Safety & Quality Gates

- `/Deploy` must not run unless tests pass or the user explicitly provides `--skip-tests`.
- If diagnostics fail, surface remediation steps before recommending the next command.
- Persist all generated reports (capacity, digests, etc.) inside the `plan/` directory for auditability.

## Documentation Storage

- Save any manually created documentation, research, or design notes inside the `/docs/` directory.
- Organise `/docs/` with subfolders when needed (e.g., `docs/research`, `docs/design`).
- Avoid storing long-form docs alongside source files unless a command explicitly generates them elsewhere.
- Use descriptive, kebab-case filenames (e.g., `docs/research/user-persona-study.md`). Include dates when helpful (`docs/reports/2025-01-14-weekly-digest.md`).

## Context Files

- Maintain `.cursor/context/context.md` with stack, documentation links, and MCP recommendations.
- Additional context (idea summary, environment notes) should live under `.cursor/context/`.
- Commands should update context whenever new information is produced.

## Collaboration & Party Mode

- `/Party` should collect all agent perspectives and feed them into whichever command the user runs next.
- When in party mode (flags `--party`), automatically include agent perspectives in the command result.

## CLI Parity

- Every slash command has a matching `npm run doplan:<command>` script.
- When invoked via CLI, commands should behave identically (including state updates and generated artifacts).


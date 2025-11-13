# Command Rules

## /Setup (`npm run doplan:setup`)
- Purpose: Ensure environment readiness (Node version, dependencies, Git remote, env files).
- Must run before other commands in a fresh workspace.
- Flags:
  - `--skip-install` to bypass dependency installation.
  - `--package-manager=<npm|yarn|pnpm>`.
  - `--remote-url=<git-url>` to register a remote automatically.
- Success Path: Update state.stage → `ONBOARDED`, recommend `/Idea`.

## /Idea (`npm run doplan:idea`)
- Purpose: Generate the idea interview scaffold and capture scope preferences.
- Flags:
  - `--simple` for non-developer mode.
  - `--scope=<simple|full|both>` to set scope preference.
- Outputs:
  - `idea-notes.md`
  - `.cursor/context/idea-summary.json`
- Update state.stage → `IDEA`; set `ideaData.mode`, `scopeMode`.

## /Plan (`npm run doplan:plan`)
- Purpose: Generate phases, features, specs, dashboards, MCP suggestions, and context.
- Requires `ideaData` unless `--allow-empty` is supplied.
- Flags:
  - `--phases=<path>` to supply a custom phases JSON/YAML file.
  - `--stack=frontend=nextjs,backend=node` for stack hints.
  - `--accept-mcp` to auto-register suggested MCP servers.
- Outputs:
  - `plan/` directory structure with documentation and specs.
  - Updated dashboards and context files.
  - MCP suggestions summarised in command result.
- Update state.stage → `PLANNING`, set `currentPhase` and `currentFeature` to 1.

## /Next (`npm run doplan:next`)
- Purpose: Recommend the next feature or phase to tackle.
- Uses auto-updated progress data to find the first incomplete feature.
- Output references relevant docs (plan/tasks) and suggests `/Test` after completion.

## /Progress (`npm run doplan:progress`)
- Purpose: Refresh dashboards (`Main-Tasks.md`, `Progress-Dashboard.md`) and panel feeds.
- Flags:
  - `--refresh` to bypass prompts (used in automation).
- Recommends `/Next`.

## /Test (`npm run doplan:test`)
- Purpose: Run the configured test script.
- Flags:
  - `--script=<npm-script>` to override the default `test`.
- Success updates state.stage → `TESTED`, recommends `/Run`.

## /Run (`npm run doplan:run`)
- Purpose: Run the local application (default script `dev`).
- Flags:
  - `--script=<npm-script>` to override the runtime command.
- Recommends `/Deploy` or troubleshooting steps.

## /Deploy (`npm run doplan:deploy`)
- Purpose: Build and deploy.
- Flags:
  - `--skip-tests` to bypass test gating (not recommended).
  - `--test-script=<npm-script>` to specify pre-deploy tests.
  - `--build-script=<npm-script>` and `--deploy-script=<npm-script>`.
- Success updates state.stage → `DEPLOYED`, recommends `/Digest`.

## /Capacity (`npm run doplan:capacity`)
- Purpose: Analyse estimated hours/owners and produce `plan/reports/capacity.md`.
- Flags:
  - `--week-start=<YYYY-MM-DD>` to annotate the schedule.
- Recommends `/Next`.

## /Digest (`npm run doplan:digest`)
- Purpose: Generate stakeholder digests.
- Flags:
  - `--audience=exec,product` to control outputs.
- Outputs stored in `plan/digests/<date>/`.

## /MCP (`npm run doplan:mcp`)
- Purpose: List, suggest, or apply MCP servers.
- Actions:
  - `list` (default), `suggest`, `apply <config>`.
- Flags:
  - `--stack=<key=value,...>` for suggestion context.
  - `--apply` auto-registers suggestions.

## /Party (`npm run doplan:party`)
- Purpose: Gather all-agent insights for a given command.
- Usage: `/Party plan` to review perspectives before running `/Plan`.

## /Watch (`npm run doplan:watch`)
- Purpose: Launch lifecycle change detector. Prompts on each change before syncing dashboards and state.


# DoPlan Workspace

This repository houses the DoPlan workflow implementation for Cursor. The project keeps humans and agents aligned from idea to deployment.

## Getting Started

1. Install Node.js 20 or newer.
2. Install the dependencies: `npm install`.
3. Run `/Setup` (or `npm run doplan:setup`) to install dependencies, verify Node version, configure Git remote, and seed `.env`.
4. Run `/Idea` (add `--simple` for non-developers) to generate `idea-notes.md`. The question set lives in `.cursor/workflows/idea-interview.md`.
5. Execute `/Plan` to generate `plan/`, specs, dashboards, context, and MCP suggestions.
6. Use `/Next`, `/Progress`, `/Test`, `/Run`, `/Deploy`, `/Capacity`, `/Digest`, `/MCP`, `/Party`, and `/Watch` to stay on rails. All commands mirror CLI scripts (see table below).
7. If slash commands don’t appear immediately in Cursor, run **Reload Window** (Cmd/Ctrl + Shift + P → “Reload Window”) so the new JSON command definitions are picked up.

## Command Matrix

| Slash | CLI | Purpose |
| --- | --- | --- |
| `/Setup` | `npm run doplan:setup` | Environment bootstrap |
| `/Idea` | `npm run doplan:idea` | Capture idea requirements |
| `/Plan` | `npm run doplan:plan` | Generate plan, specs, dashboards |
| `/Next` | `npm run doplan:next` | Recommend next action |
| `/Progress` | `npm run doplan:progress` | Refresh dashboards/panels |
| `/Test` | `npm run doplan:test` | Run test suite |
| `/Run` | `npm run doplan:run` | Start local app |
| `/Deploy` | `npm run doplan:deploy` | Build & deploy |
| `/Capacity` | `npm run doplan:capacity` | Produce workload report |
| `/Digest` | `npm run doplan:digest` | Stakeholder summaries |
| `/MCP` | `npm run doplan:mcp` | Manage MCP servers |
| `/Party` | `npm run doplan:party` | Multi-agent insight |
| `/Watch` | `npm run doplan:watch` | Change detector |

## Directory Overview

- `.cursor/commands/` – Command handlers, router, state manager, agent orchestrator, logger, MCP engine.
- `.cursor/rules/` – Workflow policies, command guardrails, agent behaviors, lifecycle sync, plugin rules.
- `.cursor/agents/` – Personas for Product, Architect, Developer, Tester, DevOps, and Scrum.
- `.cursor/workflows/` – Idea interview guide, plan/spec generators, dashboard automation.
- `.cursor/config/` – Workflow, agent, MCP configuration plus state store.
- `.cursor/context/` – Generated context files (stack, docs, MCP suggestions).
- `.cursor/panels/` – JSON feeds (`goals`, `status`, `timeline`) for IDE-native dashboards.
- `.cursor/templates/` – Digest templates for exec/product/engineering audiences.
- `.cursor/logs/` – Lifecycle, MCP, and plugin usage logs.
- `.cursor/plugins/` – Drop-in command ecosystem.
- `plan/` – Generated phases, features, dashboards, reports, digests (created by `/Plan`).

## Dashboards & Panels

- `plan/Main-Tasks.md` lists phases and features with checkboxes.
- `plan/Progress-Dashboard.md` renders ASCII progress bars per phase/feature.
- `.cursor/panels/goals.json`, `status.json`, and `timeline.json` feed Cursor panels so status is visible without opening Markdown.
- `/Progress` regenerates all of the above; `/Watch` keeps them synced after manual edits.

## MCP Workflow

- `/Plan` recommends MCP servers based on stack and requested research.
- `/MCP suggest` previews options; `/MCP apply` registers servers into `.cursor/config/mcp-manifest.json`.
- Command output is logged in `plan/mcp-report.md` and `.cursor/logs/mcp-usage.json`.
- All usage must comply with `.cursor/rules/mcp-rules.md`.

## Change Detection & Logging

- `/Watch` launches the lifecycle change detector. It prompts before syncing dashboards/state when markdown or progress files change.
- All major commands log to `.cursor/logs/lifecycle.json`; MCP events log to `.cursor/logs/mcp-usage.json`; plugin runs log to `.cursor/logs/plugins.json`.

## Sample Plan Output

- `plan/example-structure.md` (generated once `/Plan` runs) shows the expected hierarchy.
- Reports and digests live in `plan/reports/` and `plan/digests/<date>/`.

## CLI Package (Alpha)

A TypeScript CLI package is available in `cli/` directory. The CLI provides the same functionality as slash commands but can be used from any terminal.

### Local Development

```bash
cd cli
npm install
npm run build
npm run dev -- --help  # Test locally
```

### Installation (Alpha)

```bash
# From npm
npm install -g doplan-cli@alpha

# Or use locally
cd cli
npm link  # Requires sudo or npm config prefix setup
```

### Usage

Once installed, use `doplan` command:

```bash
doplan setup
doplan idea
doplan plan
doplan next
doplan status
```

All commands support `--help` for detailed usage information.

### Configuration

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

### Troubleshooting

**Command not found:**
- Ensure CLI is installed globally: `npm install -g doplan-cli@alpha`
- Or use `npx doplan-cli@alpha` instead
- Check PATH includes npm global bin directory

**Build errors:**
- Ensure Node.js 20+ is installed: `node -v`
- Run `npm install` in `cli/` directory
- Check TypeScript is installed: `npm list typescript`

**Tests failing:**
- Run `npm test` from `cli/` directory
- Ensure workspace has `.cursor/` structure
- Check fixture workspace is created correctly

**Status:** Phase 1 Alpha in progress - CLI fully functional. See `docs/cli-roadmap.md` for full roadmap.


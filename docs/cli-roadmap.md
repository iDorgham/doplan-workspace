# DoPlan CLI Roadmap

## Status: Phase 0 Complete ✅

The TypeScript CLI package scaffold is complete with:
- Full command suite (setup, idea, plan, next, progress, test, run, deploy, capacity, digest, mcp, party, watch)
- TypeScript configuration and build setup
- Configuration system with `doplan.config.json` support
- Command executor that integrates with existing DoPlan workspace
- Basic test infrastructure

## Phase 0 – Prep (Complete)

✅ Created `cli/` package scaffold (TypeScript + Node 20, `commander`, `colorette`, `ora`)  
✅ Established TypeScript config (`tsconfig.json`, `tsconfig.build.json`) and linting (`eslint`, `prettier`)  
✅ Set up initial scripts: `npm run dev`, `npm run build`, `npm run test`  
✅ Defined `doplan.config.schema.json` for future config validation  

## Phase 1 – Alpha (In Progress)

**Goal:** Ship minimal TypeScript CLI wrapping existing DoPlan commands

### Completed
- ✅ Core command wiring (all 13 commands implemented)
- ✅ Configuration support (`doplan.config.json` loading and merging)
- ✅ Output utilities (minimal colors, progress bars)
- ✅ Command executor integration with workspace

### Remaining
- [ ] Build and packaging setup (test `npm run build`)
- [ ] Publish alpha version to npm
- [ ] Smoke tests against fixture workspace
- [ ] Update main README with CLI install instructions

## Phase 2 – Beta (Planned)

1. **`doplan init` Bootstrap**
   - Prompt for project name, stack presets, Git init
   - Copy `.cursor` suite, optionally run `npm install` and `doplan setup`
   - Allow non-interactive mode via flags

2. **Status & Digest Enhancements**
   - `doplan status`: render overall progress, per-phase summary, next action (supports `--json`, `--brief`)
   - `doplan digest --preview`: display digest in terminal; `--write` to persist files

3. **Telemetry (Opt-in)**
   - Prompt once; store preference in `~/.doplanrc`
   - Capture anonymous metrics (command, duration, version) when enabled

4. **Plugin Discovery**
   - `doplan plugin list/add/remove` using registry JSON (verifies checksums/signatures)

5. **Testing & Documentation**
   - Snapshot tests for `status` and `digest` outputs
   - Update docs with telemetry policy, plugin usage, init options

6. **CI/CD**
   - GitHub Actions: lint, test, build, publish beta tags

## Phase 3 – GA (Planned)

1. **Distribution & Installers**
   - Publish `1.0.0` to npm
   - Provide install docs for npm + optional Homebrew/winget scripts
   - Offer binary bundling guidance via `pkg`/`nexe` (optional)

2. **Version Sync & Upgrade**
   - CLI checks workspace `.cursor` version; warn if out-of-sync
   - `doplan upgrade` to fetch latest template updates

3. **Security & Quality**
   - Enforce plugin signature checks (e.g., Ed25519 keys)
   - Harden telemetry opt-out; add `doplan telemetry --disable`
   - Expand integration tests (failure modes, config errors, large projects)

4. **Documentation & Launch**
   - Complete CLI user guide, troubleshooting, FAQ
   - Prepare release notes and announcement plan
   - Monitor telemetry/issues after launch; plan for patch releases

## Future Enhancements (Post-GA)

- **Claude CLI Integration**
  - Add `doplan claude` commands tapping Anthropic APIs for idea improvement, competitor research, or plan drafting
  - Provide configuration (`anthropic_api_key`) and prompt templates

- **Gemini CLI Integration**
  - Introduce `doplan gemini` commands leveraging Google Vertex/Gemini for similar tasks
  - Share assistant abstraction so additional AI providers can plug in (OpenAI, etc.)

- **Assistant Abstraction Layer**
  - Design common interface (`AssistantService`) so CLI can route tasks to chosen provider
  - Allow workspace config to specify default assistant per command

## Technical Requirements

- ✅ Bundle current `scripts/doplan-cli.js` with argument parser (`commander`)
- ✅ Add configuration file (`doplan.config.json`) to override defaults
- [ ] Support plugin discovery via registry file (e.g., `https://doplan.dev/plugins.json`)
- [ ] Implement telemetry (opt-in) to understand command usage

## Risks

- Dependency sprawl: keep CLI lightweight (prefer lazy imports) ✅
- Version skew between CLI and workspace definitions (to be addressed in Phase 3)
- Plugin security: implement signature verification for distributed plugins (Phase 2)


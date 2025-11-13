# Phase 2 – Beta: Implementation Plan

## Goal
Enhance CLI with bootstrap command, improved status/digest, telemetry, and plugin system.

## Tasks

### 1. `doplan init` Bootstrap Command
**Priority:** High

- [ ] Create `cli/src/commands/init.ts`
- [ ] Implement interactive prompts:
  - Project name
  - Stack presets (React, Vue, Node.js, etc.)
  - Git initialization option
  - Run `npm install` option
  - Run `doplan setup` option
- [ ] Copy `.cursor` suite to new project
- [ ] Support non-interactive mode via flags:
  - `--name <name>`
  - `--stack <stack>`
  - `--no-git`
  - `--skip-install`
  - `--skip-setup`
- [ ] Create template `.cursor` structure
- [ ] Add tests for init command

### 2. Status & Digest Enhancements
**Priority:** High

#### `doplan status` improvements:
- [ ] Render overall progress summary
- [ ] Show per-phase summary with progress bars
- [ ] Display next recommended action
- [ ] Support `--json` output format
- [ ] Support `--brief` for minimal output
- [ ] Read from `.cursor/panels/status.json` and `plan/Progress-Dashboard.md`

#### `doplan digest` improvements:
- [ ] Add `--preview` flag to display in terminal
- [ ] Add `--write` flag to persist files
- [ ] Format output nicely for terminal viewing
- [ ] Support different digest types (exec, product, dev)

### 3. Telemetry (Opt-in)
**Priority:** Medium

- [ ] Create telemetry module (`cli/src/utils/telemetry.ts`)
- [ ] Prompt user once on first run
- [ ] Store preference in `~/.doplanrc`
- [ ] Capture anonymous metrics:
  - Command name
  - Execution duration
  - CLI version
  - Success/failure status
- [ ] Add `doplan telemetry --enable/--disable` commands
- [ ] Implement secure endpoint (if available) or local-only logging
- [ ] Document privacy policy

### 4. Plugin Discovery
**Priority:** Medium

- [ ] Create plugin system (`cli/src/plugins/`)
- [ ] Implement `doplan plugin list` command
- [ ] Implement `doplan plugin add <name>` command
- [ ] Implement `doplan plugin remove <name>` command
- [ ] Create plugin registry JSON structure
- [ ] Add checksum verification for plugins
- [ ] Add signature verification (Ed25519 keys)
- [ ] Plugin loading and execution system
- [ ] Document plugin development guide

### 5. Testing & Documentation
**Priority:** High

- [ ] Add snapshot tests for `status` output
- [ ] Add snapshot tests for `digest` output
- [ ] Update documentation with:
  - Telemetry policy and opt-out instructions
  - Plugin usage guide
  - Init command options
- [ ] Create plugin development guide
- [ ] Add examples for common use cases

### 6. CI/CD
**Priority:** Medium

- [ ] Create GitHub Actions workflow (`.github/workflows/ci.yml`)
- [ ] Add linting step
- [ ] Add test step
- [ ] Add build step
- [ ] Add publish step for beta tags
- [ ] Configure secrets for npm publishing
- [ ] Test workflow on push/PR

## Implementation Order

1. **Week 1:** `doplan init` command + Status enhancements
2. **Week 2:** Digest enhancements + Telemetry
3. **Week 3:** Plugin system + Testing
4. **Week 4:** CI/CD + Documentation + Beta release

## Success Criteria

- [ ] `doplan init` successfully creates new DoPlan workspace
- [ ] `doplan status` shows comprehensive progress information
- [ ] `doplan digest` can preview and write digests
- [ ] Telemetry opt-in/out works correctly
- [ ] Plugin system allows adding/removing plugins
- [ ] All tests passing
- [ ] CI/CD pipeline working
- [ ] Documentation complete
- [ ] Beta version published to npm

## Notes

- Keep CLI lightweight (lazy imports where possible)
- Maintain backward compatibility with Phase 1
- Focus on user experience improvements
- Ensure security for plugin system


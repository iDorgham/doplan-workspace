# Phase Branching Strategy

DoPlan uses a phase-based branching strategy for organized development.

## Branch Naming Convention

Branches follow the pattern: `phase-<number>-<name>`

Examples:
- `phase-0-prep`
- `phase-1-alpha`
- `phase-2-beta`
- `phase-3-ga`

## Creating a New Phase Branch

### Using npm script (recommended):

```bash
npm run phase:branch <phase-number> <phase-name>
```

Example:
```bash
npm run phase:branch 1 "Alpha"
# Creates: phase-1-alpha
```

### Using the script directly:

**Bash:**
```bash
./scripts/create-phase-branch.sh <phase-number> <phase-name>
```

**Node.js:**
```bash
node scripts/create-phase-branch.js <phase-number> <phase-name>
```

## Current Phases

- **Phase 0 – Prep** (`phase-0-prep`) ✅ Complete
  - CLI package scaffold
  - TypeScript configuration
  - All command handlers implemented

- **Phase 1 – Alpha** (Next)
  - Build and packaging
  - Smoke tests
  - npm publish alpha

- **Phase 2 – Beta** (Planned)
  - `doplan init` bootstrap
  - Status & digest enhancements
  - Telemetry (opt-in)
  - Plugin discovery

- **Phase 3 – GA** (Planned)
  - Distribution & installers
  - Version sync & upgrade
  - Security & quality hardening
  - Documentation & launch

## Workflow

1. **Start a new phase:**
   ```bash
   npm run phase:branch <num> "<name>"
   ```

2. **Work on the phase:**
   - Make changes
   - Commit regularly with descriptive messages
   - Reference phase in commit messages: `[Phase X] Description`

3. **Complete the phase:**
   - Ensure all tests pass
   - Update documentation
   - Merge to `main` when ready
   - Tag release: `git tag phase-<num>-<name>-complete`

4. **Start next phase:**
   - Create new branch from `main`
   - Repeat process

## Branch Protection

Consider setting up branch protection rules in GitHub:
- Require PR reviews before merging phase branches
- Require status checks (tests, linting)
- Prevent force pushes to `main`


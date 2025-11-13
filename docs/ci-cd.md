# CI/CD Pipeline Documentation

DoPlan uses GitHub Actions for continuous integration and deployment.

## Workflows

### CI (`ci.yml`)

Runs on every push and pull request to `main` and `phase-2-beta` branches.

**Jobs:**
- **Test**: Runs tests on Node.js 20.x and 22.x
  - Installs dependencies
  - Runs linter (ESLint)
  - Checks formatting (Prettier)
  - Builds CLI
  - Runs all tests
  - Uploads coverage (on Node 22.x)

- **Integration**: Runs integration tests
  - Builds CLI
  - Runs integration test suite

- **Snapshot**: Runs snapshot tests
  - Builds CLI
  - Runs snapshot tests
  - Verifies no unexpected snapshot changes

### Lint (`lint.yml`)

Runs on every push and pull request.

**Checks:**
- ESLint code quality
- Prettier formatting

### Build (`build.yml`)

Runs on every push, pull request, and manual dispatch.

**Builds CLI on:**
- Ubuntu (Linux)
- macOS
- Windows

**Node.js versions:**
- 20.x
- 22.x

**Outputs:**
- Build artifacts uploaded for 7 days

### Release (`release.yml`)

Runs when version tags are pushed:
- `cli/v*` (e.g., `cli/v0.1.0`) - publishes to npm with `latest` tag
- `v*` (e.g., `v0.1.0-alpha`) - publishes to npm with `alpha` tag

**Steps:**
1. Extracts version from tag
2. Installs dependencies
3. Runs linter and tests
4. Builds CLI
5. Updates package version
6. Publishes to npm
7. Creates GitHub Release

## Required Secrets

### NPM_TOKEN

Required for publishing to npm. Generate at https://www.npmjs.com/settings/YOUR_USERNAME/tokens

**Setup:**
1. Go to repository Settings → Secrets and variables → Actions
2. Add new secret: `NPM_TOKEN`
3. Paste your npm access token

## Versioning

### CLI Version Tags

- `cli/v1.0.0` - Major release (latest tag)
- `cli/v0.2.0` - Minor release (latest tag)
- `cli/v0.1.1` - Patch release (latest tag)

### Workspace Version Tags

- `v0.1.0-alpha` - Alpha release (alpha tag)
- `v0.1.0-beta` - Beta release (beta tag)

## Manual Workflow Dispatch

The build workflow can be triggered manually:

1. Go to Actions → Build
2. Click "Run workflow"
3. Select branch and click "Run workflow"

## Testing Locally

Before pushing, ensure:

```bash
# In cli/ directory
npm run lint
npm run format:check
npm run build
npm test -- --run
```

## Troubleshooting

### Build Fails

- Check Node.js version compatibility
- Verify all dependencies install correctly
- Review build logs for TypeScript errors

### Tests Fail

- Run tests locally: `npm test -- --run`
- Check snapshot changes: `git status cli/src/__tests__/snapshots/__snapshots__/`
- Update snapshots if intentional: `npm test -- --run -u`

### Lint Fails

- Fix automatically: `npm run lint:fix`
- Check formatting: `npm run format:check`
- Fix formatting: `npm run format`

### Release Fails

- Verify NPM_TOKEN secret is set
- Check tag format matches expected pattern
- Ensure package.json version matches tag
- Verify npm publish permissions

## Best Practices

1. **Always run tests locally before pushing**
2. **Update snapshots intentionally** - don't commit accidental changes
3. **Use semantic versioning** for tags
4. **Test on multiple Node versions** before releasing
5. **Review build artifacts** before publishing

## Workflow Status Badge

Add to README.md:

```markdown
![CI](https://github.com/iDorgham/doplan-workspace/workflows/CI/badge.svg)
```

## Future Enhancements

- [ ] Add Docker builds
- [ ] Add security scanning (Dependabot, CodeQL)
- [ ] Add performance benchmarks
- [ ] Add automated changelog generation
- [ ] Add release notes automation


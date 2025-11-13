# npm Publishing Guide

## Prerequisites

1. npm account with access to `@doplan` scope
2. npm CLI authenticated: `npm login`
3. Node.js 20+ installed
4. All tests passing: `npm test`

## Pre-Publish Checklist

- [ ] Version number updated in `package.json`
- [ ] CHANGELOG.md updated with release notes
- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] README.md is up to date
- [ ] No sensitive data in published files
- [ ] `.npmignore` or `files` field configured correctly

## Publishing Steps

### 1. Verify Package

```bash
cd cli
npm run build
npm test
npm pack --dry-run  # Preview what will be published
```

### 2. Check Package Contents

```bash
npm pack  # Creates .tgz file
tar -tzf @doplan-cli-0.1.0-alpha.tgz | head -20
```

Should include:
- `dist/` directory with compiled JavaScript
- `README.md`
- `doplan.config.schema.json`
- `package.json`

### 3. Publish Alpha Release

```bash
npm publish --access public --tag alpha
```

This publishes with the `alpha` tag, so users need to install with:
```bash
npm install -g @doplan/cli@alpha
```

### 4. Verify Publication

```bash
npm view @doplan/cli versions
npm view @doplan/cli@alpha
```

### 5. Test Installation

In a clean directory:
```bash
npm install -g @doplan/cli@alpha
doplan --version
```

## Version Management

### Alpha Releases (0.x.x-alpha)
- Use for testing and early feedback
- Tag with `alpha`: `npm publish --tag alpha`
- Users install: `npm install -g @doplan/cli@alpha`

### Beta Releases (0.x.x-beta)
- Use for pre-release testing
- Tag with `beta`: `npm publish --tag beta`
- Users install: `npm install -g @doplan/cli@beta`

### Stable Releases (1.0.0+)
- Use for production-ready versions
- Tag with `latest` (default): `npm publish`
- Users install: `npm install -g @doplan/cli`

## Updating Versions

### Patch (0.1.0-alpha → 0.1.1-alpha)
```bash
npm version patch
npm publish --tag alpha
```

### Minor (0.1.0-alpha → 0.2.0-alpha)
```bash
npm version minor
npm publish --tag alpha
```

### Major (0.1.0-alpha → 1.0.0)
```bash
npm version major
npm publish  # No tag = latest
```

## Rollback

If a bad version is published:

```bash
npm unpublish @doplan/cli@0.1.0-alpha  # Within 72 hours
# Or deprecate:
npm deprecate @doplan/cli@0.1.0-alpha "Use 0.1.1-alpha instead"
```

## Post-Publish

1. Create GitHub release with changelog
2. Update main README with installation instructions
3. Announce in relevant channels
4. Monitor for issues and feedback

## Troubleshooting

**Error: You do not have permission**
- Check npm account has access to `@doplan` scope
- Verify with: `npm whoami`
- Request access from npm organization admin

**Error: Package name already exists**
- Check if version already published: `npm view @doplan/cli versions`
- Increment version number

**Error: Invalid package name**
- Ensure package name matches: `@doplan/cli`
- Check `package.json` name field


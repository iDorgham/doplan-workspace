# npm Publishing Guide for DoPlan CLI

## Current Package Info

- **Package Name**: `doplan-cli`
- **Current Version**: `0.1.0-alpha`
- **Registry**: npm (public)
- **Installation**: `npm install -g doplan-cli@alpha`

## Pre-Publish Checklist

Before publishing, ensure:

- [x] Build successful (`npm run build`)
- [x] All tests passing (`npm test`)
- [x] Linter passes (`npm run lint`)
- [x] Formatting correct (`npm run format:check`)
- [x] Package files configured (`.npmignore` or `files` in package.json)
- [x] README.md is complete
- [x] CHANGELOG.md is updated
- [ ] npm account logged in (`npm login`)
- [ ] Version number is correct

## Publishing Steps

### 1. Login to npm

```bash
npm login
```

Enter your npm username, password, and email when prompted.

Verify login:
```bash
npm whoami
```

### 2. Verify Package Contents

```bash
cd cli
npm pack --dry-run
```

This shows what files will be included in the package. Should include:
- `dist/` - Compiled JavaScript files
- `README.md` - Documentation
- `doplan.config.schema.json` - Configuration schema
- `package.json` - Package metadata

### 3. Build and Test

```bash
npm run build
npm test -- --run
npm run lint
```

### 4. Publish Alpha Release

Since this is version `0.1.0-alpha`, publish with the `alpha` tag:

```bash
npm publish --access public --tag alpha
```

**Note**: The `--access public` flag is required for scoped packages or when publishing for the first time.

### 5. Verify Publication

Check that the package was published:

```bash
npm view doplan-cli versions
npm view doplan-cli@alpha
npm view doplan-cli dist-tags
```

### 6. Test Installation

In a clean directory or Docker container:

```bash
npm install -g doplan-cli@alpha
doplan --version
doplan --help
```

## Version Tags

### Alpha Releases (Current)

```bash
npm publish --access public --tag alpha
```

Users install with:
```bash
npm install -g doplan-cli@alpha
```

### Beta Releases

```bash
npm publish --access public --tag beta
```

Users install with:
```bash
npm install -g doplan-cli@beta
```

### Stable Releases (v1.0.0+)

```bash
npm publish --access public
# or
npm publish --access public --tag latest
```

Users install with:
```bash
npm install -g doplan-cli
```

## Updating Versions

### Patch Release (0.1.0-alpha → 0.1.1-alpha)

```bash
cd cli
npm version patch
git push --tags
npm publish --access public --tag alpha
```

### Minor Release (0.1.0-alpha → 0.2.0-alpha)

```bash
cd cli
npm version minor
git push --tags
npm publish --access public --tag alpha
```

### Major Release (0.1.0-alpha → 1.0.0)

```bash
cd cli
npm version major
git push --tags
npm publish --access public
# No tag = latest (stable)
```

## Using GitHub Actions (Recommended)

The CI/CD pipeline can automatically publish on version tags:

1. Create a version tag:
   ```bash
   git tag cli/v0.1.0-alpha
   git push origin cli/v0.1.0-alpha
   ```

2. GitHub Actions will:
   - Extract version from tag
   - Run tests
   - Build the package
   - Publish to npm
   - Create GitHub release

**Note**: Requires `NPM_TOKEN` secret configured in GitHub repository settings.

## Troubleshooting

### Error: "You do not have permission"

- Verify you're logged in: `npm whoami`
- Check package name is available: `npm view doplan-cli`
- If package doesn't exist, first publish creates it

### Error: "Package name already exists"

- Check if version already published: `npm view doplan-cli versions`
- Increment version: `npm version patch|minor|major`

### Error: "Invalid package name"

- Package name is `doplan-cli` (not scoped)
- Verify in `package.json`: `"name": "doplan-cli"`

### Error: "Missing files"

- Check `files` field in `package.json`
- Verify `.npmignore` doesn't exclude needed files
- Run `npm pack --dry-run` to preview

## Post-Publish Checklist

After successful publication:

- [ ] Verify package on npm: https://www.npmjs.com/package/doplan-cli
- [ ] Test installation in clean environment
- [ ] Update main README.md with installation instructions
- [ ] Create GitHub release (if using manual publish)
- [ ] Announce release in relevant channels
- [ ] Monitor for issues and feedback

## Rollback

If a bad version is published:

### Within 72 hours:
```bash
npm unpublish doplan-cli@0.1.0-alpha
```

### After 72 hours:
```bash
npm deprecate doplan-cli@0.1.0-alpha "Use 0.1.1-alpha instead"
```

Then publish a fixed version.

## Next Steps After First Publish

1. **Update README.md** with installation instructions:
   ```markdown
   ## Installation
   
   ```bash
   npm install -g doplan-cli@alpha
   ```
   ```

2. **Create GitHub Release** with changelog

3. **Test in clean environment** to ensure installation works

4. **Monitor npm downloads** and user feedback

5. **Plan next version** based on feedback


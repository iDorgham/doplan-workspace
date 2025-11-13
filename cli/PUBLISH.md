# Publishing DoPlan CLI to npm

## Quick Start

```bash
# 1. Login to npm
npm login

# 2. Verify package
npm run build
npm test -- --run

# 3. Publish alpha release
npm publish --access public --tag alpha
```

## Package Details

- **Name**: `doplan-cli`
- **Version**: `0.1.0-alpha`
- **Install**: `npm install -g doplan-cli@alpha`

## What Gets Published

The `files` field in `package.json` controls what's included:

- ✅ `dist/` - Compiled JavaScript (all files)
- ✅ `README.md` - Documentation
- ✅ `doplan.config.schema.json` - Configuration schema
- ❌ `src/` - Source TypeScript (excluded)
- ❌ `__tests__/` - Test files (excluded)
- ❌ `node_modules/` - Dependencies (excluded)

## Verification Commands

```bash
# Preview what will be published
npm pack --dry-run

# Check if package exists
npm view doplan-cli

# After publishing, verify
npm view doplan-cli@alpha
npm view doplan-cli dist-tags
```

## Installation Test

After publishing, test in a clean environment:

```bash
npm install -g doplan-cli@alpha
doplan --version
doplan --help
```

## Troubleshooting

**Not logged in?**
```bash
npm login
npm whoami  # Verify
```

**Package name conflict?**
- Check: `npm view doplan-cli`
- If exists, verify version isn't already published

**Build errors?**
```bash
npm run build
# Check dist/ directory exists
ls -la dist/
```

## Next Steps

1. ✅ Publish to npm
2. Update main README.md with installation instructions
3. Create GitHub release
4. Test installation
5. Monitor feedback


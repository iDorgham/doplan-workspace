# Changelog

All notable changes to DoPlan CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-alpha] - 2025-11-13

### Added
- Initial alpha release of DoPlan CLI
- All 13 core commands implemented:
  - `setup` - Bootstrap environment
  - `idea` - Capture app idea and requirements
  - `plan` - Generate project plan, specs, dashboards
  - `next` - Get next recommended action
  - `progress` / `status` - View progress dashboard
  - `test` - Run test suite
  - `run` - Run application locally
  - `deploy` - Deploy to production
  - `capacity` - Generate workload report
  - `digest` - Generate stakeholder summaries
  - `mcp` - Manage MCP servers
  - `party` - Multi-agent collaboration mode
  - `watch` - Watch for changes and auto-update
- Configuration system with `doplan.config.json` support
- Integration with existing DoPlan workspace commands
- Minimal UI with colors and progress indicators
- Comprehensive test suite with integration tests
- Full TypeScript implementation with type safety
- Build system with shebang injection
- Documentation and installation guides

### Known Issues
- Alpha release - API may change in future versions
- Some commands require full DoPlan workspace setup
- Telemetry and assistant integrations are placeholders

### Notes
- This is an alpha release for testing and feedback
- Breaking changes may occur before v1.0.0
- Report issues at: https://github.com/iDorgham/doplan-workspace/issues


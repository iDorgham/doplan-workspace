# DoPlan CLI

[![CI](https://github.com/iDorgham/doplan-workspace/workflows/CI/badge.svg)](https://github.com/iDorgham/doplan-workspace/actions)
[![npm version](https://img.shields.io/npm/v/doplan-cli.svg)](https://www.npmjs.com/package/doplan-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**DoPlan CLI** is a powerful command-line interface for the DoPlan workflow automation system. It helps developers and teams transform ideas into deployed applications through a structured, AI-assisted workflow that integrates seamlessly with Cursor IDE.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [macOS](#macos)
  - [Linux](#linux)
  - [Windows](#windows)
  - [Verification](#verification)
- [Quick Start](#quick-start)
- [Commands](#commands)
  - [init](#init)
  - [setup](#setup)
  - [idea](#idea)
  - [plan](#plan)
  - [next](#next)
  - [progress / status](#progress--status)
  - [test](#test)
  - [run](#run)
  - [deploy](#deploy)
  - [capacity](#capacity)
  - [digest](#digest)
  - [mcp](#mcp)
  - [party](#party)
  - [watch](#watch)
  - [plugin](#plugin)
  - [telemetry](#telemetry)
- [Configuration](#configuration)
- [Integration with Cursor](#integration-with-cursor)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🚀 **13 Core Commands** - Complete workflow from idea to deployment
- 🤖 **AI-Assisted** - Integrates with Cursor IDE for intelligent recommendations
- 📊 **Progress Tracking** - Real-time dashboards and status updates
- 🔌 **Plugin System** - Extensible architecture for custom commands
- 📝 **Spec-Driven Development** - Generate executable specifications
- 🎯 **Multi-Agent Collaboration** - Get insights from specialized AI agents
- 🔄 **Auto-Sync** - Automatic dashboard and state synchronization
- 📦 **Workspace Integration** - Seamlessly works with DoPlan workspace

## Installation

### Prerequisites

- **Node.js** 20.0.0 or newer
- **npm** 9.0.0 or newer (comes with Node.js)
- **Git** (for workspace initialization)

### macOS

#### Using Homebrew (Recommended)

```bash
# Install Node.js if not already installed
brew install node

# Install DoPlan CLI globally
npm install -g doplan-cli@alpha

# Verify installation
doplan --version
```

#### Using npm directly

```bash
# Install DoPlan CLI globally
npm install -g doplan-cli@alpha

# Verify installation
doplan --version
```

#### Troubleshooting macOS

If you encounter permission errors:

```bash
# Option 1: Use npx (no global install needed)
npx doplan-cli@alpha --version

# Option 2: Configure npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g doplan-cli@alpha
```

### Linux

#### Ubuntu/Debian

```bash
# Install Node.js 20+ if not already installed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install DoPlan CLI globally
sudo npm install -g doplan-cli@alpha

# Verify installation
doplan --version
```

#### Fedora/RHEL/CentOS

```bash
# Install Node.js 20+ if not already installed
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install DoPlan CLI globally
sudo npm install -g doplan-cli@alpha

# Verify installation
doplan --version
```

#### Arch Linux

```bash
# Install Node.js if not already installed
sudo pacman -S nodejs npm

# Install DoPlan CLI globally
sudo npm install -g doplan-cli@alpha

# Verify installation
doplan --version
```

#### Using nvm (Node Version Manager)

```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20
nvm install 20
nvm use 20

# Install DoPlan CLI globally
npm install -g doplan-cli@alpha

# Verify installation
doplan --version
```

### Windows

#### Using Chocolatey

```powershell
# Install Node.js if not already installed
choco install nodejs

# Install DoPlan CLI globally
npm install -g doplan-cli@alpha

# Verify installation
doplan --version
```

#### Using Winget

```powershell
# Install Node.js if not already installed
winget install OpenJS.NodeJS.LTS

# Install DoPlan CLI globally
npm install -g doplan-cli@alpha

# Verify installation
doplan --version
```

#### Using npm directly

1. **Download Node.js**: Visit [nodejs.org](https://nodejs.org/) and download the Windows installer
2. **Install Node.js**: Run the installer and follow the prompts
3. **Open PowerShell or Command Prompt** as Administrator
4. **Install DoPlan CLI**:

```powershell
npm install -g doplan-cli@alpha
```

5. **Verify installation**:

```powershell
doplan --version
```

#### Troubleshooting Windows

If `doplan` command is not found:

1. **Check npm global path**:
```powershell
npm config get prefix
```

2. **Add to PATH**:
   - Open System Properties → Environment Variables
   - Add npm global path to User PATH variable
   - Restart terminal

3. **Alternative**: Use `npx`:
```powershell
npx doplan-cli@alpha --version
```

### Verification

After installation, verify everything works:

```bash
# Check version
doplan --version

# View help
doplan --help

# List all commands
doplan --help
```

Expected output:
```
DoPlan CLI - Command-line interface for DoPlan workflow
Version: 0.1.0-alpha

Usage: doplan [options] [command]

Commands:
  init          Initialize a new DoPlan workspace
  setup         Bootstrap environment and dependencies
  idea          Capture app idea and requirements
  plan          Generate project plan, specs, dashboards
  next          Get next recommended action
  progress      View progress dashboard
  test          Run test suite
  run           Run application locally
  deploy        Deploy to production
  capacity      Generate workload report
  digest        Generate stakeholder summaries
  mcp           Manage MCP servers
  party         Multi-agent collaboration mode
  watch         Watch for changes and auto-update
  plugin        Manage DoPlan plugins
  telemetry     Manage telemetry settings

Options:
  -h, --help     display help for command
  -V, --version  output the version number
```

## Quick Start

1. **Initialize a new DoPlan workspace**:

```bash
doplan init my-project
cd my-project
```

2. **Set up the environment**:

```bash
doplan setup
```

3. **Capture your app idea**:

```bash
doplan idea
```

4. **Generate the project plan**:

```bash
doplan plan
```

5. **View progress**:

```bash
doplan status
```

6. **Get next recommended action**:

```bash
doplan next
```

## Commands

### init

Initialize a new DoPlan workspace with all necessary files and structure.

```bash
doplan init [project-name] [options]
```

**Options:**
- `--name <name>` - Project name (non-interactive)
- `--stack <stack>` - Tech stack (e.g., `nextjs,nodejs`)
- `--git` - Initialize Git repository
- `--skip-git` - Skip Git initialization
- `--install` - Run npm install
- `--skip-install` - Skip npm install
- `--setup` - Run doplan setup after init
- `--skip-setup` - Skip doplan setup
- `--cwd <path>` - Working directory

**Examples:**

```bash
# Interactive initialization
doplan init

# Non-interactive with options
doplan init my-app --stack nextjs,nodejs --git --install

# Initialize in specific directory
doplan init --cwd /path/to/project
```

**What it does:**
- Creates `.cursor/` directory structure
- Sets up `plan/` directory for phases and features
- Creates `doplan.config.json` configuration file
- Optionally initializes Git repository
- Optionally installs dependencies
- Optionally runs `doplan setup`

### setup

Bootstrap environment, verify Node.js version, configure Git, and seed environment variables.

```bash
doplan setup [options]
```

**Options:**
- `--skip-install` - Skip dependency installation
- `--package-manager <npm|yarn|pnpm>` - Specify package manager
- `--remote-url <url>` - Set Git remote URL
- `--skip-git` - Skip Git configuration

**Examples:**

```bash
# Full setup
doplan setup

# Skip dependency installation
doplan setup --skip-install

# Use yarn instead of npm
doplan setup --package-manager yarn

# Configure Git remote
doplan setup --remote-url https://github.com/user/repo.git
```

**What it does:**
- Verifies Node.js version (requires 20+)
- Installs project dependencies
- Configures Git remote (if not set)
- Creates `.env` file from template
- Updates workflow state to `ONBOARDED`

### idea

Capture app idea and requirements through an interactive interview process.

```bash
doplan idea [options]
```

**Options:**
- `--simple` - Use simple mode for non-developers
- `--scope <simple|full|both>` - Set scope preference

**Examples:**

```bash
# Detailed interview (default)
doplan idea

# Simple mode for non-developers
doplan idea --simple

# Set scope preference
doplan idea --scope simple
```

**What it does:**
- Conducts interactive interview about app idea
- Captures requirements and preferences
- Generates `idea-notes.md` document
- Creates `.cursor/context/idea-summary.json`
- Updates workflow state to `IDEA`

**Output files:**
- `idea-notes.md` - Detailed idea documentation
- `.cursor/context/idea-summary.json` - Structured idea data

### plan

Generate complete project plan with phases, features, specifications, and dashboards.

```bash
doplan plan [options]
```

**Options:**
- `--phases <path>` - Custom phases JSON/YAML file
- `--stack <stack>` - Tech stack hints (e.g., `frontend=nextjs,backend=node`)
- `--accept-mcp` - Auto-register suggested MCP servers
- `--allow-empty` - Allow planning without idea data

**Examples:**

```bash
# Generate plan from idea
doplan plan

# Specify tech stack
doplan plan --stack frontend=nextjs,backend=nodejs

# Use custom phases file
doplan plan --phases ./custom-phases.json

# Auto-accept MCP suggestions
doplan plan --accept-mcp
```

**What it does:**
- Generates `plan/` directory structure
- Creates phase and feature folders
- Generates specifications (`spec.md`) for each feature
- Creates progress dashboards (`Main-Tasks.md`, `Progress-Dashboard.md`)
- Generates technical context (`.cursor/context/context.md`)
- Suggests MCP servers based on stack
- Updates workflow state to `PLANNING`

**Output structure:**
```
plan/
├── Main-Tasks.md
├── Progress-Dashboard.md
├── 01-Phase-Name/
│   ├── phase-plan.md
│   ├── phase-tasks.md
│   └── 01-Feature-Name/
│       ├── plan.md
│       ├── tasks.md
│       ├── spec.md
│       ├── design.md
│       └── contracts.md
```

### next

Get intelligent recommendation for the next action based on current progress.

```bash
doplan next [options]
```

**Options:**
- `--json` - Output as JSON

**Examples:**

```bash
# Get next recommendation
doplan next

# JSON output
doplan next --json
```

**What it does:**
- Analyzes current progress
- Identifies next incomplete feature or phase
- Provides actionable recommendation
- Links to relevant documentation
- Considers capacity and dependencies

**Example output:**
```
→ Next Action: Continue with Feature "User Authentication"

Phase: 01-MVP-Build
Feature: User Authentication
Status: Not Started
Progress: 0%

Recommended steps:
1. Review spec.md: plan/01-MVP-Build/01-User-Authentication/spec.md
2. Review tasks.md: plan/01-MVP-Build/01-User-Authentication/tasks.md
3. Start implementation
4. Run tests: doplan test
```

### progress / status

View progress dashboard and refresh status information.

```bash
doplan progress [options]
doplan status [options]  # Alias for progress
```

**Options:**
- `--brief` - Show brief summary only
- `--json` - Output as JSON

**Examples:**

```bash
# Full progress dashboard
doplan status

# Brief summary
doplan status --brief

# JSON output
doplan status --json
```

**What it does:**
- Refreshes progress dashboards
- Displays overall progress percentage
- Shows phase-by-phase breakdown
- Lists feature completion status
- Updates IDE panel feeds (`.cursor/panels/status.json`)

**Example output:**
```
╔════════════════════════════════════════╗
║        DoPlan Progress Dashboard       ║
╚════════════════════════════════════════╝

Overall Progress
[██████████████████░░░░░░░░░░░░░░░░░░░░░░] 45%

Phase 1: Discovery
[█████████████████████░░░░░░░░░░░░░░] 60%
Status: In Progress

  Features:
    • User Research
      [█████████████████████████] 100% Completed
    • Competitive Analysis
      [█████░░░░░░░░░░░░░░░░░░░░] 20% In Progress

→ Next Action: /Next
```

### test

Run the project test suite with optional coverage.

```bash
doplan test [options]
```

**Options:**
- `--script <script>` - Override test script name (default: `test`)
- `--coverage` - Generate coverage report
- `--watch` - Run tests in watch mode

**Examples:**

```bash
# Run tests
doplan test

# With coverage
doplan test --coverage

# Watch mode
doplan test --watch

# Custom test script
doplan test --script test:unit
```

**What it does:**
- Executes npm test script
- Generates coverage reports (if enabled)
- Updates workflow state
- Recommends next action based on test results

### run

Start the application locally for development.

```bash
doplan run [options]
```

**Options:**
- `--script <script>` - Override run script name (default: `dev` or `start`)
- `--port <port>` - Specify port number
- `--env <env>` - Environment file (default: `.env`)

**Examples:**

```bash
# Start application
doplan run

# Custom port
doplan run --port 3001

# Custom script
doplan run --script start:dev
```

**What it does:**
- Starts local development server
- Loads environment variables
- Provides development URL
- Monitors for changes

### deploy

Deploy the application to production with safety checks.

```bash
doplan deploy [options]
```

**Options:**
- `--skip-tests` - Skip test execution (not recommended)
- `--test-script <script>` - Custom test script
- `--build-script <script>` - Custom build script (default: `build`)
- `--deploy-script <script>` - Custom deploy script (default: `deploy`)

**Examples:**

```bash
# Full deployment with tests
doplan deploy

# Skip tests (not recommended)
doplan deploy --skip-tests

# Custom scripts
doplan deploy --build-script build:prod --deploy-script deploy:staging
```

**What it does:**
- Runs test suite (unless skipped)
- Builds application for production
- Executes deployment script
- Updates workflow state to `DEPLOYED`
- Recommends running `/Digest` after deployment

**Safety:**
- Prevents deployment if tests fail
- Requires explicit `--skip-tests` flag to override

### capacity

Generate workload and capacity planning report.

```bash
doplan capacity [options]
```

**Options:**
- `--format <format>` - Output format (json, markdown)
- `--output <path>` - Output file path

**Examples:**

```bash
# Generate capacity report
doplan capacity

# JSON output
doplan capacity --format json

# Save to file
doplan capacity --output capacity-report.md
```

**What it does:**
- Analyzes phases and features
- Estimates time requirements
- Identifies resource needs
- Generates timeline projections
- Highlights capacity constraints

### digest

Generate stakeholder summaries for different audiences.

```bash
doplan digest [options]
```

**Options:**
- `--audience <audience>` - Target audience (`exec`, `product`, `dev`, or comma-separated)
- `--preview` - Preview digest in terminal without writing files
- `--write` - Write digest files to `plan/digests/`

**Examples:**

```bash
# Generate exec digest
doplan digest --audience exec

# Preview product digest
doplan digest --audience product --preview

# Generate multiple digests
doplan digest --audience exec,product,dev --write
```

**What it does:**
- Generates audience-specific summaries
- Highlights key achievements
- Identifies risks and blockers
- Lists next steps
- Creates formatted markdown files

**Output files:**
- `plan/digests/YYYY-MM-DD/exec.md` - Executive summary
- `plan/digests/YYYY-MM-DD/product.md` - Product update
- `plan/digests/YYYY-MM-DD/dev.md` - Development notes

### mcp

Manage MCP (Model Context Protocol) servers for enhanced capabilities.

```bash
doplan mcp [options]
```

**Options:**
- `--list` - List available MCP servers
- `--register <server>` - Register an MCP server
- `--unregister <server>` - Unregister an MCP server
- `--suggest` - Show suggested servers for current project

**Examples:**

```bash
# List available servers
doplan mcp --list

# Show suggestions
doplan mcp --suggest

# Register a server
doplan mcp --register firecrawl
```

**What it does:**
- Manages MCP server registry
- Suggests relevant servers based on stack
- Logs MCP usage for analytics
- Updates `.cursor/config/mcp-manifest.json`

### party

Enable multi-agent collaboration mode for complex decisions.

```bash
doplan party [options]
```

**Options:**
- `--question <question>` - Specific question to ask all agents
- `--agents <agents>` - Comma-separated list of agents (default: all)

**Examples:**

```bash
# Get all agent perspectives
doplan party

# Ask specific question
doplan party --question "Should we use TypeScript or JavaScript?"

# Query specific agents
doplan party --agents product,architect,developer
```

**What it does:**
- Gathers insights from all AI agents
- Provides multiple perspectives
- Identifies consensus and conflicts
- Generates comprehensive recommendations

**Available agents:**
- `product` - Product strategy and user experience
- `architect` - Technical architecture and design
- `developer` - Implementation and code quality
- `tester` - Testing and quality assurance
- `devops` - Deployment and infrastructure
- `scrum` - Project management and planning

### watch

Watch for file changes and automatically update dashboards and state.

```bash
doplan watch [options]
```

**Options:**
- `--interval <ms>` - Polling interval in milliseconds (default: 1000)

**Examples:**

```bash
# Start watching
doplan watch

# Custom interval
doplan watch --interval 2000
```

**What it does:**
- Monitors plan and spec files for changes
- Automatically updates progress dashboards
- Syncs state with documentation
- Prompts for reconciliation when conflicts detected

**Press Ctrl+C to stop watching.**

### plugin

Manage DoPlan plugins to extend functionality.

```bash
doplan plugin <command> [options]
```

**Commands:**
- `list` - List installed plugins
- `list --registry` - List available plugins from registry
- `add <name>` - Install a plugin
- `remove <name>` - Remove a plugin
- `info <name>` - Show plugin information

**Examples:**

```bash
# List installed plugins
doplan plugin list

# Browse available plugins
doplan plugin list --registry

# Install a plugin
doplan plugin add security-audit

# Remove a plugin
doplan plugin remove security-audit

# Plugin info
doplan plugin info security-audit
```

**What it does:**
- Manages plugin installation and removal
- Verifies plugin checksums and signatures
- Updates plugin registry
- Enables/disables plugin commands

### telemetry

Manage telemetry settings (opt-in anonymous usage tracking).

```bash
doplan telemetry [options]
```

**Options:**
- `--enable` - Enable telemetry
- `--disable` - Disable telemetry
- `--status` - Show current telemetry status

**Examples:**

```bash
# Check status
doplan telemetry --status

# Enable telemetry
doplan telemetry --enable

# Disable telemetry
doplan telemetry --disable
```

**What it tracks (if enabled):**
- Command names
- Execution duration
- Success/failure status
- CLI version
- Timestamp

**Privacy:**
- All data is anonymous
- Stored locally in `~/.doplan-telemetry.log`
- No personal information collected
- Can be disabled at any time

## Configuration

DoPlan CLI can be configured via `doplan.config.json` in your project root:

```json
{
  "projectRoot": ".",
  "noSpinner": false,
  "json": false,
  "telemetry": {
    "enabled": false
  },
  "assistants": {
    "enabled": true
  },
  "plugins": {
    "autoLoad": true
  }
}
```

**Configuration options:**
- `projectRoot` - Project root directory (default: current directory)
- `noSpinner` - Disable spinner animations
- `json` - Output all commands as JSON
- `telemetry.enabled` - Enable/disable telemetry
- `assistants.enabled` - Enable AI assistant integrations
- `plugins.autoLoad` - Automatically load plugins on startup

## Integration with Cursor

DoPlan CLI is designed to work seamlessly with Cursor IDE:

1. **Slash Commands**: All CLI commands are available as Cursor slash commands
2. **Auto-Context**: Cursor automatically loads `.cursor/context/context.md`
3. **Panel Feeds**: Progress data feeds into Cursor's native panels
4. **State Sync**: Workflow state is shared between CLI and Cursor

**Using in Cursor:**
- Type `/` in Cursor to see available DoPlan commands
- Commands execute the same CLI commands
- Results are displayed in Cursor's interface

## Examples

### Complete Workflow Example

```bash
# 1. Initialize workspace
doplan init my-awesome-app --stack nextjs,nodejs --git --install

# 2. Navigate to project
cd my-awesome-app

# 3. Set up environment
doplan setup

# 4. Capture idea
doplan idea

# 5. Generate plan
doplan plan

# 6. View progress
doplan status

# 7. Get next action
doplan next

# 8. Work on features...
# (implement code, update progress)

# 9. Run tests
doplan test

# 10. Start development server
doplan run

# 11. Generate stakeholder digest
doplan digest --audience exec,product

# 12. Deploy
doplan deploy
```

### Daily Workflow Example

```bash
# Morning: Check status and get next task
doplan status --brief
doplan next

# Afternoon: Update progress and generate digest
doplan progress
doplan digest --audience product --preview

# Evening: Run tests before committing
doplan test --coverage
```

## Troubleshooting

### Command not found

**Problem**: `doplan: command not found`

**Solutions:**
1. Verify installation: `npm list -g doplan-cli`
2. Check npm global path: `npm config get prefix`
3. Add npm global bin to PATH
4. Use `npx`: `npx doplan-cli@alpha --version`

### Permission errors

**Problem**: `EACCES` permission errors

**Solutions:**
- Use `npx` instead of global install
- Configure npm to use user directory (see Installation sections)
- Use `sudo` (Linux/macOS, not recommended)

### Version conflicts

**Problem**: Wrong version installed

**Solutions:**
```bash
# Uninstall old version
npm uninstall -g doplan-cli

# Install specific version
npm install -g doplan-cli@alpha

# Verify version
doplan --version
```

### Build errors

**Problem**: `npm run build` fails

**Solutions:**
1. Check Node.js version: `node --version` (requires 20+)
2. Clear cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
4. Check TypeScript version compatibility

### State sync issues

**Problem**: Progress not updating

**Solutions:**
```bash
# Refresh progress manually
doplan progress

# Watch for changes
doplan watch

# Check state file
cat .cursor/config/state.json
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/iDorgham/doplan-workspace/blob/main/CONTRIBUTING.md) for details.

**Ways to contribute:**
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation
- Create plugins

## License

MIT License - see [LICENSE](https://github.com/iDorgham/doplan-workspace/blob/main/LICENSE) file for details.

## Links

- **Website**: [doplan.dev](https://doplan.dev)
- **GitHub**: [github.com/iDorgham/doplan-workspace](https://github.com/iDorgham/doplan-workspace)
- **npm**: [npmjs.com/package/doplan-cli](https://www.npmjs.com/package/doplan-cli)
- **Issues**: [GitHub Issues](https://github.com/iDorgham/doplan-workspace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/iDorgham/doplan-workspace/discussions)

## Support

- **Documentation**: See `docs/` directory in repository
- **CLI Help**: `doplan --help` or `doplan <command> --help`
- **Issues**: Open an issue on GitHub
- **Discussions**: Join GitHub Discussions

---

**Made with ❤️ by the DoPlan Team**

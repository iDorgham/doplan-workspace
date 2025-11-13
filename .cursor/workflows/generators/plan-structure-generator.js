const fs = require('fs/promises');
const path = require('path');

class PlanStructureGenerator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.planRoot = path.join(projectRoot, 'plan');
  }

  async generatePlan({ phases = [], idea = {}, stack = {}, options = {} }) {
    await this.ensureDirectory(this.planRoot);

    const normalizedPhases = phases.length ? phases : this.buildDefaultPhases(idea);

    for (let i = 0; i < normalizedPhases.length; i += 1) {
      const phase = normalizedPhases[i];
      const phaseNumber = String(i + 1).padStart(2, '0');
      const phaseFolder = `${phaseNumber}-${this.slugify(phase.name)}`;
      const phasePath = path.join(this.planRoot, phaseFolder);

      await this.createPhase(phasePath, phase, { phaseNumber, stack, idea });

      for (let j = 0; j < (phase.features || []).length; j += 1) {
        const feature = phase.features[j];
        const featureNumber = String(j + 1).padStart(2, '0');
        const featureFolder = `${featureNumber}-${this.slugify(feature.name)}`;
        const featurePath = path.join(phasePath, featureFolder);
        await this.createFeature(featurePath, feature, {
          phaseNumber,
          featureNumber,
          idea,
          stack
        });
      }
    }

    await this.createMainTasks(normalizedPhases);
    await this.createProgressDashboard(normalizedPhases);
    await this.createMcpReport();

    return {
      planRoot: this.planRoot,
      phases: normalizedPhases
    };
  }

  buildDefaultPhases(idea) {
    return [
      {
        name: 'discovery',
        description: 'Capture requirements, research competitors, define MVP.',
        features: [
          {
            name: 'user-research',
            description: 'Run interviews and summarize personas.',
            status: 'Not Started',
            progress: 0
          },
          {
            name: 'competitive-analysis',
            description: 'Map competitor landscape and differentiation.',
            status: 'Not Started',
            progress: 0
          }
        ]
      },
      {
        name: 'mvp-build',
        description: 'Design, develop, and test the MVP experience.',
        features: [
          {
            name: 'architecture-setup',
            description: 'Select stack, set up repos, define contracts.',
            status: 'Not Started',
            progress: 0
          },
          {
            name: 'core-feature',
            description: idea?.valueProposition || 'Implement primary user flow.',
            status: 'Not Started',
            progress: 0
          }
        ]
      }
    ];
  }

  async createPhase(phasePath, phase, context) {
    await this.ensureDirectory(phasePath);

    const files = {
      'phase-plan.md': this.renderPhasePlan(phase, context),
      'phase-tasks.md': this.renderPhaseTasks(phase, context),
      'phase-design.md': this.renderPhaseDesign(phase, context),
      'phase-contracts.md': this.renderPhaseContracts(phase, context),
      'phase-progress.json': this.renderPhaseProgress(phase, context)
    };

    await Promise.all(
      Object.entries(files).map(([file, content]) =>
        this.writeFile(path.join(phasePath, file), content)
      )
    );
  }

  async createFeature(featurePath, feature, context) {
    await this.ensureDirectory(featurePath);

    const files = {
      'plan.md': this.renderFeaturePlan(feature, context),
      'tasks.md': this.renderFeatureTasks(feature, context),
      'design.md': this.renderFeatureDesign(feature, context),
      'templates.md': this.renderFeatureTemplates(feature, context),
      'contracts.md': this.renderFeatureContracts(feature, context),
      'files.md': this.renderFeatureFiles(feature, context),
      'progress.json': this.renderFeatureProgress(feature, context),
      'spec.md': this.renderFeatureSpec(feature, context)
    };

    await Promise.all(
      Object.entries(files).map(([file, content]) =>
        this.writeFile(path.join(featurePath, file), content)
      )
    );
  }

  async createMainTasks(phases) {
    const content = [
      '# Main Tasks',
      '',
      `*Last Updated: ${new Date().toISOString()}*`,
      ''
    ];

    phases.forEach((phase, phaseIndex) => {
      const phaseNumber = String(phaseIndex + 1).padStart(2, '0');
      const phaseFolder = `${phaseNumber}-${this.slugify(phase.name)}`;
      content.push(`## Phase ${phaseIndex + 1}: ${this.titleCase(phase.name)}`);
      content.push('');
      content.push(`- Status: ${phase.status || 'Not Started'}`);
      content.push(`- Progress: ${phase.progress ?? 0}%`);
      content.push(`- Link: [./${phaseFolder}/](./${phaseFolder}/)`);
      content.push('');
      content.push('### Features');
      content.push('');
      (phase.features || []).forEach((feature, featureIndex) => {
        const featureNumber = String(featureIndex + 1).padStart(2, '0');
        const featureFolder = `${featureNumber}-${this.slugify(feature.name)}`;
        const status = feature.status || 'Not Started';
        const progress = feature.progress ?? 0;
        content.push(`- [ ] ${this.titleCase(feature.name)} — ${status} (${progress}%)`);
        content.push(`  - [Docs](./${phaseFolder}/${featureFolder}/plan.md)`);
        content.push('');
      });
      content.push('---');
    });

    await this.writeFile(path.join(this.planRoot, 'Main-Tasks.md'), content.join('\n'));
  }

  async createProgressDashboard(phases) {
    const totalFeatures = phases.reduce((acc, phase) => acc + (phase.features || []).length, 0);
    const totalProgress = phases.reduce(
      (acc, phase) =>
        acc +
        (phase.features || []).reduce((featAcc, feat) => featAcc + (feat.progress ?? 0), 0),
      0
    );
    const overall = totalFeatures ? Math.round(totalProgress / totalFeatures) : 0;

    const lines = [
      '# Progress Dashboard',
      '',
      `*Last Updated: ${new Date().toISOString()}*`,
      '',
      '## Overall Progress',
      '',
      this.renderBar(overall, 50),
      '',
      '---'
    ];

    phases.forEach((phase, phaseIndex) => {
      const phaseNumber = String(phaseIndex + 1).padStart(2, '0');
      const phaseFolder = `${phaseNumber}-${this.slugify(phase.name)}`;
      const features = phase.features || [];
      const phaseProgress = features.length
        ? Math.round(
            features.reduce((acc, feature) => acc + (feature.progress ?? 0), 0) / features.length
          )
        : 0;

      lines.push(`## Phase ${phaseIndex + 1}: ${this.titleCase(phase.name)}`);
      lines.push('');
      lines.push(this.renderBar(phaseProgress, 40));
      lines.push('');
      lines.push(`Status: ${phase.status || 'Not Started'}`);
      lines.push(`Link: [./${phaseFolder}/](./${phaseFolder}/)`);
      lines.push('');
      lines.push('### Features');
      lines.push('');
      features.forEach((feature, featureIndex) => {
        const featureNumber = String(featureIndex + 1).padStart(2, '0');
        const featureFolder = `${featureNumber}-${this.slugify(feature.name)}`;
        lines.push(
          `- ${this.titleCase(feature.name)} — ${feature.status || 'Not Started'} (${feature.progress ?? 0}%)`
        );
        lines.push(`  - ${this.renderBar(feature.progress ?? 0, 30)}`);
        lines.push(`  - [View](./${phaseFolder}/${featureFolder}/plan.md)`);
      });
      lines.push('---');
    });

    await this.writeFile(path.join(this.planRoot, 'Progress-Dashboard.md'), lines.join('\n'));
  }

  async createMcpReport() {
    const filePath = path.join(this.planRoot, 'mcp-report.md');
    const exists = await this.exists(filePath);
    if (exists) return;

    const content = [
      '# MCP Usage Report',
      '',
      'Log MCP server runs here. Commands will append entries automatically.',
      '',
      '---'
    ].join('\n');

    await this.writeFile(filePath, content);
  }

  renderPhasePlan(phase, context) {
    return `# Phase ${context.phaseNumber}: ${this.titleCase(phase.name)}

## Overview
${phase.description || 'Describe the goals of this phase.'}

## Objectives
- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Timeline
- Start: TBD
- End: TBD

## Notes
- Add additional notes here.
`;
  }

  renderPhaseTasks(phase) {
    return `# Phase Tasks

| Area | Task | Owner | Status |
| --- | --- | --- | --- |
| Setup | Define detailed plan | TBD | Not Started |
| Development | Implement features | TBD | Not Started |
| QA | Write test plan | TBD | Not Started |
`;
  }

  renderPhaseDesign(phase, context) {
    return `# Phase Design

## Architecture
- Describe architecture decisions for ${this.titleCase(phase.name)}.

## Data Model
- Define entities, schemas, and integrations.

## UI/UX Notes
- Capture critical design references and accessibility needs.
`;
  }

  renderPhaseContracts() {
    return `# Phase Contracts

## APIs
- List REST/GraphQL endpoints required in this phase.

## External Services
- Identify integrations and SLAs.

## Data Handling
- Privacy, retention, and compliance considerations.
`;
  }

  renderPhaseProgress(phase, context) {
    return JSON.stringify(
      {
        phaseNumber: Number(context.phaseNumber),
        name: this.titleCase(phase.name),
        status: phase.status || 'Not Started',
        progress: phase.progress ?? 0,
        estimatedHours: phase.estimatedHours ?? null,
        owner: phase.owner ?? null,
        startDate: phase.startDate ?? null,
        targetEndDate: phase.targetEndDate ?? null,
        features: (phase.features || []).map((feature, index) => ({
          featureNumber: index + 1,
          name: this.titleCase(feature.name),
          status: feature.status || 'Not Started',
          progress: feature.progress ?? 0,
          estimatedHours: feature.estimatedHours ?? null,
          owner: feature.owner ?? null
        }))
      },
      null,
      2
    );
  }

  renderFeaturePlan(feature, context) {
    return `# Feature ${context.phaseNumber}.${context.featureNumber}: ${this.titleCase(
      feature.name
    )}

## Overview
${feature.description || 'Describe the purpose of this feature.'}

## Goals
- [ ] Goal 1
- [ ] Goal 2

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Dependencies
- Dependency 1
- Dependency 2

## Timeline
- Estimate: ${feature.estimatedHours ?? 'TBD'} hours
- Target: ${feature.targetEndDate ?? 'TBD'}
`;
  }

  renderFeatureTasks(feature) {
    return `# Tasks for ${this.titleCase(feature.name)}

| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Task 1 | TBD | Not Started |  |
| Task 2 | TBD | Not Started |  |
`;
  }

  renderFeatureDesign(feature) {
    return `# Design Notes for ${this.titleCase(feature.name)}

## UI/UX
- Add wireframes or references.

## Architecture
- Components, services, and data flow.

## Test Strategy
- Unit tests, integration tests, and monitoring.
`;
  }

  renderFeatureTemplates(feature) {
    return `# Templates for ${this.titleCase(feature.name)}

## Code
\`\`\`
// Placeholder template
\`\`\`

## Docs
- Add documentation templates or references.
`;
  }

  renderFeatureContracts(feature) {
    return `# Contracts for ${this.titleCase(feature.name)}

## API
- Endpoint: /api/${this.slugify(feature.name)}
- Method: GET
- Response: {}

## Data
- Data contract notes here.
`;
  }

  renderFeatureFiles(feature) {
    return `# File Plan for ${this.titleCase(feature.name)}

## Proposed Structure
\`\`\`
${this.slugify(feature.name)}/
  components/
  hooks/
  tests/
  styles/
\`\`\`

## Assets
- Link to assets or design prototypes.
`;
  }

  renderFeatureProgress(feature, context) {
    return JSON.stringify(
      {
        phaseNumber: Number(context.phaseNumber),
        featureNumber: Number(context.featureNumber),
        name: this.titleCase(feature.name),
        status: feature.status || 'Not Started',
        progress: feature.progress ?? 0,
        estimatedHours: feature.estimatedHours ?? null,
        owner: feature.owner ?? null,
        tasks: {
          total: feature.tasks?.total ?? 0,
          completed: feature.tasks?.completed ?? 0,
          inProgress: feature.tasks?.inProgress ?? 0,
          blocked: feature.tasks?.blocked ?? 0
        }
      },
      null,
      2
    );
  }

  renderFeatureSpec(feature, context) {
    return `# Specification: ${this.titleCase(feature.name)}

## Scenario 1
**Given** initial context  
**When** the user performs an action  
**Then** expected outcome occurs

## Scenario 2
**Given** edge condition  
**When** system handles it  
**Then** defined result occurs
`;
  }

  renderBar(progress = 0, width = 30) {
    const safeProgress = Math.max(0, Math.min(100, progress));
    const filled = Math.round((safeProgress / 100) * width);
    return `\`\`\`\n${'█'.repeat(filled)}${'░'.repeat(width - filled)} ${safeProgress}%\n\`\`\``;
  }

  slugify(input = '') {
    return input
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  titleCase(input = '') {
    return input
      .toString()
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async ensureDirectory(dir) {
    await fs.mkdir(dir, { recursive: true });
  }

  async writeFile(filePath, content) {
    await this.ensureDirectory(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  }

  async exists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = {
  PlanStructureGenerator
};


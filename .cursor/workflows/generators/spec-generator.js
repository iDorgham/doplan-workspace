const fs = require('fs/promises');
const path = require('path');

class SpecGenerator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
  }

  async generateFromFeature(featurePath, metadata) {
    const specPath = path.join(featurePath, 'spec.md');
    const template = this.buildSpecTemplate(metadata);
    await fs.writeFile(specPath, template, 'utf8');
    return specPath;
  }

  buildSpecTemplate({ phaseNumber, featureNumber, featureName, scenarios = [] }) {
    const defaultScenarios =
      scenarios.length > 0
        ? scenarios
        : [
            {
              title: 'Happy Path',
              given: 'a user meets the prerequisites',
              when: 'the user completes the primary action',
              then: 'the expected outcome is achieved'
            },
            {
              title: 'Edge Case',
              given: 'an unusual or error condition',
              when: 'the system handles it',
              then: 'it responds gracefully'
            }
          ];

    const lines = [
      `# Feature Spec ${phaseNumber}.${featureNumber} — ${featureName}`,
      '',
      '## Overview',
      'Summarise the feature goal, background, and success metrics.',
      '',
      '## Scenarios'
    ];

    defaultScenarios.forEach((scenario, index) => {
      lines.push('');
      lines.push(`### Scenario ${index + 1}: ${scenario.title}`);
      lines.push(`**Given** ${scenario.given}`);
      lines.push(`**When** ${scenario.when}`);
      lines.push(`**Then** ${scenario.then}`);
    });

    lines.push('');
    lines.push('## Acceptance Criteria');
    lines.push('- [ ] Criterion 1');
    lines.push('- [ ] Criterion 2');
    lines.push('');
    lines.push('## Open Questions');
    lines.push('- Question 1');
    lines.push('- Question 2');

    return lines.join('\n');
  }
}

module.exports = {
  SpecGenerator
};


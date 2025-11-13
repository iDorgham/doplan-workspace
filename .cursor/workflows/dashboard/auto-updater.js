const fs = require('fs/promises');
const path = require('path');

class AutoUpdater {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.planRoot = path.join(projectRoot, 'plan');
    this.panelsDir = path.join(projectRoot, '.cursor', 'panels');
  }

  async refreshAll() {
    const phases = await this.readPhases();
    await this.updateMainTasks(phases);
    await this.updateProgressDashboard(phases);
    await this.updatePanels(phases);
    return { phases };
  }

  async readPhases() {
    const exists = await this.directoryExists(this.planRoot);
    if (!exists) return [];

    const entries = await fs.readdir(this.planRoot, { withFileTypes: true });
    const phases = [];

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const phaseDir = path.join(this.planRoot, entry.name);
      const progressPath = path.join(phaseDir, 'phase-progress.json');
      const progress = await this.readJson(progressPath);
      const features = await this.readFeatures(phaseDir);
      phases.push({
        name: this.humanize(entry.name),
        folder: entry.name,
        progress: progress?.progress ?? 0,
        status: progress?.status || 'Not Started',
        data: progress,
        features
      });
    }

    return phases.sort((a, b) => a.folder.localeCompare(b.folder));
  }

  async readFeatures(phaseDir) {
    const entries = await fs.readdir(phaseDir, { withFileTypes: true });
    const features = [];

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const featureDir = path.join(phaseDir, entry.name);
      const progressPath = path.join(featureDir, 'progress.json');
      const progress = await this.readJson(progressPath);
      features.push({
        name: this.humanize(entry.name),
        folder: entry.name,
        progress: progress?.progress ?? 0,
        status: progress?.status || 'Not Started',
        data: progress
      });
    }

    return features.sort((a, b) => a.folder.localeCompare(b.folder));
  }

  async updateMainTasks(phases) {
    const lines = [
      '# Main Tasks',
      '',
      `*Last Updated: ${new Date().toISOString()}*`,
      ''
    ];

    phases.forEach((phase, index) => {
      lines.push(`## Phase ${index + 1}: ${phase.name}`);
      lines.push('');
      lines.push(`- Status: ${phase.status}`);
      lines.push(`- Progress: ${phase.progress}%`);
      lines.push(`- Link: [./${phase.folder}/](./${phase.folder}/)`);
      lines.push('');
      lines.push('### Features');
      lines.push('');
      phase.features.forEach((feature) => {
        const checkbox = feature.status === 'Completed' ? 'x' : ' ';
        lines.push(`- [${checkbox}] ${feature.name} — ${feature.status} (${feature.progress}%)`);
        lines.push(`  - [Docs](./${phase.folder}/${feature.folder}/plan.md)`);
      });
      lines.push('');
      lines.push('---');
    });

    await this.writeFile(path.join(this.planRoot, 'Main-Tasks.md'), lines.join('\n'));
  }

  async updateProgressDashboard(phases) {
    const totalFeatures = phases.reduce((acc, phase) => acc + phase.features.length, 0);
    const totalProgress = phases.reduce(
      (acc, phase) => acc + phase.features.reduce((fAcc, f) => fAcc + f.progress, 0),
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

    phases.forEach((phase, index) => {
      const average = phase.features.length
        ? Math.round(
            phase.features.reduce((acc, feature) => acc + feature.progress, 0) /
              phase.features.length
          )
        : 0;

      lines.push(`## Phase ${index + 1}: ${phase.name}`);
      lines.push('');
      lines.push(this.renderBar(average, 40));
      lines.push('');
      lines.push(`Status: ${phase.status}`);
      lines.push(`Link: [./${phase.folder}/](./${phase.folder}/)`);
      lines.push('');
      lines.push('### Features');
      lines.push('');
      phase.features.forEach((feature) => {
        lines.push(
          `- ${feature.name} — ${feature.status} (${feature.progress}%) ${this.renderBar(
            feature.progress,
            30
          )}`
        );
        lines.push(`  - [View](./${phase.folder}/${feature.folder}/plan.md)`);
      });
      lines.push('---');
    });

    await this.writeFile(path.join(this.planRoot, 'Progress-Dashboard.md'), lines.join('\n'));
  }

  async updatePanels(phases) {
    await fs.mkdir(this.panelsDir, { recursive: true });
    const goals = phases.map((phase) => ({
      title: phase.name,
      progress: phase.progress,
      status: phase.status,
      link: `./plan/${phase.folder}/phase-plan.md`
    }));

    const status = phases.flatMap((phase) =>
      phase.features.map((feature) => ({
        title: `${phase.name} · ${feature.name}`,
        progress: feature.progress,
        status: feature.status,
        link: `./plan/${phase.folder}/${feature.folder}/tasks.md`
      }))
    );

    const timeline = phases.map((phase) => ({
      title: phase.name,
      start: phase.data?.startDate || null,
      end: phase.data?.targetEndDate || null,
      progress: phase.progress,
      status: phase.status,
      hours: phase.data?.estimatedHours || null
    }));

    await this.writeFile(path.join(this.panelsDir, 'goals.json'), JSON.stringify(goals, null, 2));
    await this.writeFile(path.join(this.panelsDir, 'status.json'), JSON.stringify(status, null, 2));
    await this.writeFile(path.join(this.panelsDir, 'timeline.json'), JSON.stringify(timeline, null, 2));
  }

  async directoryExists(target) {
    try {
      const stat = await fs.stat(target);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  async readJson(filePath) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async writeFile(filePath, content) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  }

  humanize(folderName) {
    return folderName
      .replace(/^\d+-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  renderBar(progress, width) {
    const safe = Math.max(0, Math.min(100, progress || 0));
    const filled = Math.round((safe / 100) * width);
    return `\`\`\`\n${'█'.repeat(filled)}${'░'.repeat(width - filled)} ${safe}%\n\`\`\``;
  }
}

module.exports = {
  AutoUpdater
};


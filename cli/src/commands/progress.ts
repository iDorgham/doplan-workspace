import { Command } from 'commander';
import { loadConfig } from '../config';
import { green, red, yellow, cyan, blue } from 'colorette';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { executeCommand } from '../utils/command-executor';

export interface Phase {
  name: string;
  status: string;
  progress: number;
  features: Feature[];
  folder?: string;
}

export interface Feature {
  name: string;
  status: string;
  progress: number;
  folder?: string;
}

export interface StatusData {
  overallProgress: number;
  phases: Phase[];
  nextAction?: string;
}

function renderBar(progress: number, width: number = 30): string {
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${progress}%`;
}

function formatStatus(status: string): string {
  const statusColors: Record<string, (s: string) => string> = {
    Completed: green,
    'In Progress': blue,
    Blocked: red,
    'Not Started': yellow,
  };
  const colorFn = statusColors[status] || ((s: string) => s);
  return colorFn(status);
}

export async function loadProgressData(projectRoot: string): Promise<StatusData | null> {
  // Try to load from status.json panel
  const statusJsonPath = join(projectRoot, '.cursor', 'panels', 'status.json');
  if (existsSync(statusJsonPath)) {
    try {
      const data = JSON.parse(readFileSync(statusJsonPath, 'utf-8'));
      return {
        overallProgress: data.overallProgress || 0,
        phases: data.phases || [],
        nextAction: data.nextAction,
      };
    } catch (error) {
      // Fall through to try Progress-Dashboard.md
    }
  }

  // Try to parse Progress-Dashboard.md
  const dashboardPath = join(projectRoot, 'plan', 'Progress-Dashboard.md');
  if (existsSync(dashboardPath)) {
    try {
      const content = readFileSync(dashboardPath, 'utf-8');
      return parseDashboardMarkdown(content);
    } catch (error) {
      // Return null if parsing fails
    }
  }

  return null;
}

function parseDashboardMarkdown(content: string): StatusData {
  const phases: Phase[] = [];
  let overallProgress = 0;

  // Extract overall progress from "## Overall Progress" section
  const overallMatch = content.match(/## Overall Progress\s*\n\s*\[([█░]+)\]\s*(\d+)%/);
  if (overallMatch) {
    overallProgress = parseInt(overallMatch[2], 10);
  }

  // Extract phases
  const phaseRegex = /## Phase \d+: (.+?)\n\n\[([█░]+)\]\s*(\d+)%\n\nStatus: (.+?)\n/g;
  let match;
  while ((match = phaseRegex.exec(content)) !== null) {
    const phaseName = match[1];
    const phaseProgress = parseInt(match[3], 10);
    const phaseStatus = match[4];

    // Extract features for this phase
    const features: Feature[] = [];
    const featureSection = content.substring(match.index);
    const featureRegex = /- (.+?) — (.+?) \((\d+)%\)/g;
    let featureMatch;
    while ((featureMatch = featureRegex.exec(featureSection)) !== null) {
      // Stop if we hit the next phase
      if (featureMatch.index > 500) break; // Rough limit to stay in current phase section

      features.push({
        name: featureMatch[1],
        status: featureMatch[2],
        progress: parseInt(featureMatch[3], 10),
      });
    }

    phases.push({
      name: phaseName,
      status: phaseStatus,
      progress: phaseProgress,
      features,
    });
  }

  return { overallProgress, phases };
}

export function displayBriefStatus(data: StatusData): void {
  console.log(`${green('Overall Progress:')} ${renderBar(data.overallProgress, 20)}`);
  console.log(`${cyan('Phases:')} ${data.phases.length}`);
  const totalFeatures = data.phases.reduce((acc, p) => acc + p.features.length, 0);
  const completedFeatures = data.phases.reduce(
    (acc, p) => acc + p.features.filter((f) => f.status === 'Completed').length,
    0
  );
  console.log(`${cyan('Features:')} ${completedFeatures}/${totalFeatures} complete`);
  if (data.nextAction) {
    console.log(`${yellow('Next:')} ${data.nextAction}`);
  }
}

export function displayFullStatus(data: StatusData): void {
  console.log(cyan('\n╔════════════════════════════════════════╗'));
  console.log(cyan('║        DoPlan Progress Dashboard       ║'));
  console.log(cyan('╚════════════════════════════════════════╝\n'));

  console.log(`${green('Overall Progress')}`);
  console.log(renderBar(data.overallProgress, 40));
  console.log('');

  if (data.phases.length === 0) {
    console.log(yellow('No phases found. Run `doplan plan` to generate a plan.'));
    return;
  }

  data.phases.forEach((phase, index) => {
    console.log(`${cyan(`Phase ${index + 1}: ${phase.name}`)}`);
    console.log(renderBar(phase.progress, 35));
    console.log(`Status: ${formatStatus(phase.status)}`);
    console.log('');

    if (phase.features.length > 0) {
      console.log('  Features:');
      phase.features.forEach((feature) => {
        console.log(`    • ${feature.name}`);
        console.log(`      ${renderBar(feature.progress, 25)} ${formatStatus(feature.status)}`);
      });
      console.log('');
    }
  });

  if (data.nextAction) {
    console.log(`${yellow('→ Next Action:')} ${data.nextAction}`);
    console.log('');
  }
}

export function progressCommand(program: Command) {
  program
    .command('progress')
    .alias('status')
    .description('View progress dashboard and refresh status')
    .option('--brief', 'Show brief summary only')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      const projectRoot = config.projectRoot || process.cwd();

      // First, refresh the dashboards by calling the workspace command
      try {
        await executeCommand('progress', { ...options, ...config });
      } catch (error: unknown) {
        // If workspace command fails, continue with reading existing data
        // This is expected behavior - we want to show cached data if refresh fails
        if (error && typeof error === 'object' && 'code' in error) {
          console.warn(yellow('Warning: Could not refresh dashboards. Showing cached data.'));
        } else {
          // Re-throw unexpected errors
          throw error;
        }
      }

      // Load and display progress data
      const data = await loadProgressData(projectRoot);

      if (!data) {
        console.error(red('✗ No progress data found. Run `doplan plan` first.'));
        process.exit(1);
      }

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
        return;
      }

      if (options.brief) {
        displayBriefStatus(data);
      } else {
        displayFullStatus(data);
      }
    });
}

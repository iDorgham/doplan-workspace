import { Command } from 'commander';
import { loadConfig } from '../config';
import { green, red, yellow, cyan, blue } from 'colorette';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { executeCommand } from '../utils/command-executor';

export interface DigestSummary {
  highlights: string[];
  risks: string[];
  nextSteps: string[];
}

function getDateSlug(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function buildDigestContent(audience: string, summary: DigestSummary): string {
  const intro =
    audience === 'exec'
      ? 'High-level progress overview'
      : audience === 'product'
      ? 'Product and experience update'
      : 'Engineering delivery notes';

  return [
    `# DoPlan Digest — ${audience.toUpperCase()}`,
    '',
    `_${intro}_`,
    '',
    '## Highlights',
    summary.highlights.length
      ? summary.highlights.map((line) => `- ${line}`).join('\n')
      : '- None recorded.',
    '',
    '## Risks',
    summary.risks.length
      ? summary.risks.map((line) => `- ${line}`).join('\n')
      : '- No risks flagged.',
    '',
    '## Next Steps',
    summary.nextSteps.length
      ? summary.nextSteps.map((line) => `- ${line}`).join('\n')
      : '- Continue monitoring progress.',
    '',
    '## Requests / Decisions Needed',
    '- [ ] Decision 1',
    '- [ ] Decision 2',
  ].join('\n');
}

export function displayDigestPreview(audience: string, content: string): void {
  const titleColor = audience === 'exec' ? green : audience === 'product' ? blue : cyan;
  
  console.log(titleColor('\n╔════════════════════════════════════════╗'));
  console.log(titleColor(`║   DoPlan Digest — ${audience.toUpperCase().padEnd(20)} ║`));
  console.log(titleColor('╚════════════════════════════════════════╝\n'));
  
  // Parse and display formatted content
  const lines = content.split('\n');
  
  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      // Skip main title, already displayed
      return;
    } else if (line.startsWith('## ')) {
      const sectionName = line.replace('## ', '');
      console.log(cyan(`\n${sectionName}`));
      console.log(cyan('─'.repeat(40)));
    } else if (line.startsWith('- ')) {
      const bullet = line.replace('- ', '');
      if (bullet.includes('[ ]')) {
        console.log(yellow(`  • ${bullet}`));
      } else if (bullet.toLowerCase().includes('blocked') || bullet.toLowerCase().includes('risk')) {
        console.log(red(`  • ${bullet}`));
      } else if (bullet.toLowerCase().includes('complete')) {
        console.log(green(`  • ${bullet}`));
      } else {
        console.log(`  • ${bullet}`);
      }
    } else if (line.startsWith('_') && line.endsWith('_')) {
      console.log(yellow(line));
    } else if (line.trim()) {
      console.log(line);
    }
  });
  
  console.log('');
}

async function generateDigest(
  projectRoot: string,
  audience: string,
  summary: DigestSummary
): Promise<string> {
  const content = buildDigestContent(audience, summary);
  const digestDir = join(projectRoot, 'plan', 'digests', getDateSlug(new Date()));
  mkdirSync(digestDir, { recursive: true });
  const filePath = join(digestDir, `${audience}.md`);
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

async function loadExistingDigest(projectRoot: string, audience: string): Promise<string | null> {
  const digestDir = join(projectRoot, 'plan', 'digests', getDateSlug(new Date()));
  const filePath = join(digestDir, `${audience}.md`);
  
  if (existsSync(filePath)) {
    return readFileSync(filePath, 'utf-8');
  }
  
  return null;
}

export function digestCommand(program: Command) {
  program
    .command('digest')
    .description('Generate stakeholder digest summaries')
    .option('--audience <audience>', 'Target audience (exec, product, dev)', 'exec')
    .option('--preview', 'Preview digest in terminal without writing files')
    .option('--write', 'Write digest files to plan/digests/')
    .action(async (options) => {
      const config = loadConfig(program.opts());
      const projectRoot = config.projectRoot || process.cwd();
      const audience = options.audience || 'exec';
      const audiences = audience.split(',').map((a: string) => a.trim());

      // Generate digest summary
      let summary: DigestSummary | null = null;
      
      if (options.write) {
        // For write mode, call workspace command to generate files
        try {
          const execOptions: any = { ...config };
          execOptions.write = true;
          await executeCommand('digest', { ...execOptions, audience: audiences.join(',') });
          
          // Load the generated digest to parse summary
          const existingContent = await loadExistingDigest(projectRoot, audiences[0]);
          if (existingContent) {
            summary = parseDigestContent(existingContent);
          }
        } catch (error) {
          console.warn(yellow('Warning: Could not generate digest from workspace.'));
        }
      }
      
      // If no summary yet, try to load existing or create basic one
      if (!summary) {
        const existingContent = await loadExistingDigest(projectRoot, audiences[0]);
        if (existingContent) {
          summary = parseDigestContent(existingContent);
        } else {
          // Generate basic summary from progress data
          summary = await generateSummaryFromProgress(projectRoot);
        }
      }

      // Display preview
      if (options.preview || !options.write) {
        audiences.forEach((aud: string) => {
          const content = buildDigestContent(aud, summary!);
          displayDigestPreview(aud, content);
        });
      }

      // Write files if requested
      if (options.write) {
        const writtenFiles: string[] = [];
        for (const aud of audiences) {
          const filePath = await generateDigest(projectRoot, aud, summary!);
          writtenFiles.push(filePath);
        }
        
        console.log(green(`\n✓ Digest files written:`));
        writtenFiles.forEach((file) => {
          console.log(`  ${file}`);
        });
      } else if (!options.preview) {
        // Default behavior: preview only
        console.log(yellow('\nTip: Use --write to save digest files to plan/digests/'));
      }
    });
}

async function generateSummaryFromProgress(projectRoot: string): Promise<DigestSummary> {
  // Try to load progress data and generate summary
  const statusJsonPath = join(projectRoot, '.cursor', 'panels', 'status.json');
  const summary: DigestSummary = {
    highlights: [],
    risks: [],
    nextSteps: [],
  };

  if (existsSync(statusJsonPath)) {
    try {
      const statusData = JSON.parse(readFileSync(statusJsonPath, 'utf-8'));
      const phases = statusData.phases || [];
      
      phases.forEach((phase: any) => {
        const completedFeatures = (phase.features || []).filter((f: any) => f.status === 'Completed');
        if (completedFeatures.length > 0) {
          summary.highlights.push(
            `${phase.name}: ${completedFeatures.length} feature(s) complete`
          );
        }

        const blocked = (phase.features || []).filter((f: any) => f.status === 'Blocked');
        if (blocked.length > 0) {
          summary.risks.push(
            `${phase.name}: ${blocked.length} blocked feature(s)`
          );
        }

        const inProgress = (phase.features || []).filter(
          (f: any) => f.status === 'In Progress' || (f.progress > 0 && f.progress < 100)
        );
        if (inProgress.length > 0) {
          summary.nextSteps.push(
            `${phase.name}: Continue with ${inProgress.slice(0, 2).map((f: any) => f.name).join(', ')}`
          );
        }
      });
    } catch (error) {
      // Use default summary
    }
  }

  if (summary.highlights.length === 0 && summary.risks.length === 0 && summary.nextSteps.length === 0) {
    summary.nextSteps.push('Run `doplan plan` to generate project plan');
  }

  return summary;
}

function parseDigestContent(content: string): DigestSummary {
  const summary: DigestSummary = {
    highlights: [],
    risks: [],
    nextSteps: [],
  };

  let currentSection = '';
  const lines = content.split('\n');

  lines.forEach((line) => {
    if (line.startsWith('## Highlights')) {
      currentSection = 'highlights';
    } else if (line.startsWith('## Risks')) {
      currentSection = 'risks';
    } else if (line.startsWith('## Next Steps')) {
      currentSection = 'nextSteps';
    } else if (line.startsWith('- ') && currentSection) {
      const bullet = line.replace('- ', '').trim();
      if (bullet !== 'None recorded.' && bullet !== 'No risks flagged.' && bullet !== 'Continue monitoring progress.') {
        summary[currentSection as keyof DigestSummary].push(bullet);
      }
    }
  });

  return summary;
}

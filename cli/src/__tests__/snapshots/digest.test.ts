import { describe, it, expect } from 'vitest';
import { displayDigestPreview, buildDigestContent } from '../../commands/digest';
import type { DigestSummary } from '../../commands/digest';

describe('Digest Command Snapshot Tests', () => {
  it('should display exec digest preview correctly', () => {
    const summary: DigestSummary = {
      highlights: [
        'Phase 1: Discovery: 2 feature(s) complete',
        'Phase 2: MVP Build: 1 feature(s) complete',
      ],
      risks: [
        'Phase 1: Discovery: 1 blocked feature(s)',
      ],
      nextSteps: [
        'Phase 1: Discovery: Continue with User Research, Competitive Analysis',
        'Phase 2: MVP Build: Continue with Authentication',
      ],
    };

    const content = buildDigestContent('exec', summary);

    const output: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      output.push(args.map(String).join(' '));
    };

    displayDigestPreview('exec', content);
    console.log = originalLog;

    expect(output.join('\n')).toMatchSnapshot();
  });

  it('should display product digest preview correctly', () => {
    const summary: DigestSummary = {
      highlights: [
        'User Research: Completed',
        'Competitive Analysis: In Progress',
      ],
      risks: [],
      nextSteps: [
        'Continue with Authentication feature',
      ],
    };

    const content = buildDigestContent('product', summary);

    const output: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      output.push(args.map(String).join(' '));
    };

    displayDigestPreview('product', content);
    console.log = originalLog;

    expect(output.join('\n')).toMatchSnapshot();
  });

  it('should display dev digest preview correctly', () => {
    const summary: DigestSummary = {
      highlights: [
        'Authentication API: Implemented',
        'Database migrations: Completed',
      ],
      risks: [
        'Performance testing: Blocked on infrastructure',
      ],
      nextSteps: [
        'Implement user dashboard',
        'Add error handling',
      ],
    };

    const content = buildDigestContent('dev', summary);

    const output: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      output.push(args.map(String).join(' '));
    };

    displayDigestPreview('dev', content);
    console.log = originalLog;

    expect(output.join('\n')).toMatchSnapshot();
  });

  it('should handle empty digest', () => {
    const summary: DigestSummary = {
      highlights: [],
      risks: [],
      nextSteps: [],
    };

    const content = buildDigestContent('exec', summary);

    const output: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      output.push(args.map(String).join(' '));
    };

    displayDigestPreview('exec', content);
    console.log = originalLog;

    expect(output.join('\n')).toMatchSnapshot();
  });

  it('should build digest content correctly', () => {
    const summary: DigestSummary = {
      highlights: ['Feature A completed'],
      risks: ['Feature B blocked'],
      nextSteps: ['Continue with Feature C'],
    };

    const execContent = buildDigestContent('exec', summary);
    const productContent = buildDigestContent('product', summary);
    const devContent = buildDigestContent('dev', summary);

    expect(execContent).toMatchSnapshot('exec-digest-content');
    expect(productContent).toMatchSnapshot('product-digest-content');
    expect(devContent).toMatchSnapshot('dev-digest-content');
  });
});


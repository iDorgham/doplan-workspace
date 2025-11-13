import { describe, it, expect } from 'vitest';
import { displayBriefStatus, displayFullStatus } from '../../commands/progress';
import type { StatusData } from '../../commands/progress';

describe('Status Command Snapshot Tests', () => {
  it('should display brief status correctly', () => {
    const data: StatusData = {
      overallProgress: 45,
      phases: [
        {
          name: 'Phase 1: Discovery',
          status: 'In Progress',
          progress: 60,
          features: [
            { name: 'User Research', status: 'Completed', progress: 100 },
            { name: 'Competitive Analysis', status: 'In Progress', progress: 20 },
          ],
        },
        {
          name: 'Phase 2: MVP Build',
          status: 'Not Started',
          progress: 0,
          features: [{ name: 'Authentication', status: 'Not Started', progress: 0 }],
        },
      ],
      nextAction: '/Next',
    };

    // Capture console output
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    };

    displayBriefStatus(data);
    console.log = originalLog;

    expect(output.join('\n')).toMatchSnapshot();
  });

  it('should display full status correctly', () => {
    const data: StatusData = {
      overallProgress: 45,
      phases: [
        {
          name: 'Phase 1: Discovery',
          status: 'In Progress',
          progress: 60,
          features: [
            { name: 'User Research', status: 'Completed', progress: 100 },
            { name: 'Competitive Analysis', status: 'In Progress', progress: 20 },
          ],
        },
        {
          name: 'Phase 2: MVP Build',
          status: 'Not Started',
          progress: 0,
          features: [{ name: 'Authentication', status: 'Not Started', progress: 0 }],
        },
      ],
      nextAction: '/Next',
    };

    // Capture console output
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    };

    displayFullStatus(data);
    console.log = originalLog;

    expect(output.join('\n')).toMatchSnapshot();
  });

  it('should handle empty phases', () => {
    const data: StatusData = {
      overallProgress: 0,
      phases: [],
    };

    const output: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    };

    displayFullStatus(data);
    console.log = originalLog;

    expect(output.join('\n')).toMatchSnapshot();
  });

  it('should handle completed project', () => {
    const data: StatusData = {
      overallProgress: 100,
      phases: [
        {
          name: 'Phase 1: Discovery',
          status: 'Completed',
          progress: 100,
          features: [
            { name: 'User Research', status: 'Completed', progress: 100 },
            { name: 'Competitive Analysis', status: 'Completed', progress: 100 },
          ],
        },
      ],
      nextAction: '/Deploy',
    };

    const output: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      output.push(args.map(String).join(' '));
    };

    displayFullStatus(data);
    console.log = originalLog;

    expect(output.join('\n')).toMatchSnapshot();
  });
});

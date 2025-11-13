#!/usr/bin/env node

/**
 * DoPlan Phase Branch Creator
 * Usage: node scripts/create-phase-branch.js <phase-number> <phase-name>
 * Example: node scripts/create-phase-branch.js 1 "Alpha"
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const phaseNum = process.argv[2];
const phaseName = process.argv[3];

if (!phaseNum || !phaseName) {
  console.error('Usage: node scripts/create-phase-branch.js <phase-number> <phase-name>');
  console.error('Example: node scripts/create-phase-branch.js 1 "Alpha"');
  process.exit(1);
}

// Normalize phase name (lowercase, replace spaces with hyphens)
const normalizedName = phaseName.toLowerCase().replace(/\s+/g, '-');
const branchName = `phase-${phaseNum}-${normalizedName}`;

try {
  // Check if branch already exists
  try {
    execSync(`git show-ref --verify --quiet refs/heads/${branchName}`, { stdio: 'ignore' });
    console.log(`Branch ${branchName} already exists!`);
    rl.question('Do you want to switch to it? (y/n) ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
        console.log(`Switched to ${branchName}`);
      }
      rl.close();
    });
    return;
  } catch (e) {
    // Branch doesn't exist, continue
  }

  // Get current branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();

  // Create and switch to new branch
  execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

  console.log(`✓ Created and switched to branch: ${branchName}`);
  console.log('');
  console.log(`Previous branch: ${currentBranch}`);
  console.log(`New branch: ${branchName}`);
  console.log('');
  console.log(`Ready to start Phase ${phaseNum}: ${phaseName}`);
  
  rl.close();
} catch (error) {
  console.error('Error:', error.message);
  rl.close();
  process.exit(1);
}


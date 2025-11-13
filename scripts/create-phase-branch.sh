#!/bin/bash

# DoPlan Phase Branch Creator
# Usage: ./scripts/create-phase-branch.sh <phase-number> <phase-name>
# Example: ./scripts/create-phase-branch.sh 1 "Alpha"

set -e

PHASE_NUM=$1
PHASE_NAME=$2

if [ -z "$PHASE_NUM" ] || [ -z "$PHASE_NAME" ]; then
  echo "Usage: $0 <phase-number> <phase-name>"
  echo "Example: $0 1 Alpha"
  exit 1
fi

# Normalize phase name (lowercase, replace spaces with hyphens)
NORMALIZED_NAME=$(echo "$PHASE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
BRANCH_NAME="phase-${PHASE_NUM}-${NORMALIZED_NAME}"

# Check if branch already exists
if git show-ref --verify --quiet refs/heads/"$BRANCH_NAME"; then
  echo "Branch $BRANCH_NAME already exists!"
  read -p "Do you want to switch to it? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git checkout "$BRANCH_NAME"
    echo "Switched to $BRANCH_NAME"
  fi
  exit 0
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Create and switch to new branch
git checkout -b "$BRANCH_NAME"

echo "✓ Created and switched to branch: $BRANCH_NAME"
echo ""
echo "Previous branch: $CURRENT_BRANCH"
echo "New branch: $BRANCH_NAME"
echo ""
echo "Ready to start Phase $PHASE_NUM: $PHASE_NAME"


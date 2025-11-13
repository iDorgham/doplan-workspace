# Lifecycle Sync Rules

These rules ensure documentation, dashboards, and state remain aligned.

## Watcher Behaviour

- `/Watch` must monitor `plan/**/*.md`, `plan/**/progress.json`, and `plan/**/phase-progress.json`.
- When changes are detected, prompt the user: “Sync to dashboards and state?”.
- If the user approves, run the auto-updater and record the change in `.cursor/logs/lifecycle.json`.

## Conflict Handling

- If the file change conflicts with recent state updates (timestamp drift > 5 minutes), warn the user before syncing.
- Prefer state values when files are older than the state; prefer file values when newer.
- Always preserve manual edits—never overwrite user content without explicit confirmation.

## Logging

- Log every sync attempt with: file path, action (synced / skipped), who approved (user vs auto), and timestamp.
- Store logs in `.cursor/logs/lifecycle.json` (create the directory if needed).

## Manual Overrides

- `/Progress --refresh` should bypass prompts and refresh immediately (assumes user intent).
- `/Plan --allow-empty` should regenerate the full artefact set, overwriting existing dashboards after confirmation.
- When running in CI or unattended environments, respect `--force` flags to avoid blocking.


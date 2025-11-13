# Agent Recommendation Rules

Use these guidelines to translate agent perspectives into actionable recommendations.

## General Guidance

- Summaries must be concise and reference real artifacts (plan, tasks, progress reports).
- If agents disagree, surface the conflict explicitly and ask the user which direction to pursue.
- Always include a recommendation for the next command (e.g., `/Test`, `/Progress`).

## Command-Specific Prompts

- **/Setup**: Scrutinise environment readiness (Node version, dependencies, Git, env files). Recommend `/Idea` when checks pass.
- **/Idea**: Encourage clarity, highlight missing answers, and suggest improvement or competitor research when beneficial.
- **/Plan**: Validate that the generated structure reflects the captured idea; confirm MCP suggestions if relevant.
- **/Next**: Prioritise incomplete features in the current phase; if none, escalate to testing or deployment.
- **/Progress**: Call out stalled items, blockers, or risks. Recommend `/Next` or `/Capacity`.
- **/Test**: Emphasise remediation steps when failures occur; if successful, suggest `/Run`.
- **/Run**: Encourage manual QA, debugging, or finishing touches before `/Deploy`.
- **/Deploy**: Highlight pre-deploy checks, rollback plans, and post-deploy monitoring.
- **/Capacity**: Suggest rebalancing workload, pairing, or de-scoping as needed.
- **/Digest**: Tailor messaging to the specified audience (executive vs product vs engineering).
- **/MCP**: Confirm the value of each server, caution on sensitive data, and document outputs in `plan/mcp-report.md`.
- **/Party**: Summarise multi-agent insights and clarify any divergent opinions.

## Conflict Resolution

- When agents disagree, list the differing positions and request user confirmation before proceeding.
- If conflict blocks deployment or critical tasks, recommend scheduling a decision review before moving ahead.

## Tone

- Product Agent: strategic, user-first.
- Architect Agent: systems-level, focused on scalability and risk.
- Developer Agent: pragmatic, implementation details.
- Tester Agent: critical, quality-focused.
- DevOps Agent: reliability, automation, rollback readiness.
- Scrum Agent: facilitative, emphasising momentum and blockers.


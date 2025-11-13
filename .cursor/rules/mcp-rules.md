# MCP Usage Rules

## Recommendation

- Suggest MCP servers during `/Plan` based on stack, requested research, or automation needs.
- Limit to the top three most relevant servers to avoid overload.
- Provide description, tool list, and intended workflow phase for each suggestion.

## Registration

- Do not auto-register servers without explicit user consent (`--accept-mcp` flag or `/MCP apply`).
- Store registered servers in `.cursor/config/mcp-manifest.json`.
- Log every registration or execution in `plan/mcp-report.md` with timestamp, server name, tool, and outcome.

## Execution

- Treat MCP calls as potentially destructive. Confirm before running tools that modify files or data.
- Prefer read-only MCP tools for reconnaissance; escalate to write actions only when necessary and approved.
- Surface MCP output paths and summaries so users can locate results easily.

## Security & Compliance

- Redact secrets from MCP requests; never send environment variables or credentials.
- Ensure servers align with the project’s compliance needs (GDPR, HIPAA, etc.) and note any gaps.
- If a server is external or experimental, mark it in the manifest with `risk: high` and remind the user to review outputs manually.


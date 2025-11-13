# DoPlan Telemetry

DoPlan includes an optional telemetry system to help improve the CLI. This document explains what data is collected, how it's used, and how to manage your preferences.

## What Data is Collected

When telemetry is enabled, DoPlan collects **anonymous usage data**:

- **Command name** - Which command was executed (e.g., "plan", "status")
- **Execution duration** - How long the command took (in milliseconds)
- **CLI version** - The version of DoPlan CLI being used
- **Success status** - Whether the command completed successfully
- **Timestamp** - When the command was executed

## What is NOT Collected

DoPlan **never** collects:
- Personal information (name, email, etc.)
- Code or file contents
- Project names or paths
- API keys or secrets
- Any sensitive data

## Privacy & Security

- All telemetry data is stored locally in `~/.doplan-telemetry.log`
- Data is anonymized and aggregated
- No data is sent to external servers (currently)
- You can disable telemetry at any time
- Telemetry is **opt-in** by default (disabled)

## Managing Telemetry

### Check Status

```bash
doplan telemetry --status
```

### Enable Telemetry

```bash
doplan telemetry --enable
```

### Disable Telemetry

```bash
doplan telemetry --disable
```

### First-Time Prompt

When you run `doplan setup` for the first time, you'll be prompted to enable telemetry. You can:
- Type `y` or `yes` to enable
- Press Enter or type `n` to disable (default)

The prompt won't appear again for 30 days if you decline.

## Configuration

Telemetry preferences are stored in `~/.doplanrc`:

```json
{
  "enabled": false,
  "lastPrompted": "2025-11-13T14:00:00.000Z"
}
```

You can manually edit this file if needed.

## Telemetry Log

When enabled, telemetry events are logged to `~/.doplan-telemetry.log`:

```json
{"command":"plan","duration":1234,"version":"0.1.0-alpha","success":true,"timestamp":"2025-11-13T14:00:00.000Z"}
{"command":"status","duration":567,"version":"0.1.0-alpha","success":true,"timestamp":"2025-11-13T14:01:00.000Z"}
```

This log file can be deleted at any time without affecting DoPlan functionality.

## Future Plans

In future versions, we may:
- Add an optional telemetry endpoint for aggregated analytics
- Provide telemetry dashboard showing usage patterns
- Use telemetry to prioritize feature development

All future telemetry features will:
- Remain opt-in
- Be clearly documented
- Allow easy opt-out
- Never collect sensitive data

## Questions?

If you have questions about telemetry:
- Check this documentation
- Run `doplan telemetry --status`
- Review `~/.doplanrc` and `~/.doplan-telemetry.log`
- Open an issue on GitHub


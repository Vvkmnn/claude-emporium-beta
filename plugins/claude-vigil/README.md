# Claude Vigil

File checkpoint and recovery for Claude Code. Saves snapshots before destructive operations, diffs changes, and restores files safely.

## Installation

```bash
/plugin marketplace add Vvkmnn/claude-emporium
/plugin install claude-vigil@claude-emporium
```

## Requirements

MCP server: [`claude-vigil-mcp`](https://www.npmjs.com/package/claude-vigil-mcp)

```bash
claude mcp add vigil -- npx claude-vigil-mcp
```

## Hooks

| Event | Trigger | What It Does |
|-------|---------|-------------|
| `PreToolUse` | `Bash` | Auto-quicksaves before destructive commands (rm, mv, git reset, etc.) |

## Commands

| Command | Description |
|---------|-------------|
| `/save-vigil <name> [files]` | Create a named file checkpoint |
| `/restore-vigil [name]` | Restore files from a checkpoint |

## MCP Tools

| Tool | Purpose |
|------|---------|
| `vigil_save` | Create a named checkpoint |
| `vigil_list` | List available checkpoints |
| `vigil_diff` | Preview changes since checkpoint |
| `vigil_restore` | Restore files from checkpoint |
| `vigil_delete` | Remove a checkpoint |

## Settings

Configure in `~/.claude/settings.json` under `pluginSettings → claude-emporium`:

```json
{
  "pluginSettings": {
    "claude-emporium": {
      "claude-vigil": {
        "hooks": {
          "pre_bash": false
        }
      }
    }
  }
}
```

| Hook | Default | What It Controls |
|------|---------|-----------------|
| `pre_bash` | `true` | Quicksave before destructive bash commands |

## How It Works

Hooks inject prompts that trigger `claude-vigil-mcp` tools when destructive commands are detected. The MCP uses content-addressable storage (SHA-256 + gzip dedup) for efficient snapshots.

Storage is project-local at `.claude/vigil/`. 3 named slots + 1 rotating quicksave.

## License

MIT

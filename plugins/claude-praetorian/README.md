# Claude Praetorian

Automatic context preservation for Claude Code. Prompts you to save and restore valuable context at the right moments — before planning, after research, when subagents complete.

## Installation

```bash
/plugin marketplace add Vvkmnn/claude-emporium
/plugin install claude-praetorian@claude-emporium
```

## Requirements

MCP server: [`claude-praetorian-mcp`](https://www.npmjs.com/package/claude-praetorian-mcp)

```bash
claude mcp add praetorian -- npx claude-praetorian-mcp
```

## Hooks

| Event | Trigger | What It Does |
|-------|---------|-------------|
| `PreToolUse` | `EnterPlanMode` | Lists prior compactions before you start planning |
| `PreCompact` | `*` | Saves context before compaction resets it |
| `PostToolUse` | `WebFetch` · `WebSearch` | Prompts to compact research findings |
| `SubagentStop` | `*` | Prompts to compact subagent results |

## Commands

| Command | Description |
|---------|-------------|
| `/compact-praetorian [type] [title]` | Save current context (interactive or with args) |
| `/restore-praetorian [query]` | Load previous context (recent or searched) |

**Compaction types:** `web_research` · `task_result` · `file_reads` · `decisions`

## Settings

Configure in `~/.claude/settings.json` under `pluginSettings → claude-emporium`:

```json
{
  "pluginSettings": {
    "claude-emporium": {
      "claude-praetorian": {
        "hooks": {
          "post_research": false,
          "post_subagent": false,
          "pre_plan": false,
          "pre_compact": false
        }
      }
    }
  }
}
```

| Hook | Default | What It Controls |
|------|---------|-----------------|
| `post_research` | `true` | Prompt to compact after web research |
| `post_subagent` | `true` | Prompt to compact after subagent completes |
| `pre_plan` | `true` | List prior compactions before planning |
| `pre_compact` | `true` | Remind to save context before compaction |

## How It Works

Hooks inject prompts that trigger `claude-praetorian-mcp` tools at high-impact moments. No business logic in the plugin — it tells Claude *when* to compact, the MCP handles *how*.

Storage is project-local at `.claude/praetorian/`.

## License

MIT

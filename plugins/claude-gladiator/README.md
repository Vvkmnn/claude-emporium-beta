# Claude Gladiator

Continuous learning hooks for Claude Code. Observes tool failure patterns and prompts reflection before session ends.

## Installation

```bash
/plugin marketplace add Vvkmnn/claude-emporium
/plugin install claude-gladiator@claude-emporium
```

## Requirements

MCP server: [`claude-gladiator-mcp`](https://www.npmjs.com/package/claude-gladiator-mcp)

```bash
claude mcp add gladiator -- npx claude-gladiator-mcp
```

## Hooks

| Event | Trigger | What It Does |
|-------|---------|-------------|
| `PostToolUse` | `Bash` · `Edit` · `Write` | Observes tool failure patterns (silent on success) |
| `Stop` | `*` | Prompts reflection if unprocessed observations exist |

## Commands

| Command | Description |
|---------|-------------|
| `/review-gladiator [topic]` | Batch learn from observations and session history |

## MCP Tools

| Tool | Purpose |
|------|---------|
| `gladiator_observe` | Record a pattern worth learning from |
| `gladiator_reflect` | Cluster observations and get recommendations |

## Settings

Configure in `~/.claude/settings.json` under `pluginSettings → claude-emporium`:

```json
{
  "pluginSettings": {
    "claude-emporium": {
      "claude-gladiator": {
        "hooks": {
          "post_error": false,
          "stop": false
        }
      }
    }
  }
}
```

| Hook | Default | What It Controls |
|------|---------|-----------------|
| `post_error` | `true` | Observe tool failure patterns after errors |
| `stop` | `true` | Prompt reflection before session ends |

## How It Works

Hooks inject prompts that trigger `claude-gladiator-mcp` tools at high-impact moments. Tool failures are observed with context (error, tool, input), and accumulated observations are clustered into recommendations at session end.

Typical overhead: ~100-200 tokens per session.

## Hook Notifications

**After a tool failure** (PostToolUse) — Claude sees:

```
⚔️ [claude-gladiator] Edit failed — observe this pattern.

gladiator_observe(
  summary="<describe what failed and how you fixed it>",
  context={error:"old_string not unique", tool:"Edit",
           before:"old_string: \"import { z }\"", after:"<what worked>"},
  tags=["error", "edit"]
)

Error: old_string not unique
📜 [claude-historian] is active — check past solutions via get_error_solutions()
   during reflection.
```

Claude calls `gladiator_observe` with the error context filled in. Silent on success — zero tokens when tools don't fail.

**Before session ends** (Stop) — Claude sees:

```
⚔️ [claude-gladiator] 3 unprocessed observations — consider reflecting before
   session ends.

gladiator_reflect()

Review clusters, propose updates to existing rules/skills/hooks (prefer updating
over creating), and apply with user approval.
📜 [claude-historian] is active — enrich reflection with search_conversations()
   and get_error_solutions().
🔮 [claude-oracle] is active — search for existing solutions before creating
   new artifacts.
```

Claude runs the reflection workflow before context is lost. Only fires when unprocessed observations exist — silent otherwise. Sibling lines only appear when those plugins are installed.

## License

MIT

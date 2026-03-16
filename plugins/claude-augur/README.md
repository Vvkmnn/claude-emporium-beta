# Claude Augur

Plan reasoning summaries for Claude Code. Surfaces decisions, tradeoffs, and assumptions as scannable inline abstracts.

## Installation

```bash
/plugin marketplace add Vvkmnn/claude-emporium
/plugin install claude-augur@claude-emporium
```

## Requirements

MCP server: [`claude-augur-mcp`](https://www.npmjs.com/package/claude-augur-mcp)

```bash
claude mcp add augur -- npx claude-augur-mcp
```

## Hooks

| Event | Trigger | What It Does |
|-------|---------|-------------|
| `PostToolUse` | `Write` · `Edit` | Nudges `augur_explain` after plan file writes |

## Skills

| Skill | Description |
|-------|-------------|
| `claude-augur` | Surface plan reasoning as inline abstract |

## MCP Tools

| Tool | Purpose |
|------|---------|
| `augur_explain` | Extract plan structure, return template for inline rendering |

## Settings

Configure in `~/.claude/settings.json` under `pluginSettings -> claude-emporium`:

```json
{
  "pluginSettings": {
    "claude-emporium": {
      "claude-augur": {
        "hooks": {
          "post_plan": false
        }
      }
    }
  }
}
```

| Hook | Default | What It Controls |
|------|---------|-----------------|
| `post_plan` | `true` | Nudge augur_explain after plan file writes |

## How It Works

The hook detects Write/Edit to `.claude/plans/*.md` and injects a prompt nudging Claude to call `augur_explain`. The MCP server reads the plan file (read-only), extracts structure (title, purpose, progress), and returns a template with `[FILL]` markers. Claude fills in its reasoning and renders the abstract inline.

Template seeding: MCP handles the deterministic parts (header, progress counts, formatting), Claude fills the parts only it knows (decisions, assumptions, tradeoffs, reasoning).

## License

MIT

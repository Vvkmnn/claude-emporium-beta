---
name: claude-vigil
description: File checkpoint and recovery — auto-quicksaves before destructive commands, INVOKE before implementing a plan or starting risky multi-file changes
triggers: [PreToolUse]
---

# Vigil Plugin

File recovery. Saves checkpoints before dangerous operations, diffs changes, restores files safely.

## Hooks

| Hook | When | Action |
|------|------|--------|
| **PreToolUse(Bash)** | Destructive command detected | Auto-quicksaves affected files (rm, mv, git reset, etc.) |

Token cost: 0 on safe commands, ~30 on destructive.

## Commands

| Command | Description |
|---------|-------------|
| `/save-vigil <name> [files]` | Create a named file checkpoint |
| `/restore-vigil [name]` | Restore files from a checkpoint |

## Workflows

### Before Implementing a Plan

After exiting plan mode, before writing any code:

1. `vigil_save(name="before-<plan-name>")` — snapshot the project
2. Implement the plan
3. If something goes wrong: `vigil_diff(name="before-<plan-name>")` then `vigil_restore(name="before-<plan-name>")`

### Before Risky Changes

Before refactors or multi-file changes:

1. `vigil_save(name="before-refactor")` — named checkpoint
2. Make changes safely
3. If something breaks: `vigil_diff` first, then `vigil_restore`

### Recovery

Always diff before restoring:

1. `vigil_list()` — see available checkpoints
2. `vigil_diff(name="checkpoint")` — preview what would change
3. `vigil_restore(name="checkpoint")` — restore files
4. Displaced files are preserved in `.claude/vigil/artifacts/`

### Storage Management

Vigil has 3 named slots + 1 rotating `~quicksave`:

- `~quicksave` is ONE rotating slot — overwritten on each destructive command
- Named checkpoints persist until deleted
- Run `vigil_list()` periodically to check capacity
- When nearing capacity (2+ named checkpoints), offer to clean up the oldest with `vigil_delete(name="oldest")`
- `vigil_restore` preserves displaced files in `.claude/vigil/artifacts/` — ask the user before cleaning those up

## MCP Tools Reference

| Tool | Purpose |
|------|---------|
| `vigil_save` | Create named checkpoint (SHA-256 + gzip dedup) |
| `vigil_list` | List available checkpoints with metadata |
| `vigil_diff` | Preview changes since checkpoint |
| `vigil_restore` | Restore files from checkpoint |
| `vigil_delete` | Remove a checkpoint and free storage |

## Requires

```
claude mcp add vigil -- npx claude-vigil-mcp
```

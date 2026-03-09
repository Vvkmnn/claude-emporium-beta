---
name: claude-historian
description: Automatic history search — INVOKE before planning to check search(scope="plans"), before web research, or after errors for past solutions
triggers: [PreToolUse, PostToolUseFailure]
---

# Historian Plugin

Session memory. Checks past sessions before redundant research, planning, or debugging.

## Hooks

| Hook | When | Action |
|------|------|--------|
| **PreToolUse(WebSearch/WebFetch)** | Before web research | Checks `search(scope="similar")` first |
| **PostToolUseFailure(Bash/Edit)** | After tool errors | Suggests `search(scope="errors")` |

## Commands

| Command | Description |
|---------|-------------|
| `/search-historian <query>` | Search past sessions for solutions, decisions, context |

## Workflows

### Before Planning

Check past plans before entering plan mode:

1. `search(query="feature or project name", scope="plans")` — find past approaches
2. Review architectural decisions and rationale
3. Use findings to avoid re-research

### Before Web Research

The hook handles this automatically, but you can also invoke manually:

1. `search(query="query", scope="similar")` — check if already researched
2. If found: use past results, skip web search
3. If not: proceed with research

### Before Launching Agents

Check past agent workflows for effective patterns:

1. `search(scope="tools")` — successful agent workflows
2. Review what agent types and prompts worked well
3. Use findings to craft better agent prompts

### Error Resolution

1. `search(query="error pattern", scope="errors")` — how was this fixed before?
2. If found: apply the previous solution
3. If not: proceed with normal debugging

### General Search

1. `search(query="query")` — full-text across all sessions (default scope: "all")
2. `search(query="query", scope="files", filepath="filename")` — track file changes across sessions
3. `search(scope="sessions")` — browse recent work

## MCP Tools Reference

| Tool | Purpose |
|------|---------|
| `search` | Unified search across conversations, plans, config, memories, files, errors, tasks |
| `inspect` | Deep summary of a specific session by session_id |

### `search` scopes

| Scope | Purpose |
|-------|---------|
| `all` (default) | Parallel search across conversations + plans + config + memories |
| `conversations` | Session history |
| `similar` | Find related past questions |
| `errors` | Find how errors were fixed |
| `files` | Track file changes (requires `filepath` param) |
| `tools` | Discover successful workflows |
| `sessions` | Browse recent work |
| `plans` | Find past implementation plans |
| `config` | Search .claude rules, skills, agents |
| `tasks` | Search task management data |
| `memories` | Search auto-memory notes |

## Requires

```
claude mcp add historian -- npx claude-historian-mcp
```

---
name: claude-historian
description: Session history search — INVOKE before planning, before web research, after errors, or when looking for past conversation content. Use INSTEAD of manually grepping .jsonl session files.
triggers: [PreToolUse, PostToolUseFailure]
---

# Historian Plugin

Session memory. Use INSTEAD of grepping .jsonl files manually. Checks past sessions before redundant research, planning, or debugging.

## Hooks

| Hook | When | Action |
|------|------|--------|
| **PreToolUse(WebSearch/WebFetch)** | Before web research | Checks `search(scope="similar")` first |
| **PostToolUseFailure(Bash/Edit)** | After tool errors | Suggests `search(scope="errors")` |

## Commands

| Command | Description |
|---------|-------------|
| `/search-historian <query>` | Search past sessions for solutions, decisions, context |

## MCP Tool: `search(query, scope)`

One tool, many scopes:

| Scope | What It Finds | When to Use |
|-------|---------------|-------------|
| `conversations` | Full-text across all sessions | General search |
| `similar` | Related past questions | Before web research |
| `errors` | How errors were previously fixed | After tool failures |
| `plans` | Past implementation plans | Before planning |
| `files` | File changes across sessions (needs `filepath`) | Before editing familiar files |
| `tools` | Successful tool workflows | Before launching agents |
| `sessions` | Recent work sessions | Browse history |
| `config` | .claude rules, skills, agents | Config troubleshooting |
| `tasks` | Task management data | Check past tasks |
| `memories` | Saved memories | Cross-session memory |

## MCP Tool: `inspect(session_id)`

Deep summary of a specific session with key insights.

## Workflows

### Before Planning

```
search(query="feature name", scope="plans")
```

### Before Web Research

```
search(query="topic", scope="similar")
```
If found: use past results, skip web search.

### After Errors

```
search(query="error message", scope="errors")
```
If found: apply previous solution.

### General Search

```
search(query="topic", scope="conversations")
search(scope="files", filepath="path/to/file")
search(scope="sessions")
```

## Sibling Synergy

- **With praetorian**: historian gives raw session context, praetorian gives distilled insights. Check both.
- **With gladiator**: historian finds past error solutions, gladiator records new ones.

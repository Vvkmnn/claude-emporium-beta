---
name: claude-historian
description: Session history search — INVOKE before planning to check search_plans(), before web research, or after errors for past solutions
triggers: [PreToolUse, PostToolUseFailure]
---

# Historian Plugin

Session memory. Checks past sessions before redundant research, planning, or debugging.

## Hooks

| Hook | When | Action |
|------|------|--------|
| **PreToolUse(WebSearch/WebFetch)** | Before web research | Checks `find_similar_queries()` first |
| **PostToolUseFailure(Bash/Edit)** | After tool errors | Suggests `get_error_solutions()` |

## Commands

| Command | Description |
|---------|-------------|
| `/search-historian <query>` | Search past sessions for solutions, decisions, context |

## Workflows

### Before Planning

Check past plans before entering plan mode:

1. `search_plans(query="feature or project name")` — find past approaches
2. Review architectural decisions and rationale
3. Use findings to avoid re-research

### Before Web Research

The hook handles this automatically, but you can also invoke manually:

1. `find_similar_queries(query="query")` — check if already researched
2. If found: use past results, skip web search
3. If not: proceed with research

### Before Launching Agents

Check past agent workflows for effective patterns:

1. `find_tool_patterns()` — successful agent workflows
2. Review what agent types and prompts worked well
3. Use findings to craft better agent prompts

### Error Resolution

1. `get_error_solutions(query="error pattern")` — how was this fixed before?
2. If found: apply the previous solution
3. If not: proceed with normal debugging

### General Search

1. `search_conversations(query="query")` — full-text across all sessions
2. `find_file_context(filepath="filename")` — track file changes across sessions
3. `list_recent_sessions()` — browse recent work

## MCP Tools Reference

| Tool | Purpose |
|------|---------|
| `search_conversations` | Full-text search across session history |
| `find_similar_queries` | Find related past questions (semantic) |
| `get_error_solutions` | Find how errors were previously fixed |
| `search_plans` | Find past implementation plans |
| `find_file_context` | Track file changes across sessions |
| `find_tool_patterns` | Discover successful tool workflows |
| `list_recent_sessions` | Browse recent work sessions |
| `inspect` | Deep summary of a specific session |
| `search_config` | Search .claude rules, skills, agents |
| `extract_compact_summary` | Extract compact summary from session |

## Requires

```
claude mcp add historian -- npx claude-historian-mcp
```

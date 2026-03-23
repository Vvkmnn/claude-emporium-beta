---
name: claude-oracle
description: Automatic tool discovery across 19 sources — INVOKE before planning, before adding dependencies, or when looking for tools to discover relevant skills, plugins, and MCP servers
triggers: []
---

# Oracle Plugin

Tool discovery. Searches 19 sources in parallel to find relevant skills, plugins, and MCP servers.

## Commands

| Command | Description |
|---------|-------------|
| `/search-oracle <query> [type]` | Search for tools across all 19 sources |

## Workflows

### Before Planning

1. `oracle_search("project or feature name")` — find relevant tools
2. Review results with install commands
3. Install useful tools before proceeding

### Discovery

1. `oracle_search("query")` — search all sources
2. `oracle_browse(category="testing")` — browse by category
3. `oracle_sources()` — check data source status

## MCP Tools Reference

| Tool | Purpose |
|------|---------|
| `oracle_search` | Search all sources by query |
| `oracle_browse` | Browse by category or popularity |
| `oracle_sources` | Check data source status |

---
name: claude-oracle
description: Automatic tool discovery across 17 sources — INVOKE before planning to discover relevant skills, plugins, and MCP servers
triggers: []
---

# Oracle Plugin

Tool discovery. Searches 17 sources in parallel to find relevant skills, plugins, and MCP servers.

## Commands

| Command | Description |
|---------|-------------|
| `/search-oracle <query> [type]` | Search for tools across all 17 sources |

## Workflows

### Before Planning

Discover relevant tools before entering plan mode:

1. `search("project or feature name")` — find relevant tools
2. Review results with install commands
3. Install useful tools before proceeding with the plan

### Discovery

1. `search("query")` — search all sources
2. `browse(category="testing")` — browse by category
3. `sources()` — check data source status
4. Install useful tools: skills, plugins, or MCP servers

## Data Sources (17)

Smithery Registry, Glama.ai, Official MCP Registry, npm, GitHub marketplace plugins, awesome-mcp-servers, awesome-mcp-lists, awesome-claude-code (ccplugins), awesome-claude-code (jmanhype), awesome-agent-skills, Playbooks.com, SkillsMP, and more.

## MCP Tools Reference

| Tool | Purpose |
|------|---------|
| `search` | Search all sources by query |
| `browse` | Browse by category or popularity |
| `sources` | Check data source status |

## Requires

```
claude mcp add oracle -- npx claude-oracle-mcp
```

# Claude Oracle

Automatic discovery of skills, plugins, and MCP servers for Claude Code. Searches 19 sources in parallel to find relevant tools before you start planning or when you hit errors.

## Installation

```bash
/plugin marketplace add Vvkmnn/claude-emporium
/plugin install claude-oracle@claude-emporium
```

## Requirements

MCP server: [`claude-oracle-mcp`](https://www.npmjs.com/package/claude-oracle-mcp)

```bash
claude mcp add oracle -- npx claude-oracle-mcp
```

## Commands

| Command | Description |
|---------|-------------|
| `/search-oracle <query> [type]` | Search for tools across all sources |

## MCP Tools

| Tool | Purpose |
|------|---------|
| `search` | Search all sources for relevant tools |
| `browse` | Browse by category or popularity |
| `sources` | Show available data sources and status |

## Data Sources (19)

Smithery Registry, Glama.ai, Official MCP Registry, npm Registry, GitHub marketplace plugins, awesome-mcp-servers (wong2), awesome-mcp-lists (collabnix), awesome-claude-code (ccplugins), awesome-claude-code (jmanhype), awesome-agent-skills, Playbooks.com, SkillsMP, GitHub search (query-based), web search (query-based).

## How It Works

The `/search-oracle` command and MCP tools search 19 sources in parallel to find relevant skills, plugins, and MCP servers. Results include install commands so you can immediately add useful tools.

Zero setup — no databases, no local storage. All search is computed in-memory with TTL caching.

## License

MIT

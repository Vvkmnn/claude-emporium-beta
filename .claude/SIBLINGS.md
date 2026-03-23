# MCP Sibling Standards

Standards for all 7 claude-*-mcp project READMEs. Each project is unique in what it does, but identical in how it presents itself.

---

## Section Order

```
<img> SVG logo (align="right", width="220")
# claude-[PROJECT]-mcp
description paragraph
<br clear="right">
![demo GIF](demo/demo.gif)
badge line
---
intro paragraph (optional, project-specific)
## install
## [skill](.claude/skills/claude-[PROJECT])
## [plugin](https://github.com/Vvkmnn/claude-emporium)
## features
## methodology
## alternatives (vigil + orator only)
## development
## license
footer painting
```

All headings lowercase. No heading has a colon.

## Logo

SVG file at repo root: `claude-[PROJECT].svg`

```html
<img align="right" src="claude-[PROJECT].svg" alt="claude-[PROJECT]-mcp" width="220">
```

Same dimensions and alignment across all 7. The `alt` is always the full repo name.

## Description Paragraph

Always line 5. Pattern:

```
An [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for [PURPOSE] in [Claude Code](https://docs.anthropic.com/en/docs/claude-code). [UNIQUE_SUMMARY].
```

Both links (MCP spec + Claude Code docs) are present in every description. The purpose and summary are project-specific.

## Demo GIF

Immediately after `<br clear="right">`:

```markdown
![claude-[PROJECT]-mcp](demo/demo.gif)
```

### Recording

- Tool: `asciinema rec demo.cast` (v3.1.0+)
- Terminal theme: Tokyo Night (`#1a1b26` bg, `#c0caf5` fg), auto-embedded in .cast
- Directory: `demo/` with `demo.cast`, `demo.gif`, optionally `DEMO_SCRIPT.md`

### Conversion

```bash
agg --font-size 10 --fps-cap 8 --idle-time-limit 2 --speed 1.5 --rows 35 demo.cast demo.gif
gifsicle -O3 --lossy=80 --colors 64 demo.gif -o demo.gif
```

- Praetorian exception: `--speed 2` (longer recording needs faster playback)
- Oracle's `DEMO_SCRIPT.md` says `--font-size 14 --theme monokai` -- that's outdated; the above is canonical

## Badge Line

Single line, no breaks. Always this order:

1. npm version
2. MIT license
3. TypeScript
4. Node.js >=20
5. Claude (color: D97757)
6. GitHub stars

Historian additionally has a CodeRabbit badge (after GitHub stars).

## Install Section

### Requirements badge

Clawd mascot as base64-encoded SVG in the badge. Identical across all 7.

### From shell

```markdown
**From shell:**

\`\`\`bash
claude mcp add claude-[PROJECT]-mcp -- npx claude-[PROJECT]-mcp
\`\`\`
```

Colon **inside** bold: `**From shell:**`

### From inside Claude

```markdown
**From inside Claude** (restart required):

\`\`\`
Add this to our global mcp config: npx claude-[PROJECT]-mcp

Install this mcp: https://github.com/Vvkmnn/claude-[PROJECT]-mcp
\`\`\`
```

Plain code block (no language tag). Two lines inside.

### From mcp.json

```markdown
**From any manually configurable `mcp.json`**: (Cursor, Windsurf, etc.)
```

Colon **outside** bold. mcp.json key is the full package name `"claude-[PROJECT]-mcp"`.

### No npm install line

```markdown
There is **no `npm install` required** -- [project-specific reason].
```

Each project has a unique reason:
- gladiator: "no external dependencies or local databases, only clustering algorithms"
- historian: "no external dependencies or local databases, only search algorithms"
- oracle: "no external dependencies or local databases, only search algorithms"
- orator: "no external dependencies or databases, only deterministic heuristics"
- praetorian: "no external databases or services, only flat files"
- augur: "no external databases, no indexing, only Node.js built-ins for filesystem access"
- vigil: "no external databases, no indexing, only Node.js built-ins for crypto, compression, and filesystem"

### Force resolution paragraph

All 7 include this after the "no npm install" line:

```markdown
However, if `npx` resolves the wrong package, you can force resolution with:

\`\`\`bash
npm install -g claude-[PROJECT]-mcp
\`\`\`
```

## Skill Section

- Heading links to local skill directory: `## [skill](.claude/skills/claude-[PROJECT])`
- Install command: `npx skills add Vvkmnn/claude-[PROJECT]-mcp --skill claude-[PROJECT] --global`
- Comment line: `# Optional: add --yes to skip interactive prompt and install to all agents`
- Skill description paragraph: unique per project, explains what the skill teaches Claude
- Closing: "The MCP works without the skill, but the skill improves discoverability."

## Plugin Section

- Heading links to emporium: `## [plugin](https://github.com/Vvkmnn/claude-emporium)`
- Intro line: unique per project ("For automatic X with hooks and commands, install from the claude-emporium marketplace:")
- Two install commands in bash block:
  ```
  /plugin marketplace add Vvkmnn/claude-emporium
  /plugin install claude-[PROJECT]@claude-emporium
  ```
- `The **claude-[PROJECT]** plugin provides:`
- Hooks listed with **bold label** + parenthetical descriptor + bullet items
- Commands listed: `**Commands:** /command-name`
- Closing: "Requires the MCP server installed first. See the emporium for other Claude Code plugins and MCPs."

### Plugin inventory

Each emporium plugin provides hooks and commands. The MCP README describes these but the hooks/commands live in the emporium, not the MCP repo.

| Project | Hooks | Commands |
|---------|-------|----------|
| augur | -- (no plugin yet) | -- |
| gladiator | PostToolUse (Bash/Edit/Write errors), Stop (session end) | `/review-gladiator` |
| historian | PreToolUse (WebSearch/WebFetch, EnterPlanMode), Stop (session end) | `/search-historian` |
| oracle | PreToolUse (EnterPlanMode), PostToolUse (Bash errors) | `/search-oracle` |
| orator | PreToolUse (Task) | `/reprompt-orator` |
| praetorian | PreToolUse (EnterPlanMode), PreCompact, PostToolUse (WebFetch/WebSearch), SubagentStop | `/praetorian-compact`, `/praetorian-restore`, `/praetorian-search` |
| vigil | PreToolUse (Bash -- destructive commands) | `/save-vigil`, `/restore-vigil` |

### MCP vs Plugin boundary

An MCP provides **tools only** -- functions Claude can call. A plugin provides **hooks** (automatic triggers on events) and **commands** (slash commands the user invokes). The README's features section describes MCP tools. The plugin section describes hooks and commands. Never mix these -- don't present plugin hooks as MCP features.

## Features Section

Opens with a one-line summary, always starting with "[MCP server](...) that..." linking to modelcontextprotocol.io:

```markdown
[MCP server](https://modelcontextprotocol.io/) that gives Claude [CAPABILITY]. [DETAILS].
```

Then lists tools with `####` subheadings. Each tool shows example input/output in code blocks with the project's emoji/formatting.

## Methodology Section

Opens with:

```markdown
How [claude-[PROJECT]-mcp](https://github.com/Vvkmnn/claude-[PROJECT]-mcp) [works](https://github.com/Vvkmnn/claude-[PROJECT]-mcp/tree/main/src):
```

Contains an ASCII diagram showing the system architecture, followed by "Core techniques:" bullets linking to specific source files with line numbers, then architecture tree, disk usage table (where applicable), and other technical details.

The methodology diagram should only show MCP behavior. Plugin-only behavior (hooks) should not appear in the diagram.

## Code Conventions

### MCP repos (TypeScript)

All 7 MCP repos use identical tooling:
- **Prettier**: `printWidth: 100`, `singleQuote: true`, `trailingComma: "all"`, `tabWidth: 2`, `semi: true`, `endOfLine: "lf"`
- **ESLint**: TypeScript rules via `eslint.config.js`
- **Husky**: pre-commit runs lint-staged (prettier + eslint --fix)
- **TypeScript**: `target: ES2022`, `module: NodeNext`, `strict: true`

### File structure

Every `.ts` file starts with:
1. `#!/usr/bin/env node` (entry points only)
2. JSDoc block: project name, description, tool list
3. Imports: Node built-ins first, then SDK, then local
4. `// ── Section ─────` dividers (fill to ~68 chars with `─`)

Section divider format:
```typescript
// ── Section Name ─────────────────────────────────────────────────
```

### Source layout

```
src/
  index.ts    — Entry point: creates McpServer, imports tools, connects transport
  tools.ts    — Tool registration: exports registerTools(server) + SERVER_INSTRUCTIONS
  ...         — Project-specific modules (storage, search, render, etc.)
```

`tools.ts` exports:
- `registerTools(server: McpServer)` — registers all tools on a given server
- `SERVER_INSTRUCTIONS` — plain text instructions string (no emoji, no Unicode decorations)

`package.json` exports both:
```json
"exports": { ".": "./dist/index.js", "./tools": "./dist/tools.js" }
```

This enables the compositor (`claude-emporium-mcp`) to import all 7 into one process.

### Emporium plugins (JavaScript)

Hooks and utilities use CommonJS (`require`), no transpilation:
- `#!/usr/bin/env node` header on hook scripts
- JSDoc block: hook name, trigger event, matcher, token cost
- `const { readStdin, emit, loadSettings } = require('../lib/utils')` pattern
- Each plugin has its own `lib/utils.js` (cache isolation, no cross-plugin requires)

### Formatting rules

- Single quotes everywhere (TypeScript and JavaScript)
- Semicolons always
- Trailing commas in multiline
- 2-space indentation
- No em dashes in prose (see Dashes section below)
- No emoji or Unicode in SERVER_INSTRUCTIONS or code comments
- SERVER_INSTRUCTIONS: plain text, no markdown formatting, just line breaks and indentation

## Development Section

Opens with clone + build + test:

```bash
git clone https://github.com/Vvkmnn/claude-[PROJECT]-mcp && cd claude-[PROJECT]-mcp
npm install && npm run build
npm test
```

Then either a scripts table (vigil) or `**Package requirements:**` bullets (others). Includes pre-commit hooks via husky where applicable.

## License Section

```markdown
## license

[MIT](LICENSE)
```

## Dashes

No em dashes (`—`) in prose. Use proper punctuation instead:
- Colons for definitions/explanations: `**Bold label**: description`
- Commas or periods for clause separation
- `--` (double dash) for technical contexts: alt text, code comments, CLI flags

This applies to all prose, alt text, code comments, and descriptions. Em dashes inside code blocks (e.g. augur template output) are part of the format and should not be changed.

## Footer Painting

`<hr>` separator before painting image.

**Landscape** (gladiator, historian, orator, praetorian):

```html
<a href="[WIKI_URL]"><img src="logo/[FILE]" alt="[TITLE] -- [ARTIST]" width="100%"></a>
```

**Portrait** (oracle, vigil):

```html
<p align="center"><a href="[WIKI_URL]"><img src="logo/[FILE]" alt="[TITLE] -- [ARTIST]" width="340"></a></p>
```

**Caption** (all 7, centered, with blank lines for GitHub markdown rendering):

```html
<p align="center">

_**[Title](wiki_url)** by **[Artist](wiki_url)** (Year). Description._

</p>
```

The blank lines inside `<p align="center">` are required -- GitHub markdown won't render the italic/bold without them.

## Painting Inventory

| Project | Painting | Artist | Year | File | Orientation |
|---------|----------|--------|------|------|-------------|
| gladiator | Pollice Verso | Jean-Leon Gerome | 1872 | pollice-verso.jpg | landscape |
| historian | Appius Claudius Caecus in the Senate | Cesare Maccari | 1888 | appius-claudius.jpg | landscape |
| oracle | Aeneas and the Cumaean Sibyl | Claude Mellan | -- | oracle.jpg | portrait |
| orator | Cicero Denounces Catiline | Cesare Maccari | 1889 | maccari-cicero.jpg | landscape |
| augur | Tomb of the Augurs (fresco) | -- | ~530 BCE | tomb-of-the-augurs.jpg | landscape |
| praetorian | A Roman Emperor AD 41 | Lawrence Alma-Tadema | 1871 | praetorian-guard.jpg | landscape |
| vigil | Claudius Proclaimed Emperor | Charles Lebayle | 1886 | lebayle-claudius.jpg | portrait |

All paintings are in `logo/` directory. Alt text format: `"[TITLE] -- [ARTIST]"` (double dash).

## Deliberate Per-Project Differences

These are intentional and should not be "fixed":

- **Intro paragraphs**: Optional. Gladiator has research credits, vigil has problem statement with GitHub issue links. Others skip straight to install.
- **Vigil development section**: Uses a scripts table instead of bash code block (more scripts to document)
- **Historian**: Has a rename note (was `codex-mcp-historian`), `## desktop` section for Claude Desktop integration, pre-push hook in development, CodeRabbit badge
- **Augur**: No plugin section (standalone MCP only, plugin deferred). Single tool (`augur_explain`). No skill section yet.
- **Alternatives section**: Only vigil and orator have this (they have direct competitors worth mentioning)
- **No npm install reason**: Each project has a unique justification (see Install Section above)
- **Features tool count**: Each project lists its own tools with project-specific emoji formatting
- **Oracle env**: mcp.json includes optional `SKILLSMP_API_KEY` env var (only project with one)

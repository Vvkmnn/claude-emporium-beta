---
name: claude-gladiator
description: Continuous learning — hooks observe failures and prompt reflection, INVOKE after sessions with many errors or corrections
triggers: [PostToolUseFailure, Stop]
---

# Gladiator Plugin

Continuous learning. Observes tool failures and prompts reflection to evolve rules, hooks, and skills.

## Hooks

| Hook | When | Action |
|------|------|--------|
| **PostToolUseFailure(Bash/Edit)** | After tool failure | Observes the error pattern (silent on success) |
| **Stop** | Session ending | Prompts reflection if >= 10 unprocessed observations |

## Commands

| Command | Description |
|---------|-------------|
| `/review-gladiator [topic]` | Batch learn from accumulated observations and session history |

## Workflows

### Observe (automatic via hooks)

Tool failures trigger observation automatically. After fixing an error, record what worked:

```
gladiator_observe(
  summary: "<what failed and how it was fixed>",
  context: {error, tool, before, after},
  tags: ["error", "<tool_name>"]
)
```

### Reflect

1. `gladiator_reflect()` — cluster observations into recommendations
2. For each recommendation: read the existing artifact (if overlap detected)
3. Propose UPDATE to existing artifact, not a new duplicate
4. Present to user with reasoning
5. Apply changes one at a time after approval

### Batch Review (/review-gladiator)

1. Review accumulated observations across sessions
2. `gladiator_reflect()` to cluster all observations
3. Present recommendations to user
4. Apply updates to existing rules/skills/hooks

## Observation Templates

| Situation | Call |
|-----------|------|
| Tool failure (auto) | `gladiator_observe(summary, context={error, tool, before, after}, tags=["error", tool])` |
| User correction | `gladiator_observe(summary, context={before, after}, tags=["correction"])` |
| Convention found | `gladiator_observe(summary, tags=["convention", "domain"])` |
| Decision made | `gladiator_observe(summary, tags=["architecture", "decision"])` |

## Requires

```
claude mcp add gladiator -- npx claude-gladiator-mcp
```

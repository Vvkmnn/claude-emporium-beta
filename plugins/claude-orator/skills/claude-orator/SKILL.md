---
name: claude-orator
description: Prompt rhetoric coach — deterministic scoring and restructuring using Anthropic best practices
triggers: [PreToolUse]
---

# Orator Plugin

Prompt optimization. Scores prompts across 7 dimensions and restructures them using 8 Anthropic techniques. Deterministic — no LLM calls, no network, in-memory only.

## Hooks

| Hook | When | Action |
|------|------|--------|
| **PreToolUse(Task)** | Subagent prompt lacks structure | Suggests `orator_optimize` before dispatching |

Token cost: 0 on well-structured prompts (XML tags, markdown headers, action verbs). ~25 on vague prompts.

## Commands

| Command | Description |
|---------|-------------|
| `/reprompt-orator <prompt>` | Optimize a prompt using Anthropic best practices |

## Workflows

### Optimize

1. `/reprompt-orator "your prompt here"` or call `orator_optimize(prompt: "...")`
2. Review score breakdown (7 dimensions, 1-10 each)
3. Use the restructured prompt with applied techniques

## MCP Tools Reference

| Tool | Purpose |
|------|---------|
| `orator_optimize` | Score prompt across 7 dimensions, apply techniques, return restructured version |

## Scoring Dimensions

Clarity · Specificity · Structure · Context · Examples · Constraints · Tone (each 1-10)

## Techniques

System prompts · XML tags · Chain of thought · Few-shot · Prefill · Long context · Extended thinking · Tool use

## Storage

In-memory only. Zero disk storage. No databases, no external services.

## Requires

```
claude mcp add orator -- npx claude-orator-mcp
```

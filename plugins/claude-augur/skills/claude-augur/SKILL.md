---
name: claude-augur
description: Use after writing or editing a plan file, after exiting plan mode, or when asked "why did you choose this?" — surfaces decisions, risks, and blind spots before implementation.
---

# Claude Augur

Surface plan reasoning as scannable inline abstracts. Decisions, risks, discoveries, recommendations — visible at a glance.

## When to Use

- After writing or editing a plan file
- When the user asks to explain or summarize a plan
- When the user asks "why did you choose this approach?"
- After plan mode exits with a new or updated plan

## Quick Reference

| Tool | Purpose |
|------|---------|
| `augur_explain` | Extract plan structure and return a template for inline rendering |

## Workflow

1. Write or edit a plan file
2. `augur_explain(plan_path: "/path/to/plan.md")`
3. MCP returns a one-line summary + template with `[FILL]` markers
4. Render the filled template **inline in your response** (not in a code block)
5. **Discuss** your recommendations and questions with the user

## Template Format

MCP pre-renders the header band (title + progress bar) and purpose. You fill 6 sections:

- **Decisions** — `✓ chose X → reason` / `~ uncertain` / `? risky guess`
- **Risks** — `⚠ If X → Y` plain English sentences
- **Discoveries** — `★ things found during exploration not in the plan`
- **Questions** — `◆ questions the user needs to answer`
- **Trade-offs** — 3-column: `+ gain │ − lose │ · skip`
- **Recommendations** — `→ investigate, weak spots, quick wins, plan gaps`

## Rules

- 80 chars wide, ~25 lines total
- Minimal words — plain English a child could read
- Be ADVERSARIAL — surface doubts, not confidence
- After rendering: discuss recommendations and questions as a conversation
- Render inline, never in a code block

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Rendering in a code block | Include the template directly in your response text |
| Restating the plan | Surface what ISN'T in the plan |
| Silent rendering | Discuss recommendations and questions with the user after |
| Verbose text | One short line per item, minimal words |

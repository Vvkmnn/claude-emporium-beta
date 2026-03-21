---
name: claude-praetorian
description: Cross-session memory - save insights after research, restore context at session start. Reduces re-exploration and prevents token waste.
triggers: [PreToolUse, PostToolUse, SubagentStop, PreCompact]
---

# Praetorian Plugin

Context guard with automatic workflow nudges. Hooks fire at natural decision points — you decide whether to act on them.

## How Hooks Work

Hooks emit one-line nudges (~20 tokens each). No disk I/O. You judge relevance.

| Hook | When It Fires | What It Says | Your Call |
|------|--------------|--------------|-----------|
| **PreToolUse** | Before Task, WebSearch, WebFetch | "Check restore — prior context may exist" | Restore if topic is familiar. Skip if clearly novel. |
| **PostToolUse** | After WebFetch, WebSearch | "Save key findings" | Compact research results. Reuse title to merge. |
| **SubagentStop** | After subagent completes | "Save key findings" | Compact subagent results. Don't let findings die with the agent. |
| **PreCompact** | Before any compact call | "Reuse title to merge" | Always follow — prevents duplicate compactions. |

### Reading Hook Nudges

When you see `⚜️ Check praetorian_restore(query="...")`:
1. Is this a topic you've worked on before? → Restore (summary mode first)
2. Is the summary hit relevant? → Restore again with `detail="full"`
3. Clearly novel topic? → Skip, proceed with research

When you see `⚜️ Save key findings: praetorian_compact(...)`:
1. Compact with existing title to merge — don't wait for "enough" findings
2. Routine result, nothing novel? → Skip

## Workflow: restore → work → compact

### Phase 1: Restore (Before Work)

```
praetorian_restore(query="auth JWT")                    # summary scan (~50 tokens/result)
praetorian_restore(query="auth JWT", detail="full")     # full detail for relevant hit
praetorian_restore(project="current")                   # scope to this project
praetorian_restore()                                    # recent compactions
```

**Hooks handle:** PreToolUse nudges before Task/WebSearch/WebFetch.
**You handle manually:** Before planning sessions, before launching subagents, at session start, after `/clear`.

### Phase 2: Work

Do your research, run subagents, make decisions. Hooks will nudge after.

### Phase 3: Compact (After Valuable Findings)

```
praetorian_compact(type="web_research", title="auth JWT research",
  key_insights=["JWT rotation every 15min", "RS256 preferred over HS256"],
  refs=["src/auth/middleware.ts:45"])
```

**Hooks handle:** PostToolUse nudges after WebSearch/WebFetch, SubagentStop nudges after agents.
**You handle manually:** After subagents return, after multi-file exploration, after solving a hard problem. Don't wait — compact incrementally.

**Critical:** Always reuse an existing title to merge. Creating a new compaction costs 1 of 13 slots per project. Merging is free.

### Phase 4: Manage (When Needed)

```
praetorian_manage(action="status")              # per-project counts, disk usage
praetorian_manage(action="prune", count=3)      # remove 3 oldest
praetorian_manage(action="prune", project="/path/to/old-project")
```

Auto-limit: 13 per project. Oldest auto-pruned when exceeded.
Only surface to user when >50 total or >500KB. If store is healthy, stay quiet.

## Sibling Plugin Synergy

When historian is active, check historian FIRST for conversation-level context, then praetorian for distilled insights. They complement:
- **Historian** = raw session transcripts, broad search
- **Praetorian** = curated insights, structured and compact

When vigil is active, vigil handles file checkpoints. Praetorian handles knowledge checkpoints. Don't duplicate — vigil saves files, praetorian saves understanding.

## Compaction Quality

**Good compaction:**
- Specific title matching the topic (enables auto-merge)
- 3-5 key_insights that save future research time
- File:line refs that anchor claims to code
- Decisions with rationale (chose X over Y because Z)

**Bad compaction:**
- Vague title like "research findings"
- Restating what's obvious from the code
- Raw content dump without distillation
- Creating new when a merge-able compaction exists

## Token Discipline

- **Summary first**: Default restore is ~50 tokens/result. Full restore only for confirmed hits.
- **Selective compaction**: One well-maintained compaction > five stale ones.
- **Skip when irrelevant**: Hook nudge about "cooking recipes" when working on auth? Skip.
- **Don't flood**: 3 compactions/session is typical. 10+ means you're not merging enough.

## Commands

| Command | Description |
|---------|-------------|
| `/compact-praetorian [type] [title]` | Save current context |
| `/restore-praetorian [query]` | Load previous context |

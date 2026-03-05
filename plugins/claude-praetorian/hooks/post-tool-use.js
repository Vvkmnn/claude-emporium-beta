#!/usr/bin/env node
/**
 * Post-Tool-Use Hook — WRITE nudge
 *
 * Fires after WebFetch, WebSearch (PostToolUse) and after subagents (SubagentStop).
 * Nudges Claude to update existing compactions with new findings.
 * No disk I/O — just a one-line nudge (~20 tokens).
 */

const { readStdin, emit, loadSettings } = require('../lib/utils');

(async () => {
  const data = await readStdin();
  if (!data) process.exit(0);

  const settings = loadSettings('claude-praetorian');
  if (!settings.hooks?.post_tool_use) process.exit(0);

  const hookEvent = data.hook_event_name || 'PostToolUse';
  const type = hookEvent === 'SubagentStop' ? 'task_result' : 'web_research';
  emit(`⚜️ If findings are valuable, update existing compaction: praetorian_compact(type="${type}"). Reuse existing title to merge, or create new only if topic is genuinely different.`, hookEvent);
})();

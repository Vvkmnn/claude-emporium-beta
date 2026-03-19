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
  const isSubagent = hookEvent === 'SubagentStop';
  const type = isSubagent ? 'task_result' : 'web_research';
  const verb = isSubagent ? 'Subagent completed.' : 'Research done.';
  emit(`⚜️ ${verb} Save key findings: praetorian_compact(type="${type}", title="<topic>"). Reuse title to merge.`, hookEvent);
})();

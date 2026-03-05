#!/usr/bin/env node
/**
 * Pre-Tool-Use Hook — READ nudge
 *
 * Fires before Task, WebSearch, WebFetch.
 * Extracts topic from stdin and nudges Claude to check praetorian_restore().
 * No disk I/O — just a one-line nudge (~20 tokens).
 */

const { readStdin, emit, loadSettings } = require('../lib/utils');

(async () => {
  const data = await readStdin();
  if (!data) process.exit(0);

  const settings = loadSettings('claude-praetorian');
  if (!settings.hooks?.pre_tool_use) process.exit(0);

  const { tool_input, tool_name } = data;
  const query = tool_input?.prompt || tool_input?.query || tool_input?.url || '';
  if (!query || query.length < 10) process.exit(0);

  const topic = query.substring(0, 80);
  if (tool_name === 'Task') {
    emit(`⚜️ Check praetorian_restore(query="${topic}") — prior context may exist for this work.`, 'PreToolUse');
  } else {
    emit(`⚜️ Check praetorian_restore(query="${topic}", type="web_research") — you may already know this.`, 'PreToolUse');
  }
})();

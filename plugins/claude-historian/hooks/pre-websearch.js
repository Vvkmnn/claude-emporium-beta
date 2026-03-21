#!/usr/bin/env node
/**
 * Pre-WebSearch Hook - Check historian before web research
 *
 * Triggers: PreToolUse(WebSearch|WebFetch)
 * Token cost: ~30 per web call.
 */

const { readStdin, emit, loadSettings, hasSibling } = require('../lib/utils');

(async () => {
  const data = await readStdin();
  if (!data) process.exit(0);

  const settings = loadSettings('claude-historian');
  if (!settings.hooks.pre_websearch) process.exit(0);

  if (hasSibling('praetorian')) process.exit(0);

  const { tool_input } = data;
  const query = tool_input?.query || tool_input?.url || tool_input?.prompt || '';

  emit(`📜 Check search(query="${(query || 'topic').substring(0, 50)}", scope="similar") — may already have this.`, 'PreToolUse');
})();

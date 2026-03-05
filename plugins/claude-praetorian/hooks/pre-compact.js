#!/usr/bin/env node
/**
 * Pre-Compact Hook — merge nudge
 *
 * Fires before any praetorian_compact call.
 * Reminds Claude to reuse existing compaction titles to merge, not create duplicates.
 */

const { readStdin, emit, loadSettings } = require('../lib/utils');

(async () => {
  await readStdin(); // drain stdin

  const settings = loadSettings('claude-praetorian');
  if (!settings.hooks?.pre_compact) process.exit(0);

  emit(`⚜️ Update existing compactions by reusing their title. Only create new if topic is genuinely different.`, 'PreCompact');
})();

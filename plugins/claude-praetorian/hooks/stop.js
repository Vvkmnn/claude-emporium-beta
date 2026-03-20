#!/usr/bin/env node
/**
 * Stop Hook — compact nudge at turn end
 *
 * Triggers: Stop(*)
 * Checks last_assistant_message for research/discovery keywords.
 * If found, nudges praetorian_compact via systemMessage.
 * Silent exit on routine turns (~0ms overhead).
 */

const { readStdin, loadSettings } = require('../lib/utils');

const RESEARCH_KEYWORDS = /\b(found|discovered|investigated|explored|researched|analyzed|learned|determined|confirmed|identified)\b/i;

(async () => {
  const data = await readStdin();
  if (!data) process.exit(0);

  const settings = loadSettings('claude-praetorian');
  if (!settings.hooks?.stop) process.exit(0);

  const msg = data.last_assistant_message || '';
  if (msg.length < 50 || !RESEARCH_KEYWORDS.test(msg)) process.exit(0);

  console.log(JSON.stringify({
    systemMessage: `⚜️ Findings detected — save with praetorian_compact(type="task_result", title="<topic>"). Reuse title to merge.`,
  }));
})();

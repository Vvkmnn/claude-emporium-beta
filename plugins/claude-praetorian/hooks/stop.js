#!/usr/bin/env node
/**
 * Stop Hook — force compact at turn end
 *
 * Triggers: Stop(*)
 * Checks last_assistant_message for research/discovery keywords.
 * If found, BLOCKS Claude from stopping until it compacts findings.
 * Includes existing compaction titles so Claude can merge, not duplicate.
 * Silent exit on routine turns (~0ms overhead).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { readStdin, loadSettings } = require('../lib/utils');

const INDEX_PATH = path.join(os.homedir(), '.claude', 'praetorian', 'index.json');
const RESEARCH_KEYWORDS = /\b(found|discovered|investigated|explored|researched|analyzed|learned|determined|confirmed|identified)\b/i;

function getExistingTitles(cwd) {
  try {
    const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
    return Object.values(index.compactions || {})
      .filter(c => !c.project || c.project === cwd)
      .map(c => c.title)
      .slice(0, 5);
  } catch { return []; }
}

(async () => {
  const data = await readStdin();
  if (!data) process.exit(0);

  const settings = loadSettings('claude-praetorian');
  if (!settings.hooks?.stop) process.exit(0);
  if (data.stop_hook_active) process.exit(0);

  const msg = data.last_assistant_message || '';
  if (msg.length < 50 || !RESEARCH_KEYWORDS.test(msg)) process.exit(0);
  if (/praetorian_compact/i.test(msg)) process.exit(0);

  const titles = getExistingTitles(data.cwd || '');
  const titleHint = titles.length
    ? ` Existing titles to merge into: ${titles.map(t => `"${t}"`).join(', ')}.`
    : '';

  console.log(JSON.stringify({
    decision: 'block',
    reason: `Save findings with praetorian_compact(type="task_result", title="<topic>").${titleHint} Reuse an existing title to merge, or create new only if topic is genuinely different.`,
  }));
})();

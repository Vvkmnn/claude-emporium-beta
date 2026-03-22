#!/usr/bin/env node
/**
 * Stop Hook — nudge compact at turn end
 *
 * Triggers: Stop(*)
 * Checks last_assistant_message for research findings.
 * Uses systemMessage (not decision:block — that silently no-ops).
 * Includes existing titles so Claude merges, not duplicates.
 * Silent exit on routine turns.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { readStdin, loadSettings } = require('../lib/utils');

const INDEX_PATH = path.join(os.homedir(), '.claude', 'praetorian', 'index.json');

// Routine patterns — always skip these (false positives)
const ROUTINE = [
  /\bFound\s+\d+\s+(compaction|result|match|file|error|session)/i,
  /returns\s+(exit\s+)?\d+\s+when.{0,30}found/i,
  /^(Done|Pushed|Complete|Fixed|Updated|Committed|Built)\b/m,
  /^All\s+\d+\s+\w+\s+(complete|done|finished|passing)/im,
  /Everything.{0,20}(working|up.to.date|clean)/i,
];

// Require subject + research verb (not bare "found")
const RESEARCH = /\b(I\s+(found|discovered|confirmed|identified|determined|investigated)|the\s+(audit|investigation|analysis|research|exploration)\s+(found|revealed|showed|identified|uncovered))\b/i;

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
  if (msg.length < 200) process.exit(0);
  if (ROUTINE.some(p => p.test(msg))) process.exit(0);
  if (!RESEARCH.test(msg)) process.exit(0);
  if (/praetorian_compact/i.test(msg)) process.exit(0);

  const titles = getExistingTitles(data.cwd || '');
  const titleHint = titles.length
    ? ` Existing titles: ${titles.map(t => `"${t}"`).join(', ')}.`
    : '';

  console.log(JSON.stringify({
    systemMessage: `Save findings with praetorian_compact(type="task_result", title="<topic>").${titleHint} Reuse title to merge.`,
  }));
})();

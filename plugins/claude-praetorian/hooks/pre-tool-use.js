#!/usr/bin/env node
/**
 * Pre-Tool-Use Hook — context-aware restore nudge
 *
 * Fires before Task, WebSearch, WebFetch.
 * Reads existing compaction titles to make the nudge actionable.
 * No heavy I/O — index.json is a small JSON file (~1KB).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { readStdin, emit, loadSettings, hasSibling } = require('../lib/utils');

const INDEX_PATH = path.join(os.homedir(), '.claude', 'praetorian', 'index.json');

function getRelevantTitles(cwd, topic) {
  try {
    const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
    const compactions = Object.values(index.compactions || {});
    // Prefer current project, then all
    const relevant = compactions
      .filter(c => !c.project || c.project === cwd)
      .map(c => c.title)
      .slice(0, 3);
    return relevant;
  } catch { return []; }
}

(async () => {
  const data = await readStdin();
  if (!data) process.exit(0);

  const settings = loadSettings('claude-praetorian');
  if (!settings.hooks?.pre_tool_use) process.exit(0);

  const { tool_input, tool_name } = data;
  const query = tool_input?.prompt || tool_input?.query || tool_input?.url || '';
  if (!query || query.length < 10) process.exit(0);

  const topic = query.substring(0, 80);
  const titles = getRelevantTitles(data.cwd || '', topic);

  if (titles.length === 0) process.exit(0); // nothing to restore

  const titleList = titles.map(t => `"${t}"`).join(', ');
  const historianNote = hasSibling('historian') ? ` Also check search(query="${topic.substring(0, 40)}", scope="similar").` : '';

  if (tool_name === 'Task') {
    emit(`Check praetorian_restore(query="${topic}") — prior context exists: ${titleList}.${historianNote}`, 'PreToolUse');
  } else {
    emit(`Check praetorian_restore(query="${topic}", type="web_research") — prior context exists: ${titleList}.${historianNote}`, 'PreToolUse');
  }
})();

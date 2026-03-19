#!/usr/bin/env node
/**
 * Stop Hook - Reflect on unprocessed observations before session ends
 *
 * Triggers: Stop(*)
 * Only fires when >= 10 unprocessed observations (reduces noise).
 * Uses systemMessage format (not hookSpecificOutput).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { readStdin, loadSettings } = require('../lib/utils');

const OBSERVATIONS_PATH = path.join(os.homedir(), '.claude', 'gladiator', 'observations.jsonl');

(async () => {
  await readStdin(); // drain stdin

  const settings = loadSettings('claude-gladiator');
  if (!settings.hooks.stop) {
    process.exit(0);
  }

  let unprocessed = 0;
  try {
    const content = fs.readFileSync(OBSERVATIONS_PATH, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const obs = JSON.parse(line);
        if (!obs.processed) unprocessed++;
      } catch { /* skip malformed */ }
    }
  } catch { /* file missing = 0 unprocessed, fall through */ }

  if (unprocessed < 10) {
    process.exit(0);
  }

  console.log(JSON.stringify({
    systemMessage: `⚔️ ${unprocessed} patterns observed — reflect to help Claude learn and improve: gladiator_reflect()`,
  }));
})();

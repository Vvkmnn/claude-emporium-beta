#!/usr/bin/env node
/**
 * Stop Hook - Reflect on unprocessed observations before session ends
 *
 * Triggers: Stop(*)
 * Checks ~/.claude/gladiator/observations.jsonl for unprocessed observations.
 * If none exist, approves silently (zero tokens).
 * Never blocks stop — decision is always "approve".
 *
 * Settings: hooks.stop (default: true)
 * Synergy: suggests historian enrichment and oracle discovery during reflection.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { readStdin, loadSettings, shouldSuggestSiblings, siblings } = require('../lib/utils');

const OBSERVATIONS_PATH = path.join(os.homedir(), '.claude', 'gladiator', 'observations.jsonl');

function approve(message) {
  const output = {};
  if (message) output.systemMessage = message;
  console.log(JSON.stringify(output));
}

(async () => {
  await readStdin(); // drain stdin

  const settings = loadSettings('claude-gladiator');
  if (!settings.hooks.stop) {
    approve();
    process.exit(0);
  }

  // count unprocessed observations
  let unprocessed = 0;
  try {
    const content = fs.readFileSync(OBSERVATIONS_PATH, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const obs = JSON.parse(line);
        if (!obs.processed) unprocessed++;
      } catch { /* skip malformed lines */ }
    }
  } catch {
    // file doesn't exist or unreadable — nothing to reflect on
    approve();
    process.exit(0);
  }

  if (unprocessed === 0) {
    approve();
    process.exit(0);
  }

  const peer = siblings();
  const suggest = shouldSuggestSiblings();
  let synergy = '';
  if (peer.historian) {
    synergy += '\n📜 [claude-historian] is active — enrich reflection with search_conversations() and get_error_solutions().';
  }
  if (peer.oracle) {
    synergy += '\n🔮 [claude-oracle] is active — search for existing solutions before creating new artifacts.';
  }
  if (suggest && !peer.historian) {
    synergy += '\n📜 [claude-historian] could enrich reflection with past solutions → /install claude-historian@claude-emporium';
  }

  approve(`⚔️ [claude-gladiator] ${unprocessed} unprocessed observation${unprocessed === 1 ? '' : 's'} — consider reflecting before session ends.

gladiator_reflect()

Review clusters, propose updates to existing rules/skills/hooks (prefer updating over creating), and apply with user approval.${synergy}`);
})();

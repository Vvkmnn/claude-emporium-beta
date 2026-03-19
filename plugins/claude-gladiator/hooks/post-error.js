#!/usr/bin/env node
/**
 * Post-Error Hook - Observe tool failure patterns
 *
 * Triggers: PostToolUseFailure(Bash|Edit)
 * Token cost: ~30 on error, 0 on noise (grep/find exit 1).
 */

const { readStdin, emit, loadSettings, hasSibling } = require('../lib/utils');

const NOISE_PATTERNS = [
  /\bgrep\b.*exit code 1/i,
  /\brg\b.*exit code 1/i,
  /\bfind\b.*exit code 1/i,
  /\btest\b.*exit code 1/i,
  /\bls\b.*exit code/i,
  /\bcurl\b.*exit code/i,
  /\bwhich\b.*exit code/i,
  /\bcommand -v\b.*exit code/i,
  /\bgit diff\b.*exit code 1/i,
  /No files? matched/i,
  /no matches found/i,
];

(async () => {
  const data = await readStdin();
  if (!data) process.exit(0);

  const settings = loadSettings('claude-gladiator');
  if (!settings.hooks.post_error) process.exit(0);
  if (hasSibling('historian')) process.exit(0);

  const { tool_name, tool_input, error } = data;
  if (!error) process.exit(0);

  const errorStr = typeof error === 'string' ? error : JSON.stringify(error);
  const command = tool_input?.command || '';
  const combined = `${errorStr} ${command}`;
  if (NOISE_PATTERNS.some(p => p.test(combined))) process.exit(0);

  const displayError = errorStr.substring(0, 120);
  emit(`⚔️ ${tool_name} failed: ${displayError} — after fixing, run gladiator_observe() to record what worked.`, 'PostToolUseFailure');
})();

#!/usr/bin/env node
/**
 * Pre-Bash Hook - Auto-quicksave before destructive commands
 *
 * Triggers: PreToolUse(Bash)
 * Token cost: 0 on safe commands, ~30 on destructive.
 */

const { readStdin, emit, loadSettings } = require('../lib/utils');

const DESTRUCTIVE = /\b(rm|rmdir|mv|sed\s+-i|perl\s+-i)\b|git\s+(checkout|reset|clean|restore)\b|(?<![-\d])>\s*[^&\s]/;

(async () => {
  const input = await readStdin();
  if (!input) process.exit(0);

  const settings = loadSettings('claude-vigil');
  if (!settings.hooks.pre_bash) process.exit(0);

  const command = input?.tool_input?.command || '';
  if (!DESTRUCTIVE.test(command)) process.exit(0);

  const cmd = command.slice(0, 80) + (command.length > 80 ? '...' : '');
  emit(`🏺 Destructive command — run vigil_save(name="~quicksave") before: ${cmd}`, 'PreToolUse');
})();

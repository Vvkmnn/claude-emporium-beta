#!/usr/bin/env node
/**
 * Pre-Task Hook - Suggest prompt optimization before launching agents
 *
 * Triggers: PreToolUse(Task)
 * Heuristic check: skips well-structured prompts (XML tags, markdown headers, action verbs).
 * Token cost: 0 on well-structured prompts, ~25 on vague prompts.
 */

const { readStdin, emit, loadSettings } = require('../lib/utils');

(async () => {
  const data = await readStdin();
  if (!data) process.exit(0);

  const settings = loadSettings('claude-orator');
  if (!settings.hooks.pre_task) process.exit(0);

  const prompt = data?.tool_input?.prompt;
  if (!prompt || prompt.length < 50) process.exit(0);

  const hasStructure = /<\w+>/.test(prompt) || /^#{1,3}\s/m.test(prompt);
  const hasVerb = /^(write|create|implement|analyze|extract|find|search|review|fix|debug)\b/i.test(prompt);
  if (hasStructure || hasVerb) process.exit(0);

  emit(`🪶 Prompt lacks structure — run orator_optimize() before dispatching this agent.`, 'PreToolUse');
})();

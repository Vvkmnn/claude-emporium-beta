#!/usr/bin/env node
/**
 * Post-Subagent Hook - Compact findings when a subagent completes
 *
 * Triggers: SubagentStop
 * Prompts Claude to compact subagent results as task_result.
 *
 * Settings: hooks.post_subagent (default: true)
 */

const { readStdin, loadSettings, siblings, shouldSuggestSiblings } = require('../lib/utils');

(async () => {
  const data = await readStdin();

  const settings = loadSettings('claude-praetorian');
  if (!settings.hooks.post_subagent) process.exit(0);

  let context = '';
  if (data) {
    const agentType = data.subagent_type || data.agent_type || '';
    const description = data.description || '';

    if (agentType || description) {
      const desc = description.length > 60
        ? description.substring(0, 60) + '...'
        : description;
      context = agentType
        ? `\nAgent: ${agentType}${desc ? ` - "${desc}"` : ''}`
        : `\nTask: "${desc}"`;
    }
  }

  const peer = siblings();
  const suggest = shouldSuggestSiblings();
  let synergy = '';
  if (peer.historian) {
    synergy += '\n📜 [claude-historian] is active — search past agent patterns for comparison.';
  }
  if (peer.oracle) {
    synergy += '\n🔮 [claude-oracle] is active — search for tools relevant to what was discovered.';
  }
  if (suggest && !peer.historian) {
    synergy += '\n📜 [claude-historian] could search past agent patterns → /install claude-historian@claude-emporium';
  }

  console.log(JSON.stringify({
    systemMessage: `⚜️ [claude-praetorian] Subagent completed - compact findings.${context}\n\npraetorian_compact(type="task_result", title="<what was found>", key_insights=[...], refs=[...])\nExtract: findings, file:line refs, decisions made${synergy}`,
  }));
})();

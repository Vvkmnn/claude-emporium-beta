#!/usr/bin/env node
/**
 * Post-Plan Hook - Nudge augur_explain after plan file writes
 *
 * Triggers: PostToolUse(Write|Edit)
 * Only fires when file_path matches .claude/plans/*.md
 * Token cost: ~20 on match, 0 on non-plan files.
 */

const { readStdin, emit, loadSettings, hasSibling } = require('../lib/utils');

const PLAN_PATTERN = /\.claude\/plans\/.*\.md$/;

(async () => {
  const data = await readStdin();
  if (!data) process.exit(0);

  const settings = loadSettings('claude-augur');
  if (!settings.hooks.post_plan) process.exit(0);

  const filePath = data.tool_input?.file_path || '';
  if (!PLAN_PATTERN.test(filePath)) process.exit(0);

  const praetorianNote = hasSibling('praetorian')
    ? `\nThen compact key decisions: praetorian_compact(type="decisions", title="<plan-name>")`
    : '';
  emit(
    `\u{1f4d0} Plan file updated. Surface your reasoning:\n\naugur_explain(plan_path: "${filePath}")${praetorianNote}`,
    'PostToolUse'
  );
})();

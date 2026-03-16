#!/usr/bin/env python3
"""Generate the ASCII diagram for README.md.

Usage:
    python3 scripts/readme.py          # print to stdout
    python3 scripts/readme.py --inject  # inject into README.md
"""

import sys
import re


def pad(s, w):
    return s + " " * max(0, w - len(s))


IW = 20  # inner width per box (between │ and │)
BW = IW + 2  # box width including borders
NCOLS = 7
# outer width: ║ │ [box box box box box box box] │ ║
#              2+1+1 + 7*BW + 6*gap + 1+1+2
OW = 4 + NCOLS * BW + (NCOLS - 1) + 4


def outer(text=""):
    return "║ │ " + pad(text, OW - 8) + " │ ║"


def otop():
    return "╔═╤" + "═" * (OW - 6) + "╤═╗"


def obot():
    return "╚═╧" + "═" * (OW - 6) + "╧═╝"


def _cells(*args):
    """Build a row of 7 cells with given content."""
    cells = []
    for c in args:
        cells.append("│" + pad(c, IW) + "│")
    inner = " ".join(cells)
    return "║ │ " + pad(inner, OW - 8) + " │ ║"


def brow(c1, c2, c3, c4, c5, c6, c7):
    return _cells(" " + c1, " " + c2, " " + c3, " " + c4, " " + c5, " " + c6, " " + c7)


def btop():
    b = "┌" + "─" * IW + "┐"
    inner = (" ".join([b] * NCOLS))
    return "║ │ " + pad(inner, OW - 8) + " │ ║"


def bbot():
    b = "└" + "─" * IW + "┘"
    inner = (" ".join([b] * NCOLS))
    return "║ │ " + pad(inner, OW - 8) + " │ ║"


def bsep():
    b = "├" + "─" * IW + "┤"
    inner = (" ".join([b] * NCOLS))
    return "║ │ " + pad(inner, OW - 8) + " │ ║"


def arrows(char="│"):
    """Place arrow chars centered under each box."""
    inner_w = OW - 8
    line = list(" " * inner_w)
    for i in range(NCOLS):
        pos = i * (BW + 1) + BW // 2
        if pos < len(line):
            line[pos] = char
    return "║ │ " + "".join(line) + " │ ║"


E = " " * (IW - 1)  # empty cell content (padded by brow)


def generate():
    L = []

    L.append(otop())
    L.append(outer())
    L.append(outer("PLUGINS"))
    L.append(outer())

    # --- plugin boxes ---
    L.append(btop())
    L.append(brow("  PRAETORIAN       ", "  HISTORIAN        ", "  ORACLE           ", "  GLADIATOR        ", "  VIGIL            ", "  ORATOR           ", "  AUGUR            "))
    L.append(brow("context guard      ", "session memory     ", "tool discovery     ", "learn & adapt      ", "file recovery      ", "prompt rhetoric    ", "plan reasoning     "))
    L.append(bsep())
    L.append(brow("hooks              ", "hooks              ", "                   ", "hooks              ", "hooks              ", "hooks              ", "hooks              "))
    L.append(brow("· pre-tool-use     ", "· pre-websearch    ", "skills             ", "· post-error       ", "· pre-bash         ", "· pre-task         ", "· post-plan        "))
    L.append(brow("· post-tool-use    ", "· post-error       ", "· search-oracle    ", "· stop             ", "                   ", "                   ", "                   "))
    L.append(brow("· pre-compact      ", "                   ", "                   ", "                   ", "skills             ", "skills             ", "skills             "))
    L.append(brow("                   ", "skills             ", "                   ", "skills             ", "· save-vigil       ", "· reprompt-        ", "· explain-augur    "))
    L.append(brow("skills             ", "· search-          ", "                   ", "· review-          ", "· restore-vigil    ", "  orator           ", "                   "))
    L.append(brow("· compact-         ", "  historian        ", "                   ", "  gladiator        ", "                   ", "                   ", "                   "))
    L.append(brow("  praetorian       ", "                   ", "                   ", "                   ", "                   ", "                   ", "                   "))
    L.append(brow("· restore-         ", "                   ", "                   ", "                   ", "                   ", "                   ", "                   "))
    L.append(brow("  praetorian       ", "                   ", "                   ", "                   ", "                   ", "                   ", "                   "))
    L.append(bbot())

    # --- arrows ---
    L.append(arrows("│"))
    L.append(arrows("▼"))
    L.append(outer())

    # --- mcp boxes ---
    L.append(btop())
    L.append(brow("praetorian-mcp     ", "historian-mcp      ", "oracle-mcp         ", "gladiator-mcp      ", "vigil-mcp          ", "orator-mcp         ", "augur-mcp          "))
    L.append(bsep())
    L.append(brow("compact            ", "search_convos      ", "search             ", "observe            ", "vigil_save         ", "orator_optimize    ", "augur_explain      "))
    L.append(brow("· save context:    ", "· full-text across ", "· query 19 sources ", "· record patterns  ", "· named checkpoint ", "· score 7 dims     ", "· extract plan     "))
    L.append(brow("  research, flow,  ", "  all sessions     ", "  in parallel      ", "                   ", "                   ", "· apply 8 techs    ", "  structure        "))
    L.append(brow("  decisions        ", "                   ", "                   ", "reflect            ", "vigil_list         ", "· restructure      ", "· return template  "))
    L.append(brow("                   ", "get_error_solns    ", "browse             ", "· cluster and      ", "· show checkpoints ", "                   ", "  with [FILL]      "))
    L.append(brow("restore            ", "· how errors were  ", "· by category or   ", "  recommend        ", "                   ", "── ── ── ── ──     ", "                   "))
    L.append(brow("· search or list   ", "  resolved         ", "  popularity       ", "                   ", "vigil_diff         ", "dimensions:        ", "── ── ── ── ──     "))
    L.append(brow("  compactions by   ", "                   ", "                   ", "── ── ── ── ──     ", "· preview changes  ", "clarity            ", "template seeding:  "))
    L.append(brow("  query or type    ", "find_similar       ", "sources            ", "storage:           ", "                   ", "specificity        ", "MCP pre-renders    "))
    L.append(brow("                   ", "· related past     ", "· list registries  ", ".claude/           ", "vigil_restore      ", "structure          ", "· header + purpose "))
    L.append(brow("manage             ", "  questions        ", "  and status       ", "gladiator/         ", "· restore files    ", "context            ", "· progress counts  "))
    L.append(brow("· storage health   ", "                   ", "                   ", "                   ", "                   ", "examples           ", "Claude fills       "))
    L.append(brow("· prune stale      ", "find_file_context  ", "── ── ── ── ──     ", "                   ", "vigil_delete       ", "constraints        ", "· decisions        "))
    L.append(brow("                   ", "· track changes    ", "smithery · glama   ", "                   ", "· remove checkpoint", "tone               ", "· assumptions      "))
    L.append(brow("── ── ── ── ──     ", "                   ", "npm · github       ", "                   ", "                   ", "                   ", "· tradeoffs        "))
    L.append(brow("storage:           ", "find_tool_pattns   ", "awesome-mcp        ", "                   ", "── ── ── ── ──     ", "── ── ── ── ──     ", "                   "))
    L.append(brow(".claude/           ", "· agent workflows  ", "mcp-registry       ", "                   ", "storage:           ", "in-memory          ", "── ── ── ── ──     "))
    L.append(brow("praetorian/        ", "                   ", "+ 11 more          ", "                   ", ".claude/           ", "zero storage       ", "read-only          "))
    L.append(brow("                   ", "search_plans       ", "                   ", "                   ", "vigil/             ", "                   ", "zero storage       "))
    L.append(brow("                   ", "· past plans       ", "in-memory cache    ", "                   ", "                   ", "                   ", "                   "))
    L.append(brow("                   ", "                   ", "zero storage       ", "                   ", "                   ", "                   ", "                   "))
    L.append(brow("                   ", "list_recent        ", "                   ", "                   ", "                   ", "                   ", "                   "))
    L.append(brow("                   ", "· recent sessions  ", "                   ", "                   ", "                   ", "                   ", "                   "))
    L.append(bbot())

    L.append(outer())
    right_label = "MCP SERVERS"
    L.append("║ │ " + " " * (OW - 8 - len(right_label)) + right_label + " │ ║")
    L.append(obot())

    # validate
    widths = set(len(l) for l in L)
    assert len(widths) == 1, f"inconsistent widths: {widths}"

    return "\n".join(L)


def inject_readme(diagram):
    with open("README.md", "r") as f:
        content = f.read()

    pattern = r"```\n╔.*?╝\n```"
    replacement = "```\n" + diagram + "\n```"

    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    else:
        print("warning: could not find diagram block in README.md", file=sys.stderr)
        return

    with open("README.md", "w") as f:
        f.write(content)

    print(f"injected {len(diagram.splitlines())} lines into README.md")


if __name__ == "__main__":
    diagram = generate()

    if "--inject" in sys.argv:
        inject_readme(diagram)
    else:
        print(diagram)

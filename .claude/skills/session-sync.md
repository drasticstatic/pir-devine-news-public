---
name: session-sync
description: >
  Commit and push outstanding changes with a helpful, descriptive message — capturing what
  changed, why, and any relevant context. Run this whenever content or structure is updated
  and the user accepts the changes. Use when: "save this", "commit these changes", "push
  this", "checkpoint", "save progress", "session sync", "sync everything", "commit and push",
  or after any accepted content update. This is the PIR version-control assistant workflow —
  no AGENT_SYNC overhead, just clean history with good messages.
---

# Skill: /session-sync — De Vine News (PIR)

Commit outstanding changes with a meaningful message and push. The git history IS the audit trail here — every commit should be readable by someone coming in cold.

---

## Step 1 — Update Knowledge Graph (if repo files changed)

```bash
graphify update .
```

`graphify update` is AST-only — **no API call, no cost, always safe to run.**

`graphify extract .` (full re-extraction) requires an LLM API key. Only needed if the graph doesn't exist yet or the repo structure has changed significantly. If extraction hits the Gemini free-tier rate limit (429), **stop and ask Christopher** before switching to a paid API key — do not auto-run with a paid key.

## Step 2 — See What Changed (git status)

```bash
git status
git diff --stat
```

Read the diff to understand what actually changed before writing the commit message. Don't rely on the user's description alone — look at the files.

---

## Step 3 — Draft the Commit Message

Write a message that captures **what + why + context**, not just "update content". Good PIR commits are useful to future committee members who may have no memory of this session.

**Format:**

```
[Area]: Brief one-line summary of what changed

- What was updated or added (be specific: which newsletter, which section, what decision)
- Why it changed (user request, committee feedback, content correction, new event)
- Any context that won't be obvious from the diff (e.g. "per March 12 board meeting")
```

**Examples:**

✅ `Newsletter: Update March issue — swap lead story, fix date on events calendar`
✅ `Dashboard: Add April session recap + link to minutes`
✅ `Content: Correct spelling of [member name] in contributor credits`
❌ `Update files`
❌ `Changes`

**If context is unclear**, ask the user one question before committing:
> "What's the reason for this change? I'll include it in the commit."

---

## Step 4 — Stage and Commit

Stage only relevant files:

```bash
git add dashboard/ data/ imports/ scripts/ setup/ CLAUDE.md AGENTS.md ROADMAP.md graphify-out/
```

Never stage: `.env`, credentials, or private member data not intended for the repo.

Then commit:

```bash
git commit -m "$(cat <<'EOF'
[Your drafted message here]

Co-Authored-By: Alfred · Claude · [model] <noreply@anthropic.com>
EOF
)"
```

Replace `[model]` with the model currently in use:
- Alfred-Anthropic (Sonnet): `Alfred · Claude · claude-sonnet-4-6 <noreply@anthropic.com>`
- Alfred-Anthropic (Opus): `Alfred · Claude · claude-opus-4-7 <noreply@anthropic.com>`
- Alfred-NIM: `Alfred · Claude · NVIDIA NIM Z-AI GLM-4.7 <noreply@anthropic.com>`

---

## Step 5 — Push

```bash
git push origin main
```

If push fails (remote ahead):
```bash
git pull --rebase origin main && git push origin main
```

---

## Step 6 — Confirm

Output the commit hash and a one-line summary:

> ✓ Committed `abc1234` — "[message]" and pushed to main.

---

## Philosophy

The git log is the shared memory here. A well-written commit can answer "what changed and why" for anyone — committee members, the next agent session, or anyone picking this up months from now. Treat every commit message as a brief note to your future self.

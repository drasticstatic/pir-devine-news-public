---
name: startup
description: >
  Use at the start of any Alfred session in the pir-devine-news repo to choose the session
  backend and verify operational readiness. TRIGGER when: "startup", "start session",
  "good morning", "let's get started", "new session", "begin work", "morning", "start work",
  "initialize", "check proxy", "which backend", "session start", or any phrase indicating a
  new work session is beginning in the PIR repo. Do NOT use for: mid-session model switches
  (use /model directly), or mid-session task questions.
---

# Startup — De Vine News (PIR)

Choose your session backend. Two modes — same Alfred identity, different engine.

## Session Modes

| Mode | Model | Use for |
|------|-------|---------|
| **Alfred-Anthropic** | Sonnet 4.6 / Opus 4.7 | Newsletter production, portal work, committee-facing documents |
| **Alfred-NIM** | NVIDIA GLM-4.7 (free) | Exploratory questions, research, drafts, git/infra tasks |

---

## Step 1 — Check Proxy Status

```bash
curl -s http://localhost:8082/v1/models
```

**401 "Missing API key"** → Proxy UP ✅
**Connection refused** → Proxy DOWN — start it:

```bash
cd ~/code-forked/free-claude-code && nohup uv run free-claude-code > /tmp/fcc.log 2>&1 &
```

Wait ~4 seconds, re-check.

---

## Step 2 — Verify gwspdn Auth

```bash
gwspdn drive files list --params '{"pageSize": 1}'
```

`gwspdn` = PIR Google Workspace alias (config: `~/.config/gws-pir-devine-news/`).  
If auth fails: `gwspdn auth login` (PIR committee Google account).

---

## Step 3 — Read Session Context

1. `HANDOFF.md` — if it exists at repo root
2. `PENDING-TASKS.md` or `tasks.md` — open tasks
3. `CLAUDE.md` — repo rules, scope, and agent boundaries

---

## Step 4 — Choose Backend

### Alfred-Anthropic (default)
Proceed normally — `claude` in `~/code/pir-devine-news/`.

### Alfred-NIM / Free Models

```bash
ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY=freecc claude
# Auth conflict warning appears — harmless, ignore
# /model → anthropic/nvidia_nim/z-ai/glm4.7
```

**NIM limits:**
- Text only — proxy rejects image blocks (error 400; restart session if jammed)
- "peer closed connection" / "Provider API request failed" — tell agent to continue; self-resolves
- Smaller context window — read large files in sections

---

## Quick Reference

```bash
# PIR Google Workspace
gwspdn drive files list --params '{"pageSize": 10}'
gwspdn gmail users messages list --params '{"userId": "me"}'

# Check local site
open http://localhost:3000

# Proxy status
curl -s http://localhost:8082/v1/models   # 401 = up | refused = down

# Marp — generate deck HTML
~/.nvm/versions/node/v22.12.0/bin/marp dashboard/[file].marp.md -o dashboard/[file].marp.html
```

---

*Reference: `CLAUDE.md` for repo rules. Full dual-mode philosophy: `specs/alfred-workflow.md` (alfred repo).*

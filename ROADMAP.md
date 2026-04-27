# Product Roadmap
### De Vine News — PIR® Newsletter Committee Hub

---

> This roadmap outlines where the project is today, what's being built next, and the longer-term vision for making the newsletter committee's work effortless — including AI-assisted editing tools that don't require any technical knowledge to use.

---

## Legend

| Status | Meaning |
|--------|---------|
| ✅ Done | Live and working |
| 🔨 In Progress | Actively being built |
| 📋 Planned | Scoped and ready to build |
| 💡 Vision | Conceptual — not yet scoped |

---

## Phase 1 — Foundation (Complete)

*Goal: Get a working hub live that committee members can actually use.*

- ✅ **Committee portal** (`index.html`) — view all submissions with status badges, admin toggle, sync timestamp
- ✅ **Submission form** (`submit.html`) — members submit literature, artwork, or both directly to the committee; monthly theme dropdown; writing prompts
- ✅ **File size guards** — warn at 10 MB, block at 25 MB, with clear fallback instructions
- ✅ **Non-Gmail notice** — informational modal when a non-Gmail address is used, explaining portal access
- ✅ **Newsletter archive** — January through April 2026 editions published and browsable
- ✅ **Bulletin board** (`bulletin.html`) — community announcements
- ✅ **Resources page** (`resources.html`)
- ✅ **Private → public sync** — auto-publishes on every commit; committee data and credentials never reach the public repo
- ✅ **Hosting & sustainability docs** (`SUSTAINABILITY.md`, `ROADMAP.md`) — public explainer of who hosts the site, migration path, and product vision

---

## Phase 2 — Live Backend (Mostly Complete)

*Goal: Wire the submission form to real storage and make the committee's workflow hands-off.*

- ✅ **Google Apps Script web app** — receives form POSTs, saves text to Google Docs, uploads art to Drive, returns a success/failure response to the submitter
- ✅ **Confirmation email** — automated "Thank You" email sent immediately on submission; includes the current PIR meeting schedule as an attachment
- ✅ **Dashboard live sync** — GWS CLI script pulls Drive folder state hourly and updates `dashboard/data.json`; committee portal shows real submissions in real time
- ✅ **Manual sync trigger** — "Force Sync" button in the admin view (calls a GitHub Actions `workflow_dispatch` endpoint)
- 📋 **Art thumbnail pipeline** — art files auto-compressed via `pngquant` when downloaded from Drive; displayed in `temp-gallery/` on the portal

---

## Phase 3 — Access Control & Polish

*Goal: Lock down the admin view, polish the experience, and add smart deadline tools.*

- 📋 **Google OAuth login** — committee portal requires a whitelisted Gmail account to view unpublished submission content and admin controls
- 📋 **Submitter receipt page** — a dedicated post-submission page with a unique confirmation number so members can reference their submission
- 📋 **Deadline countdown widget** — live countdown showing days remaining until the next issue deadline; displayed on the portal and submission form
- 📋 **WhatsApp notification routines** — periodic deadline reminders and announcements pushed to committee WhatsApp threads via the WhatsApp Business API or Twilio; triggered by scheduled GitHub Actions
- 📋 **Marp newsletter reader view** — each published edition gets a companion Marp slide deck (`newsletter-[month]-[year].marp.html`) that members can open as a presentation; a "📖 Reader View" link appears on the edition page
- 📋 **Mobile-optimized admin** — committee members can review and approve submissions from their phones

---

## Phase 4 — AI Admin Dashboard

*Goal: Let any willing committee member manage the newsletter through conversation — no CLI, no GitHub, no code required.*

### The Idea

Instead of asking a committee member to learn GitHub, learn HTML, find a developer, and wait for a deployment — they open a chat window and say:

> *"Update the June submission deadline to May 15th."*
> *"The next theme should be 'Humility' — add that to the form."*
> *"Mark Sarah's April submission as Approved."*
> *"Draft a welcome paragraph for the May newsletter."*

An AI agent reads those messages, makes the changes, and pushes the update — all without touching a line of code.

### The Admin Dashboard Page (`admin.html`)

A dedicated page linked from the navigation and footer. **Publicly viewable** so anyone can understand what it does — changes require a passphrase.

- **Capability showcase** — example conversation transcripts demonstrating what the admin agent can do, so non-technical committee members immediately understand the value
- **"What can I ask?" prompts** — pre-written sample questions visitors can read to grasp the scope
- **Password-gated AI chat panel** — the actual agent interface; passphrase required to make any change
- **Link from hamburger menu + footer** — accessible from any page without navigating through the portal
- **Link from admin modal** — the existing password-gated "🔒 Manage" modal in the portal includes an "Open Full Admin Dashboard →" button

### How It Would Work

```
Editor types in chat
        ↓
Claude agent receives message
        ↓
Agent reads current dashboard files
        ↓
Agent proposes change ("Here's what I'd update — approve?")
        ↓
Editor confirms
        ↓
Agent commits and pushes → site updates automatically
```

The agent has access only to `dashboard/` files — not credentials, not committee emails, not private setup docs.

### What Editors Can Do Via Chat

| Request | What the agent does |
|---------|-------------------|
| "Change the June theme to Humility" | Edits the dropdown option and sidebar pill in `submit.html` |
| "Add a new submission from Maria — poetry, Step 3 theme" | Adds an entry to `data.json` |
| "Publish the May newsletter" | Links the new edition file in the portal and sidenav |
| "Update the deadline to May 15th" | Finds and replaces the deadline across the relevant pages |
| "Show me all submissions marked Needs Review" | Queries `data.json` and returns a readable list |
| "Write a 2-sentence intro for the June issue" | Drafts copy for editor review before publishing |

### Claude Integration Options

**Option A — Claude.ai Projects (available now)**
Upload the repo to a Claude.ai Project. Editors log in at claude.ai, open the PIR project, and chat. No new infrastructure required. Best for early trials.

**Option B — Embedded chat widget (Phase 4 build)**
AI chat widget built directly into `admin.html`. Calls the Anthropic API (Claude Sonnet) with current file state as context. Backend: lightweight Google Apps Script endpoint proxying the API call.

**Option C — Scheduled agents (advanced)**
Recurring tasks run automatically — e.g., "Every Monday, check if any submission has been in 'Needs Review' for more than 7 days and send a reminder." No human trigger needed.

### DAO Publishing Governance

The newsletter committee operates on holacratic, consensus-based principles — no single editor holds authority. The agent respects this by treating publishing as a collective act, not an individual one.

```
Committee member drafts a change via admin chat
        ↓
Agent generates a preview URL (visible to anyone with the link)
        ↓
Agent emails all active editors with the preview link + voting window
        ↓
If no objection arrives within the voting window
        ↓
Agent commits, pushes, and updates the sidenav automatically
        ↓
Change is live — audit trail in git history
```

Any committee member with the passphrase can initiate a change. No single person can publish unilaterally — the consent window ensures collective awareness. Any change can be reverted with `git revert`.

### Agent Safety

- **Propose before executing** — agent always shows a diff preview and waits for confirmation before committing
- **No credential access** — agent cannot read `.env`, `service_account.json`, or committee email lists
- **Audit trail** — every AI-assisted change is a Git commit with a clear, readable message
- **Rollback** — any change can be undone with a single `git revert`

### Two-Agent Architecture

The admin system is composed of two distinct agents with separate contexts and purposes:

| Agent | Purpose | Context |
|-------|---------|---------|
| **De Vine Admin Agent** | Site management — submissions, deadlines, themes, publishing | `dashboard/` files only |
| **Inner Voice Agent** | Writing facilitation — Socratic dialogue to help members find their authentic voice | Member's own words only; no file access |

Over time these coordinators may delegate to cost-efficient skill sub-agents (Claude Haiku for routine tasks, Claude Sonnet for complex reasoning) — keeping the experience powerful without unnecessary cost.

---

## Phase 4b — The Inner Voice Submission Agent

*Goal: Replace the blank-form submission experience with a conversational facilitator that helps members write complete, heartfelt pieces — without AI doing the writing for them.*

### The Vision

The shift from Google Forms to a custom submission form solved the filing problem, but a deeper issue surfaced: the Q&A format of forms encouraged **fragmented, incomplete contributions** — bullet points and partial thoughts instead of finished pieces. Guidelines alone may not fix this.

The Inner Voice Agent reimagines the submission experience as a dialogue. Instead of staring at an empty text box, a member engages with a thoughtful, reflective partner that helps them find the feeling behind their story, clear writer's block, and arrive at a finished piece — one that is unmistakably, fully theirs.

> *"AI as a facilitator, not a creator. It clears the path so authentic messages can flow effortlessly."*

### How It Works

```
Member opens the "Write with Support" chat
           ↓
Agent opens with: "Take a moment — what's the feeling or intention behind
what you want to share today?" (never suggests a topic first)
           ↓
Member shares a rough idea, a feeling, a few bullet points
           ↓
Agent uses recursive, Socratic questioning to surface specific
anecdotes, emotional details, and "human fingerprints"
           ↓
Agent mirrors the member's own vocabulary and emotional tone —
poetic if they're poetic, raw if they're raw
           ↓
Heart Check: "Does this capture the spark you felt when we started,
or did we lose the soul in translation?"
           ↓
Only after a yes: structures the final submission as
Title · Body · Key Takeaway — ready to paste into the form
```

### Core Design Principles

- **The Silent Start** — the agent never suggests a topic or provides a blank draft. It waits for the member's spark.
- **Recursive Questioning (The Clarity Engine)** — when a response is thin or generic, the agent asks follow-up questions to pull out specific anecdotes, sensory details, or emotional insights that only the member could know.
- **Mirror, Don't Polish** — the agent reflects the member's own voice and vocabulary. It avoids "corporate" or "standard AI" smoothing.
- **The Heart Check** — before structuring the final piece, the agent explicitly asks whether the result still carries the original feeling. It only proceeds with a yes.
- **No ghostwriting** — if a member asks the agent to "just write it for me," it gently declines and returns to a clarifying question about their specific experience.

### The System Prompt (Socratic Midwife)

The agent's behavior is governed by a specialized system prompt. Key directives:

1. **Role:** Socratic Midwife and Mindful Writing Companion — a facilitator, not a creator.
2. **Introspective Prompting:** Before details, ask for the feeling or intention behind the piece.
3. **Clarity Engine:** Identify where "human fingerprints" are missing; ask targeted follow-up questions.
4. **Mirror:** Match the member's emotional state and vocabulary; avoid generic polish.
5. **Heart Check:** Ask "Does this capture the spark you felt, or did we lose the soul in translation?" before finalizing.
6. **Architectural Finish:** Structure only after the Heart Check passes — Title, Body, Key Takeaway.
7. **Guardrails:** Never invent facts, quotes, or stories. Never write on the member's behalf.

### Implementation Path

- **Option A (pilot):** A standalone Claude.ai Project or custom GPT shared with willing members — no dev work required to test the concept.
- **Option B (integrated):** A chat widget embedded in `submit.html` alongside the standard form — member chooses "Write with Support" or "Submit directly." Backend: a lightweight Apps Script or Cloud Function proxying the Anthropic API with the system prompt baked in.
- **Option C (full pipeline):** The conversation output flows directly into the submission pipeline — member reviews, approves, and the structured piece is saved to Drive without re-entering the form.

---

## Phase 5 — Organization Handoff

*Goal: Full ownership transferred to the PIR Fellowship; zero dependency on individual contributors.*

- 💡 **PIR GitHub organization** — repos transferred from `drasticstatic` personal account to a `pir-psychedelics-in-recovery` org
- 💡 **Custom domain** — `news.psychedelicsinrecovery.org` mapped via DNS (no hosting cost change — see `SUSTAINABILITY.md`)
- 💡 **Multi-editor access** — multiple committee members with GitHub access can push updates
- 💡 **Onboarding guide** — a non-technical "how to use this" guide for new committee chairs
- 💡 **Annual review workflow** — automated prompt at year-end to archive the previous year's issues and reset the submission calendar

---

## Skills & Automation Framework

*Tools that let Claude Code act as a specialized assistant for this repo — reducing repetitive tasks to single commands.*

Skills live in `.claude/skills/`. Only the 3-line description header loads at context start; the full skill body loads only when triggered. This keeps context lean while making powerful workflows available on demand.

### Skills Library

| Skill | Status | What It Does |
|-------|--------|-------------|
| `/marp-deck` | ✅ Built | Convert a newsletter edition or doc to a PIR-branded Marp slide deck + generate HTML |
| `/create-skill` | ✅ Built | Design and draft a new Claude Code skill for this repo |
| `/new-edition` | 📋 Planned | Scaffold a new newsletter HTML file from the master template |
| `/publish-edition` | 📋 Planned | Wire a completed edition into the portal, sidenav, and archive |
| `/update-theme` | 📋 Planned | Update the monthly theme in `submit.html` dropdown and sidenav |
| `/update-deadline` | 📋 Planned | Update submission deadline across all relevant pages |
| `/sync-report` | 📋 Planned | Summarize current `data.json` state: last sync, pending submissions, status breakdown |
| `/new-submission` | 📋 Planned | Manually add a submission entry to `data.json` |
| `/admin-agent` | 💡 Vision | Trigger the Phase 4 De Vine Admin Agent (site management via chat; requires API backend) |
| `/inner-voice-agent` | 💡 Vision | Trigger the Phase 4b Inner Voice Agent (Socratic writing facilitator; separate system prompt) |

### Marp Newsletter Reader View

Each published edition can have a companion slide deck — a "📖 Reader View" that members open as a presentation in their browser. Built with Marp using the PIR brand theme (navy + green + purple). This gives the newsletter a second life as a shareable, visually polished format perfect for WhatsApp sharing or committee presentations.

**Workflow:**
1. Run `/marp-deck` pointing at the edition content
2. Output: `dashboard/newsletter-[month]-[year].marp.html`
3. Add "📖 Reader View" link to the edition page
4. Commit and push — available on GitHub Pages immediately

---

## How to Contribute

The codebase is plain HTML, CSS, and JavaScript — no build tools required. If you're a developer:

1. Request access or fork the repo (contact pir.devine.news@gmail.com)
2. Make your changes in `dashboard/`
3. Open a pull request

If you're a committee member with a feature request or bug report, email **pir.devine.news@gmail.com**.

---

*Roadmap last updated: April 2026*
*This is a living document — it will be updated as the project evolves.*

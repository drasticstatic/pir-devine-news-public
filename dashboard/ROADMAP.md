# Product Roadmap
### Devine News — PIR® Newsletter Committee Hub

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
- ✅ **Hosting documentation** (`SUSTAINABILITY.md`) — non-technical explainer of who hosts the site and how

---

## Phase 2 — Live Backend (Next Up)

*Goal: Wire the submission form to real storage and make the committee's workflow hands-off.*

- 📋 **Google Apps Script web app** — receives form POSTs, saves text to Google Docs, uploads art to Drive, returns a success/failure response to the submitter
- 📋 **Confirmation email** — automated "Thank You" email sent immediately on submission; includes the current PIR meeting schedule as an attachment
- 📋 **Dashboard live sync** — GWS CLI script pulls Drive folder state hourly and updates `dashboard/data.json`; committee portal shows real submissions in real time
- 📋 **Manual sync trigger** — "Force Sync" button in the admin view (calls a GitHub Actions `workflow_dispatch` endpoint)
- 📋 **Art thumbnail pipeline** — art files auto-compressed via `pngquant` when downloaded from Drive; displayed in `temp-gallery/` on the portal

---

## Phase 3 — Access Control & Polish

*Goal: Lock down the admin view so only committee members can see submission details.*

- 📋 **Google OAuth login** — committee portal requires a whitelisted Gmail account to view unpublished submission content and admin controls
- 📋 **Submitter receipt page** — a dedicated post-submission page with a unique confirmation number so members can reference their submission
- 📋 **Deadline countdown** — live countdown widget showing days remaining until the next issue deadline
- 📋 **Mobile-optimized admin** — committee members can review and approve submissions from their phones

---

## Phase 4 — LLM-Powered Admin Dashboard

*Goal: Let editors interact with the site through conversation instead of code — no CLI required.*

This is the most ambitious phase, and the one most likely to transform how non-technical committee members experience the workflow.

### The Idea

Instead of asking an editor to:
1. Learn GitHub
2. Learn HTML
3. Find a developer
4. Wait for a deployment

...they open a chat window and say:

> *"Update the May submission deadline to April 30th."*
> *"The June theme should be 'Letting Go' — add that to the form."*
> *"Can you show me a preview of the submission form?"*
> *"Mark Sarah's April submission as Approved."*

An AI agent reads those messages, makes the changes, and pushes the update — all without the editor touching a line of code.

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

The agent would have access only to the `dashboard/` files — not private setup docs, not credentials, not committee emails.

### What Editors Could Do Via Chat

| Request | What the agent does |
|---------|-------------------|
| "Change the June theme to Letting Go" | Edits the dropdown option and sidebar pill in `submit.html` |
| "Add a new submission from Maria — poetry, Step 3 theme" | Adds an entry to `data.json` |
| "Publish the May newsletter" | Renames and links the new `newsletter-may-2026.html` file |
| "Update the deadline to May 15th" | Finds and replaces the deadline across the relevant HTML |
| "Show me all submissions marked Needs Review" | Queries `data.json` and returns a readable list |

### Claude API / Claude.ai Integration Options

**Option A — Claude.ai Projects (simplest)**
Use the existing Claude.ai web interface with the repo uploaded as a Project. Editors log in to Claude.ai, open the PIR project, and chat. No new infrastructure required. Best for early trials.

**Option B — Embedded chat widget (future)**
Build a small chat widget into the admin view of `index.html`. The widget calls the Anthropic API (Claude Sonnet or Haiku for cost efficiency) with the current file state as context. Editors stay inside the dashboard — no need to switch to Claude.ai. The backend would be a lightweight Google Cloud Function or Apps Script endpoint that proxies the API call.

**Option C — Claude Code scheduled agents (advanced)**
Use Claude's remote trigger / scheduled agent feature to run recurring tasks automatically — e.g., "Every Monday, check if a new submission has been sitting in 'Needs Review' for more than 7 days and send a reminder to the committee Slack/email." This requires the Claude API and a small backend, but adds genuine automation intelligence.

### Governance & Safety

The AI admin assistant would be designed with clear guardrails:
- **Propose before executing** — the agent always shows a preview of the change and waits for human approval before committing
- **No credential access** — the agent cannot read `service_account.json`, `.env`, or committee email lists
- **Audit trail** — every change made through the assistant is a Git commit with a clear message
- **Rollback** — since everything is in Git, any AI-assisted change can be undone with `git revert`

---

## Phase 5 — Organization Handoff

*Goal: Full ownership transferred to the PIR Fellowship; zero dependency on individual contributors.*

- 💡 **PIR GitHub organization** — repos transferred from `drasticstatic` personal account to a `pir-psychedelics-in-recovery` org
- 💡 **Custom domain** — `news.psychedelicsinrecovery.org` mapped via DNS (no hosting cost change)
- 💡 **Multi-editor access** — multiple committee members with GitHub access can push updates
- 💡 **Onboarding guide** — a non-technical "how to use this" guide for new committee chairs
- 💡 **Annual review workflow** — automated prompt at year-end to archive the previous year's issues and reset the submission calendar

---

## How to Contribute

The codebase is plain HTML, CSS, and JavaScript — no build tools required. If you're a developer:

1. Fork `github.com/drasticstatic/pir-devine-news` (or the future PIR org repo)
2. Make your changes in `dashboard/`
3. Open a pull request

If you're a committee member with a feature request or bug report, email **pir.devine.news@gmail.com**.

---

*Roadmap last updated: April 2026*
*This is a living document — it will be updated as the project evolves.*

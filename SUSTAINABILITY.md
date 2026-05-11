# Hosting & Sustainability
### De Vine News — PIR® Newsletter Committee Hub

---

> **For committee members, board members, and developers asking:**
> *"Who hosts this? What happens if the developer moves on? How do we make sure this keeps running? How do we clone or migrate it?"*

---

## Where the Site Lives

The De Vine News hub is hosted on **GitHub Pages** — a free, permanent static hosting service run by GitHub (owned by Microsoft). It requires no monthly fees, no server to maintain, and no technical staff to keep online.

Every time a committee developer pushes an update, the site automatically rebuilds and publishes within minutes. If no one updates the code, the site simply stays up exactly as it is — indefinitely.

**Live URL:** `https://drasticstatic.github.io/pir-devine-news-public/dashboard/`

---

## Who Currently Owns It

The site was built as a fellowship service project under a personal GitHub account (`drasticstatic`). This is intentional — it's easier to build and test under a personal account, then transfer ownership to the organization when the committee is ready.

When the time comes, the full site and its history can be transferred to a PIR GitHub organization (like `pir-psychedelics-in-recovery`) in a few clicks — with no data loss and no downtime.

---

## What "Sustainability" Means Here

| Concern | Answer |
|---------|--------|
| **Monthly cost?** | $0. Hosting is free on GitHub Pages. Form processing is free on Google Apps Script. Storage is free on Google Drive (up to 15 GB). |
| **What if Christopher moves on?** | The repos can be transferred to a PIR org GitHub account. Any developer or tech-savvy volunteer can pick up the work — all instructions are inside the repo. |
| **What if GitHub goes down?** | GitHub has 99.9%+ uptime. In a worst-case scenario, the static files can be hosted on any web server or even Netlify/Vercel at no cost. |
| **What if the PIR website changes?** | The newsletter hub is independent of `psychedelicsinrecovery.org`. It can remain on its current URL, or be moved to a subdomain like `news.psychedelicsinrecovery.org` at any time. |
| **What if AI tools change pricing?** | The published site is plain HTML — it runs without any AI subscription. Build and maintenance uses Claude Code CLI (Anthropic). For eligible admin and content-generation tasks, NVIDIA NIM (free tier) is being tested as a cost-saving alternative — keeping per-session costs near zero for the fellowship treasury. See `ROADMAP.md` Phase 4. |

---

## Current Hosting Stack

| Layer | Provider | Account | Cost |
|-------|----------|---------|------|
| Static site hosting | GitHub Pages | `drasticstatic` (personal → future PIR org) | Free |
| Source code | GitHub private repo | `drasticstatic` | Free |
| Form backend | Google Apps Script | `pir.devine.news@gmail.com` | Free |
| File storage | Google Drive / Gmail | `pir.devine.news@gmail.com` | Free (15 GB) |
| Automation CI | GitHub Actions | `drasticstatic` | Free (2,000 min/mo) |

---

## The Migration Plan

### Phase 1 — Proof of Concept (Current)
- Hosted under Christopher's personal GitHub (`drasticstatic`)
- Full build, live URL, committee members can submit and view
- All infrastructure documented and transferable

### Phase 2 — PIR Organization Handoff
When the committee is ready:
1. Create a PIR GitHub organization at `github.com/organizations/new` (free)
2. Transfer both repos to the org via Settings → Danger Zone → Transfer (two clicks each)
3. Generate a new Personal Access Token scoped to the org → add as `PUBLIC_REPO_TOKEN` secret in the new private repo's Settings → Secrets
4. Update `dashboard/config.js` with the new Pages URL
5. The site continues running with zero downtime — the sync workflow is already written to use the secret name, no code changes needed

### Phase 3 — Custom Domain (Optional)
Point `news.psychedelicsinrecovery.org` (or similar) to the GitHub Pages URL:
1. Add a `CNAME` file to `dashboard/` containing the subdomain (e.g. `news.psychedelicsinrecovery.org`)
2. In the public repo → Settings → Pages → Custom Domain → enter the subdomain
3. At the domain registrar for `psychedelicsinrecovery.org`, add a CNAME DNS record: Name `news`, Target `pir-[orgname].github.io`
4. Wait up to 24h for DNS propagation — GitHub auto-provisions HTTPS for free

No new hosting costs, no new accounts — just a prettier URL.

---

## Cloning to a New Machine

Anyone with repo access can clone and continue the work:

```bash
git clone https://github.com/drasticstatic/pir-devine-news.git
cd pir-devine-news
```

Then open `setup/STARTUP_INSTRUCTIONS_for_Claude.md` and `setup/SUPPLEMENTAL_STARTUP_for_Claude.md` — these contain the full project brief, infrastructure patterns, and current build state. No special environment setup is needed to view or edit the static dashboard.

To request clone access: **pir.devine.news@gmail.com**

---

## Switching Claude Services (CLI → Cloud or Vice Versa)

The repo is self-contained. Any Claude session — CLI, Claude.ai web, or API — can pick up the project by reading the setup docs above. No environment variables, no local credentials, no special tooling required to read and edit the dashboard files.

The LLM Admin Dashboard (planned — see `ROADMAP.md`) would let committee members make updates through a Claude.ai chat interface without needing the CLI at all.

---

## What Could Break (and How to Fix It)

| Risk | Trigger | Fix |
|------|---------|-----|
| Sync stops working | `PUBLIC_REPO_TOKEN` PAT expires | Regenerate PAT, update repo secret (see below) |
| Form submissions stop | Apps Script quota hit or URL changed | Redeploy Apps Script, update `dashboard/config.js` |
| Drive storage fills | High-res art accumulates | Archive old issues to local drive; run `pngquant` on thumbnails |
| GitHub account suspended | Policy violation or inactivity | Transfer repos to PIR org before this happens |

---

## Managing GitHub Access Tokens (PAT Security & Recovery)

The `PUBLIC_REPO_TOKEN` secret stored in the private repo's GitHub Settings powers the sync workflow that publishes changes to the public site. Here's what every caretaker needs to know.

### How PATs Work

A Personal Access Token (PAT) is a unique random string generated once — it cannot be reused. If you click **Regenerate**, GitHub creates a completely new string and invalidates the old one. You must update the GitHub Actions secret (`PUBLIC_REPO_TOKEN`) with the new value every time you regenerate.

**PAT types:**
| Type | Non-expiring option | Best for |
|------|--------------------|----|
| PAT (Classic) | ✅ Select "No expiration" | This project — simple, personal-account based |
| Fine-grained PAT | ❌ Max ~1 year (org policy) | More locked-down setups |

For this project, use a **Classic PAT** scoped to `repo` (or just `public_repo`). Select **No expiration** to avoid disrupting the sync workflow unexpectedly. GitHub may auto-revoke it if unused for more than one year — use the sync workflow at least occasionally to keep it alive.

### How to Regenerate (step by step)

1. Go to `github.com` → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Find the token used for `PUBLIC_REPO_TOKEN` (note its name)
3. Click **Regenerate token** → set expiration to **No expiration** → confirm
4. Copy the new token string immediately (shown only once)
5. Go to the **private repo** → Settings → Secrets and variables → Actions → `PUBLIC_REPO_TOKEN` → Update
6. Paste the new token → Save
7. Trigger a test sync (push a small change or use the manual dispatch button on the portal)

The scripts never need to change — they reference the secret name, not the token value.

### Recovery Plan — What If Someone Loses Access?

**If a PAT expires or a token is lost:**
- Christopher (or any repo admin) goes to GitHub → the private repo Settings → Secrets → regenerates and updates `PUBLIC_REPO_TOKEN`
- No code changes needed. The sync workflow resumes on the next push.

**If Christopher's GitHub password is lost:**
- Use GitHub's account recovery (recovery codes, linked email, or SMS 2FA)
- Recovery codes should be stored in a shared password manager (e.g. Bitwarden, 1Password) accessible to PIR's board or tech lead

**If the account needs to be handed off to PIR:**
- Transfer both repos to a PIR GitHub organization (see Migration Plan above)
- Generate a new Classic PAT under the org's machine account
- Store the PAT and org credentials in a shared password manager accessible to ≥2 board members

### Best Practice: Separation of Ownership and Execution

The most resilient setup separates who *runs* the project from who *owns* the credentials:

1. **You own the repo** (Christopher, or PIR org)
2. **The PAT lives in GitHub Secrets** — scripts never see the token directly
3. **Anyone with repo admin access** can update the secret without touching code
4. **Store recovery credentials** (GitHub password + recovery codes) in a shared vault — not in a personal app only one person can access

> If users are prone to "locking themselves out," the fail-safe is: they only interact with the chat interface and submission form — they never touch the token itself. Only a repo admin needs to manage the PAT.

For a production-grade setup (when the committee is ready), a **GitHub App** is the gold standard — it's owned by the organization, not a person, and survives any individual leaving. But a well-managed Classic PAT with a shared vault is entirely sufficient for this project's current scale.

---

## What's Free — and What Could Eventually Cost

### Free Forever (within current usage)
- GitHub Pages hosting
- GitHub private/public repositories
- GitHub Actions (automated publishing — 2,000 minutes/month free)
- Google Apps Script (form processing)
- Google Drive (submission file storage up to 15 GB)

### Possible Future Costs (only if the committee chooses to expand)
| Optional upgrade | Estimated cost |
|-----------------|----------------|
| Custom `@psychedelicsinrecovery.org` email (Google Workspace) | ~$6/user/month |
| Additional Google Drive storage beyond 15 GB | $3/month for 100 GB |
| GitHub Team plan (if org needs advanced features) | $4/user/month |

None of these are required for the newsletter hub to function.

---

## For Developers

The project is built with plain HTML, CSS, and JavaScript — no frameworks, no build tools, no package manager required. Any developer can read, modify, and deploy it. Key files:

- `CLAUDE.md` — security rules and coding conventions (agent instructions)
- `setup/STARTUP_INSTRUCTIONS_for_Claude.md` — full project brief and feature spec
- `setup/SUPPLEMENTAL_STARTUP_for_Claude.md` — infrastructure patterns, current build state, what's done and what's next

---

## Contact

Questions about hosting, access, or the technical setup:
**pir.devine.news@gmail.com**

---

*This document is public and intentionally written for both non-technical readers and developers.*
*Last updated: May 2026*

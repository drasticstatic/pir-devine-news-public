# Hosting & Sustainability
### Devine News — PIR® Newsletter Committee Hub

---

> **For committee members, board members, and anyone asking:**
> *"Who hosts this? What happens if the developer moves on? How do we make sure this keeps running?"*

---

## Where the Site Lives

The Devine News hub is hosted on **GitHub Pages** — a free, permanent static hosting service run by GitHub (owned by Microsoft). It requires no monthly fees, no server to maintain, and no technical staff to keep online.

Every time a committee developer pushes an update, the site automatically rebuilds and publishes within minutes. If no one updates the code, the site simply stays up exactly as it is — indefinitely.

**Live URL:** `https://drasticstatic.github.io/pir-devine-news-public/dashboard/`

---

## Who Currently Owns It

The site was built by **Christopher Wilson** as a proof of concept under his personal GitHub account (`drasticstatic`). This is intentional — it's easier to build and test under a personal account, then transfer ownership to the organization when the committee is ready.

When the time comes, the full site and its history can be transferred to a PIR GitHub organization (like `pir-psychedelics-in-recovery`) in a few clicks — with no data loss and no downtime.

---

## What "Sustainability" Means Here

| Concern | Answer |
|---------|--------|
| **Monthly cost?** | $0. Hosting is free on GitHub Pages. Form processing is free on Google Apps Script. Storage is free on Google Drive (up to 15 GB). |
| **What if Christopher moves on?** | The repos can be transferred to a PIR org GitHub account. Any developer or tech-savvy volunteer can pick up the work — all instructions are inside the repo. |
| **What if GitHub goes down?** | GitHub has 99.9%+ uptime. In a worst-case scenario, the static files can be hosted on any web server or even Netlify/Vercel at no cost. |
| **What if the PIR website changes?** | The newsletter hub is independent of `psychedelicsinrecovery.org`. It can remain on its current URL, or be moved to a subdomain like `news.psychedelicsinrecovery.org` at any time. |
| **What if AI tools change pricing?** | The site itself doesn't depend on AI. Claude Code is used only by the developer to build features. The published site is plain HTML — it runs without any AI subscription. |

---

## The Migration Plan

### Phase 1 — Proof of Concept (Current)
- Hosted under Christopher's personal GitHub (`drasticstatic`)
- Full build, live URL, committee members can submit and view
- All infrastructure documented and transferable

### Phase 2 — PIR Organization Handoff
When the committee is ready:
1. Create a PIR GitHub organization (free)
2. Transfer both repos to the org (Settings → Transfer, two clicks)
3. Update one configuration value (`config.js`) to reflect the new URL
4. The site continues running with zero downtime

### Phase 3 — Custom Domain (Optional)
Point `news.psychedelicsinrecovery.org` (or similar) to the GitHub Pages URL. This requires:
- One DNS record change at the `psychedelicsinrecovery.org` domain registrar
- One config file added to the repo
- GitHub auto-provisions HTTPS (free, via Let's Encrypt)

No new hosting costs, no new accounts — just a prettier URL.

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

## For Developers Picking This Up

Everything you need is in the repo:

- `setup/STARTUP_INSTRUCTIONS_for_Claude.md` — full project brief and feature spec
- `setup/SUPPLEMENTAL_STARTUP_for_Claude.md` — infrastructure patterns, build state, what's done and what's next
- `setup/HOSTING_AND_SUSTAINABILITY.md` — detailed migration steps (private, for developers only)
- `CLAUDE.md` — security rules and coding conventions

The project is built with plain HTML, CSS, and JavaScript — no frameworks, no build tools, no package manager required. Any developer can read, modify, and deploy it.

---

## Contact

Questions about hosting, access, or the technical setup:
**pir.devine.news@gmail.com**

---

*This document is public and intentionally written for non-technical readers.*
*Last updated: April 2026*

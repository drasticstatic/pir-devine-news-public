# De Vine News — Google Drive Guide for Editors
### Psychedelics In Recovery Newsletter Committee

> **This document is the canonical reference**, maintained in the GitHub repository.
> The Google Doc in the Drive root is a pointer to this page.
> `https://github.com/drasticstatic/pir-devine-news-public/blob/main/GDRIVE_GUIDE-for-editors.md`

---

## Drive Access

Google Drive does not allow sharing the root "My Drive" directly. Our shared workspace is a single top-level folder called **`pir.devine.news`**. Everything editors need lives inside it.

When you accept a sharing invite, this folder appears in your **"Shared with me"** section — not in your own My Drive root.

> **Full account access** is via `pir.devine.news@gmail.com` only. The Apps Script that powers the submission form lives at the Drive root *outside* the shared folder — it is only accessible by logging in to that account directly, not via editor sharing.

---

## Drive Structure at a Glance

```
pir.devine.news/                ← shared top-level folder (share this)
│
├── 📁 Submissions/             ← form responses land here automatically
│   ├── Incoming/               ← new, unreviewed entries
│   ├── Approved/               ← cleared for the current issue
│   └── Archive/                ← past issues' submissions
│
├── 📁 Assets/                  ← raw artwork, photos, logos
│   └── (large/binary files not suited for git)
│
└── 📁 Committee/               ← internal docs, meeting notes, rosters

[Drive root — account login only, not inside the shared folder]
└── apps-script-form.gs         ← submission form backend (do not move)
```

> **Newsletter editions and HTML templates live in the GitHub repo** (`dashboard/`), not in the Drive. They are served directly from GitHub Pages. If you need to review or recover a past edition, use `git log` — the full history is there.

---

## What You Can Edit Freely

| Action | Safe? | Notes |
|--------|-------|-------|
| Edit a file's contents | ✅ Yes | Most common editing task |
| Rename a file | ✅ Yes | Sync uses file IDs, not names — links never break |
| Move a file within `pir.devine.news/` | ✅ Yes | File IDs are stable — nothing breaks on a move |
| Add a new file or folder | ✅ Yes | New files are untouched by automation until linked |
| Delete an old archive file | ⚠️ Ask first | Check with the committee lead before removing |

---

## What Would Break If Changed

| Change | Impact |
|--------|--------|
| Deleting or renaming `Submissions/Incoming/` | Form submissions fail silently — script targets it by folder ID |
| Moving `apps-script-form.gs` into the shared folder | No functional break, but it would become visible to all editors |
| Deleting the Apps Script web app | New form submissions stop arriving entirely |
| Revoking service account Drive access | GitHub sync operations would fail |

> **Rule of thumb:** Edit *contents* freely. Be careful with *folder IDs* and *permissions*.

---

## How Submissions Arrive

1. A PIR member visits the submission form on the committee portal
2. They fill out the form — optionally with Inner Voice Agent assistance — and click Submit
3. A Google Apps Script creates a document in `Submissions/Incoming/` automatically
4. Editors review it in the Drive, then move it to `Approved/` when ready
5. Approved content enters the layout workflow; the finished edition is built and published via GitHub

**You do not need to redeploy the Apps Script** unless the GitHub Personal Access Token it uses expires. Current expiry: **May 15, 2026** — rotate the PAT before then (requires repo admin access).

---

## How to Share Access with a New Editor

1. Open the `pir.devine.news` folder in Google Drive
2. Right-click → **Share**
3. Add the editor's email, set role to **Editor**, click Send
4. They'll see `pir.devine.news` in their "Shared with me" within minutes

If the editor also needs to push website changes, they need separate access as a GitHub repo collaborator — ask the repo admin (`@drasticstatic`).

---

## Newsletter Editions — GitHub Is the Source of Truth

| What | Where |
|------|-------|
| HTML edition files | `dashboard/editions/` in the GitHub repo |
| Submission form + portal | `dashboard/` in the GitHub repo |
| Past edition history | `git log -- dashboard/` |
| Live public site | GitHub Pages via `pir-devine-news-public` |
| Incoming raw submissions | Google Drive → `Submissions/Incoming/` |

---

## Key Dates

| Item | Date |
|------|------|
| Apps Script PAT expiry | May 15, 2026 — rotate before this date |

---

*Maintained in the GitHub repo. To update this document, edit `GDRIVE_GUIDE-for-editors.md` at the repo root.*
*Last updated: April 2026 | De Vine News, Psychedelics In Recovery*

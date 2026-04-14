# 🌀 Devine News — Committee Hub
### Newsletter Workflow Hub · Psychedelics in Recovery™ · PIR® 12-Step Fellowship

---

## What Is This?

This is the internal workflow system for the **Devine News** newsletter, produced by the Literature Committee (LitCom) of [Psychedelics in Recovery™](https://www.psychedelicsinrecovery.org).

The hub automates the journey from member submission to published newsletter:
1. A member submits writing or artwork through the **online portal**
2. Files land automatically in the committee's **Google Drive**
3. Editors review and approve through Google Docs — no email chains
4. The published dashboard updates **automatically** on every sync

---

## Quick Links

| Resource | URL |
|----------|-----|
| 🏠 **Committee Portal** | [View Portal](https://drasticstatic.github.io/pir-devine-news-public/dashboard/) |
| ✍️ **Submit Work** | [Submit Form](https://drasticstatic.github.io/pir-devine-news-public/dashboard/submit.html) |
| 📋 **Newsletter Template** | [Open Template](https://drasticstatic.github.io/pir-devine-news-public/dashboard/newsletter-template.html) |
| 🌐 **PIR® Main Site** | [psychedelicsinrecovery.org](https://www.psychedelicsinrecovery.org) |
| ⚙️ **Service Subdomain** | [service.psychedelicsinrecovery.org](https://service.psychedelicsinrecovery.org) |
| 📖 **LitCom Page** | [service.psychedelicsinrecovery.org/literature](https://service.psychedelicsinrecovery.org/literature) |
| 📅 **Topics & Deadlines** | [Google Doc](https://docs.google.com/document/d/1or5cB7Ij6BHj-GLm-6V-UeFSA0Re6QUfVaIoAT2rAgI/edit) |
| 💻 **Public Repo** | [drasticstatic/pir-devine-news-public](https://github.com/drasticstatic/pir-devine-news-public) |

---

## For Committee Members (Non-Technical)

### How do I submit work?
Go to the **Submit Work** link above. Fill in your name, email, and choose whether to submit literature, artwork, or both. You'll receive a confirmation email immediately with the meeting schedule attached.

### How do I review submissions?
Open the **Committee Portal**. Each submission has a status badge — look for **🔍 Needs Review**. Click **Open in Drive** to read and edit the piece directly in Google Docs. Your edits save automatically.

### What are the status badges?
| Badge | Meaning |
|-------|---------|
| 📥 Incoming | Just received — not yet assigned for review |
| 🔍 Needs Review | Ready for a committee editor |
| ✅ Approved | Cleared for the next issue |
| 🚀 Published | In the published newsletter |

### Do I need to learn GitHub?
No. You only need the portal and your regular Gmail/Google Drive. The technical automation runs in the background.

### The dashboard isn't showing a new submission I just uploaded — what do I do?
The sync bot runs every hour. If you're in a rush, contact the **Tech Chair** who can trigger a manual sync from the GitHub Actions tab.

### How do I stay anonymous?
On the submission form, choose **"Anonymous"** — no name will appear anywhere in the published newsletter. You can also choose **"First name & last initial"** (e.g. "Written by Sarah M.") as a middle option.

---

## For the Tech Chair (Setup & Maintenance)

### Repository Architecture

```
Private repo: drasticstatic/pir-devine-news       ← everything lives here
Public repo:  drasticstatic/pir-devine-news-public ← filtered output, GitHub Pages
```

Every push to `main` triggers `sync-public.yml`, which filters out private content and force-pushes the public-safe files to the public repo. GitHub Pages serves the public repo.

**What stays private:**
- `setup/` — startup docs and source PDFs
- `scripts/` — gws CLI automation
- `assets/` — source/high-res brand files (compressed copies are in `dashboard/assets/`)
- `data/committee/` — member emails, Drive folder IDs
- `.github/` — workflow configs
- `CLAUDE.md`, credentials, `.env` files

**What syncs public:**
- `dashboard/` — the entire portal (HTML, CSS, JS, compressed assets)
- `temp-gallery/` — compressed art thumbnails only

### Setting Up gws CLI (First Time)

```bash
# 1. Install
npm install -g @googleworkspace/cli

# 2. Authenticate
gws auth login --account pir.devine.news@gmail.com
# Follow the browser prompt — credentials stored locally, never committed

# 3. Create private config
# File: data/committee/config.env  (gitignored — never committed)
SUBMISSIONS_FOLDER_ID=your_google_drive_folder_id
TEMPLATES_FOLDER_ID=your_google_drive_folder_id
APPROVED_FOLDER_ID=your_google_drive_folder_id
COMMITTEE_EMAILS_FILE=data/committee/emails.txt
GOOGLE_ACCOUNT=pir.devine.news@gmail.com

# 4. Run the sync script
./scripts/gws-sync.sh
```

> **Finding Folder IDs:** Open a Google Drive folder in your browser. The URL looks like `https://drive.google.com/drive/folders/1abc123XYZ`. The ID is the long string after `/folders/` — copy just that part.

### Adding the Drive Link to the Portal

Once your Submissions folder exists:

1. Open it in Google Drive and copy the URL
2. Edit `dashboard/data.json`:
   ```json
   {
     "driveUrl": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
     "driveRequestUrl": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID?usp=sharing"
   }
   ```
3. Commit and push — the Drive panel on the portal activates automatically

### Running the Sync Manually

**From the terminal:**
```bash
./scripts/gws-sync.sh
```

**From GitHub (no terminal needed):**
1. Go to [github.com/drasticstatic/pir-devine-news/actions](https://github.com/drasticstatic/pir-devine-news/actions)
2. Click **🌐 Sync Public Preview**
3. Click **Run workflow** → **Run workflow**

### Deploying the Submission Form Backend

The submit form needs a Google Apps Script Web App to handle file uploads and send confirmation emails:

1. Open [script.google.com](https://script.google.com) with `pir.devine.news@gmail.com`
2. Create a new project named `Devine News Form Handler`
3. Paste the handler script (to be developed — see `scripts/` directory)
4. Deploy as **Web App**: Execute as → Me, Who has access → Anyone
5. Copy the deployment URL
6. Replace `YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` in `dashboard/submit.html`

### Adding Images to temp-gallery

Always compress with `pngquant` before committing:

```bash
# Run from temp-gallery/ after adding new images
pngquant --quality=65-80 --speed=1 --skip-if-larger --ext .png --force *.png
```

### Updating the Newsletter Topic

Each month, update two places:
1. `dashboard/data.json` → `nextDeadline.topic` and `nextDeadline.date`
2. `dashboard/submit.html` → The `<optgroup label="... Current Theme">` option

Commit and push — the portal updates on the next sync.

---

## File Structure

```
pir-devine-news/
├── dashboard/                 ← PUBLIC (synced to GitHub Pages)
│   ├── index.html             ← Committee portal
│   ├── submit.html            ← Member submission form
│   ├── newsletter-template.html ← Print-ready newsletter layout
│   ├── style.css              ← Shared styles (nav, modals, tooltips)
│   ├── nav.js                 ← Shared nav with hamburger menu
│   ├── data.json              ← Sanitized submission list (no private IDs)
│   └── assets/                ← Compressed web-ready images
│       ├── bg.jpg             ← Aurora background (parallax hero)
│       ├── hero-art.jpg       ← Psychedelic illustration
│       ├── logo-white.png     ← PIR® logo (white, for dark bg)
│       └── logo-dark.png      ← PIR® logo (black, for light bg)
├── temp-gallery/              ← PUBLIC (compressed thumbnails only)
├── setup/                     ← PRIVATE (startup docs, source PDFs)
├── scripts/                   ← PRIVATE (gws CLI automation)
│   └── gws-sync.sh            ← Drive sync + thumbnail + data.json
├── assets/                    ← PRIVATE (source/high-res brand files)
├── data/
│   ├── committee/             ← PRIVATE (emails, folder IDs, config)
│   └── raw/                   ← PRIVATE (uncompressed art downloads)
├── .github/workflows/
│   └── sync-public.yml        ← Private→public sync + workflow_dispatch
├── gitexporter.config.json    ← Sync filter config
├── CLAUDE.md                  ← Agent instructions
└── README.md                  ← This file
```

---

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Frontend | Static HTML + Vanilla JS | No framework needed — runs on any CDN, zero dependencies |
| Fonts | Google Fonts (Montserrat + Merriweather) | Matches the PIR® main site |
| Hosting | GitHub Pages | Free, reliable, HTTPS, served from public repo |
| Storage | Google Shared Drive | Committee already uses Google Workspace |
| Automation | GWS CLI + GitHub Actions | Bridges Drive and GitHub without a server |
| Image compression | pngquant + sips | Keeps the public repo fast on mobile |
| Sync | git-filter-repo (in Actions) | Surgical private→public content filtering |

---

## Security Notes

- **No credentials ever touch the public repo.** Service account JSON, `.env` files, and committee member emails are gitignored and filtered out by the sync workflow.
- **Drive folder IDs** are stored only in `data/committee/config.env` (private) and never in the HTML or public `data.json`.
- **The submit form** currently shows a demo success screen until `APPS_SCRIPT_URL` is replaced with a real deployed endpoint.

---

## Contributing & Service

The Devine News hub is built and maintained as committee service. No special expertise required — only a willingness to collaborate and serve with humility.

Questions, bugs, or suggestions: open an issue on [pir-devine-news-public](https://github.com/drasticstatic/pir-devine-news-public/issues) or email `pir.devine.news@gmail.com`.

---

*©2026 Psychedelics in Recovery™ · PIR® · All Rights Reserved*

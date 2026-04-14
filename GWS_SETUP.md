# gws CLI Setup Guide — Devine News
### Connecting GitHub to Google Workspace for the PIR® Newsletter

---

## Overview

The `gws` CLI bridges the committee's Google Shared Drive with the GitHub
automation workflow. Once authenticated, the `gws-sync.sh` script:
- Checks Drive for new submissions each hour (via GitHub Actions)
- Creates Google Doc copies for committee review
- Downloads compressed art thumbnails to `temp-gallery/`
- Updates `dashboard/data.json` with the latest submission list

---

## Prerequisites

- Node.js 18+ installed (`node --version`)
- A **Google Cloud Project** with the Drive API and Gmail API enabled
- Access to `pir.devine.news@gmail.com`
- gws CLI installed: `npm install -g @googleworkspace/cli`

---

## Step 1 — Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with `pir.devine.news@gmail.com`
3. Click **Select a project** → **New Project**
4. Name it `Devine News Automation` → **Create**

---

## Step 2 — Enable the APIs

With the project selected:

1. Go to **APIs & Services → Library**
2. Search for **Google Drive API** → Enable
3. Search for **Gmail API** → Enable

---

## Step 3 — Create OAuth 2.0 Credentials

1. Go to **APIs & Services → Credentials**
2. Click **+ Create Credentials → OAuth client ID**
3. If prompted to configure the consent screen:
   - User Type: **External**
   - App name: `Devine News Automation`
   - User support email: `pir.devine.news@gmail.com`
   - Scopes: add `.../auth/drive` and `.../auth/gmail.send`
   - Test users: add `pir.devine.news@gmail.com`
4. Back in Create Credentials → OAuth client ID:
   - Application type: **Desktop app**
   - Name: `gws-desktop`
   - Click **Create**
5. Click **Download JSON** on the created credential
6. Rename the file to `client_secret.json`

---

## Step 4 — Place the Credentials File

Google downloads the file with a long name like:
`client_secret_123456789-abcdef.apps.googleusercontent.com.json`

Rename it to `client_secret.json` **before** moving it. If you rename it
in Finder, macOS may add a second `.json` extension, giving you
`client_secret.json.json`. Use the terminal to be safe:

```bash
mkdir -p ~/.config/gws
# Replace the filename below with whatever Google downloaded
mv ~/Downloads/client_secret_*.json ~/.config/gws/client_secret.json
```

If you already moved it and it ended up as `client_secret.json.json`:

```bash
mv ~/.config/gws/client_secret.json.json ~/.config/gws/client_secret.json
```

> **Never commit this file.** It is gitignored system-wide.

---

## Step 5 — Authenticate

```bash
gws auth login
```

This opens your browser. Sign in with `pir.devine.news@gmail.com` and
grant the requested Drive + Gmail permissions. Your token is stored in
`~/.config/gws/` and never touches the repo.

Verify it worked:

```bash
gws auth status
```

You should see the account listed as authenticated.

---

## Step 6 — Create the Private Config File

This file tells the sync scripts which Google Drive folders to use and
which account to operate as. It is gitignored and **never synced** to
the public repo.

**6a — Create the directory and file:**

```bash
mkdir -p data/committee
touch data/committee/config.env
```

**6b — Open the file in any text editor and paste this template:**

```env
# ── Google Drive folder IDs ─────────────────────────────────
# Find a Folder ID in the Drive URL after /folders/
# e.g. https://drive.google.com/drive/folders/1abc123XYZ
#                                                ^^^^^^^^^^^ this part

SUBMISSIONS_FOLDER_ID=your_submissions_folder_id_here
TEMPLATES_FOLDER_ID=your_templates_folder_id_here
APPROVED_FOLDER_ID=your_approved_folder_id_here
PUBLISHED_FOLDER_ID=your_published_folder_id_here

# ── Committee contacts ──────────────────────────────────────
COMMITTEE_EMAILS_FILE=data/committee/emails.txt
GOOGLE_ACCOUNT=pir.devine.news@gmail.com
```

**6c — Create the four Drive folders** (if they don't exist yet):

1. Go to [drive.google.com](https://drive.google.com) and sign in as
   `pir.devine.news@gmail.com`
2. Create a Shared Drive named **"Devine News"** (or use an existing one)
3. Inside it, create four folders:
   - `Submissions` — raw incoming member work
   - `Templates` — approved Google Doc templates
   - `Approved` — pieces cleared for layout
   - `Published` — archive of finalized editions
4. Open each folder, copy the ID from the URL, and paste it into
   `config.env` above

**6d — Create the committee emails list:**

```bash
touch data/committee/emails.txt
```

Add one committee member email per line — the sync script uses this to
send notifications. Example:

```
pir.devine.news@gmail.com
editor@example.org
```

**6e — Verify the file is gitignored:**

```bash
git check-ignore -v data/committee/config.env
```

You should see a line confirming it is ignored. If nothing appears,
add this to your `.gitignore`:

```
data/committee/
```

---

## Step 7 — Add the Drive Link to the Portal

Once your Submissions folder exists in Drive, copy its URL and add it to
`dashboard/data.json`:

```json
{
  "driveUrl": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
  "driveRequestUrl": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID?usp=sharing"
}
```

Commit and push — the Drive panel on the portal activates on next sync.

---

## Step 8 — Run the Sync

```bash
./scripts/gws-sync.sh
```

Or trigger manually from GitHub:
1. Go to your private repo → **Actions**
2. Select **Sync Public Preview**
3. Click **Run workflow** → **Run workflow**

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `gws: command not found` | `npm install -g @googleworkspace/cli` |
| `No credentials found` | Check `~/.config/gws/client_secret.json` exists |
| `Token expired` | Run `gws auth login` again |
| `403 Forbidden on Drive` | Ensure Drive API is enabled in the Cloud project |
| `Actions sync failing` | The `PUBLIC_REPO_TOKEN` secret must be set in repo Settings → Secrets |

---

*This file is intentionally public — it contains no secrets or credentials.*

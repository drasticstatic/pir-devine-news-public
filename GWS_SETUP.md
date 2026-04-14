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

The portal's Drive button stays dormant until a real URL is wired into
`dashboard/data.json`. This step activates it.

**7a — Get the Submissions folder URL:**

1. Go to [drive.google.com](https://drive.google.com) and sign in as
   `pir.devine.news@gmail.com`
2. Open the **Submissions** folder you created in Step 6c
3. Copy the URL from the browser address bar — it will look like:
   `https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWx`
4. The long string after `/folders/` is your **folder ID** —
   it should match `SUBMISSIONS_FOLDER_ID` in `data/committee/config.env`

**7b — Update `dashboard/data.json`:**

Open the file and replace the empty `driveUrl` and `driveRequestUrl` values:

```json
{
  "lastSync": "Never",
  "nextDeadline": {
    "topic": "Steps 4 & 5",
    "date": "April 30, 2026"
  },
  "driveUrl": "https://drive.google.com/drive/folders/YOUR_SUBMISSIONS_FOLDER_ID",
  "driveRequestUrl": "https://drive.google.com/drive/folders/YOUR_SUBMISSIONS_FOLDER_ID?usp=sharing",
  "submissions": []
}
```

Replace `YOUR_SUBMISSIONS_FOLDER_ID` with the real ID from Step 7a.

> `driveUrl` is used by the nav "Google Drive" link (opens Drive directly).
> `driveRequestUrl` is used by the portal's Drive panel CTA (shared link
> that lets submitters request access if they don't already have it).

**7c — Commit and push:**

```bash
git add dashboard/data.json
git commit -m "config: add Google Drive folder URL to portal"
git push origin main
```

The Drive button in the nav and the Drive panel on the portal will activate
on the next GitHub Pages deployment (usually under 2 minutes).

**7d — Verify it works:**

1. Open the live portal at `https://drasticstatic.github.io/pir-devine-news-public/`
2. Click **Links ▾ → Google Drive** in the nav — it should open the
   Submissions folder
3. The Drive panel on the index page should now show a live link instead
   of a placeholder

> **Note:** `data.json` is public (synced to the public repo). It contains
> only the Drive folder URL — never folder IDs from `config.env` or any
> other private data.

---

## Step 8 — Deploy the Submission Form Back-End

The submission form (`submit.html`) POSTs data to a Google Apps Script web app
that saves responses to a Google Sheet and emails the committee.

**8a — Open Google Apps Script:**

1. Go to [script.google.com](https://script.google.com)
2. Sign in as `pir.devine.news@gmail.com`
3. Click **+ New project** → name it `Devine News Form Handler`

**8b — Paste the script:**

The script is in `scripts/apps-script-form.gs` in this repo.
Copy the entire file contents and paste it into the Apps Script editor,
replacing the default `myFunction()` stub.

**8c — Set the Sheet ID:**

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com)
   signed in as `pir.devine.news@gmail.com` — name it `Devine News Submissions`
2. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. In the Apps Script editor, find this line near the top:
   ```js
   const SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```
   Replace `YOUR_SHEET_ID_HERE` with your real Sheet ID.

**8d — Deploy as a web app:**

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Type" → select **Web app**
3. Settings:
   - Description: `Devine News Form v1`
   - Execute as: **Me** (`pir.devine.news@gmail.com`)
   - Who has access: **Anyone**
4. Click **Deploy** → copy the **Web app URL**

**8e — Wire the URL into the submit form:**

Open `dashboard/submit.html` and find:
```js
var APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```
Replace the placeholder with the URL from Step 8d. Commit and push.

**8f — Test a submission:**

Open the live portal → Submit page. Fill out a test submission and hit send.
Check the Google Sheet — a new row should appear within seconds.

---

## Step 9 — Run the Sync

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

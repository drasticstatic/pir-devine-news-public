# gws CLI Setup Guide — De Vine News
### Connecting GitHub to Google Workspace for the PIR® Newsletter

---

## Overview

The `gws` CLI bridges the committee's Google Shared Drive with the GitHub
automation workflow. Once authenticated, the `gws-sync.sh` script:
- Checks Drive for new submissions (run manually by the committee admin)
- Copies each new literature submission into `Approved/` for committee review
- Grants all committee editors Write access on new review copies automatically
- Downloads compressed art thumbnails to `temp-gallery/`
- Updates `dashboard/data.json` with the latest submission list

> **Note:** `gws-sync.sh` is a manual admin tool — it is **not** called by
> `sync-public.yml` (that workflow only mirrors the private repo to the public
> repo). A scheduled GitHub Actions version is planned (see `ROADMAP.md`).

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

Before running the login command, you must add your account as a test user in the GCP
console — otherwise Google blocks the OAuth flow with Error 403: access_denied.

**Add test user (required — even for the project owner account):**
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → select your project
2. **APIs & Services → OAuth consent screen → Audience → Test users → + Add users**
3. Add `pir.devine.news@gmail.com` → Save

> **Note on scopes:** The **Data Access** tab (APIs & Services → OAuth consent screen → Data Access)
> is where "Add or remove scopes" lives. You do not need to manually configure scopes here —
> `gws` requests all required scopes automatically at login time. Leave this section as-is.

> **Testing mode user cap:** While publishing status is set to "Testing", only approved test
> users can access the app. The allowed user cap is 100, counted over the entire lifetime of
> the app. See https://support.google.com/cloud/answer/7454865 for more info.

Then run:

```bash
gwspdn auth login
```

This opens your browser. Sign in with `pir.devine.news@gmail.com` and grant the requested
permissions. Your token is stored in `~/.config/gws/` and never touches the repo.

Verify it worked:

```bash
gwspdn auth status
```

You should see `has_refresh_token: true` and `encryption_valid: true`.

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

PIR_DEVINE_NEWS_FOLDER_ID=your_top_level_sharing_folder_id_here
SUBMISSIONS_FOLDER_ID=your_submissions_folder_id_here
APPROVED_FOLDER_ID=your_approved_folder_id_here
STAGING_FOLDER_ID=your_staging_folder_id_here
RESOURCES_FOLDER_ID=your_resources_folder_id_here
COMMITTEE_FOLDER_ID=your_committee_folder_id_here
ARCHIVE_FOLDER_ID=your_archive_folder_id_here
GDRIVE_GUIDE_DOC_ID=your_gdrive_guide_doc_id_here

# ── Spreadsheets ────────────────────────────────────────────
# Structured index of submissions — admin agent reads this
SUBMISSIONS_SPREADSHEET_ID=your_submissions_spreadsheet_id_here

# ── Committee contacts ──────────────────────────────────────
COMMITTEE_EMAILS_FILE=data/committee/emails.txt
GOOGLE_ACCOUNT=pir.devine.news@gmail.com
```

**6c — Create the Drive folder structure** (if it doesn't exist yet):

1. Go to [drive.google.com](https://drive.google.com) and sign in as
   `pir.devine.news@gmail.com`
2. Create a top-level folder named **`pir.devine.news`** — this is the
   sharing target (Drive root itself cannot be shared directly)
3. Inside it, create these six folders:

   ```
   pir.devine.news/
   ├── 📥 Submissions/   ← form submissions land here automatically
   ├── ✅ Approved/      ← gws-sync.sh copies new submissions here
   ├── 🎬 Staging/       ← assembled newsletter awaiting holacratic vote
   ├── 📋 Committee/     ← internal docs, meeting notes, rosters
   ├── 🗄️  Resources/    ← layout files, branding, logos
   └── 🗂️  _Archive/     ← historical storage
   ```

4. Open each folder, copy the ID from the URL, and paste it into
   `config.env` above. The `apps-script-form.gs` stays at the Drive
   root (outside this shared folder) — do not move it.

**6d — Create the committee emails list:**

```bash
touch data/committee/emails.txt
```

Add one committee member email per line — when `gws-sync.sh` runs, every
address here receives automatic Writer access on new `Approved/` review
copies. This same list drives holacratic publishing notifications.

Example:

```
pir.devine.news@gmail.com
dpnelson@gmail.com
pr@psychedelicsinrecovery.org
```

You can also manage this list visually using the **📧 Committee Emails**
button on the Admin Dashboard (`admin.html`) — it shows the current editors
and lets you propose adds/removes through the agent interface.

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

> **Note:** As of April 2026, `data.json` is **no longer synced** from the
> private repo to the public repo — it is managed entirely by the Apps Script
> (see Step 8g below). The Drive URLs are baked into the Apps Script constants
> so they populate automatically on the first submission. You do not need to
> manually edit `data.json` to activate the Drive panel.

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

**8c — Sheet ID (already set):**

The **De Vine News Submissions** Google Sheet has been created under
`pir.devine.news@gmail.com`. The Sheet ID is already wired into
`scripts/apps-script-form.gs` (private — never synced public).

To find it yourself: open the sheet in Google Drive and copy the ID
from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

No changes needed to the script for this step.

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
Replace the placeholder with the URL from Step 8d. The same URL also appears
near the top of the `<script>` block in `dashboard/index.html`. Update both.
Commit and push.

**8f — Generate a GitHub Personal Access Token:**

The Apps Script needs write access to the **public** repo (`pir-devine-news-public`)
to keep `dashboard/data.json` updated with new submissions.

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name: `De Vine News — Apps Script`
4. Expiration: set a reminder to rotate annually
5. Scope: check **`public_repo` only** — private repo access is NOT required
6. Click **Generate token** and copy it immediately (it is not shown again)

**8g — Add Script Properties (secrets for the Apps Script):**

Script Properties are the Apps Script equivalent of a `.env` file — stored
server-side, never in code, never visible in the browser.

1. In the Apps Script editor, click the **gear icon (Project Settings)**
   in the left sidebar
2. Scroll to **Script properties** → click **Add script property** for each:

| Property name    | Value                                                         |
|------------------|---------------------------------------------------------------|
| `GITHUB_TOKEN`   | The PAT you generated in Step 8f                             |
| `ADMIN_PASSWORD` | A passphrase for the dashboard removal gate (your choice)    |

3. Click **Save script properties**

> **`ADMIN_PASSWORD`** gates the **🔒 Manage** button on the dashboard.
> It is validated server-side — a wrong guess never unlocks the UI.
> Choose something memorable but not trivial. To change it later, just
> update the Script Property value — no re-deploy needed.

**8h — Re-deploy after adding properties:**

Script Properties take effect immediately, but the web app must be on the
latest code version. After pasting updated script code or adding properties:

1. Click **Deploy → Manage deployments**
2. Click the **pencil (edit)** icon on the active deployment
3. Change **Version** to **New version**
4. Click **Deploy** — the URL stays the same

**8i — Test the full pipeline:**

1. Open the live portal → Submit page. Fill out a test submission and send.
2. Check **two places** within ~10 seconds:
   - The **Google Sheet** — a new row should appear
   - The **dashboard index page** — click ↺ Refresh; the submission card should appear
3. Test the removal gate: click **🔒 Manage**, enter the admin passphrase,
   then click **✕ Remove** on the test card. It should disappear and the
   Sheet row should show **Archived**.

**Rotating the GitHub token later:**

When the PAT expires (or you rotate it manually), generate a new one with the
same `public_repo` scope and update the `GITHUB_TOKEN` Script Property.
No re-deploy is needed — the property is read at runtime.

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
| `Token expired` or `invalid_grant` | Run `gwspdn auth login` (see Re-authentication below) |
| `403 Forbidden on Drive` | Ensure Drive API is enabled in the Cloud project |
| `Actions sync failing` | The `PUBLIC_REPO_TOKEN` secret must be set in repo Settings → Secrets |
| Submission email arrives but dashboard never updates | `GITHUB_TOKEN` missing or expired — add/renew in Script Properties |
| `"ADMIN_PASSWORD not set"` error on removal | Add `ADMIN_PASSWORD` to Script Properties (no re-deploy needed) |
| `"Incorrect password"` on removal | Re-enter carefully; update Script Property value if forgotten |
| `GitHub PUT failed: 404` | Wrong `GH_OWNER`/`GH_REPO` constants in script, or token lacks `public_repo` scope |
| `GitHub PUT failed: 409 Conflict` | Two simultaneous submissions (very rare) — refresh and re-submit |
| Dashboard shows stale data after removal | Click ↺ Refresh; GitHub Pages CDN may cache for up to 60 s |

---

## Re-authentication

OAuth tokens for `gwspdn` expire periodically (Google may also revoke them if the account is
inactive or the app is re-authorized). When you see `invalid_grant` or `Token expired`:

```bash
gwspdn auth login
```

This opens your browser. Sign in with `pir.devine.news@gmail.com` and re-grant permissions.
The new token is written to `~/.config/gws/` automatically.

**Never run** `gws auth login` (bare) or
`GOOGLE_WORKSPACE_CLI_CONFIG_DIR=... gws auth login` in front of `gwspdn` —
the alias already sets the config dir. Double-setting it is harmless but confusing.

Verify the token is fresh:

```bash
gwspdn auth status
```

You should see `has_refresh_token: true` and `encryption_valid: true`.
No re-deploy of any script is needed after re-authentication — only the CLI token refreshes.

---

## Multi-Account Setup (Running Multiple gws Profiles)

If you use `gws` across multiple Google accounts or projects, each account gets its own
isolated config directory and a named shell alias so they never collide. Never rely on
the bare `gws` binary default — always use a named alias so the account is explicit.

**Naming convention:** `gws<abbrev>` — a short descriptive alias per project.
For this repo, the alias is `gwspdn` (short for **P**IR-**D**evine-**N**ews).

| Alias | Account | Config Dir | GCP Project |
|-------|---------|-----------|-------------|
| `gwspdn` | `pir.devine.news@gmail.com` | `~/.config/gws/` | `devine-news-automation` |
| `gws<abbrev>` | `your-other-account@gmail.com` | `~/.config/gws-<project>/` | `your-gcp-project` |

**APIs enabled for `devine-news-automation`:** Drive, Docs, Sheets, Slides, Gmail.
The Drive API alone is sufficient to create and copy Google Docs (via mime type); the
Docs, Sheets, and Slides APIs enable direct content editing if needed in the future.

To add a profile for another project:

```bash
# 1. Create a config dir and place the new project's client_secret.json in it
mkdir -p ~/.config/gws-<project>
mv ~/Downloads/client_secret_*.json ~/.config/gws-<project>/client_secret.json

# 2. Add a named alias to ~/.zshrc
echo "alias gws<abbrev>='GOOGLE_WORKSPACE_CLI_CONFIG_DIR=~/.config/gws-<project> gws'" >> ~/.zshrc
source ~/.zshrc

# 3. Authenticate under the new profile
gws<abbrev> auth login
```

Each profile requires its own GCP project with the relevant APIs enabled and its own
OAuth Desktop client credentials (see Steps 1–5 above, repeated for each account).

> Each `~/.config/gws-*/` directory is local-only and should never be committed.

---

## How Aliases Work in Practice

**Why `~/.config/gws/` instead of `~/.config/gws-pir-devine-news/`?**

When `gws` was first installed on this machine, it created `~/.config/gws/` as its default
config directory. The existing credentials and tokens live there. Renaming the directory
would break any scripts or GitHub Actions that reference the path directly. New profiles
added later get explicit descriptive names (e.g. `~/.config/gws-<project>/`) — but the
original stays at `~/.config/gws/`. The `gwspdn` alias explicitly points to `~/.config/gws/`,
so there is never any ambiguity when using the alias.

**Will existing scripts and automation continue to work without the alias?**

Yes. GitHub Actions, cron jobs, and shell scripts that call `gws` directly are unaffected
by alias setup. An alias only applies to interactive shell sessions. Scripts that need to
target a specific account set `GOOGLE_WORKSPACE_CLI_CONFIG_DIR` themselves (or run in an
environment where only one profile exists). The alias is a convenience for humans typing
commands at the terminal — not a dependency for automation.

**How does an AI assistant (e.g. Claude) know which alias to use?**

Each repo contains a `CLAUDE.md` file — a plain-text instruction file read by Claude Code
at the start of every session. It documents the repo's account, alias, tools, and
conventions. When Claude generates a `gws` command for this repo, it uses `gwspdn` because
`CLAUDE.md` says to. Claude does not run the alias itself — it produces the correct command
for the operator to run. The alias in your shell (`~/.zshrc`) does the actual account
routing when you execute that command.

If you are setting up a new machine or onboarding a new team member, add the alias to
their `~/.zshrc` as shown in Step 6 above. Without it, they would need to pass the full
`GOOGLE_WORKSPACE_CLI_CONFIG_DIR=...` prefix manually every time.

---

## Why gws-sync.sh and apps-script-form.gs Rarely Need Code Changes

When configuration changes (new editors, updated folder IDs, a new spreadsheet), neither script usually needs a code edit. They're designed to read their settings from external files at runtime:

| What changed | Where to update | Why no code change needed |
|---|---|---|
| Add/remove an editor | `data/committee/emails.txt` | Script loops over the file at runtime |
| Add a reviewer | `data/committee/reviewers.txt` | Same pattern — file is read fresh every run |
| New or renamed Drive folder | `data/committee/config.env` | All folder IDs are sourced at startup via `source "$CONFIG_FILE"` |
| New spreadsheet | `data/committee/config.env` | Same — `SUBMISSIONS_SPREADSHEET_ID` read from config |

`apps-script-form.gs` is a separate pipeline entirely — it runs in Google's cloud, talks directly to the GitHub API via a stored PAT, and has no awareness of `emails.txt`, `config.env`, or `gws-sync.sh`. The two scripts share only the Drive folder as a handoff point: the Apps Script drops files into `Submissions/`, and `gws-sync.sh` picks them up. Neither knows the other exists.

**The only times you'd need to edit the scripts themselves:**
- `gws-sync.sh` — adding a new processing step (e.g. Phase 4 Staging assembly)
- `apps-script-form.gs` — PAT expires (May 15, 2026), Sheet ID changes, or repo path changes

---

## Two-Tier Drive Access Model

`gws-sync.sh` manages two levels of Google Drive access automatically:

| Tier | File | Drive role | What they can do |
|------|------|-----------|-----------------|
| **Editors** | `data/committee/emails.txt` | `writer` | Full edit access on the entire `pir.devine.news/` folder + all `Approved/` copies |
| **Reviewers** | `data/committee/reviewers.txt` | `commenter` | Read + comment on the entire `pir.devine.news/` folder — cannot edit |

Both grants happen in **Step 0** of the sync (before processing any submissions), so access is refreshed on every run. Grants are idempotent — re-granting an existing permission is a no-op and does not cause errors.

To **add a reviewer**: add their email to `data/committee/reviewers.txt` (one per line) and run the sync. To **promote a reviewer to editor**: move their email from `reviewers.txt` to `emails.txt`.

> Removing an email does **not** revoke existing Drive permissions retroactively — revocation must be done manually in the Drive sharing UI.

---

## Script Redeployment — What Needs Updating After gws-sync.sh Changes

**Does changing `scripts/gws-sync.sh` require any redeployment?**

No. `sync-public.yml` (the GitHub Actions workflow) only syncs dashboard files to the
public repo — it never calls `gws-sync.sh` at all. That script runs manually from your
local machine. Since the changes are committed and pushed to the private repo, you only need:

1. `git pull` on any machine where you plan to run the script
2. `gwspdn auth status` — if it shows `token_error`, run `gwspdn auth login` to
   re-authenticate before testing the script

**Does changing `gws-sync.sh` affect `apps-script-form.gs`?**

No. `scripts/apps-script-form.gs` is a Google Apps Script that runs in Google's cloud
environment as a deployed Web App. It talks directly to the GitHub API using a stored PAT —
it never uses the gws CLI, `gwspdn`, or anything in `scripts/gws-sync.sh`. Changes to the
local CLI setup have zero effect on the Apps Script. The only time you need to update
`apps-script-form.gs` is if the GitHub PAT expires (currently set to expire **May 15, 2026**)
or if the Sheet ID, repo path, or email address changes.

---

*This file is intentionally public — it contains no secrets or credentials.*
*Last updated: April 2026 — alias gwspdn; gwsdc/gwsds added to multi-account table; all APIs enabled on devine-news-automation.*

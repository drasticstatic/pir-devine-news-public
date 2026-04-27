---
name: marp-deck
description: >
  Use to generate a PIR-branded Marp slide deck from a newsletter edition, briefing,
  or documentation file. TRIGGER when: "create a deck for", "make slides from",
  "marp this", "turn [edition/doc] into slides", "reader view for [edition]",
  "shareable deck", "Marp version of". Do NOT use for: creating the underlying
  newsletter HTML (build that first), or when the user wants a formatted markdown
  export rather than slides.
---

# Skill: /marp-deck

Convert any De Vine News document into a shareable PIR-branded Marp slide deck and generate the HTML output.

## Quick Command

```bash
# Generate HTML from any .marp.md file
~/.nvm/versions/node/v22.12.0/bin/marp dashboard/[name].marp.md -o dashboard/[name].marp.html

# Or for setup/docs
~/.nvm/versions/node/v22.12.0/bin/marp setup/[name].marp.md -o setup/[name].marp.html
```

## Before Starting

1. Confirm the source document or edition HTML exists and is complete
2. Identify output location: `dashboard/` for editions/newsletter reader view, `setup/` for documentation
3. Read the source to extract key content and structure

## Step 1 — Identify Content Type

| Source | Deck Type | Key Slides |
|--------|-----------|-----------|
| Newsletter edition HTML | Reader view | Cover, theme intro, each section, closing reflection, archive |
| Bulletin | Announcement deck | Header, each announcement, service positions, CTA |
| Submission guidelines | Onboarding deck | What to submit, what works, deadlines, how to submit |
| Roadmap/planning doc | Vision deck | Phase overview, what's live, what's next, how to contribute |

## Step 2 — Create the .marp.md File

Use this front-matter for all De Vine News decks:

```markdown
---
marp: true
theme: default
paginate: true
backgroundColor: '#000814'
color: '#e8e8f0'
style: |
  h1 { color: #00d082; border-bottom: 2px solid #00d082; padding-bottom: 12px; }
  h2 { color: #7c3aed; margin-bottom: 0.4em; }
  h3 { color: #06b6d4; }
  strong { color: #00d082; }
  em { color: #a78bfa; font-style: normal; }
  code { background: #0a1628; color: #00d082; padding: 2px 6px; border-radius: 3px; }
  pre { background: #050e1c; border: 1px solid #1a2f4a; border-radius: 6px; padding: 1em; }
  table { border-collapse: collapse; width: 100%; font-size: 0.85em; }
  th { background: #0a1628; color: #00d082; padding: 6px 12px; }
  td { border: 1px solid #1a2f4a; padding: 5px 12px; background: #050e1c; color: #e8e8f0; }
  blockquote { border-left: 4px solid #7c3aed; padding-left: 1em; color: #9ca3af; font-style: italic; font-size: 1.05em; }
  .subtitle { color: #6b7280; font-size: 0.8em; margin-top: 0.5em; }
  section { font-family: 'Montserrat', system-ui, sans-serif; }
---
```

**Why PIR theme:** Navy `#000814` matches the portal background. Green `#00d082` is the PIR brand accent. Purple `#7c3aed` adds warmth for section headers. This keeps the Marp reader view visually consistent with the main site.

**Slide rules:**
- One idea or piece per slide — if a slide needs scrolling, split it
- Quote/reflection slides: use `blockquote` — most powerful content type for this audience
- Tables: max 6 rows before splitting
- Each slide starts with `---` on its own line
- Lead with the monthly theme and reflection — that's what members come for

## Step 3 — Newsletter Edition Structure

```markdown
---
marp: true
theme: default
paginate: true
backgroundColor: '#000814'
color: '#e8e8f0'
style: |
  [paste style block from Step 2]
---

<!-- Cover slide -->
# De Vine *News*
**[Month] [Year] — Theme: [Theme]**

*PIR® Newsletter · Psychedelics In Recovery™*

---

<!-- Theme intro -->
## This Month: [Theme]

> "[Opening reflection or theme description]"

---

<!-- Each submission becomes its own slide or 2-3 slides -->
## [Title of Piece]
*by [Author or "A PIR® Member"]*

[Content — break at natural paragraph breaks]

---

<!-- If piece continues -->
[Continued content]

---

<!-- Closing slide -->
## Until Next Month

> "[Closing reflection]"

**Submit for [Next Month]:** [deadline date]
*Theme: [next theme]*

[Submit link or QR code placeholder]

---

<!-- Archive / back to portal -->
## Read More

📚 All editions: [portal URL]
✍️ Submit your story: [submit URL]
```

## Step 4 — Naming Convention

```
newsletter-[month]-[year].marp.md
newsletter-[month]-[year].marp.html
```

Examples:
- `newsletter-may-2026.marp.md` → May edition reader view
- `newsletter-april-2026.marp.md` → April edition reader view

**Location:** `dashboard/` — same directory as the HTML editions so relative links work.

## Step 5 — Generate HTML

```bash
~/.nvm/versions/node/v22.12.0/bin/marp dashboard/newsletter-[month]-[year].marp.md \
  -o dashboard/newsletter-[month]-[year].marp.html
```

Verify in browser: check that blockquotes render in purple, tables are readable on dark background, and the PIR logo image path resolves if embedded.

## After Completing

1. Verify HTML opens and all slides render
2. Add a "📖 Reader View" link to the corresponding newsletter HTML page
3. Commit both `.marp.md` and `.marp.html`:
   `"Add Marp reader view for [Month] [Year] edition"`
4. The HTML is what gets shared — GitHub doesn't render `.marp.md`

## Reference

- Marp binary: `~/.nvm/versions/node/v22.12.0/bin/marp`
- Quick syntax reference: `.claude/skills/marp-quick-reference.md`
- PIR brand colors: `#000814` navy · `#00d082` green · `#7c3aed` purple · `#06b6d4` cyan

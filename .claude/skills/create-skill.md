---
name: create-skill
description: >
  Use when Christopher wants to design, draft, or build a new Claude Code skill for
  the pir-devine-news repo. TRIGGER when: "create skill", "build skill for", "make a skill",
  "new skill for [task]", "draft a skill". Do NOT use for: general task execution,
  explaining how skills work conceptually, or executing a skill that already exists.
---

# Skill: /create-skill

Design a new Claude Code skill for De Vine News. Produce a draft ready for review.

## The 7 Rules for Effective Skills

1. **Debug with description echo:** Ask "When would you use the [skill-name] skill?" — Claude quotes the description back. Reveals what's vague.
2. **Negative triggers matter more than positive:** The "Do NOT use for..." line prevents skill hijacking. Write it first.
3. **Skills stack with CLAUDE.md and memory:** Skill = process. CLAUDE.md = context and rules. Don't repeat CLAUDE.md rules inside the skill.
4. **Build from what already worked:** Best skills are reverse-engineered from prompts that worked well in past sessions.
5. **Description is everything:** Too vague → skill never fires. Too broad → hijacks conversations. Test both.
6. **Laziness workaround:** If Claude cuts corners, add "Take your time. Quality over speed." to the invocation, not the skill file.
7. **Skills are portable:** The format is an open standard. Build once, works across sessions.

## Skill File Format

```markdown
---
name: skill-name
description: >
  One or two sentences. TRIGGER when: [specific conditions].
  Do NOT use for: [anti-triggers — be specific].
---

# Skill: /skill-name

[Full instructions. Only the 3-line header loads at context start;
full body only loads when triggered.]

## Before Starting
[What to read/check]

## Steps
[Numbered process]

## Output Format
[What the result looks like]

## After Completing
[Cleanup, commits, follow-on actions]

## Quick Commands
[Exact bash commands with [PLACEHOLDER] for anything variable]
```

## PIR Skills in This Repo

| Skill | Status | What It Does |
|-------|--------|-------------|
| `/marp-deck` | ✅ Built | Convert a newsletter edition or doc to a PIR-branded Marp slide deck |
| `/new-edition` | 📋 Planned | Scaffold a new newsletter HTML file from template |
| `/publish-edition` | 📋 Planned | Wire a completed edition into portal + sidenav + archive |
| `/update-theme` | 📋 Planned | Update monthly theme in submit.html dropdown and sidenav |
| `/update-deadline` | 📋 Planned | Update submission deadline across all pages |
| `/sync-report` | 📋 Planned | Summarize current data.json state, last sync, pending submissions |
| `/new-submission` | 📋 Planned | Manually add a submission entry to data.json |
| `/admin-chat` | 💡 Vision | Trigger Phase 4 AI admin chatbot session |

## How to Create a Skill

1. Describe what you want the skill to do
2. Draft following the format above — start with the `Do NOT use for` line
3. Test: ask "When would you use the [skill-name] skill?"
4. Save to `.claude/skills/skill-name.md`
5. Add to the skills table above and to ROADMAP.md skills section

## Version Control Safety

Skills in `.claude/skills/` are tracked in git.
**Never include in a skill file:**
- Passwords, passphrases, or API keys — use `[PLACEHOLDER]`
- Specific committee member names or emails
- Real Google Drive folder IDs — use `[FOLDER_ID]`
- Any content from `data/committee/` or `.env` files

## Reference

- Framework: [makemyskill.com](https://makemyskill.com)
- Quick syntax: `.claude/skills/marp-quick-reference.md`

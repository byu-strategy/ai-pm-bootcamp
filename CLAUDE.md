# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Quarto book project for the BYU AI PM Bootcamp, a workshop for product managers who already use Claude Code, centered on the Agent Team Kit. The book is published as a static website via GitHub Pages.

**Project Type**: Quarto Book
**Output Format**: HTML website
**Deployment**: GitHub Pages (automated via GitHub Actions)
**Author**: Scott Murff
**Target Audience**: Technical PMs learning AI-assisted prototyping and development

## Build and Development Commands

### Preview the Book Locally

```bash
quarto preview
```

This starts a local development server with live reload. The book will be available at `http://localhost:4200` (or similar).

### Render the Book

```bash
quarto render
```

Builds the complete book into the `_book/` directory. This is what gets deployed to GitHub Pages.

### Render a Single Chapter

```bash
quarto render 01-vibe-coding.qmd
```

Useful for testing changes to a specific chapter without rebuilding the entire book.

## Project Structure

### Content Organization

The book follows a three-part structure defined in `_quarto.yml`:

1. **Start Here** - self-paced on-ramp for anyone not yet fluent with Claude Code (00-04)
2. **Workshop** - the live session, built around the Agent Team Kit (10-15)
3. **Resources** - kit reference and thought leaders (90-99)

### Key Files

- `_quarto.yml` - book structure: Start Here, Workshop, Resources
- `index.qmd` - welcome, two tracks, the six-skill builder model, agenda, bio
- Start Here (self-paced on-ramp): `00-setup.qmd`, `01-how-agents-work.qmd`, `02-directing-the-agent.qmd`, `03-git-deployment.qmd`, `04-first-build.qmd`
- Workshop (taught live): `10-the-harness.qmd`, `11-surfaces.qmd`, `12-agent-team-kit.qmd`, `13-spec-to-release.qmd`, `14-lab.qmd`, `15-software-factory.qmd`
- Resources: `90-kit-reference.qmd`, `97-thought-leaders.qmd`
- `_header.html` / `_footer.html` - Custom HTML injected into all pages
- `styles.css` - Custom CSS styling

### Where the content comes from

Rebuilt 2026-10-19 as a reusable site: keep it generic (no event dates, times, venues, or one-off logistics), since the workshop runs repeatedly and attendees refer back to it. The agenda is in minutes, three hours in all. Most pages are condensed from the Product
Management course book (`~/courses/product-management`, chapters 01, 02, 06b, 09, A2, A3, 09c)
and from the Agent Team Kit (`~/ai-foundry-byu/agent-team-kit`). When either source changes,
the matching page here may need the same change. The pre-rebuild chapters are in git history.

### Learn in Claude buttons

`_extensions/learn` (copied from the Product Management book) adds a button to every `##` section
whose first paragraph opens with `**The model:**`. The button copies a prompt that runs the
`/learn` skill, whose single source is `byu-strategy/builder-template` (`.claude/skills/learn`);
its fetcher reads any `byu-strategy.github.io/<book>/` link from the repo `byu-strategy/<book>`.
To give a section a button, write its model line. The prompt installs the skill into the
attendee's `~/.claude/skills/learn`, not into their repo.

### Chapter Naming Convention

- `00-04` - Start Here
- `10-15` - Workshop
- `90-99` - Resources

## Deployment

### Automatic Publishing

The book automatically deploys to GitHub Pages when changes are pushed to the `main` branch via `.github/workflows/publish.yml`.

**Workflow steps:**
1. Checks out repository
2. Sets up Python 3.12 and installs Jupyter + dependencies
3. Installs Quarto CLI (version 1.8.24)
4. Renders the Quarto project
5. Uploads `_book/` directory as artifact
6. Deploys to GitHub Pages

### Python Dependencies

The GitHub Actions workflow installs:
- `jupyter`
- `nbformat`
- `ipykernel`
- Any packages in `requirements.txt` (if present)

This ensures Python code chunks in `.qmd` files can execute during rendering.

## Content Development Guidelines

### Quarto Markdown (.qmd) Files

Chapters are written in Quarto markdown, which extends standard markdown with:
- YAML frontmatter for metadata
- Code chunks (Python, R, etc.)
- Special callout blocks
- Citation support via BibTeX

### Embedding Tweets

The book uses custom tweet embedding with centered layout:

```markdown
::: tweet-center
<blockquote class="twitter-tweet">
<p lang="en" dir="ltr">Tweet text...</p>
— Author (@handle) <a href="...">Date</a>
</blockquote>
:::

```{=html}
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
```
```

### Code Execution Settings

From `_quarto.yml`:
```yaml
execute:
  eval: false
```

By default, code chunks are shown but **not executed** during rendering. Override per-chunk with `{python eval=true}` if needed.

## Theme and Styling

**Theme**: Cosmo (from Bootswatch)
**Custom CSS**: `styles.css`
**External links**: Open in new window
**TOC**: Enabled with title "On this page"
**Sections**: Not numbered by default

## Workshop Context

Attendees already use Claude Code (or Codex or Copilot). The workshop covers surfaces, the
harness (rules, hooks, MCP, subagents), and the Agent Team Kit: parallel agents, spec to
release, and a hands-on install lab. Writing follows the course-book rules in the hub
CLAUDE.md: no em dashes, no mannered prose, no hype.

## Git Workflow

**Main branch**: `main`
**Deployment**: Automated on push to `main`
**Large files ignored**: `.gitignore` excludes common build artifacts

When making changes:
1. Edit `.qmd` files for content
2. Test locally with `quarto preview`
3. Commit and push to `main`
4. GitHub Actions handles the rest

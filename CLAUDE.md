# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Quarto book project for the BYU AI PM Bootcamp 2025, a workshop teaching Product Managers how to build full-stack applications using AI-assisted development tools like Claude Code. The book is published as a static website via GitHub Pages.

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

1. **Overview** - Introduction and computer setup instructions
2. **Topics** - Core workshop content chapters (numbered 01-05)
3. **Resources** - Reference materials, checklists, tools (numbered 95-99)

### Key Files

- `_quarto.yml` - Main configuration file defining book structure, chapters, and output settings
- `index.qmd` - Landing page and schedule
- `00-computer-set.qmd` - Pre-workshop setup instructions for installing Claude Code, VS Code, Git, Node, Python
- `01-vibe-coding.qmd` - Introduction to AI-assisted coding and the vibe coding movement
- `02-spec-driven-development.qmd` - Structured approach to feature development
- `03-git-deployment.qmd` - Version control and deployment workflows
- `04-power-users.qmd` - Power user techniques and advanced workflows
- `99-prompts.qmd` - Prompt engineering resources
- `99-first-prototype.qmd` - Building first prototypes and command line basics
- `99-llms-prompt-engineering.qmd` - LLMs and prompt engineering fundamentals
- `95-eng-checklist.qmd` - Engineering checklist
- `96-code-base-review.qmd` - Code base review guidelines
- `97-thought-leaders.qmd` - Thought leaders in AI-assisted development
- `98-tools.qmd` - Tools and resources
- `_header.html` / `_footer.html` - Custom HTML injected into all pages
- `styles.css` - Custom CSS styling
- `references.bib` - Bibliography for citations
- `informs.csl` - Citation style

### Chapter Naming Convention

- `00-*` - Setup and prerequisites
- `01-04` - Core workshop topics (active chapters in Topics section)
- `95-99` - Resources, tools, and appendices

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

This book supports a hands-on workshop where participants:
- Install Claude Code, VS Code, Git, Node, and Python
- Build prototypes using AI-assisted development
- Learn command-line fundamentals
- Follow spec-driven development workflows
- Deploy applications to production

The workshop emphasizes becoming a "Full-Stack Product Builder" who can use AI tools to rapidly prototype and ship products without waiting for engineering support.

## Git Workflow

**Main branch**: `main`
**Deployment**: Automated on push to `main`
**Large files ignored**: `.gitignore` excludes common build artifacts

When making changes:
1. Edit `.qmd` files for content
2. Test locally with `quarto preview`
3. Commit and push to `main`
4. GitHub Actions handles the rest

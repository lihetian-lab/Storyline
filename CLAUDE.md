# CLAUDE.md — Storyline

## Project Overview

**Storyline** is a new project under initial setup. The repository is hosted at `github.com/lihetian-lab/Storyline`.

**Current state**: The repo contains only an initialization script (`start`). No application code, dependencies, or build tooling have been added yet.

## Repository Structure

```
Storyline/
├── .git/          # Git repository metadata
├── start          # Repo initialization shell script
└── CLAUDE.md      # This file — guidance for AI assistants
```

## Git Workflow

- **Default branch**: `main` (remote), `master` (local legacy name from init)
- **Feature branches**: Use `claude/` prefix for AI-assisted development branches
- Push with: `git push -u origin <branch-name>`

## Development Setup

No build system, package manager, or dependencies are configured yet. When the project is initialized:

1. Update this file with the chosen framework, language, and tooling
2. Document all scripts (build, test, lint, format)
3. Document the directory structure as it evolves

## Conventions for AI Assistants

- Read existing code before proposing changes
- Keep changes minimal and focused on the task at hand
- Do not add unnecessary abstractions, comments, or documentation beyond what is requested
- When the project gains a test suite, run tests before committing
- When the project gains a linter/formatter, run it before committing
- Commit messages should be concise and describe the "why" not just the "what"

## Updating This File

This file should be updated whenever:
- A framework or language is chosen for the project
- Build tooling, linters, or formatters are added
- The directory structure changes significantly
- New development workflows or CI/CD pipelines are introduced
- Key architectural decisions are made

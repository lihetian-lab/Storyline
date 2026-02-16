# CLAUDE.md — Storyline

## Project Overview

**Storyline** is an LLM chat frontend for local models. It connects to **KoboldCpp** (serving Mistral 24B in llamacpp format) via the OpenAI-compatible API.

Repository: `github.com/lihetian-lab/Storyline`

## Tech Stack

- **Frontend**: Vue 3 + Vite
- **Styling**: Pure CSS (dark theme, no UI library)
- **Markdown**: marked + highlight.js
- **Backend**: KoboldCpp (external, default `localhost:5001`)

## Repository Structure

```
Storyline/
├── frontend/
│   ├── index.html              # HTML entry
│   ├── package.json            # Dependencies & scripts
│   ├── vite.config.js          # Vite config with API proxy
│   └── src/
│       ├── main.js             # App entry
│       ├── App.vue             # Root component
│       ├── components/
│       │   ├── Sidebar.vue     # Conversation list & nav
│       │   ├── ChatView.vue    # Main chat area
│       │   ├── MessageBubble.vue # Individual message
│       │   ├── InputArea.vue   # Message input
│       │   └── SettingsPanel.vue # Settings modal
│       ├── composables/
│       │   ├── useChat.js      # Chat logic orchestrator
│       │   ├── useKoboldApi.js # KoboldCpp API client (streaming)
│       │   └── useStorage.js   # localStorage persistence
│       ├── styles/
│       │   └── main.css        # Global styles (dark theme)
│       └── utils/
│           └── markdown.js     # Markdown rendering
├── start                       # Repo initialization script
└── CLAUDE.md                   # This file
```

## Scripts

Run from `frontend/` directory:

- `npm run dev` — Start dev server (port 3000, proxies API to KoboldCpp)
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build

## Git Workflow

- **Default branch**: `main`
- **Feature branches**: Use `claude/` prefix for AI-assisted development branches
- Push with: `git push -u origin <branch-name>`

## Conventions for AI Assistants

- Read existing code before proposing changes
- Keep changes minimal and focused on the task at hand
- Do not add unnecessary abstractions, comments, or documentation beyond what is requested
- Commit messages should be concise and describe the "why" not just the "what"

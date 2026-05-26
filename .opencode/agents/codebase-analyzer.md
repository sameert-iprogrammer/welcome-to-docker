# Codebase Analyzer Agent — welcome-to-docker

## Role & Responsibility

Analyzes this repository to produce two artifacts under `docs/ai/`:
- `docs/ai/project-context.md` — compact human-readable markdown index
- `docs/ai/context-map.json` — compact machine-readable JSON

Only creates or updates those two files. Does not modify application source code. Does not create unrelated files. Does not overwrite `governance-agent.md` or `story-analyzer.md`.

## High-Signal Inspection Paths

Inspect these areas — skip everything else:

### 1. Project Roots (glance)
- `package.json` — name, version, private flag, `dependencies`, `scripts`, `eslintConfig`, `browserslist`
- `Dockerfile` — base image, build strategy, serving approach, EXPOSE, CMD
- `README.md` and `MAINTAINERS.md` — project description, build/run instructions
- `.github/workflows/` — CI/CD pipeline (push/merge triggers)

### 2. Source Entry Points
- `src/index.js` — root render, StrictMode
- `src/App.js` — routing (pushState/popstate), auth guard, component switching

### 3. Components (detect patterns, not full contents)
- `src/Login.js` — form, localStorage auth, validation
- `src/Register.js` — form with multi-field validation, localStorage registration
- `src/Dashboard.js` — post-login view, social sharing, logout
- `src/Settings.js` — profile settings form (no persistence)
- `src/Confetti.js` — particles confetti effect

### 4. Styling
- `src/App.css` — all component styles (single file)
- `src/index.css` — body reset
- `public/index.html` — Font Awesome CDN link

### 5. Configuration & Static Assets
- `public/index.html`, `favicon.ico`, `robots.txt`
- `.opencode/agents/governance-agent.md` — project identity, code quality, architecture rules
- `.opencode/agents/_sdlc-rules.md` — shared operational constraints

### 6. Tests
- Glob `**/*.test.*` — detect test files alongside source
- If none found, note absence

## Architecture Detection Protocol

1. **Read `package.json` first** — identifies framework (React), CRA version, available scripts, dependencies.
2. **Read `src/App.js`** — confirms routing strategy (`pushState`/`popstate`, no react-router), auth pattern (localStorage guard), component composition.
3. **Read key components** — confirms functional components, hooks only, props-based communication (no context/Redux).
4. **Read `Dockerfile`** — confirms build strategy (multi-stage `node:alpine`, `serve` static SPA).
5. **Read `.github/workflows/`** — confirms deployment pipeline (only merge-main-into-small-image.yml).
6. **Read `governance-agent.md`** — absorbs all project-specific constraints (no TypeScript, no react-router, plain CSS only, etc.).
7. **Glob for test files** — confirms testing setup existence/absence.

**Do not walk every file.** Summarize patterns + link key paths.

## Convention Capture

Record only high-signal, project-specific conventions agents need repeatedly:

| Area | Convention |
|---|---|
| File naming | PascalCase for components (`Dashboard.js`), camelCase plans/utilities |
| Exports | Default export per component |
| Component pattern | Functional components, `useState`/`useEffect`/`useCallback`, props destructuring |
| Routing | `window.history.pushState` + `popstate` listener, no react-router |
| Auth | localStorage `isAuthenticated` key, mock only |
| State | Component-local `useState`, callbacks as props |
| CSS | Plain `.css` files (App.css, index.css), single-file approach |
| CSS naming | BEM-ish `.login-container`, `.login-card`, `.login-form` prefixed class names |
| Validation | Inline regex + conditional rendering of `.validation-error` divs |
| Test suffix | `.test.js` alongside source |
| Social icons | Font Awesome CDN via `<link>` in `public/index.html` |

## Dependency & Framework Derivation

Analyze `package.json` dependencies to derive patterns:
- `react`, `react-dom` → React 18 with `createRoot`
- `react-scripts` 5.0.1 → Create React App, ESLint react-app preset
- `react-particles` + `tsparticles` → confetti feature only, not a project-wide pattern
- CDN link in `public/index.html` → Font Awesome 6.4.2 for social icons

**In project-context.md output:** list only high-level stack (React 18, CRA, plain CSS, Font Awesome). Do not dump full dependency lists.

## Compact Summary Rules

### API patterns
- No API layer. No server calls. All data is localStorage.
- Two localStorage keys: `isAuthenticated` (string "true"/absent) and `registeredUsers` (JSON array).

### State management
- Component-local `useState` only. Callbacks passed as props (`navigateTo`, `onLoginSuccess`, `onLogout`).
- No context, no Redux, no external state library.

### Routing
- `src/App.js` manages routes via `window.history.pushState` + `popstate`.
- Routes: `/login` (default unauthenticated), `/register`, `/dashboard` (default authenticated), `/settings`.

### Styling
- Plain CSS in two files (`App.css` for components, `index.css` for body reset).
- No CSS-in-JS, no Tailwind, no CSS Modules.
- Font Awesome icons from CDN.

### Validation
- Inline in `Register.js`: regex email check, composite password rules (8+ chars, upper, lower, digit, special).
- Errors rendered as `.validation-error` divs, stored in component-level `errors` state object.

### Testing
- Jest + React Testing Library via `react-scripts test`.
- No test files currently exist in the repo.

### Build / Deployment
- `npm run build` → `react-scripts build` → static files in `build/`.
- Docker: `node:22-alpine` multi-stage, `serve -s build` on port 3000.
- GitHub Actions: `merge-main-into-small-image.yml` auto-merges `main` → `small-image`.
- Manual Docker push by maintainers per `MAINTAINERS.md`.

## Output Format: project-context.md

Generated file at `docs/ai/project-context.md`. Must follow:

- **Word budget:** target under 2,000 words; hard maximum 5,000 words. Prefer under ~15,000 characters.
- **Conciseness:** Prefer concise bullets. No full file summaries. No full directory inventories. No large code snippets. No pasted package/config contents. Do not repeat governance — reference `.opencode/agents/governance-agent.md`. Only high-signal, project-specific conventions.
- **Required headings** (exact or very close):
  - `# Project Context`
  - `## Stack`
  - `## Commands`
  - `## Folder Map`
  - `## Architecture Rules`
  - `## Testing Rules`
  - `## Styling and Component Rules`
  - `## Common Paths`
  - `## Deeper Docs`
  - `## Agent Notes`
- **Deeper Docs:** Link to deeper documentation if present, otherwise `None found`.
- **Agent Notes:** Short do/don't for future SDLC agents. Reference governance instead of repeating it.

## Output Format: context-map.json

Generated file at `docs/ai/context-map.json`. Must follow:

- Single valid JSON object; no comments; no markdown fences in the file; no long prose fields; no full file inventory.
- Compact JSON only, no prose.
- Use `schemaVersion: 1` and the standard shape with `agentEntryPoints` for governance, projectContext, and contextMap paths.
- Empty strings and empty arrays acceptable when unknown.

Standard shape:

```json
{
  "schemaVersion": 1,
  "project": {
    "name": "<from package.json name>",
    "type": "<React SPA | ...>",
    "stackSummary": "<one-line summary of primary stack>"
  },
  "agentEntryPoints": {
    "governance": ".opencode/agents/governance-agent.md",
    "projectContext": "docs/ai/project-context.md",
    "contextMap": "docs/ai/context-map.json"
  },
  "routing": {
    "strategy": "<pushState | react-router | next.js | ...>",
    "knownPaths": ["/login", "/register", "/dashboard", "/settings"]
  },
  "stateManagement": "<localState | context | redux | ...>",
  "styling": "<plainCSS | tailwind | cssModules | ...>",
  "testing": {
    "framework": "<jest | ...>",
    "command": "<npm test | ...>"
  },
  "buildCommand": "<npm run build | ...>",
  "devCommand": "<npm start | ...>",
  "commonPaths": {
    "source": "src/",
    "components": "src/",
    "styles": ["src/App.css", "src/index.css"],
    "config": ["package.json"],
    "deployment": ["Dockerfile"]
  },
  "keyFiles": {
    "entry": "src/index.js",
    "appRoot": "src/App.js",
    "dockerfile": "Dockerfile"
  },
  "agentNotes": "<short rules-of-thumb for future agents>"
}
```

Derive all fields from actual inspection. Do not hardcode defaults.

## Safety Rules

1. **Do not modify application source code** — read-only for `.js`, `.css`, `.html`, `.json`, `.yml`, `Dockerfile` files.
2. **Output-only paths:** `docs/ai/project-context.md` and `docs/ai/context-map.json`.
3. **No unrelated file creation:** Do not create README updates, new components, config files, or documentation outside `docs/ai/`.
4. **Do not overwrite:** `governance-agent.md`, `story-analyzer.md`, `_sdlc-rules.md` are read-only.
5. **Do not commit or push** unless explicitly instructed.
6. **Do not run destructive commands** — no install, build, deploy, or git operations unless explicitly instructed for verification.

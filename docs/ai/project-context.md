# Project Context

## Stack
- React 18 with `createRoot` API
- Create React App (react-scripts 5.0.1), plain JS (no TypeScript)
- Plain CSS (App.css + index.css), no CSS-in-JS/Tailwind/CSS Modules
- Font Awesome 6.4.2 from CDN (`public/index.html`)
- `react-particles` + `tsparticles` — confetti only, not a project-wide pattern
- No backend, no API calls, no database — all state is localStorage

## Commands
| Command | Action |
|---|---|
| `npm start` | Dev server (react-scripts) |
| `npm run build` | Production build to `build/` |
| `npm test` | Jest + RTL via react-scripts |
| `npm test -- --watchAll=false` | CI-style single run |
| `docker build -t welcome-to-docker .` | Build image |
| `docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker` | Run container |

## Folder Map
```
./
├── .github/workflows/merge-main-into-small-image.yml
├── .opencode/agents/
│   ├── _sdlc-rules.md
│   ├── codebase-analyzer.md
│   ├── governance-agent.md
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── robots.txt
├── src/
│   ├── App.js              # react-router (Routes, Route, Navigate), auth guard
│   ├── App.css             # all component styles (272 lines)
│   ├── Confetti.js         # particle confetti via react-particles + tsparticles
│   ├── Dashboard.js        # post-login view, social sharing, logout
│   ├── index.js            # root render entry point
│   ├── index.css           # body reset (13 lines)
│   ├── Login.js            # localStorage auth form
│   ├── Register.js         # multi-field registration form
│   └── Settings.js         # profile settings (no persistence)
├── Dockerfile              # multi-stage node:22-alpine + serve
├── MAINTAINERS.md          # manual Docker build/push instructions
├── package.json
└── README.md
```

## Architecture Rules
- **Routing**: react-router-dom v6 (`BrowserRouter`, `Routes`, `Route`, `Navigate`) in `src/App.js`. Routes: `/login`, `/register`, `/dashboard`, `/settings`, `/orders`, `/profile`.
- **Auth**: localStorage mock only. Key `isAuthenticated` = `"true"` / absent + `registeredUsers` JSON array. No real auth.
- **State**: Component-local `useState`. Navigation via `useNavigate()` hook from react-router-dom. No context, no Redux.
- **Components**: Functional components, default exports, hooks only (`useState`, `useEffect`, `useCallback`). Props destructuring.
- **Validation**: Inline regex in `Register.js:9-31` — email regex, composite password rules. Rendered as `.validation-error` divs.
- **No server code, no TypeScript, no styling frameworks**. See `.opencode/agents/governance-agent.md` for full constraints.

## Testing Rules
- Jest + React Testing Library via `react-scripts test`. ESLint preset `react-app/jest`.
- Test suffix: `.test.js` alongside source component file.
- **No test files currently exist** in the repo.
- At minimum smoke-test new components (render without crashing).

## Styling and Component Rules
- Plain CSS only: `src/App.css` (all component styles) + `src/index.css` (body reset).
- BEM-ish class naming: `.login-container`, `.login-card`, `.login-form`, `.login-input`, `.login-submit-btn`, `.dashboard-nav`, `.logout-btn`.
- Single CSS file for components; no new `.css` files to be created.
- Font Awesome icons via CDN (`<link>` in `public/index.html`).
- File naming: PascalCase for components, camelCase for utilities.

## Common Paths
- Entry point: `src/index.js`
- App root + routing: `src/App.js`
- Components: `src/` (flat, no subdirectories)
- Styles: `src/App.css`, `src/index.css`
- Docker: `Dockerfile` (multi-stage `node:22-alpine`, `serve -s build` on port 3000)
- CI: `.github/workflows/merge-main-into-small-image.yml` (auto-merge `main` → `small-image`)
- Governance: `.opencode/agents/governance-agent.md`
- SDLC rules: `.opencode/agents/_sdlc-rules.md`

## Deeper Docs
- `MAINTAINERS.md` — manual Docker buildx multi-arch push instructions.
- `README.md` — basic build/run instructions.
- No other documentation artifacts found.

## Agent Notes
- **Do**: Make minimal focused changes. Preserve pushState routing, localStorage auth, plain CSS. Follow governance constraints.
- **Do not**: Add TypeScript, backend, state management libs, CSS frameworks, or new pages. Never modify Dockerfile build strategy or GitHub Actions workflows. No speculative refactors.
- Reference `.opencode/agents/governance-agent.md` before any change. Reference `.opencode/agents/_sdlc-rules.md` for change discipline.

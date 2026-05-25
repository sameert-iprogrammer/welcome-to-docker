# Governance Agent — welcome-to-docker

## Project Identity

- **Type**: Educational/demo React SPA for Docker new-user onboarding
- **Stack**: React 18, Create React App (react-scripts 5.0.1), plain CSS, JavaScript (no TypeScript)
- **Routing**: Client-side via `window.history.pushState` (no react-router)
- **Auth Simulation**: localStorage mock (no real backend, no API calls)
- **Testing**: Jest via `react-scripts test`
- **Build**: `react-scripts build` → served via `serve` in Docker
- **Deployment**: Multi-arch Docker images published to `docker/welcome-to-docker` on Docker Hub
- **Branch Strategy**: `main` → auto-merged to `small-image` via GitHub Actions; manual Docker push by maintainers

## Code Quality Rules

- Fix all ESLint errors (`react-app`/`react-app/jest` presets). Do not suppress warnings without explicit approval.
- Preserve JSX patterns: functional components, hooks (`useState`, `useEffect`, `useCallback`), default exports.
- Do not introduce TypeScript, CSS-in-JS, Tailwind, or any styling framework — plain CSS only (App.css, index.css).
- Keep existing file naming: PascalCase for components (`Dashboard.js`), camelCase for utilities.
- Tests live alongside source. Add/modify tests when changing logic, not presentation-only code.
- No speculative refactors, renames, or style cleanups. Change only what the task requires.

## Architecture Rules

- **No react-router**: The app uses `window.history.pushState` + `popstate` listener in App.js. Do not introduce a routing library.
- **No backend**: All state is localStorage-based. Do not add server code, API calls, database, or backend dependencies.
- **Component pattern**: Components receive `navigateTo` and callbacks as props. Do not introduce context, Redux, or state management libraries.
- **DO NOT** change the Dockerfile build strategy (multi-stage, `serve`, Alpine) or the deploy workflow (GitHub Actions → Docker Hub).
- **DO NOT** add new pages/routes not required by the task.
- Preserve the existing CSS class naming scheme and file organization (single App.css for component styles).

## Security Rules

- This is a **demo app**. No real authentication, encryption, or secrets management is needed.
- Never commit real credentials, tokens, or secrets.
- Never introduce authentication libraries (Auth0, Firebase Auth, Passport, etc.).
- Do not add `helmet`, `cors`, rate-limiting, or production security middleware — this app has no server.
- Warning: localStorage auth is insecure. If a task implies real security, flag it.

## Testing Expectations

- Use `react-scripts test` (Jest + React Testing Library).
- At minimum, smoke-test new components (render without crashing).
- Use `.test.js` suffix alongside the component file.
- Do not add testing libraries beyond what CRA provides.
- Run `npm test -- --watchAll=false` before completing any change that touches logic.

## File/Folder Modification Rules

| Allowed | Forbidden |
|---|---|
| Edit existing components in `src/` | Create files outside `src/`, `.opencode/`, or root config |
| Add new `.js` component files in `src/` | Add `.ts`, `.tsx`, `.vue`, or non-JS source files |
| Edit `App.css` or `index.css` | Create new `.css` files (use existing ones) |
| Add `.test.js` alongside source | Modify `Dockerfile` unless task is deployment-related |
| Edit `.opencode/agents/*.md` | Modify GitHub Actions workflows |
| Add root config (`.eslintrc`, `.prettierrc`) if aligned with existing | Add `Dockerfile` variants (dev, prod, multi-stage changes) |

## Dependency Usage Rules

- **DO NOT** add: `react-router`, `axios`, `express`, `redux`, `typescript`, `tailwindcss`, `next.js`, `gatsby`, `webpack` (already via CRA), `babel` configs.
- **Allowed** additions: small utility libs (`lodash`-like, `date-fns`) if justified; testing helpers only if essential.
- Prefer existing dependencies: `react-particles`, `tsparticles` are for the confetti feature only.
- Before adding any npm dependency, justify in writing and prefer a no-dependency solution.
- Run `npm install --no-fund --no-audit` if adding packages.

## Review Checklist

Before completing any work, verify:
- [ ] Only files explicitly required were created/modified
- [ ] No new dependencies were added (or justified)
- [ ] No TypeScript, react-router, backend, or state management introduced
- [ ] ESLint passes (`npx react-scripts build` and/or direct lint check)
- [ ] Existing tests pass (`npm test -- --watchAll=false`)
- [ ] No real credentials or secrets in code
- [ ] Dockerfile untouched unless deployment change was required
- [ ] No changes to GitHub Actions workflows or branch strategy
- [ ] No speculative/off-topic refactors or cleanups
- [ ] No new CSS files created

## Instructions for Future AI Agents

1. Read this governance agent first before making any changes.
2. Check `package.json` scripts to validate: `npm test`, `npm run build`.
3. Understand this is a **learning demo** — it intentionally simulates auth and has no backend.
4. Do not "productionize" the app. No real auth, no API integration, no database, no TypeScript migration.
5. When in doubt, do less. Minimal change is the default.
6. If the task conflicts with these rules, flag it before acting.
7. Keep `_sdlc-rules.md` conventions in parallel with this file.

## Prohibited Changes (Hard Blocks)

- **No server code** — no Express, no API routes, no server-side rendering.
- **No TypeScript migration** — keep `.js` and plain JS.
- **No routing library** — keep `pushState`-based SPA routing.
- **No new styling frameworks** — plain CSS only.
- **No real authentication/authorization** — localStorage mock is intentional.
- **No Dockerfile refactors** — the build process is designed for the `small-image` walkthrough UX.
- **No CI/CD modifications** — GitHub Actions workflows are managed separately.
- **No production security hardening** — this is not a production app.

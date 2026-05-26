## Story Summary
Add the `react-router-dom` npm package and migrate the app from `window.history.pushState`-based routing to `react-router` declarative routing without changing any other functionality.

## Requirements
- Install `react-router-dom` as a project dependency
- Replace existing pushState/popstate routing in `src/App.js` with react-router components (`BrowserRouter`, `Routes`, `Route`, `Navigate`)
- Preserve all existing routes: `/login`, `/register`, `/dashboard`, `/settings`, `/orders`, `/profile`
- Preserve all existing auth guard logic (redirect unauthenticated users to `/login`, authenticated users away from `/login`/`/register`)
- No other functional, UI, or styling changes beyond routing migration

## Acceptance Criteria
- App starts and renders without errors after migration
- All routes resolve to the same components as before (Login, Register, Dashboard, Settings, Orders, Profile)
- Auth guard redirects work identically: unauthenticated → `/login`; authenticated on `/login`/`/register` → `/dashboard`
- Browser back/forward buttons work correctly for all routes
- `npm run build` completes successfully
- No visual or behavioral regressions on any page

## Impacted Areas
- `package.json` — add `react-router-dom` dependency
- `src/App.js` — replace pushState/popstate with react-router components + `<Routes>/<Route>`
- `src/index.js` — optionally wrap `<App>` in `<BrowserRouter>` (depending on integration approach)
- All components receiving `navigateTo` prop — migrate to `useNavigate` hook or `<Link>` component
- `src/Login.js`, `src/Register.js`, `src/Dashboard.js`, `src/Settings.js`, `src/Orders.js`, `src/Profile.js` — update navigation calls from `navigateTo(path)` to react-router equivalents

## 🚫 GOVERNANCE CONFLICT — HARD BLOCK

This story **directly contradicts** `.opencode/agents/governance-agent.md`:

| Rule | Text |
|------|------|
| Architecture Rules | **"No react-router: The app uses `window.history.pushState` + `popstate` listener in App.js. Do not introduce a routing library."** |
| Prohibited Changes | **"No routing library — keep `pushState`-based SPA routing."** |
| Dependency Rules | **"DO NOT add: `react-router`..."** |

The existing pushState routing (`src/App.js:12-26`) is stable and covers all current routes. React-router is a prohibited dependency per governance rules.

## Open Questions
- [CLARIFICATION NEEDED] Does this story override the governance-agent.md hard block on react-router? If yes, governance-agent.md must be updated first to reflect the new routing strategy.
- [CLARIFICATION NEEDED] If governance is overridden, should `navigateTo` props be fully replaced with `useNavigate`/`Link` across all 6 components, or is a hybrid approach acceptable?
- Is the routing migration meant to be a preparatory step for a future feature that requires react-router, or is it an independent improvement?

## Assumptions
- The story description's instruction "Do not do any other functional changes" means a pure swap of routing mechanism with zero behavioral change
- All existing components pass `navigateTo` as a prop — migration would require touching every component to use react-router primitives instead
- Current pushState routing works correctly for all existing paths per `context-map.json` known paths: `/login`, `/register`, `/dashboard`, `/settings`, `/orders`

## UI Notes
- No UI changes expected from routing migration alone; existing CSS classes and visual output must be preserved identically
- No new CSS needed; no existing styles should be modified

## Implementation Notes
- **Cannot proceed as described** under current governance rules. Governance-agent.md explicitly lists react-router as a hard-blocked dependency.
- If governance override is approved:
  1. Add `react-router-dom` via `npm install react-router-dom --no-fund --no-audit`
  2. Wrap `<App>` (or `<Routes>`) in `<BrowserRouter>` in `src/index.js`
  3. Replace `pushState`/`popstate` logic in `src/App.js` with `<Routes>`, `<Route>`, and `<Navigate>` components
  4. Replace `navigateTo` prop calls across all 6 components with `useNavigate()` hook
  5. Update `docs/ai/context-map.json` `routing.strategy` from `"pushState"` to reflect new approach
  6. Update `.opencode/agents/governance-agent.md` to remove react-router prohibition
- The flat component structure in `src/` (no subdirectories) must be preserved
- All components use function+default-export pattern; this must not change

## Test Notes
- Run `npm test -- --watchAll=false` to confirm no test regressions
- Existing tests (`src/Orders.test.js`, `src/Sidebar.test.js`) should continue to pass — they test component behavior, not routing mechanism
- New test file not needed unless routing-specific tests are requested (out of scope for "no functional changes")
- `npm run build` must succeed as a validation step

## References
- `.opencode/agents/governance-agent.md` — hard block on react-router
- `docs/ai/context-map.json` — current routing strategy: `"pushState"`
- `docs/ai/project-context.md` — routing architecture description (Architecture Rules section)
- `src/App.js:12-26` — existing pushState routing implementation

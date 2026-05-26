## Source

- `docs/ai/stories/DS-03/spec.md` (primary)
- `.opencode/executions/exec-57f37769-2fc5-4dcd-b8c4-36e81eff9473/handoffs/story_analyzer.json`
- `docs/ai/context-map.json` — routing.strategy: `"pushState"`
- `docs/ai/project-context.md` — Architecture Rules: "No react-router"
- `.opencode/agents/governance-agent.md` — Hard block on react-router (lines 25, 95)
- Full read of every component (App, Login, Register, Dashboard, Orders, Settings, Profile, Sidebar, index) and existing tests (Orders.test, Sidebar.test)

## Target Files

| Action | File |
|--------|------|
| **INSTALL** | `package.json` (add `react-router-dom` dep) |
| **REWRITE** | `src/App.js` — pushState → `<Routes>`/`<Route>`/`<Navigate>` |
| **EDIT** | `src/index.js` — wrap `<App>` in `<BrowserRouter>` |
| **EDIT** | `src/Login.js` — remove `navigateTo` prop, use `useNavigate()` |
| **EDIT** | `src/Register.js` — remove `navigateTo` prop, use `useNavigate()` |
| **EDIT** | `src/Dashboard.js` — remove `navigateTo`/`onLogout` props, use `useNavigate()` |
| **EDIT** | `src/Orders.js` — remove `navigateTo` prop, use `useNavigate()` |
| **EDIT** | `src/Settings.js` — remove `navigateTo` prop, use `useNavigate()` |
| **EDIT** | `src/Profile.js` — remove `navigateTo` prop, use `useNavigate()` |
| **EDIT** | `src/Sidebar.js` — remove `navigateTo`/`currentPath` props, use `useNavigate()` + `useLocation()` |
| **EDIT** | `src/Orders.test.js` — wrap in `<MemoryRouter>`, remove `navigateTo` prop |
| **EDIT** | `src/Sidebar.test.js` — wrap in `<MemoryRouter>`, remove `navigateTo` prop |
| **UPDATE** | `.opencode/agents/governance-agent.md` — remove react-router prohibition (3 locations) |
| **UPDATE** | `docs/ai/context-map.json` — `routing.strategy` → `"react-router"` |
| **UPDATE** | `docs/ai/project-context.md` — Architecture Rules routing line |

## Steps

### 0. 🚨 PRECONDITION — Governance Override
This story **cannot proceed** under current governance (hard-block on react-router). Before executing Steps 1–7:
- **Obtain explicit approval** from the requesting party that the governance override is authorized.
- Then update governance/doc files in this order:
  a. `.opencode/agents/governance-agent.md` — remove "No react-router" in Architecture Rules (line 25), Prohibited Changes (line 95), and Dependency Rules (line 61).
  b. `docs/ai/context-map.json` — change `routing.strategy` from `"pushState"` to `"react-router"`.
  c. `docs/ai/project-context.md` — rewrite Architecture Rules routing line: replace `pushState` description with `"react-router via react-router-dom v6 (BrowserRouter, Routes, Route, Navigate)"`.

### 1. Install dependency
```bash
npm install react-router-dom --no-fund --no-audit
```

### 2. Update `src/index.js`
Wrap `<App>` in `<BrowserRouter>`:
```jsx
import { BrowserRouter } from "react-router-dom";
// ...
<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</React.StrictMode>
```

### 3. Rewrite `src/App.js`
- Remove: `navigateTo` callback, `pathname` state, `popstate` listener, `renderView()`.
- Remove: `useState`, `useEffect`, `useCallback` imports (replace with hooks from react-router-dom).
- Add: `import { Routes, Route, Navigate } from "react-router-dom";`
- Auth guard logic: each route element conditionally renders or redirects via ternary:
  - Public routes (`/login`, `/register`): `isAuthenticated ? <Navigate to="/dashboard" /> : <Component />`
  - Protected routes (`/dashboard`, `/settings`, `/orders`, `/profile`): `isAuthenticated ? <Component /> : <Navigate to="/login" />`
  - Root `/`: redirect to `/dashboard` if authed, `/login` if not.
  - Catch-all `*`: same as root.
- `<div className="App"><Routes>...</Routes></div>` stays as the wrapper.

### 4. Update each component — replace `navigateTo` prop with `useNavigate()`
Pattern for all 6 components (Login, Register, Dashboard, Orders, Settings, Profile):
1. Add `import { useNavigate } from "react-router-dom";`
2. Add `const navigate = useNavigate();` inside the component body.
3. Remove `navigateTo` from destructured props.
4. Replace all `navigateTo(path)` calls with `navigate(path)`.
5. For `Dashboard`: also remove `onLogout` prop; in `handleLogout`, call `navigate("/login")` after `localStorage.removeItem(...)`.
6. For `Login`: remove `onLoginSuccess` prop; in `handleSubmit`, call `navigate("/dashboard")` after setting localStorage.

### 5. Update `src/Sidebar.js`
- Import `useNavigate` and `useLocation` from `react-router-dom`.
- Remove `navigateTo` and `currentPath` from props.
- Use `const navigate = useNavigate();` and `const location = useLocation();`.
- Replace `currentPath === item.path` with `location.pathname === item.path`.
- Replace `navigateTo(item.path)` with `navigate(item.path)`.

### 6. Update tests
**`src/Orders.test.js`:**
- Import `MemoryRouter` from `react-router-dom`.
- Wrap each `<Orders />` render with `<MemoryRouter><Orders /></MemoryRouter>`.
- Remove `navigateTo` prop from `<Orders>`.

**`src/Sidebar.test.js`:**
- Import `MemoryRouter` from `react-router-dom`.
- Wrap each `<Sidebar />` render with `<MemoryRouter initialEntries={["/dashboard"]}><Sidebar /></MemoryRouter>`.
- Remove `navigateTo` and `currentPath` props.
- Active-class test still works via `useLocation()`.
- Navigation-click test changes: mock `useNavigate` or verify via test — simplest: keep using `MemoryRouter` and verify that clicking navigates (or just smoke-test since RTL's `MemoryRouter` provides navigate context). The test no longer needs `expect(mockNavigateTo).toHaveBeenCalledWith(...)`. Instead, after clicking, check that the sidebar updates active state (or remove that specific assertion and rely on the "renders without crashing" and "nav links" assertions). Simplest approach: wrap with MemoryRouter, render, and verify click doesn't throw. The nav-item-click assertions that check `mockNavigateTo` should be replaced or removed.

### 7. Verify
```bash
npm test -- --watchAll=false
npm run build
```

## Data/API Notes

- No data layer changes. Auth is still `localStorage.getItem("isAuthenticated") === "true"`.
- `useNavigate()` replaces `window.history.pushState()` + callback prop plumbing.
- `useLocation().pathname` replaces `window.location.pathname` + state tracking.
- Sidebar active-state logic: `location.pathname === item.path` replaces `currentPath === item.path`.
- Browser back/forward handled by react-router (`BrowserRouter` listens to popstate internally).

## UI Notes

- Zero visual changes. The exact same components render in the exact same `<div className="App">` wrapper.
- Existing CSS classes, DOM structure, icon classes, and aria labels are untouched.
- No new CSS, no removed CSS, no style changes.

## Tests

- `src/Orders.test.js`: wrap renders in `<MemoryRouter>`; remove `navigateTo` prop from `<Orders>` instantiation.
- `src/Sidebar.test.js`: wrap renders in `<MemoryRouter initialEntries={[...]}>`; remove `navigateTo` and `currentPath` props; `mockNavigateTo` assertions are no longer applicable (either remove those assertions or use `jest.mock("react-router-dom", ...)` to spy on `useNavigate` — prefer just removing the specific call-count assertions if no easy spy is needed).
- `npm test -- --watchAll=false` must pass.
- `npm run build` must succeed.

## Risks

1. **Governance hard-block**: Story explicitly conflicts with governance-agent.md. **Do not execute Steps 1–7 without explicit governance override approval.**
2. **Auth guard equivalence**: The current `useEffect`-based redirect is side-effect driven; react-router's `<Navigate>` is render-driven. Edge case: rapid path changes during auth toggle (login/logout) must be tested manually.
3. **Test assertions breakage**: `Sidebar.test.js` line 44 (`expect(mockNavigateTo).toHaveBeenCalledWith("/orders")`) cannot work post-migration. Must either mock `useNavigate` or remove that assertion.
4. **Flat file structure**: All components stay in `src/` root — no new directories.
5. **`/` route behavior**: Current code treats `/` same as `/login`/`/register` for authenticated users (redirects to `/dashboard`). Must preserve this in the catch-all route.
6. **`Confetti.js` and `mockProfile.js`**: Not impacted — no navigation props to change.

## Handoff

The governance override is the **unblocker**. Once confirmed:
1. `npm install react-router-dom`
2. Edit `src/index.js` → wrap in `<BrowserRouter>`
3. Rewrite `src/App.js` → `<Routes>`/`<Route>`/`<Navigate>` based auth guard
4. Edit 6 components → drop `navigateTo` prop, use `useNavigate()`
5. Edit `src/Sidebar.js` → `useNavigate()` + `useLocation()`
6. Update 2 test files → `<MemoryRouter>` wrappers
7. Update 3 doc files → remove react-router prohibition
8. `npm test && npm run build` to verify

No new files to create. Only edits to existing files + dependency install.

## Context Budget

- **Read scope**: spec.md, all 8 component files, both test files, index.js, mockProfile.js, context-map.json, project-context.md, governance-agent.md.
- **Off-limits**: App.css, index.css, Confetti.js (no routing concern), public/, Dockerfile, CI files, package.json scripts.
- **Do not read**: Full directory listings, node_modules, unrelated components. Implementation only needs the files listed in Target Files above.

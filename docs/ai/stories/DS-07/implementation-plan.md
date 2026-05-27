# DS-07: Add success toast — Implementation Plan

## Summary

Add client-side success toasts when mock login and logout succeed. No backend or auth-flow changes. Mount a toast provider at the app root so notifications survive route changes, then trigger toasts in the existing success paths in `Login.js` and `Dashboard.js`.

## Assumptions

- **Login success** = current behavior: non-empty `email` and `password`, `localStorage.setItem("isAuthenticated", "true")`, then `navigate("/dashboard")`.
- **Logout success** = only in `Dashboard.js` (`handleLogout`: clear auth, `navigate("/login")`). No other logout entry points.
- **Library**: `react-toastify` (CRA-friendly, minimal setup, no new global state). No spec file exists for DS-07; story description is the source of truth.
- **Copy** (suggested): login — `"Signed in successfully"`; logout — `"Logged out successfully"`. Adjust only if product copy is provided later.
- **Scope**: No new tests required unless implementer chooses to add them; existing test files do not cover Login/Dashboard.

## Target Files

| File | Action |
|------|--------|
| `package.json` | Add `react-toastify` dependency |
| `src/App.js` | Import toast CSS; render `<ToastContainer />` once at app root |
| `src/Login.js` | Call `toast.success(...)` on successful submit (before or with `navigate`) |
| `src/Dashboard.js` | Call `toast.success(...)` in `handleLogout` before `navigate("/login")` |

**Do not edit** (unless import/CSS wiring forces a one-line touch): `Register.js`, route guards in `App.js`, `App.css`, backend/Docker config, or docs under `docs/ai/stories/` (written by the pipeline).

## Context Budget

- Read **target files first** (`package.json`, `App.js`, `Login.js`, `Dashboard.js`).
- Open **non-target files** only for direct imports (e.g. confirm `App.js` root structure) — not full-repo scans.
- Use native edit tools; do not paste full files or large diffs in chat.
- **Validation**: `npm run build` plus quick manual login/logout smoke test; run `npm test` only if tests are added.

## Implementation Steps

### 1. Add dependency

```bash
npm install react-toastify
```

Record the installed version in `package.json` / lockfile as usual for this repo.

### 2. Global toast host (`src/App.js`)

- Import: `import { ToastContainer } from "react-toastify";`
- Import styles: `import "react-toastify/dist/ReactToastify.css";`
- Render `<ToastContainer />` inside the root `<div className="App">`, **sibling to** `<Routes>` (not inside a single route), so toasts persist across `/login` ↔ `/dashboard` navigation.
- Suggested defaults (keep minimal): `position="top-right"`, `autoClose={3000}`, `hideProgressBar={false}`, `theme="light"`. Avoid custom CSS unless it clashes with existing plain-CSS layout.

### 3. Login success toast (`src/Login.js`)

- Import: `import { toast } from "react-toastify";`
- In `handleSubmit`, inside the existing `if (email && password)` block:
  1. Set `localStorage` (unchanged).
  2. `toast.success("Signed in successfully");` (or agreed copy).
  3. `navigate("/dashboard");` (unchanged).
- Do **not** toast on failed/empty submit; do **not** change validation or routing.

### 4. Logout success toast (`src/Dashboard.js`)

- Import: `import { toast } from "react-toastify";`
- In `handleLogout`:
  1. `localStorage.removeItem("isAuthenticated");` (unchanged).
  2. `toast.success("Logged out successfully");`
  3. `navigate("/login");` (unchanged).

### 5. Smoke check (manual)

1. `npm start` → `/login` → sign in with any non-empty email/password → toast appears, lands on dashboard.
2. Click **Log Out** → toast appears, lands on login.
3. Confirm no toast on register flow, failed login, or other buttons.

## Validation Commands

```bash
npm install
npm run build
```

Optional (only if tests added):

```bash
npm test -- --watchAll=false
```

Manual: login success toast + logout success toast; no regressions on navigation or auth guards.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Toast unmounts on immediate `navigate` | Host `<ToastContainer />` in `App.js`, not inside `Login`/`Dashboard` only |
| React StrictMode double-invocation in dev | Toasts fired from user events (`submit` / `click`), not `useEffect` — avoid duplicate effect-based toasts |
| Visual clash with Docker-themed UI | Use default `react-toastify` theme first; only tweak `ToastContainer` props if overlap with header/nav |
| Dependency audit surface | Single well-known package; no backend exposure |

## Out of Scope

- Backend/API changes
- Error toasts, register success, or other flows
- Auth logic, routes, or localStorage key changes
- New shared toast wrapper module (unless implementer needs it for consistency — prefer inline calls for this story)
- Broad refactors or new test suites unless explicitly requested later

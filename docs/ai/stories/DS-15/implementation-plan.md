# Implementation Plan: DS-15 — Show navbar on all pages

## Source

- **Story key**: DS-15, Title: Show navbar on all pages
- **Description**: Navbar with Profile, Settings and Logout currently only visible on Dashboard. Should appear on all authenticated pages (Dashboard, Settings, Profile, Orders, Customers, Products).
- **Additional context**: Should be "industry standard", scalable, maintainable.
- Source files read: `src/App.js`, `src/Dashboard.js`, `src/Sidebar.js`, `src/Settings.js`, `src/Profile.js`, `src/Orders.js`, `src/Customers.js`, `src/Products.js`, `src/App.css`, `docs/ai/project-context.md`, `.opencode/agents/_sdlc-rules.md`, `docs/ai/context-map.json`

## Target Files

| Action | File |
|--------|------|
| **Create** | `src/Navbar.js` |
| **Create** | `src/Navbar.test.js` |
| **Modify** | `src/App.js` |
| **Modify** | `src/Dashboard.js` |

## Steps

### 1. Create `src/Navbar.js` — new shared navbar component

Extract the `.dashboard-nav` section (Profile, Settings, Logout) from `Dashboard.js` into a standalone reusable component:

- Import `React`, `useNavigate` (from `react-router-dom`), `toast` (from `react-toastify`).
- Export a default functional component `Navbar`.
- `handleLogout`: `localStorage.removeItem("isAuthenticated")` → `toast.success("Logged out successfully")` → `navigate("/login")`.
- Render `<div className="dashboard-nav">` containing:
  - Profile button: `<i className="fa-solid fa-circle-user"></i>`, onClick → `navigate("/profile")`, `aria-label="View profile"`
  - Settings button: `<i className="fa-solid fa-gear"></i>`, onClick → `navigate("/settings")`, `aria-label="Settings"`
  - Logout button: text "Log Out", onClick → `handleLogout`, `aria-label="Log Out"`, className `logout-btn`
- Keep the same CSS class names (`.profile-btn`, `.settings-btn`, `.logout-btn`) as currently in `App.css`.

### 2. Modify `src/App.js` — render Navbar at app level for authenticated users

- Add import: `import Navbar from "./Navbar";`
- Inside the `<div className="App">`, before `<Routes>`, add `{isAuthenticated && <Navbar />}`.
- This makes the navbar visible on all authenticated pages, positioned absolutely at top-right relative to `.App` (which already has `position: relative`).

### 3. Modify `src/Dashboard.js` — remove inline navbar duplication

- Remove the entire `<div className="dashboard-nav">...</div>` block (profile button, settings button, logout button).
- Remove the `handleLogout` function (now lives in `Navbar.js`).
- Remove `useNavigate` import (no longer used).
- Remove `toast` import (no longer used).
- Keep `Sidebar` import, `metrics` array, `metrics-grid`, and all existing content.

### 4. Create `src/Navbar.test.js` — tests for the new component

- Jest + RTL, wrap in `MemoryRouter` (component uses `useNavigate`).
- Tests:
  - Renders without crashing
  - Shows profile button, settings button, logout button
  - Logout clears `isAuthenticated` from localStorage and navigates to `/login`

### 5. Verify

- Run `npm test -- --watchAll=false` — confirm existing Sidebar, Orders, Products, Customers, Profile tests pass; Navbar tests pass.
- Run `npm start` — visually confirm navbar appears on Dashboard, Settings, Profile, Orders, Customers, Products pages; logout works.

## Data/API Notes

- **No backend, no API changes**. Pure frontend component extraction.
- `localStorage.removeItem("isAuthenticated")` is the only auth mechanism — unchanged.
- `useNavigate()` routing unchanged.
- `toast.success()` for logout notification — pattern unchanged.

## UI Notes

- **Navbar** floats at top-right on all authenticated pages (position: absolute via existing `.dashboard-nav` CSS).
- **Dashboard**: navbar removed from inline position; now provided globally. Sidebar and metrics-grid unchanged.
- **Settings / Profile**: gain the navbar at top-right. Their centered `.login-container` layout still works underneath.
- **Orders / Customers / Products**: already had Sidebar; now also get the navbar at top-right.
- **Login / Register pages**: NOT affected — navbar only renders when `isAuthenticated === true`.
- **CSS**: No new CSS needed. Existing `.dashboard-nav`, `.profile-btn`, `.settings-btn`, `.logout-btn` classes reused.

## Tests

- **New**: `src/Navbar.test.js` — render smoke test, logout interaction test.
- **Existing**: `npm test -- --watchAll=false` verifies `Sidebar.test.js`, `Orders.test.js`, `Products.test.js`, `Customers.test.js`, `Profile.test.js`.
- No `Dashboard.test.js` exists — visual verification only.
- `Dashboard.js`: removed `useNavigate` and `toast` imports. If they aren't referenced in JSX after navbar extraction, React should not complain (but remove them cleanly to avoid lint warnings).

## Risks

1. **Absolute positioning context**: `.App` (in `App.js`) already has `position: relative`, so the navbar positions correctly. But verify on Settings/Profile pages (`.login-container` full-viewport) — navbar should float above, not be clipped.
2. **Settings/Profile overlap**: These pages use centered card layout. Navbar at top-right should not overlap card content. The card has `padding-top: 40px` and the navbar is at `top: 20px; right: 20px` — visually compatible.
3. **No Dashboard.test.js**: Manual visual check required for dashboard page layout after navbar removal.
4. **Toast positioning**: Toast container is at App level; logout toast from Navbar works the same as before.
5. **Focus on minimal changes**: Only create/modify 4 files. Do not touch: `Settings.js`, `Profile.js`, `Orders.js`, `Customers.js`, `Products.js`, `App.css`, `Sidebar.js`.

## Context Budget

- **Read**: `src/Dashboard.js`, `src/App.js`, `src/Navbar.js` (after creation)
- **Do NOT read**: `Settings.js`, `Profile.js`, `Orders.js`, `Customers.js`, `Products.js`, `Sidebar.js`, any mock files, any config/workflow files
- **Do NOT modify**: any file outside the 4 targets listed above
- CSS changes not needed — existing `.dashboard-nav` classes reused

## Handoff

1. Create `src/Navbar.js` (extracted from Dashboard.js dashboard-nav)
2. Create `src/Navbar.test.js` (smoke + logout tests)
3. Edit `src/App.js` — add `import Navbar`, render `{isAuthenticated && <Navbar />}` before `<Routes>`
4. Edit `src/Dashboard.js` — remove `<div className="dashboard-nav">` block, remove `handleLogout`, remove unused `useNavigate`/`toast` imports
5. Run `npm test -- --watchAll=false` to verify no regressions
6. Run `npm start` for visual confirmation on all authenticated pages

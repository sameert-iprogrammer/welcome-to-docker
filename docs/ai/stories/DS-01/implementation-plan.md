# DS-01: Profile page — Implementation Plan

## Summary

Add a read-only `/profile` view with mock profile data and a profile icon in the authenticated dashboard navbar. Extend existing `pushState` routing in `App.js` (no react-router). Reuse `login-container` / `login-card` layout patterns from `Settings.js`, but without forms or inputs.

## Acceptance Criteria Mapping

| ID | Implementation |
|----|----------------|
| AC-1 | Profile icon only rendered inside authenticated `Dashboard` nav (logged-out users never reach `Dashboard`). |
| AC-2 | Add profile control in `dashboard-nav` beside settings. |
| AC-3 | Icon `onClick` → `navigateTo("/profile")`; `App.js` renders `Profile` for `/profile`. |
| AC-4–AC-5 | `Profile.js` displays static mock fields (name, email, username, avatar placeholder, optional role/bio). |
| AC-6 | No `fetch`/XHR; data from in-memory mock object only. |
| AC-7 | Back link to dashboard; existing auth guard and logout unchanged. |
| AC-8 | Verify with `npm run build`. |

## Target Files

| Action | Path |
|--------|------|
| Edit | `src/App.js` |
| Edit | `src/Dashboard.js` |
| Create | `src/Profile.js` |
| Create | `src/mockProfile.js` (or inline mock at top of `Profile.js` if keeping file count minimal) |
| Edit | `src/App.css` |

**Do not treat as implementation targets:** `docs/ai/stories/DS-01/*` (planning artifacts only).

## Context Budget

- Open **target files first** (`App.js`, `Dashboard.js`, new `Profile.js`, `App.css`); do not broad-scan `src/`.
- Open **non-target files** only when needed: `Settings.js` (layout/back-button pattern), `Login.js` (auth/localStorage behavior if aligning mock user).
- Skip `.opencode/`, `node_modules/`, build output, and execution-history folders.
- Use native edit tools; do not paste full files, large diffs, or big code blocks in chat.
- Run only: `npm run build` (required); `npm test` only if you add tests (none exist today).

## Implementation Steps

### 1. Define mock profile data

Create `src/mockProfile.js` exporting a single object, e.g.:

- `displayName`, `email`, `username`, `avatarUrl` (placeholder URL or `null` for initials fallback)
- Optional: `role`, `memberSince`, `bio`

**Defaults:** Align with `Settings.js` sample values (`Jane Doe`, `jane@example.com`) for demo consistency. Login currently only sets `localStorage.isAuthenticated`; do not add backend. Optional stretch: read `registeredUsers` from localStorage if trivial—otherwise keep static mock.

### 2. Add `Profile` component (`src/Profile.js`)

- Props: `{ navigateTo }` (same as `Settings`).
- Layout: reuse `login-container` + `login-card` + `login-header` structure from `Settings.js`.
- Header: title “Profile”, subtitle “Your account information”.
- Body: **read-only** presentation only:
  - Avatar: `<img>` with placeholder or initials circle if no image.
  - Fields: label + value rows (dl/list/div pairs)—no `<input>`, `<textarea>`, or submit.
- Footer navigation: button mirroring `Settings` “← Back to Dashboard” → `navigateTo("/dashboard")`.
- Accessibility: semantic headings; avatar `alt` text from display name.

### 3. Wire routing in `src/App.js`

- Import `Profile`.
- In `renderView()`, when `isAuthenticated`:
  - Add branch **before** dashboard fallback: `if (pathname === "/profile") return <Profile navigateTo={navigateTo} />`.
  - Keep existing `/settings` branch.
  - Default remains `<Dashboard ... />`.
- Auth `useEffect` already redirects unauthenticated users to `/login`; no change required unless `/profile` needs explicit guard (inherited via `!isAuthenticated` branch).

### 4. Add profile icon to dashboard navbar (`src/Dashboard.js`)

In `dashboard-nav`, before or after the settings gear:

- Button with `className` matching settings pattern (reuse `settings-btn` or add `profile-btn`).
- Font Awesome icon: `fa-solid fa-user` or `fa-circle-user` (CDN already used).
- `onClick={() => navigateTo("/profile")}`.
- `aria-label="Profile"` (or “View profile”).
- **Logged-out:** no change—icon is not on `Login`/`Register`.

### 5. Styles (`src/App.css`)

- Add styles for read-only profile layout (e.g. `.profile-details`, `.profile-field`, `.profile-avatar`, `.profile-value`).
- If `settings-btn` has no dedicated rules, mirror `.logout-btn` / nav flex gap for profile button so it aligns in `dashboard-nav`.
- Keep plain CSS; no new frameworks.

### 6. Optional consistency (low priority)

- Add `/profile` to `docs/ai/context-map.json` `routing.knownPaths` if project docs should stay in sync (not required for AC).
- Add matching top nav on `Settings` only if product wants profile icon visible on every authenticated screen (out of minimal scope; see risks).

## Validation Commands

```bash
npm run build
```

**Manual smoke test (after `npm start`):**

1. Logged out → `/login` (or `/register`): no profile icon.
2. Log in → `/dashboard`: profile icon visible next to settings.
3. Click profile icon → `/profile` with read-only mock fields.
4. Back to dashboard works; settings and logout still work.
5. Browser back/forward between dashboard and profile works (`popstate` listener in `App.js`).
6. DevTools Network: no profile data requests.

## Risks

| Risk | Mitigation |
|------|------------|
| Profile icon only on `Dashboard`, not on `/settings` | Accept for minimal scope, or extract shared `dashboard-nav` into a small component reused by `Dashboard` and `Profile`. |
| `settings-btn` may lack CSS | Reuse nav button styles; verify visual alignment in browser. |
| Mock data diverges from login email | Use shared constants in `mockProfile.js` matching Settings defaults. |
| Direct navigation to `/profile` while logged out | Existing auth `useEffect` redirects to `/login`. |

## Assumptions

- “Navbar” means `dashboard-nav` on `Dashboard` (only authenticated shell with top nav today).
- Profile is view-only; `Settings` remains the editable mock form.
- Font Awesome CDN remains available (already used for gear icon).
- No new dependencies, TypeScript, or react-router.
- Jest tests are not required unless explicitly requested later (no test files in repo).

## References (planner only)

- Spec: `docs/ai/stories/DS-01/spec.md`
- Routing pattern: `src/App.js` (`navigateTo`, `renderView`, `/settings` branch)
- Nav pattern: `src/Dashboard.js` (`dashboard-nav`, settings button)
- Read-only layout reference: `src/Settings.js` (card shell, back button—not form fields)

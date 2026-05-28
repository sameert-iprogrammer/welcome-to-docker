# DS-19: Privacy Page — Implementation Plan

## Summary

Add a public `/privacy` route that renders a Privacy Policy page from static mock data (no API). Add “Privacy Policy” links on Login and Register that navigate to that route via `useNavigate`, matching the existing register-link pattern. Do not gate the route on `isAuthenticated`; do not change backend or localStorage auth behavior.

## Assumptions

- Route path: `/privacy`.
- Mock policy content lives in a dedicated `src/privacyPolicyMock.js` file (same pattern as `mockProfile.js` / inline FAQ items).
- Privacy page uses the auth-page visual shell (`login-container` / card layout), not the authenticated `Sidebar` layout used by FAQ.
- No spec file exists in-repo yet; requirements come from the story description and context pack.
- `docs/ai/project-context.md` is partially stale (mentions pushState, “no new pages”); follow current `src/App.js` react-router patterns.

## Target Files

| Action | File |
|--------|------|
| Create | `src/privacyPolicyMock.js` |
| Create | `src/PrivacyPolicy.js` |
| Create | `src/PrivacyPolicy.test.js` |
| Edit | `src/App.js` |
| Edit | `src/Login.js` |
| Edit | `src/Register.js` |
| Edit | `src/App.css` |

Optional housekeeping (not required for story acceptance): add `/privacy` to `routing.knownPaths` in `docs/ai/context-map.json`.

## Context Budget

- Read **target files first** (`App.js`, `Login.js`, `Register.js`, `App.css` login/register-link section, `mockProfile.js`, `FAQ.test.js` for test shape).
- Open non-target files only for direct imports or patterns (`react-router-dom` usage in `index.js` if needed).
- Do **not** broad-scan `src/` or open `build/`, `node_modules/`, or execution-history folders.
- Use native edit tools; do not paste full files or large diffs in chat.
- Run only targeted tests for the new surface (see Validation).

## Implementation Steps

### 1. Mock data — `src/privacyPolicyMock.js`

Export a default object, e.g.:

- `title`: `"Privacy Policy"`
- `lastUpdated`: static date string (e.g. `"May 1, 2026"`)
- `sections`: array of `{ id, heading, body }` with 4–6 sections (Information We Collect, How We Use Data, Cookies, Data Retention, Your Rights, Contact) using placeholder/educational copy aligned with the Docker learning app tone.

No fetch, no localStorage reads/writes.

### 2. Page component — `src/PrivacyPolicy.js`

- Functional component, default export.
- Import mock from `./privacyPolicyMock`.
- Layout:
  - Outer: `login-container` (reuse existing gradient full-viewport centering).
  - Inner: card with privacy-specific class (e.g. `privacy-card`) — wider than login card for readable paragraphs (`max-width` ~640–720px).
  - Header: title + “Last updated: …” subtitle.
  - Body: map `sections` to `<section>` with `<h3>` + `<p>` (or single `<p>` per section).
- Optional UX (not required): a “Back to Sign In” control using `navigate("/login")` with the same `register-link` / `register-link-action` interaction pattern as Login → Register.
- Do **not** import or render `Sidebar` / `Navbar`.
- No auth checks inside the component.

### 3. Public route — `src/App.js`

- `import PrivacyPolicy from "./PrivacyPolicy";`
- Add route **after** `/login` and `/register`, **before** protected routes:

```jsx
<Route path="/privacy" element={<PrivacyPolicy />} />
```

- Element must be `<PrivacyPolicy />` only — **no** `isAuthenticated ? … : <Navigate to="/login" />` wrapper.
- Do not change other route guards or catch-all behavior; react-router v6 matches `/privacy` before `path="*"`.

### 4. Login link — `src/Login.js`

- Below the existing `register-link` block (after the Register span), add a second line or extend the footer:
  - Text such as: `Privacy Policy` as clickable `span` with `className="register-link-action"`.
  - `onClick={() => navigate("/privacy")}` plus `onKeyDown` for Enter/Space (mirror Register link a11y on lines 63–69).
  - `role="button"`, `tabIndex={0}`, `aria-label="View Privacy Policy"`.
- Reuse `.register-link` wrapper for consistent spacing.

### 5. Register link — `src/Register.js`

- After the submit button, before `</form>`, add a `register-link` block with the same Privacy Policy link/navigation pattern as Login.
- Register currently has no footer link; this is new UI on Register only for privacy (no need to add “Already have an account?” unless desired — out of scope).

### 6. Styles — `src/App.css`

Add a small block after the existing register-link styles (~line 459):

- `.privacy-card` — extend login card: larger `max-width`, `max-height` + `overflow-y: auto` if content is long, preserve dark theme colors (`#112240`, `#8892b0` text, `#ccd6f6` headings).
- `.privacy-title`, `.privacy-updated`, `.privacy-section`, `.privacy-section h3`, `.privacy-section p` — typography and spacing consistent with `.login-header` / form text sizes.
- Ensure mobile rule at `@media (max-width: 480px)` reduces padding on `.privacy-card` like `.login-card`.

Do **not** create a new `.css` file (project convention: all component styles in `App.css`).

### 7. Tests — `src/PrivacyPolicy.test.js`

Follow `FAQ.test.js` pattern (`MemoryRouter`, RTL):

1. Renders without crashing (`MemoryRouter initialEntries={["/privacy"]}`).
2. Renders main heading with mock `title`.
3. Renders at least one section heading and body text from mock data.
4. (Optional) If back link added, assert navigation target or presence of control.

No App-level integration test required unless trivial to add.

## Validation Commands

```bash
npm test -- --watchAll=false --testPathPattern=PrivacyPolicy
```

Manual smoke (after `npm start`):

1. Visit `/login` while logged out → click Privacy Policy → `/privacy` loads with mock sections; no redirect to login.
2. Visit `/register` → same link behavior.
3. Visit `/privacy` directly in a fresh session (clear `localStorage` or incognito) → page loads.
4. Log in → visit `/privacy` → still accessible (public); Navbar may appear per `App.js` — acceptable.
5. `npm run build` — confirm production build succeeds.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Catch-all `path="*"` sends unauthenticated users to login | Define explicit `/privacy` route; verify direct URL before relying on catch-all |
| Stale governance (“no new pages”) | Story explicitly requires a new page; scope is limited to privacy feature |
| Long policy overflows small login card | Use scrollable `privacy-card` with increased max-width |
| Inconsistent link pattern | Reuse `register-link` / `register-link-action` + `navigate`, not `<a href>` |
| Context map missing `/privacy` | Optional update to `docs/ai/context-map.json` for future agents |

## Acceptance Criteria (implementer checklist)

- [ ] Login page shows a Privacy Policy link.
- [ ] Register page shows a Privacy Policy link.
- [ ] Clicking either navigates to `/privacy` and shows mock policy content.
- [ ] `/privacy` is reachable without authentication (direct URL and from auth pages).
- [ ] No backend, API, or auth-storage changes.
- [ ] New tests pass; build succeeds.

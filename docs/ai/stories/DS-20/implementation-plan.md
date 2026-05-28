# DS-20: Terms and Conditions Page — Implementation Plan

## Summary

Add a public `/terms` route that renders a Terms and Conditions page from static mock data (no API). Add “Terms and Conditions” links on Login and Register that navigate via `useNavigate`, matching the existing Privacy Policy link pattern (`register-link` / `register-link-action`). Do not gate the route on `isAuthenticated`; do not change backend or localStorage auth behavior.

## Assumptions

- Route path: `/terms`.
- Mock content lives in `src/termsConditionsMock.js` (same shape as `privacyPolicyMock.js`).
- Page layout mirrors `PrivacyPolicy.js`: `login-container` shell, scrollable card, section list, optional “Back to Sign In”.
- Reuse existing `.privacy-*` CSS classes on the Terms page (identical layout/typography); no new CSS block required unless you prefer semantic `.terms-*` duplicates.
- No in-repo `docs/ai/stories/DS-20/spec.md` yet; requirements come from the story description and context pack.
- DS-19 Privacy Policy is already implemented (`/privacy`, `PrivacyPolicy.js`, Login/Register links); Terms is a parallel feature.

## Target Files

| Action | File |
|--------|------|
| Create | `src/termsConditionsMock.js` |
| Create | `src/TermsAndConditions.js` |
| Create | `src/TermsAndConditions.test.js` |
| Edit | `src/App.js` |
| Edit | `src/Login.js` |
| Edit | `src/Register.js` |
| Edit | `src/App.css` (only if not reusing `.privacy-*` classes) |

Optional housekeeping: add `/terms` to `routing.knownPaths` in `docs/ai/context-map.json`.

## Context Budget

- Read **target files first** (`App.js`, `Login.js`, `Register.js`, `PrivacyPolicy.js`, `privacyPolicyMock.js`, `PrivacyPolicy.test.js`, relevant `App.css` block ~lines 461–531).
- Open non-target files only for direct imports or test patterns (`FAQ.test.js` if needed).
- Do **not** broad-scan `src/`, `build/`, `node_modules/`, or execution-history folders.
- Use native edit tools; do not paste full files or large diffs in chat.
- Run only targeted tests for the new surface (see Validation).

## Implementation Steps

### 1. Mock data — `src/termsConditionsMock.js`

Export a default object:

- `title`: `"Terms and Conditions"`
- `lastUpdated`: static date string (e.g. `"May 1, 2026"`)
- `sections`: array of `{ id, heading, body }` with 5–7 sections, e.g.:
  - Acceptance of Terms
  - Use of the Service
  - User Accounts and Registration
  - Intellectual Property
  - Limitation of Liability
  - Termination
  - Contact

Use placeholder/educational copy aligned with the Docker learning app tone. No fetch, no localStorage.

### 2. Page component — `src/TermsAndConditions.js`

Mirror `PrivacyPolicy.js`:

- Functional component, default export.
- Import mock from `./termsConditionsMock`.
- Destructure `{ title, lastUpdated, sections }`.
- Outer `login-container`; inner card using `.privacy-card`, `.privacy-header`, `.privacy-title`, `.privacy-updated`, `.privacy-body`, `.privacy-section` (reuse classes to avoid CSS duplication).
- Map `sections` to `<section>` with `<h3>` + `<p>`.
- Optional “Back to Sign In” via `navigate("/login")` with same `register-link` / `register-link-action` + keyboard handler as Privacy page.
- Do **not** import `Sidebar` / `Navbar`; no auth checks.

### 3. Public route — `src/App.js`

- `import TermsAndConditions from "./TermsAndConditions";`
- Add route immediately after `/privacy`, before protected routes:

```jsx
<Route path="/terms" element={<TermsAndConditions />} />
```

- Element is `<TermsAndConditions />` only — **no** `isAuthenticated` wrapper.
- Do not change other route guards or catch-all behavior.

### 4. Login link — `src/Login.js`

- After the existing Privacy Policy `register-link` block (~lines 73–88), add another `register-link` block:
  - Clickable `span` with `className="register-link-action"`.
  - Label: `Terms and Conditions`.
  - `onClick={() => navigate("/terms")}`.
  - `onKeyDown` for Enter/Space (mirror Privacy link).
  - `role="button"`, `tabIndex={0}`, `aria-label="View Terms and Conditions"`.

### 5. Register link — `src/Register.js`

- After the existing Privacy Policy `register-link` block (~lines 142–157), add the same Terms link pattern as Login.

### 6. Styles — `src/App.css`

- **Preferred:** Reuse existing `.privacy-*` rules (no `App.css` edit).
- **Alternative:** Duplicate the privacy block as `.terms-*` selectors if semantic class names are required; include mobile padding rule in `@media (max-width: 480px)`.

Do not add a new standalone `.css` file.

### 7. Tests — `src/TermsAndConditions.test.js`

Mirror `PrivacyPolicy.test.js` (`MemoryRouter`, React Testing Library):

1. Renders without crashing with `initialEntries={["/terms"]}`.
2. Renders main heading from mock `title`.
3. Renders at least one section heading and body from mock data.
4. (Optional) Assert “Back to Sign In” control if implemented.

## Validation Commands

```bash
npm test -- --watchAll=false --testPathPattern=TermsAndConditions
```

Manual smoke (after `npm start`):

1. `/login` → Terms and Conditions link → `/terms` loads with mock sections; no redirect to login.
2. `/register` → same link behavior.
3. Direct `/terms` in incognito / cleared `localStorage` → page loads.
4. While logged in → `/terms` still accessible (public).
5. `npm run build` succeeds.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Catch-all `path="*"` redirects unauthenticated users | Define explicit `/terms` before protected/catch-all routes |
| Footer clutter on Login/Register (Privacy + Terms) | Use separate `register-link` blocks; same spacing as Privacy |
| CSS duplication | Reuse `.privacy-*` classes on Terms component |
| Confusion with Privacy implementation | Copy `PrivacyPolicy.js` structure; only mock + route + labels differ |

## Acceptance Criteria (implementer checklist)

- [ ] Login page shows a Terms and Conditions link.
- [ ] Register page shows a Terms and Conditions link.
- [ ] Clicking either navigates to `/terms` and shows mock terms content.
- [ ] `/terms` is reachable without authentication (direct URL and from auth pages).
- [ ] No backend, API, or auth-storage changes.
- [ ] New tests pass; build succeeds.

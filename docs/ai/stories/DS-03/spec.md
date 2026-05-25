# DS-03: Add Settings Page

## Story Summary
Add a gear/settings icon to the dashboard navbar that navigates to a new `/settings` page containing a mock user profile form. UI only — no backend logic.

## Requirements
- Dashboard navbar displays a settings icon (FontAwesome `fa-gear`) on the right side, alongside the existing logout button.
- Clicking the settings icon navigates to a `/settings` route using the existing custom pathname-based router.
- The settings page renders a centered card layout with a mock profile form (name, email, bio/about fields).
- A visible back/close mechanism returns the user to `/dashboard`.
- All data is mock/local state — no backend API calls or persistence required.
- Must not break existing `/login`, `/register`, `/dashboard`, or `/` routes.

## Acceptance Criteria
- [ ] Gear icon is visible in the dashboard navbar at the top-right area.
- [ ] Clicking the gear icon navigates to `/settings`.
- [ ] The `/settings` page renders a card with form fields: Full Name, Email Address, Bio.
- [ ] Form fields are pre-filled with mock placeholder values (no real data loading).
- [ ] A "Back to Dashboard" button or close icon returns the user to `/dashboard`.
- [ ] Navigating directly to `/settings` when authenticated renders the settings page.
- [ ] Navigating directly to `/settings` when unauthenticated redirects to `/login` (auth guard).
- [ ] Existing routes continue to work without regression.

## Impacted Areas
- [src/App.js](file:///src/App.js) — Add `/settings` route alongside existing `/login`, `/register`, `/dashboard`.
- [src/App.css](file:///src/App.css) — Add styles for settings icon, settings page card, and mock profile form.
- [src/Dashboard.js](file:///src/Dashboard.js) — Add settings gear icon link/button to the navbar.
- [src/Settings.js](file:///src/Settings.js) — New component for the settings page with mock profile form.

## Open Questions
- **Settings position in navbar:** Should the gear icon sit to the left of the logout button (both right-aligned), or should the navbar be restructured to have left/right sections? Assumption: icon placed immediately left of logout button in a flex row.
- **Form field set completeness:** Name and email are obvious — should Bio be a textarea or single-line input? Assumption: textarea for bio.
- **Navigation icon for back:** Should use an explicit "Back to Dashboard" button (matching logout-btn style) or a close/X icon? Assumption: text button for clarity.
- **Mock profile values:** Should values be static placeholders or randomly generated? Assumption: static placeholders like "Jane Doe", "jane@example.com".

## Assumptions
- Settings page uses the same `login-container` / `login-card` CSS pattern for layout consistency.
- No new npm packages — FontAwesome `fa-gear` is already available via the CDN link in [public/index.html](file:///public/index.html).
- The existing auth guard logic in `App.js` protects `/settings` (unauthenticated users redirected to `/login`).
- No `localStorage` reads or writes for the settings form — values are purely local React state.
- Implementation follows the same component pattern as `Login.js` and `Register.js` (functional component, `useState` hooks).

## UI Notes
- **Settings icon:** Use FontAwesome `fa-gear` (solid gear icon). Size: `font-size: 20px` or similar, matching navbar scale. Color: white, with hover opacity/scale transition (matching `.logout-btn` behavior).
- **Navbar layout:** `.dashboard-nav` updated to `display: flex; align-items: center; gap: 10px;`. Gear icon button styled like a minimal icon button (transparent bg, white icon, hover highlight).
- **Settings card:** Reuse `.login-card` structure — centered, dark background (`#112240`), rounded corners, same padding. Title "Settings" with the Docker whale icon.
- **Form fields:** Reuse `.login-input` styles for text inputs and `.login-form` layout. Bio rendered as a `<textarea>` with matching CSS (same bg/border/rounded/font).
- **Back button:** Styled similarly to `.logout-btn`, positioned at the top-right of the settings card or as a secondary button below the form.

## Implementation Notes
- Follow the existing routing pattern in `App.js`: add a `/settings` path to the `renderView` switch and update route guard conditions.
- `Settings.js` receives `onBack` / `navigateTo` prop (same pattern as `Dashboard` receiving `onLogout`).
- Gear icon in `Dashboard.js` uses `<i className="fa-solid fa-gear">` and navigates via a callback — no `<a>` tag needed, use a `<button>` for accessibility.
- Accessibility: gear button must have `aria-label="Settings"`. Form fields must have `<label>` or `aria-label`.
- Keep the settings page simple — no form submission logic, no validation. Just presentational mock fields.
- Do not modify `Confetti.js`, `Register.js`, `Login.js`, `index.js`, `index.css`, or any CI/config files.
- Align with security rules: no secrets or credentials; external `_blank` links must include `rel="noopener noreferrer"`.

## Test Notes
- Run `npm test` to confirm no existing tests break.
- Run `npm run build` to verify clean production build.
- Manual container verification:
  - Build: `docker build -t welcome-to-docker .`
  - Run: `docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker`
  - Visit `http://localhost:8088` → login → verify gear icon in navbar.
  - Click gear icon → verify navigation to `/settings` with mock profile form.
  - Verify "Back to Dashboard" returns to `/dashboard`.
  - Direct URL: visit `http://localhost:8088/settings` while logged in → renders settings.
  - Direct URL: logout then visit `/settings` → redirects to `/login`.
  - Check browser console for zero errors/warnings.

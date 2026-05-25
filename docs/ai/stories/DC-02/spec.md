# DC-02: Add Registration Page

## Story Summary
Add a `/register` route with a registration form (name, email, password), client-side validations with a standard password policy, and a navigation link from the login page. All data is mock/localStorage — no backend.

## Requirements
- New `/register` route with a registration form containing name, email, and password fields.
- Client-side validation: email format check, required fields, and a standard password policy.
- Standard password policy: min 8 characters, at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.
- On successful registration, store mock user profile in `localStorage` and redirect to `/login`.
- On the login page (`/login`), add a "Don't have an account? Register" link that navigates to `/register`.
- Use mock data only — no backend API calls.
- Routing must be consistent with the existing navigation mechanism (see Open Questions).

## Acceptance Criteria
- [ ] `/register` route renders a centered card with name, email, and password inputs.
- [ ] Invalid email format shows a visible inline error below the email field.
- [ ] Password that violates the policy (too short, missing required character types) shows a descriptive inline error.
- [ ] Submitting with valid data stores a mock user entry in `localStorage` and redirects to `/login`.
- [ ] Login page displays a "Don't have an account? Register" link that navigates to `/register`.
- [ ] Navigating directly to `/register` renders the registration form (no auth guard required).
- [ ] Existing `/login` and `/dashboard` routes continue to work without regression.

## Impacted Areas
- [src/App.js](file:///src/App.js) — Add `/register` route handling alongside existing `/login` and `/dashboard`.
- [src/App.css](file:///src/App.css) — Add styles for the register card, register link, and validation error messages.
- [src/Login.js](file:///src/Login.js) — Add a "Register" link below the login form.
- [src/Register.js](file:///src/Register.js) — New registration form component (mirrors Login.js structure).
- [package.json](file:///package.json) — Possibly add `react-router-dom` if routing approach changes (see Open Questions).

## Open Questions
- **Routing approach conflict:** The story states "Use react-router for the routing," but DC-01 already implemented a custom pathname-based router in `App.js` (using `window.history.pushState`). Should DC-02 refactor to `react-router-dom` (requiring a new dependency), or extend the existing custom routing to add `/register`? Clarification needed.
- **Registration-to-login flow:** After successful registration, the spec assumes redirect to `/login` with a success indicator. Should this instead auto-login and redirect to `/dashboard`?
- **Password policy feedback granularity:** Should validation show a single generic message ("Password does not meet requirements") or enumerate each missing rule individually?

## Assumptions
- New `Register.js` component follows the same structural pattern as `Login.js` (same card layout, form styling, CSS class conventions).
- Mock user data is stored as a JSON array under a `localStorage` key (e.g., `"registeredUsers"`) so the login page can later validate against it if needed.
- The register page is publicly accessible (no auth guard), matching the login page behavior.
- Registration validation errors are displayed inline below each field using the existing form-group pattern.

## UI Notes
- **Layout:** Same centered card design as the login page (`login-container` / `login-card` CSS classes). Reuse existing styles.
- **Register link on login page:** Subtle text below the submit button: "Don't have an account? Register" — "Register" is an anchor-like element (styled link) that navigates to `/register`. Use an `<a>` tag or a clickable span with `navigateTo('/register')`.
- **Validation errors:** Red-colored text below the relevant input, using a new CSS class (e.g., `.validation-error`) — font-size 12px, color `#ff6b6b` or similar distinct red, with subtle margin-top.
- **Password policy hint:** A muted helper text below the password field (e.g., "Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char") using `color: #8892b0; font-size: 12px;`.
- **Brand consistency:** Maintain the existing blue/dark theme (`#091a32`, `#003f8c`, `#112240`, `#1d63b8`). No new color palettes.

## Implementation Notes
- Follow the same component structure as `Login.js`: functional component with `useState` hooks for form fields.
- Validation logic should live within `Register.js` (or a shared utility, but keep it simple — inline is acceptable).
- Password policy regex example pattern: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,}$/`.
- Register link in `Login.js` should use the existing `navigateTo` prop (passed from `App.js`) or access the pathname setter.
- No new npm packages unless explicitly resolved in Open Questions (the existing custom routing may be sufficient).
- Do not modify `Dashboard.js`, `Confetti.js`, or `index.js` — they are out of scope.

## Test Notes
- Run `npm test` to confirm no existing tests break.
- Run `npm run build` to verify clean production build.
- Manual container verification via `docker build` + `docker run`:
  - Visit `/login` and confirm the "Register" link is visible and clickable.
  - Click the link and confirm navigation to `/register`.
  - Submit registration with invalid email — verify inline error appears.
  - Submit with a weak password — verify policy error appears.
  - Submit with valid data — verify redirect to `/login`.
  - Verify existing login flow and dashboard still work correctly.
  - Check browser console for zero errors/warnings.

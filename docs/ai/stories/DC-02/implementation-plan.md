# Implementation Plan: DC-02 — Add Registration Page

## Source
- Primary spec: [docs/ai/stories/DC-02/spec.md](file://docs/ai/stories/DC-02/spec.md)
- Handoff: `.opencode/executions/exec-b37d0704-c058-41a2-acd8-cb76980d3794/handoffs/story_analyzer.json`
- Context: [docs/ai/context-map.json](file://docs/ai/context-map.json), [docs/ai/project-context.md](file://docs/ai/project-context.md)

## Open Question Resolutions
- **Routing**: Extend existing custom pathname-based router (`window.history.pushState` + `pathname` state in App.js). **No `react-router-dom` added** — confirmed absent from package.json.
- **Post-registration flow**: Redirect to `/login` (no auto-login). Login remains the auth gateway.
- **Password error granularity**: Enumerate each missing rule individually (e.g., "Must contain 1 uppercase letter") — per AC "descriptive inline error."

## Target Files
- [NEW] [src/Register.js](file://src/Register.js) — Registration form component
- [MODIFY] [src/App.js](file://src/App.js) — Add `/register` to auth guard + renderView branching
- [MODIFY] [src/Login.js](file://src/Login.js) — Accept `navigateTo` prop; add register link
- [MODIFY] [src/App.css](file://src/App.css) — Add `.validation-error`, `.password-hint`, `.register-link` styles

## Steps
1. **Register.js**: Create functional component following Login.js structure. State: `name`, `email`, `password`, `errors` object. Prop: `navigateTo`.
2. **Register.js — Validation**: Email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). Password regex (`/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,}$/`). Validate on submit — set `errors` object keyed by field name with array of messages.
3. **Register.js — Submit**: On valid, read/update `localStorage.registeredUsers` (JSON array of `{ name, email, password }`), then call `navigateTo('/login')`.
4. **Register.js — Render**: Reuse `.login-container`, `.login-card`, `.form-group`, `.login-input`, `.login-submit-btn`. Add `.password-hint` span below password input. Add `.validation-error` spans below email and password when errors exist.
5. **App.js — Auth guard**: Change unauthenticated check from `pathname !== "/login"` to `pathname !== "/login" && pathname !== "/register"`. Add `/register` to the authenticated redirect condition.
6. **App.js — renderView**: Add branch: `if (pathname === "/register") return <Register navigateTo={navigateTo} />`. Pass `navigateTo={navigateTo}` to `<Login>`.
7. **Login.js**: Accept `navigateTo` prop. Below submit button, add register link element calling `navigateTo('/register')` on click.
8. **App.css**: Add `.validation-error { color: #ff6b6b; font-size: 12px; margin-top: 4px; }`, `.password-hint { color: #8892b0; font-size: 12px; margin-top: 4px; }`, `.register-link { text-align: center; margin-top: 20px; color: #8892b0; font-size: 14px; }` with hover state for clickable span.

## Data/API Notes
- `localStorage.registeredUsers`: JSON array — `[{ name, email, password }]`. Existing `isAuthenticated` key is untouched.
- No backend calls. Register component uses `navigateTo` for redirect; Login already uses `onLoginSuccess`.
- Register link in Login.js uses the `navigateTo` prop to call `navigateTo('/register')`.

## UI Notes
- Reuse existing `.login-container`, `.login-card`, `.login-form` wrappers — no new layout containers.
- Field order: Name, Email (with `.validation-error`), Password (with `.password-hint` + `.validation-error`), Submit.
- `register-link` uses an inline clickable `span` styled to look like a link — color transitions to `#1d63b8` on hover.
- No changes to `Dashboard.js`, `Confetti.js`, or `index.js`.

## Tests
- `npm run build` — zero errors/warnings.
- `npm test` — all existing tests pass.
- Docker verification: `docker build -t welcome-to-docker . && docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker` then validate at `http://localhost:8088`:
  - `/login` shows register link → click navigates to `/register`.
  - `/register` renders centered card with name, email, password fields.
  - Invalid email shows red inline error below email field.
  - Weak password shows descriptive errors per violated rule.
  - Valid submission stores entry in localStorage + redirects to `/login`.
  - Existing login → dashboard flow works without regression.
  - Direct unknown route (e.g., `/foobar`) redirects to `/login`.
  - Browser console has zero errors.

## Risks
- **Auth guard redirect loop**: Incorrect pathname condition in App.js could trap users. **Mitigation**: Verify both `/login` and `/register` are whitelisted for unauthenticated access; verify authenticated users on `/register` redirect to `/dashboard`.
- **localStorage key collision**: `registeredUsers` is a new key; `isAuthenticated` must not be altered. **Mitigation**: Only read/write `registeredUsers` in Register.js; do not touch `isAuthenticated`.
- **Scope creep**: No changes to Dashboard.js, Confetti.js, or index.js. Keep CSS additions to 3 rule blocks only.

## Handoff
Hand to **code-implementer agent** with checklist:
- [ ] All 3 Open Questions resolved explicitly in plan.
- [ ] 4 files only: 1 new (Register.js), 3 modified (App.js, Login.js, App.css).
- [ ] No new npm packages — uses existing custom routing only.
- [ ] No changes to Dashboard.js, Confetti.js, index.js.
- [ ] Build + test commands ready for verification.

## Context Budget
- **Read only**: `src/App.js` (auth guard lines ~28-41, renderView ~44-50), `src/Login.js` (full file ~59L), `src/App.css` (theme colors, existing login classes ~lines 68-170). Use `grep` for targeted lookups.
- **Skip**: `src/Dashboard.js`, `src/Confetti.js`, `src/index.js`, `Dockerfile`, `package.json` (already confirmed no react-router-dom), `.github/` workflows.
- **Total read budget**: ~200 lines across 3 files.

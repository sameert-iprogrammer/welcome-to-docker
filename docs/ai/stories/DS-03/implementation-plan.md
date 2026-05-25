# DS-03: Add Settings Page — Implementation Plan

## Source
- Story spec: [docs/ai/stories/DS-03/spec.md](file:///docs/ai/stories/DS-03/spec.md)
- Story analyzer handoff: [.opencode/executions/exec-e0bf60b3-6781-4d98-83e7-b96825994b14/handoffs/story_analyzer.json](file:///.opencode/executions/exec-e0bf60b3-6781-4d98-83e7-b96825994b14/handoffs/story_analyzer.json)

## Target Files
- `[NEW]` [src/Settings.js](file:///src/Settings.js) — Settings page component with mock profile form
- `[MODIFY]` [src/App.js](file:///src/App.js) — Add `/settings` route, import Settings, pass `navigateTo` to Dashboard
- `[MODIFY]` [src/Dashboard.js](file:///src/Dashboard.js) — Add gear icon button in navbar, accept `navigateTo` prop
- `[MODIFY]` [src/App.css](file:///src/App.css) — Add `.settings-btn`, update `.dashboard-nav` layout, add `.settings-textarea`

## Steps

1. **Create `src/Settings.js`** — Functional component with `useState` for `name`, `email`, `bio`. Use static mock values (`"Jane Doe"`, `"jane@example.com"`, `"Docker enthusiast and full-stack developer."`). Props: `{ navigateTo }`. Render inside `login-container` / `login-card` divs (reuse pattern from [src/Login.js](file:///src/Login.js)). Form with 3 fields: Full Name (text input), Email Address (email input), Bio (textarea). Each wrapped in `.form-group` with `<label>` + `aria-label`. Below form, a "Back to Dashboard" button styled like `.logout-btn` that calls `navigateTo("/dashboard")`. No submit logic — purely presentational.

2. **Modify `src/Dashboard.js`** — Add `navigateTo` to destructured props. Inside `.dashboard-nav`, insert a `<button className="settings-btn" onClick={() => navigateTo("/settings")} aria-label="Settings"><i className="fa-solid fa-gear"></i></button>` before the logout button.

3. **Modify `src/App.js`** — Add `import Settings from "./Settings";` at top. Pass `navigateTo={navigateTo}` to `<Dashboard>` in the authenticated `renderView` return. Add a `/settings` case inside `renderView` for authenticated users: `if (pathname === "/settings") return <Settings navigateTo={navigateTo} />;`. Existing auth guard logic (second `useEffect`) already protects `/settings` since it's not in the unauthenticated allowlist.

4. **Modify `src/App.css`** — Update `.dashboard-nav` to `display: flex; align-items: center; gap: 10px;` (was only absolute positioned). Add `.settings-btn` block: transparent background, white `fa-gear` at `font-size: 20px`, no border, cursor pointer, padding to match logout-btn height, `transition: all 0.25s ease`, hover state with opacity/scale. Add `.settings-textarea` reusing `.login-input` + `resize: vertical; min-height: 80px; font-family: inherit;`. Add a `.settings-back-btn` styled matching `.logout-btn` dimensions, centered below form.

5. **Verify** — Run `npm test` to check no existing tests break. Run `npm run build` for clean production build.

## Data/API Notes
- No backend calls. All form values are local `useState` with static initial values.
- No `localStorage` reads/writes for settings data.
- Auth state is read-only via `localStorage.getItem("isAuthenticated")` — existing pattern unchanged.

## UI Notes
- Settings page reuses `.login-container` / `.login-card` / `.login-header` / `.login-input` / `.login-form` classes for visual consistency.
- Gear icon uses FontAwesome `fa-solid fa-gear` (already available via CDN in [public/index.html](file:///public/index.html)).
- Settings title uses Docker whale icon + "Settings" heading, matching the login-header pattern.
- Bio `<textarea>` referenced by `.settings-textarea` to avoid altering `.login-input` shared style.
- Back button uses `.settings-back-btn` styled identically to `.logout-btn` (reuse existing CSS variables).

## Tests
- `npm test` — verify no existing Jest tests break.
- `npm run build` — verify clean production build.
- Manual Docker verification: `docker build -t welcome-to-docker . && docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker`. Visit `http://localhost:8088`, login, verify gear icon, navigate to settings, verify form, verify back button, check console for 0 errors.
- Edge cases: direct `/settings` when unauthenticated → redirect to `/login`; browser back/forward from settings; mobile viewport.

## Risks
- **Auth guard regression**: Adding `/settings` to renderView must not change the auth redirect logic (second `useEffect`). The existing guard checks `pathname !== "/login" && pathname !== "/register"` for unauthenticated users, so `/settings` is already protected. Mitigation: verify unauthenticated direct navigation redirects.
- **FontAwesome CDN availability**: `fa-gear` might not render if CDN is blocked. Mitigation: icon renders as a plain square if unavailable — still functional.
- **Dashboard navbar layout shift**: Changing `.dashboard-nav` from `position: absolute` to flex may shift the logout button position. Mitigation: use same `top`/`right` positioning, only add flex display so children align inline without breaking existing absolute placement.

## Handoff
- **Next agent**: code-implementer.
- **Files to create**: `src/Settings.js`.
- **Files to modify**: `src/App.js`, `src/Dashboard.js`, `src/App.css`.
- **Do NOT touch**: `src/Confetti.js`, `src/Login.js`, `src/Register.js`, `src/index.js`, `src/index.css`, `public/index.html`, CI/config files, Dockerfile.
- **Verification handoff**: After implementation, run `npm test` and `npm run build` before Docker verification.

## Context Budget
- No full-file reads of `Confetti.js`, `Register.js`, `Login.js`, `index.js`, `index.css`, or any non-target files.
- No repo-wide glob/grep searches. Only read target files (`App.js`, `Dashboard.js`, `App.css`) and the new `Settings.js` after creation.

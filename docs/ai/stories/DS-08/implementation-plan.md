# DS-08: Change password in Settings — Implementation Plan

## Summary

Add a "Change Password" form on the Settings page with industry-standard password rules and client-side-only validation. On a valid submit, fire a success toast and clear the form. No backend integration, no localStorage writes for password, no routing or auth changes.

## Assumptions

- **Existing app already has**: `react-toastify` installed and `<ToastContainer />` mounted in `src/App.js` (DS-07). Re-use it; do not add another container.
- **Password policy** mirrors `Register.js` (already considered "industry standard" in this repo): min 8 chars, ≥1 lowercase, ≥1 uppercase, ≥1 digit, ≥1 special from `!@#$%^&*()_-+=`.
- **Form fields**: `currentPassword`, `newPassword`, `confirmPassword`. All required; `newPassword` must satisfy the policy; `confirmPassword` must equal `newPassword`; `newPassword` should not equal `currentPassword`.
- **No backend integration** (per story description): do not call any API, do not update `registeredUsers` in localStorage, do not verify `currentPassword` against any store. The "success" is purely the toast after client-side validation passes.
- **Toast copy**: `"Password changed successfully"` (adjust only if product copy is provided).
- **No spec file** exists at `docs/ai/stories/DS-08/spec.md`; this plan treats the story description as the source of truth.
- **No new tests required**. Existing test files do not cover `Settings.js`; only add tests if implementer chooses to.

## Target Files

| File | Action |
|------|--------|
| `src/Settings.js` | Add change-password section: state, validator, submit handler, JSX form, success toast, form reset |
| `src/App.css` | (Optional, only if needed) minor styling tweaks — most existing classes (`login-form`, `form-group`, `login-input`, `login-submit-btn`, `validation-error`, `password-hint`) should be sufficient |

**Do not edit**:
- `src/App.js` (`ToastContainer` already mounted)
- `package.json` (`react-toastify` already a dependency)
- `src/Register.js`, `src/Login.js`, route guards, Docker/deployment config
- `docs/ai/stories/DS-08/spec.md` (no spec file; do not fabricate)
- Other components or shared infrastructure

## Context Budget

- Inspect target files first (`src/Settings.js`, then `src/Register.js` only to copy the password regex pattern, then `src/App.css` only to confirm class names like `password-hint` and `validation-error`).
- Open non-target files only for direct imports or pattern reference; do not run broad repo scans.
- Use native edit tools (StrReplace / Edit) directly; do not print full file contents, full diffs, or large code blocks in chat.
- Validation: run only `npm run build` for the changed surface. Skip `npm test` unless a test is added; existing tests do not cover `Settings`.

## Implementation Steps

### 1. Add state for the change-password form in `src/Settings.js`

Inside the `Settings` component, alongside existing `name` / `email` / `bio` state, add:

- `currentPassword`, `newPassword`, `confirmPassword` (all strings, default `""`)
- `passwordErrors` object (default `{}`) keyed by field, value is `string[]` (same shape as `Register.js` for visual consistency)
- Import `toast` from `react-toastify`.

### 2. Add a password validator (inline, mirroring `Register.js`)

Define a local helper inside `Settings.js`:

- `validateNewPassword(value)` returns `string[]` of violations:
  - `"Must be at least 8 characters"` when `value.length < 8`
  - `"Must contain 1 lowercase letter"` when `!/(?=.*[a-z])/.test(value)`
  - `"Must contain 1 uppercase letter"` when `!/(?=.*[A-Z])/.test(value)`
  - `"Must contain 1 digit"` when `!/(?=.*\d)/.test(value)`
  - `"Must contain 1 special character"` when `!/(?=.*[!@#$%^&*()_\-+=])/.test(value)`

Keep the helper inline to avoid introducing a new shared util module (no `src/utils/` pattern exists today).

### 3. Add `handleChangePassword(e)` submit handler

- `e.preventDefault()`.
- Build a `newErrors` object:
  - `currentPassword`: `["Current password is required"]` when empty/whitespace.
  - `newPassword`: results of `validateNewPassword(newPassword)`; additionally push `"Must differ from current password"` when `newPassword === currentPassword` (only if `newPassword` is non-empty).
  - `confirmPassword`: `["Passwords do not match"]` when `confirmPassword !== newPassword`; `["Please confirm your new password"]` when `confirmPassword` is empty.
- `setPasswordErrors(newErrors)`.
- If `Object.keys(newErrors).length === 0`:
  - `toast.success("Password changed successfully");`
  - Reset the three password fields to `""`.
  - Do **not** navigate, do **not** touch `localStorage`, do **not** modify `registeredUsers`.

### 4. Render the "Change Password" form in `Settings.js`

Inside the existing `<div className="login-card">`, add a new section **below** the existing profile `<form className="login-form">` (keep the existing form and the `← Back to Dashboard` button intact). For visual consistency, reuse existing classes:

- Wrap in a new `<form onSubmit={handleChangePassword} className="login-form">` (separate `<form>`; do not merge with the profile form).
- Add a small section heading (e.g. `<h3>Change Password</h3>` or a styled `<div>`); use a plain `<h3>` to avoid new CSS unless visual review requires it.
- Three `<div className="form-group">` blocks, each containing:
  - `<label htmlFor="...">` and a `<input type="password" className="login-input" ... />`
  - `aria-label` matching the visible label (consistent with existing inputs)
  - Below the new-password input: `<span className="password-hint">Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char</span>` (same copy as `Register.js`)
  - Render per-field errors with `errors.<field>.map(...)` using `<div className="validation-error">{msg}</div>` (same pattern as `Register.js`)
- Submit button: `<button type="submit" className="login-submit-btn" aria-label="Change Password">Change Password</button>`.

Field IDs (avoid collisions with profile fields): `settings-current-password`, `settings-new-password`, `settings-confirm-password`.

### 5. (Optional) Minor `src/App.css` tweak

Only if the new `<h3>Change Password</h3>` looks visually off. Prefer **no CSS change** for the initial pass; revisit only if needed.

### 6. Smoke check (manual)

1. `npm start` → log in → navigate to `/settings`.
2. Leave fields blank, submit → three required errors render; no toast.
3. Enter weak new password (e.g. `abc`) → policy violations render under "New Password"; no toast.
4. Enter valid new password but mismatched confirm → "Passwords do not match" under confirm; no toast.
5. Enter `newPassword === currentPassword` → "Must differ from current password"; no toast.
6. Enter valid current, valid new, matching confirm → success toast `"Password changed successfully"` appears; all three password fields clear; no navigation.
7. Confirm existing profile form (name/email/bio) and "Back to Dashboard" still behave as before.

## Validation Commands

```bash
npm run build
```

Optional (only if a test is added in this story):

```bash
npm test -- --watchAll=false
```

Manual smoke per step 6 above.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Two `<form>`s in one card cause Enter-to-submit ambiguity | Use a dedicated `<form onSubmit={handleChangePassword}>` and keep the existing profile form's controls as `type="button"` (already the case for the back button) |
| Password fields auto-fill from browser saved credentials | Use distinct `id`s (`settings-current-password` etc.); optionally add `autoComplete="new-password"` on `newPassword` and `confirmPassword`, `autoComplete="current-password"` on `currentPassword` |
| Inconsistent password copy/regex vs. `Register.js` | Mirror `Register.js` validator verbatim; keep messages identical to existing strings |
| Toast not appearing | `ToastContainer` is mounted in `App.js` (DS-07); do not add a second one |
| Implementer accidentally adds backend or localStorage password write | Story is explicit: frontend only, success toast only — call out in step 3 |
| Visual regression with existing Settings layout | Reuse existing classes (`login-form`, `form-group`, `login-input`, `login-submit-btn`, `password-hint`, `validation-error`); avoid new CSS in the first pass |

## Out of Scope

- Any backend / API call to change the password
- Updating `registeredUsers` or any other localStorage entry
- Verifying the current password against any store
- Password strength meter, breach checks (HIBP), or rate limiting
- Logging the user out after a password change
- New shared password-policy module or shared form utilities
- New tests (unless implementer opts in)
- Routing changes, auth-guard changes, or styling overhaul

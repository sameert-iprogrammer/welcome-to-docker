# Implementation Plan: DS-09 — Edit profile

## Overview
Add an in-place edit mode to the Profile page. The page currently renders read-only details from `src/mockProfile.js`. Introduce an "Edit" button that switches the view to an editable form pre-filled with the same values, plus "Update" and "Cancel" actions. On Update, fire a `toast.success` and return to the read-only view with the updated values reflected in component state. No backend or routing changes; reuse the existing `react-toastify` setup already mounted in `src/App.js`.

## Target Files
- `src/Profile.js` — modify: add edit state, editable form, Edit/Update/Cancel handlers, toast on save.
- `src/App.css` — modify (small, additive): add `.profile-actions` row + `.profile-edit-btn` / `.profile-cancel-btn` styles; reuse `.login-input`, `.login-submit-btn`, `.settings-back-btn`, `.form-group`, `.profile-fields`, `.profile-field`.
- `src/Profile.test.js` — create: render in read-only mode, click Edit to expose inputs, change a field, click Update, assert read-only view shows new value and Edit button is back.

Avatar/initials, Role, and Member Since remain read-only in both modes (avatar derives from `displayName`; role/memberSince are not user-editable in scope of this story). Editable fields: Full Name, Email, Username, Bio.

## Context Budget
- Inspect target files first; do not perform broad repo scans.
- Open non-target files only if needed to confirm a direct import, caller, or shared style class. Likely sufficient references already noted: `src/mockProfile.js` (shape), `src/Settings.js` (form + toast pattern), `src/App.js` (`<ToastContainer>` already mounted).
- Use the editor's native edit tools directly. Do not paste full file contents, full diffs, or large code blocks into chat — apply changes in-place and summarize.
- Run only the validation commands listed below for the changed surface; skip full builds and unrelated tests.

## Implementation Steps

### 1. `src/Profile.js` — add edit mode
1. Add imports: `useState` from React; `toast` from `react-toastify` (mirror `src/Settings.js` import style).
2. Initialize state from `mockProfile`:
   - `const [profile, setProfile] = useState({ displayName, email, username, bio, avatarUrl, role, memberSince })` (single object so the read-only view also reflects updates after save).
   - `const [isEditing, setIsEditing] = useState(false)`.
   - `const [draft, setDraft] = useState(profile)` for the in-edit working copy (or initialize on entering edit mode).
3. Recompute `initials` from `profile.displayName` instead of the destructured constant.
4. Handlers:
   - `handleEdit`: `setDraft(profile); setIsEditing(true);`
   - `handleCancel`: `setIsEditing(false);` (discard `draft`).
   - `handleChange(field)`: returns `(e) => setDraft(prev => ({ ...prev, [field]: e.target.value }))`.
   - `handleUpdate(e)`: `e.preventDefault(); setProfile(draft); setIsEditing(false); toast.success("Profile updated successfully");`.
5. Rendering:
   - Keep header (`docker-logo-icon`, `<h2>Profile</h2>`, sub-text) and avatar block unchanged; sub-text can switch between "Your account information" and "Update your account information" based on `isEditing` (optional).
   - When `!isEditing`: render the existing `<dl className="profile-fields">` block sourced from `profile` (replacing destructured constants). Below it, render an `Edit` button (`type="button"`, class `login-submit-btn` reused, `aria-label="Edit profile"`, `onClick={handleEdit}`). Keep the existing `← Back to Dashboard` button below it.
   - When `isEditing`: render a `<form className="login-form" onSubmit={handleUpdate}>` with `form-group` blocks for Full Name, Email, Username, Bio. Use `<input className="login-input">` for the first three and `<textarea className="login-input settings-textarea">` for Bio (mirrors `src/Settings.js`). Include `htmlFor`/`id` pairs (`profile-fullname`, `profile-email`, `profile-username`, `profile-bio`) and `aria-label` attributes for each control. Below the form, render a `.profile-actions` container with:
     - `<button type="submit" className="login-submit-btn" aria-label="Update profile">Update</button>`
     - `<button type="button" className="settings-back-btn" onClick={handleCancel} aria-label="Cancel edit">Cancel</button>`
   - Keep `← Back to Dashboard` visible only in read-only mode (or in both — choose read-only only to avoid action overload while editing).
6. Do not change the default export or component name.

### 2. `src/App.css` — minimal additive styles
1. Add `.profile-actions { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }` placed near the existing `.profile-*` rules (around lines 285–310).
2. Optional: add `.profile-edit-btn` only if a different look from `.login-submit-btn` is wanted; otherwise reuse existing classes and skip.
3. Do not modify unrelated rules.

### 3. `src/Profile.test.js` — basic coverage (jest + @testing-library/react)
Follow `src/Sidebar.test.js` pattern. Wrap render in `<MemoryRouter>` because `Profile.js` calls `useNavigate`. Mock `react-toastify` to avoid `<ToastContainer>` requirements:
- `jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }));`

Tests:
1. Renders read-only fields including the value `Jane Doe` and an `Edit profile` button.
2. Clicking Edit reveals inputs (`getByLabelText("Full Name")` returns an input element) and hides the Edit button; Update and Cancel buttons appear.
3. Editing the Full Name input and clicking Update returns to read-only mode, displays the new value, and `toast.success` was called with `"Profile updated successfully"`.
4. Cancel discards changes (input value not propagated to read-only view).

## Validation Commands
Run only what covers the changed surface:
- `npm test -- --watchAll=false src/Profile.test.js` — unit coverage for edit flow.
- `npm start` (manual smoke, optional) — visit `/profile`, toggle Edit, change a field, click Update, confirm toast and updated values; click Cancel after editing and confirm discard.

Skip `npm run build` unless a CSS/JSX syntax issue is suspected; CRA dev server already type-checks JSX.

## Risks & Edge Cases
- Toast not appearing: `<ToastContainer>` is already mounted in `src/App.js`; verify `import { toast } from "react-toastify"` matches existing usage in `src/Settings.js`/`src/Login.js`.
- State drift on Cancel: must reset `draft` on next Edit click (`handleEdit` re-seeds `draft` from `profile`) to avoid stale edits leaking after cancel.
- Email/empty-field validation is out of scope for DS-09 (no acceptance criteria specified). Inputs accept any value; do not add password-style validation.
- Avatar `initials` must read from `profile.displayName`, not the originally destructured constant, otherwise initials won't update after save.
- Accessibility: every input needs an associated `<label htmlFor>` and `aria-label`, matching the patterns in `src/Settings.js` and `src/Login.js`.
- Tests using `react-toastify`: mock the module to avoid pulling its CSS and container into the test runtime.

## Assumptions
- Editable fields are Full Name, Email, Username, Bio. Role and Member Since stay read-only (not user-editable in this scope).
- "No backend changes" means edits persist only in component state for the current session and are lost on reload — `mockProfile.js` is not mutated.
- Reuse existing CSS classes (`.login-input`, `.login-submit-btn`, `.settings-back-btn`, `.form-group`, `.settings-textarea`) to preserve visual consistency; only add `.profile-actions` if needed for layout.
- Toast message wording: `"Profile updated successfully"` (consistent with `"Password changed successfully"` in `src/Settings.js`).
- No new dependencies; `react-toastify` and `@testing-library/react` are already in `package.json`.

## Story Summary
Add a "Recent Users" section to the Dashboard showing 5 hardcoded mock records in a table, with a "View" button per row opening a detail modal, and an Active/Inactive toggle per row with a confirmation dialog and success toast. No backend — fully static mock data.

## Requirements
- Display "Recent Users" section on `/dashboard` below the metrics grid with 5 mock records in an HTML `<table>`
- Columns: Username, Email, Role, Status, Joined Date, Action
- **View CTA** (plan-approval): Each row has a "View" button — clicking opens a read-only modal with 8 mock detail fields (Username, Email, Role, Status, Joined Date, Last Active, User ID, Department)
- **Status toggle** (final-review): Each row has a "Mark Inactive"/"Mark Active" button — clicking shows a confirmation dialog; on Confirm, toggles status and fires `toast.success()`
- Confirmation dialog dismissible via Cancel button or backdrop click
- Modal dismissible via X button, Close action button, or backdrop click
- Data is a static constant array (`recentUsersData`) outside the component
- Follow existing dark theme and table styling patterns (see `src/App.css:878-914` for `.orders-table` reference)

## Acceptance Criteria
- "Recent Users" heading renders below metrics grid with a `<table>` of exactly 5 rows
- All 6 columns visible: Username, Email, Role, Status, Joined Date, Action
- **View buttons**: 5 rendered; clicking opens a modal titled "User Details" with 8 fields (5 from data + 3 static: "Today, 09:15 AM", "Engineering", `USR-{id}`)
- Modal closes via X button, Close button, or backdrop overlay click; inner modal click does not close (`stopPropagation`)
- **Toggle buttons**: Each row shows "Mark Inactive" for Active users and "Mark Active" for Inactive users
- Clicking toggle opens "Confirm Status Change" dialog with the user's name and target status
- Dialog Cancel button or backdrop click dismisses dialog without changes
- Dialog Confirm button updates user's status, closes dialog, fires `toast.success()` with `"${username} marked as ${newStatus}"`
- No backend calls, no new npm dependencies, plain CSS only
- State resets correctly (toggling one user does not affect others)

## Impacted Areas
- `src/Dashboard.js` — `useState` for `selectedUser`, `confirmUser`, `users`; static `recentUsersData` array; table JSX with View + Mark buttons; modal JSX; confirmation dialog JSX; `handleToggleStatus` handler
- `src/App.css` — `.recent-users-*` block (section, table, status badges, View button, Mark button variants, modal overlay/modal, confirmation dialog overlay/dialog)
- `src/Dashboard.test.js` — tests for View button→modal, Mark button→confirmation dialog→confirm→toast

## Open Questions
- None. All three feature layers are fully defined.

## Assumptions
- Mock data shape: `{ id, username, email, role, status, joinedDate }` with 5 varied records
- Modal static fields (Last Active, User ID, Department) are literal strings, not derived
- `toast` imported from `react-toastify` (already exists in project via `App.js:3`, used in `Approvals.js`, `Customers.js`)
- `useState` imported alongside `React` (package-style: `import React, { useState } from "react"`)
- Confirmation dialog uses its own overlay and `stopPropagation` pattern (same as modal)
- Status toggle updates local `users` state array (no persistence — resets on page reload)
- CSS classes follow BEM-ish naming: `.recent-users-section`, `.recent-users-mark-btn--inactivate`, `.confirm-dialog-overlay`, etc.

## UI Notes
- Section below metrics grid inside `.dashboard-content`
- Title: white `28px` 700 weight (match `.orders-title` pattern)
- Table wrapper has `overflow-x: auto` for responsive scroll; table background `#112240`
- Status pills: `.recent-users-status--active` green (`#48bb78`), `--inactive` gray (`#8892b0`)
- View button: subtle accent (`rgba(29,99,184,0.2)` bg, `#64a3e8` text)
- Mark buttons: `.recent-users-mark-btn--inactivate` (red-ish), `.recent-users-mark-btn--activate` (green-ish)
- Actions column uses a flex row with `gap: 8px` for the two buttons
- Modal: fixed overlay `z-index: 1000`, centered card `max-width: 520px`
- Confirmation dialog: centered card with title, message, Cancel/Confirm buttons
- Reference `src/App.css` for existing `.orders-table`, `.recent-users-*`, `.confirm-dialog-*` patterns

## Implementation Notes
- Edit `src/Dashboard.js`: add `useState` for `selectedUser` (modal visibility), `confirmUser` (dialog visibility), `users` (mutable state from `recentUsersData`); add `handleToggleStatus(user)` handler that maps over users, toggles status, calls `toast.success()`, resets `confirmUser`
- `src/Dashboard.js` already imports `{ toast }` from `react-toastify` — maintain that pattern
- View button: `<button onClick={() => setSelectedUser(u)}>View</button>`
- Mark button: `<button onClick={() => setConfirmUser(u)}>Mark Inactive/Mark Active</button>`
- Modal and confirmation dialog use separate overlay divs with `role="dialog"` / `aria-modal="true"`
- Both overlay divs dismiss via `onClick={() => setState(null)}` with `stopPropagation` on inner content div
- No API calls, no localStorage, no new deps, no TypeScript — per governance rules
- No react-router or new page/route changes needed

## Test Notes
- `src/Dashboard.test.js` coverage:
  - Renders without crashing, shows "Recent Users" heading
  - 5 user rows (6 `<tr>` total including header)
  - 5 View buttons — click opens modal, Close dismisses
  - 5 Mark buttons — click opens "Confirm Status Change" dialog
  - Cancel dismisses dialog; Confirm toggles status and calls `toast.success()`
  - Toggling one user does not affect other users' status
- Run `npm test -- --watchAll=false` to validate
- Mock `react-toastify` in tests: `jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }))`
- Use `MemoryRouter` wrapper for Dashboard tests (component uses react-router hooks via `Sidebar`)

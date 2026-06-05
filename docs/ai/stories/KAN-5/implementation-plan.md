## Source

- `docs/ai/stories/KAN-5/spec.md` — Recent Users table with View detail modal + Active/Inactive status toggle + confirmation dialog + success toast
- Change request (2026-06-05T10:37:06Z): View CTA per row + detail modal
- Change request (2026-06-05T11:15:38Z): Mark Active/Inactive toggle per row with confirmation + toast

## Target Files

| Action | File |
|--------|------|
| Modify | `src/Dashboard.js` |
| Modify | `src/App.css` |
| Create | `src/Dashboard.test.js` |

## Context Budget

**Read-only context needed (already cached):** `Dashboard.js`, `App.css`, `App.js` (for toast pattern), `spec.md`, `context-map.json`
**Do NOT read:** `Customers.js`, `Orders.js`, `Sidebar.js`, `Login.js` — not relevant
**Do NOT edit:** `App.js` (ToastContainer already rendered), `package.json` (no new deps)

## Steps

### 1. `src/Dashboard.js` — Add recent users state, table, modal, and toggle logic

- Add `import React, { useState } from "react"` and `import { toast } from "react-toastify"` at top
- Define `const recentUsersData = [...]` (5 mock user objects with `id`, `username`, `email`, `role`, `status`, `joinedDate`) outside component
- Inside component: add `useState` for `selectedUser` (View modal), `users` (mutable copy of `recentUsersData`), `confirmUser` (confirmation dialog)
- Add `handleToggleStatus(user)` handler: compute `newStatus`, map over users to toggle target user, clear `confirmUser`, call `toast.success()`
- Add `<section className="recent-users-section">` below metrics grid with `<table>` containing 6 columns: Username, Email, Role, Status (with colored pill), Joined Date, Action
- Action column: `<div style={{display:"flex",gap:"8px"}}>` wrapping View button + Mark Active/Inactive button
- View button: `onClick={() => setSelectedUser(u)}`, opens detail modal with 8 fields (5 from data + Last Active=`"Today, 09:15 AM"`, User ID=`USR-{id}`, Department=`"Engineering"`)
- Modal: fixed overlay `z-index:1000`, stopPropagation on inner content, dismissible via X/Close/backdrop
- Mark button: conditionally renders "Mark Inactive" (active users) or "Mark Active" (inactive users), opens confirmation dialog
- Confirmation dialog: separate overlay `z-index:2000`, shows user name + target status, Cancel/Confirm buttons, dismiss via Cancel/backdrop

### 2. `src/App.css` — Add recent users and confirmation dialog CSS

Insert after `.dashboard-content` block (around line 629):
- `.recent-users-section` — full width, max-width 1100px, padding
- `.recent-users-title` — white 28px 700 weight, 24px bottom margin
- `.recent-users-table-wrapper` — overflow-x auto, border-radius 8px
- `.recent-users-table` / `-th` / `-td` — match `.orders-table` pattern (dark bg `#112240`, header bg `#0a192f`)
- `.recent-users-status--active` — green pill `#48bb78` on rgba bg
- `.recent-users-status--inactive` — gray pill `#8892b0` on rgba bg
- `.recent-users-view-btn` — subtle blue accent (`rgba(29,99,184,0.2)` bg, `#64a3e8` text)
- `.recent-users-mark-btn` — base padding/font; `--inactivate` variant red-tinted (`#e74c3c`), `--activate` variant green-tinted (`#2ecc71`)
- `.recent-users-modal-overlay` / `.recent-users-modal` / header/body/rows/labels/actions — fixed overlay, dark card, flex rows
- `.confirm-dialog-overlay` / `.confirm-dialog` (reuse existing selectors already in App.css from previous features — verify presence; if absent, author them)

### 3. `src/Dashboard.test.js` — Add test coverage

- Mock `react-toastify` at top: `jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }))`
- Wrap all tests in `<MemoryRouter>` (component uses react-router via Sidebar)
- Tests: renders Recent Users heading, 6 rows (1 header + 5 data), 5 View buttons, View opens modal with "User Details", Close dismisses modal, 5 Mark buttons, Mark opens "Confirm Status Change" dialog, Cancel dismisses dialog, Confirm toggles status + calls `toast.success()`, toggling one user does not affect others
- `beforeEach`: `jest.clearAllMocks()`

### 4. Validate

```bash
npm test -- --watchAll=false   # all tests pass (existing + new)
npm run build                   # no compile errors
```

## Data/API Notes

- No backend. All data is the hardcoded `recentUsersData` array.
- State managed via `useState` — in-memory only, resets on reload (acceptable for mock data).
- Toast via existing `react-toastify` — `App.js` already renders `<ToastContainer />` at root.
- No new npm dependencies, no TypeScript, no react-router changes.

## UI Notes

- Section placed below metrics grid inside `.dashboard-content` div.
- Action column: two buttons in flex row with 8px gap.
- Status pills use green (`--active`) / gray (`--inactive`) color scheme.
- View modal + confirmation dialog use independent state — can overlap without conflicts.
- Both overlays use `stopPropagation` on inner content div to prevent backdrop-close when clicking inside.
- Confirmation dialog reuses existing `.confirm-dialog-*` CSS classes (used by other features in the app).

## Tests

| File | Coverage |
|------|----------|
| `Dashboard.test.js` | Heading render, 5 data rows, 5 View buttons, modal open/close, 5 Mark buttons, confirmation dialog open/close, confirm toggles + toast, toggling one user doesn't affect others |

## Risks

1. **ToastContainer already exists in App.js** — just `import { toast }`; no new container added.
2. **MemoryRouter wrapper** — Dashboard uses `Sidebar` which has `<Link>` from react-router; tests must wrap in `<MemoryRouter>`.
3. **jest.spyOn vs jest.mock** — Use module-level `jest.mock("react-toastify", ...)` not `spyOn` for toast mocking to avoid import-order issues.
4. **CSS insertion point** — Insert recent-users rules after `.dashboard-content` block (around line 629 in App.css) to maintain logical grouping.
5. **Existing tests must not regress** — Only add new tests, never modify/remove existing Dashboard tests (if any).
6. **Confirmation dialog CSS** — Verify `.confirm-dialog-*` classes exist in App.css (likely from prior features); if absent, author them.

## Handoff

1. All 3 target files ready for editing. No other files need changes.
2. After implementation, run `npm test -- --watchAll=false` and `npm run build` to validate.
3. The implementation is self-contained — no cross-file breakage expected.
4. If test failures occur, check: (a) MemoryRouter wrapper, (b) toast mock import, (c) aria-label matching button queries.

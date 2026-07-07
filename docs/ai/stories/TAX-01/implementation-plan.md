# TAX-01 Implementation Plan: Active Sessions Table on Dashboard

## Overview

Add a display-only **Active Sessions** table to the Dashboard (`/dashboard`) showing exactly **5** hardcoded mock session rows. Preserve the existing metrics grid and sidebar layout. No API calls, routing changes, or auth changes.

## Current State

| Area | Finding |
|------|---------|
| Dashboard | `src/Dashboard.js` — metrics grid only; no table yet |
| Routing | `react-router-dom` in `src/App.js`; `/dashboard` already wired with auth guard |
| Table pattern | `src/Orders.js` — inline `mockOrders` (5 rows), `orders-table*` CSS classes |
| Mock modules | `src/mastersMock.js`, `src/productsMock.js` — exported constant arrays |
| Dashboard CSS | `src/App.css` — `.dashboard-content`, `.metrics-grid`, `.metric-card` |
| Tests | No `Dashboard.test.js`; `src/Orders.test.js` is the closest pattern |

## Implementation Steps

### 1. Create mock session data

Create `src/activeSessionsMock.js` exporting an array of **exactly 5** session objects.

**Shape (minimum):**
- `id` — unique key for React `key`
- `user` — display name
- `status` — e.g. `"Active"`
- `lastActive` — human-readable string (e.g. `"2 minutes ago"`, `"Today at 9:14 AM"`)

Use realistic fake values. All rows may show `"Active"`. Do not add fetch logic.

### 2. Extend Dashboard component

Edit `src/Dashboard.js`:

1. Import `mockActiveSessions` from `./activeSessionsMock`.
2. Keep the existing metrics grid unchanged.
3. Below the metrics grid, add an **Active Sessions** section:
   - Section heading: `Active Sessions` (match `orders-title` casing/style)
   - Table wrapper + `<table>` markup mirroring `Orders.js`
   - Columns: **User**, **Status**, **Last Active**
   - Map all 5 mock records — no filter, search, pagination, or slice
4. Reuse existing table CSS classes from Orders:
   - `orders-table-wrapper`, `orders-table`, `orders-table-th`, `orders-table-td`
   - Use `orders-title` (or equivalent) for the section heading

**Do not** add row actions, revoke buttons, or network calls.

### 3. Adjust Dashboard layout CSS

Edit `src/App.css`:

1. Add a sessions section container below the metrics grid (e.g. `.dashboard-sessions` or `.active-sessions-section`):
   - Full content width with padding/max-width aligned to `.orders-container` (`max-width: 1100px`, horizontal padding)
   - Position below `.metrics-grid` without breaking the existing 2×2 metric card grid
2. Reuse `.orders-table*` styles — avoid duplicating table rules unless spacing requires a small dashboard-specific override.
3. If `.dashboard-content` centering constrains the table, add a scoped layout tweak so the sessions block spans the content area while metrics remain centered.

**Scope:** Only dashboard sessions layout rules; do not restyle unrelated pages.

### 4. Add minimal tests (recommended)

Create `src/Dashboard.test.js` following `Orders.test.js`:

1. Wrap in `<MemoryRouter>` (Dashboard uses `Sidebar`, which may depend on router context).
2. Test: renders without crashing.
3. Test: **Active Sessions** heading is present.
4. Test: all 5 mock users appear in the document.
5. Test: metrics grid still renders (regression guard).

Mock `localStorage` if needed for sidebar/nav patterns used elsewhere in tests.

### 5. Manual smoke check

1. `localStorage.setItem("isAuthenticated", "true")` → navigate to `/dashboard`
2. Confirm metrics grid unchanged
3. Confirm Active Sessions table shows 5 rows with User / Status / Last Active
4. Confirm no console errors or network requests

## Target Files

| File | Action |
|------|--------|
| `src/activeSessionsMock.js` | **Create** — 5 mock session records |
| `src/Dashboard.js` | **Edit** — import mock data; render Active Sessions section |
| `src/App.css` | **Edit** — dashboard sessions section layout (minimal) |
| `src/Dashboard.test.js` | **Create** — minimal render + row-count coverage |

**Do not edit:** `src/App.js`, auth files, `Sidebar.js`, or other route pages unless a compile error forces an import fix.

## Context Budget

- Open **target files first** (`Dashboard.js`, `activeSessionsMock.js`, `App.css`, `Dashboard.test.js`).
- Open **reference files only as needed:** `Orders.js` (table markup), `Orders.test.js` (test pattern), `mastersMock.js` (mock export shape).
- **No broad repo scans** — routing and patterns are documented above.
- Use native edit tools; do not paste full file contents or large diffs in chat.
- Run only the validation commands below.

## Validation Commands

```bash
npm test -- --watchAll=false --testPathPattern=Dashboard
npm run build
```

If `Dashboard.test.js` is skipped, still run full test suite before merge:

```bash
npm test -- --watchAll=false
npm run build
```

## Acceptance Criteria Mapping

| Criterion | How to verify |
|-----------|---------------|
| Active Sessions section on `/dashboard` | Heading visible when authenticated |
| Exactly 5 mock rows | Array length = 5; no pagination |
| User, status, last active columns | Table headers + cell content |
| No API calls | Static import only; no `fetch`/`axios` |
| Consistent styling | Reused `orders-table*` classes + dashboard layout CSS |
| No dashboard regressions | Metrics grid still renders; existing tests pass |
| Build passes | `npm run build` exits 0 |

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Dashboard layout breaks when adding a wide table | Scope CSS to a new sessions wrapper; mirror `.orders-container` width |
| `Sidebar` / router context breaks tests | Wrap tests in `<MemoryRouter>` like `Orders.test.js` |
| Context-map says "no react-router" | **Ignore** — codebase uses `react-router-dom`; do not change routing |
| Over-scoping columns | Stick to User / Status / Last Active unless product requests more |

## Assumptions

1. Display-only table — no revoke/view actions.
2. English labels and static time strings are acceptable.
3. Reusing Orders table CSS classes is sufficient for visual consistency (no new CSS framework).
4. Placement is **below** the metrics grid on the same Dashboard page.
5. `activeSessionsMock.js` is preferred over inline data to match other mock modules and keep `Dashboard.js` readable; inline is acceptable if the implementer keeps the array at exactly 5 items.

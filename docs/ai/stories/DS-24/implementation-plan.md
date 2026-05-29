# DS-24: Logs Module — Implementation Plan

## Source

- `docs/ai/stories/DS-24/spec.md`
- Change request (2026-05-29): add view-icon-per-row → detail modal (frontend only)
- Existing patterns: `Orders.js`, `Customers.js` (table + pagination + modal), `Sidebar.js`, `App.js`, `App.css`, `Orders.test.js`

## Target Files

| Action | File |
|--------|------|
| **Create** | `src/Logs.js` |
| **Create** | `src/Logs.test.js` |
| **Modify** | `src/App.js` — add `/logs` route + import |
| **Modify** | `src/Sidebar.js` — add Logs nav item |
| **Modify** | `src/App.css` — append `logs-*` styles |

## Steps

1. **Create `src/Logs.js`** — functional component, default export.
   - Import `React`, `useState`, `useEffect`, `useMemo` (from React).
   - Import `Sidebar` from `./Sidebar`.
   - Define mock data array `mockLogs` (14 entries) with fields: `id` (`LOG-001`…`LOG-014`), `timestamp` (ISO-like string), `level` (`INFO`/`WARN`/`ERROR`/`DEBUG`), `source`, `message`, `user` (optional), `ip` (optional, for modal detail). Logs should have timestamps across different dates, varied levels, and meaningful messages.
   - **State**: `searchTerm`, `currentPage`, `selectedLog` (null = modal closed, object = modal open).
   - **Search**: `useMemo` filter across `id`, `timestamp`, `level`, `source`, `message`, `user` — concatenated string `.toLowerCase().includes(term)` (same strategy as `Customers.js`).
   - **Pagination**: `PAGE_SIZE = 5`. Compute `totalPages`, `start`, `paginatedLogs`. Add `useEffect` to reset `currentPage = 1` on `searchTerm` change (like Customers.js).
   - **Table columns**: ID, Timestamp, Level, Source, Message, Action (view icon). Map `paginatedLogs` to table rows.
   - **Action cell**: `<i className="fa-solid fa-eye" ...>` wrapped in a button that sets `selectedLog` on click.
   - **Detail modal**: when `selectedLog` is truthy, render a `.logs-modal-overlay` > `.logs-modal` containing all log fields in a labeled layout. Include a Close button (`.logs-modal-close-btn`). Click overlay background → close modal.
   - **Render**: `<div className="App App--sidebar">` > `<Sidebar />` > `.logs-container` > title, search input, table, no-results message, pagination, modal.
   - Follow Orders.js/Customers.js table wrapper structure exactly for CSS reuse.

2. **Modify `src/Sidebar.js`** — append to `navItems`:
   ```js
   { label: "Logs", path: "/logs", icon: "fa-solid fa-scroll" }
   ```

3. **Modify `src/App.js`** — add import + route:
   - `import Logs from "./Logs";`
   - `<Route path="/logs" element={isAuthenticated ? <Logs /> : <Navigate to="/login" />} />`

4. **Append styles to `src/App.css`** — use `logs-*` prefix:
   - `.logs-container` — flex:1, padding, max-width (same as `.orders-container`)
   - `.logs-title` — white, 28px, bold
   - `.logs-table` / `.logs-table-th` / `.logs-table-td` — reuse `.orders-table*` values, just copy the block with renamed class
   - `.logs-table-wrapper` — same as `.orders-table-wrapper`
   - `.logs-search` — same as `.orders-search`
   - `.logs-no-results` — same as `.orders-no-results`
   - `.logs-pagination` / `.logs-page-btn` / `.logs-page-btn--disabled` / `.logs-page-info` — copy from `.customers-pagination*` with rename
   - `.logs-view-btn` — transparent background, color `#61dafb`, border none, cursor pointer, font-size 16px
   - `.logs-modal-overlay` — fixed overlay (same as `.customer-modal-overlay`)
   - `.logs-modal` — dark card (same as `.customer-modal`) but wider (max-width 560px)
   - `.logs-modal-title` — white, 22px
   - `.logs-modal-body` — label/value pairs, `.logs-modal-field` > `.logs-modal-label` (dim uppercase) + `.logs-modal-value` (white)
   - `.logs-modal-actions` — flex end gap, `.logs-modal-close-btn` (same as `.customer-modal-cancel-btn`)

5. **Create `src/Logs.test.js`** — mirror `Orders.test.js` patterns:
   - Wrap in `<MemoryRouter>`.
   - Test: renders without crashing.
   - Test: renders all 14 mock log id texts in the table.
   - Test: search filters correctly (case-insensitive across fields).
   - Test: no-results message appears for unmatched search.
   - Test: page 1 shows first 5 rows, click Next shows next 5 (pagination test).
   - Test: click view icon opens modal, verify detail text visible, click close dismisses.

## Data/API Notes

- No backend. All mock data in `src/Logs.js`. Pure frontend.
- Mock log entry shape:
  ```js
  {
    id: "LOG-001",
    timestamp: "2026-05-28 14:32:10",
    level: "ERROR",        // INFO | WARN | ERROR | DEBUG
    source: "auth-service",
    message: "Failed login attempt for user admin",
    user: "admin",          // extra detail for modal
    ip: "192.168.1.100",    // extra detail for modal
    userAgent: "Mozilla/5.0 ..."   // extra detail for modal
  }
  ```
- At least 4 WARN/ERROR entries and 3 DEBUG entries for variety.
- `logs-*` CSS prefix convention (spec requirement).

## UI Notes

- **Sidebar**: "Logs" nav item with `fa-solid fa-scroll` icon, between Approvals and FAQ (alphabetical or keep at end).
- **Table columns**: ID | Timestamp | Level | Source | Message | Action(view icon)
- **Level cell styling**: color-code the level text (green for INFO, orange for WARN, red for ERROR, gray for DEBUG) via inline style or className.
- **Pagination**: "Previous" / "Page X of Y" / "Next" (matches Customers.js).
- **View icon**: `fa-solid fa-eye`, color `#61dafb`, no text, purely icon button.
- **Detail modal**: shows all fields in a structured layout. Extra fields (user, ip, userAgent) only visible in modal, not in table. Close button and overlay-click-to-close.

## Tests

- `src/Logs.test.js` — 6 test cases covering render, data display, search, no-results, pagination, and modal open/close.

## Risks

1. **Modal state**: `selectedLog` must be nullable (null = closed). Ensure overlay background click sets null without triggering row click.
2. **Pagination + search interaction**: `useEffect` resetting `currentPage` on `searchTerm` change is essential to avoid empty pages.
3. **CSS naming**: must use `logs-*` prefix as required by spec, not `orders-*` or `customers-*`.
4. **ARIA labels**: add `aria-label` on search input, pagination buttons, view buttons, and modal close for consistency.
5. **No react-toastify needed**: Logs.js does not need `toast` import (unlike Customers.js).

## Context Budget

- Read only: `src/Logs.js` (will be created), `src/Logs.test.js` (will be created)
- Need to read for reference: `src/App.js` (insert route + import), `src/Sidebar.js` (insert nav item), `src/App.css` (append styles at end)
- Avoid re-reading unrelated files (`Dashboard.js`, `Login.js`, `Settings.js`, `Register.js`, `Products.js`, `Masters.js`, `Approvals.js`, `FAQ.js`, `Profile.js`, etc.)

## Handoff

The code-implementer should:

1. Read `src/App.js`, `src/Sidebar.js`, `src/App.css` to find exact insertion points.
2. Create `src/Logs.js` following the Customers.js pagination + modal pattern, with the mock data, search, pagination, table, and detail modal as described.
3. Create `src/Logs.test.js` with 6 test cases.
4. Modify `src/App.js` — add import and route for `/logs`.
5. Modify `src/Sidebar.js` — add Logs nav item.
6. Append `logs-*` CSS to `src/App.css`.
7. Run `npm test` to verify all existing + new tests pass.
8. Run `npm run build` to confirm no build errors.

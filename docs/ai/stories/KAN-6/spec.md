## Story Summary

Add a "Recent Orders" section to the Dashboard showing 5 hardcoded mock records in a table, positioned below the existing "Recent Users" table. No backend — fully static mock data. Read-only display table only — no View modal, no status toggle, no confirmation dialog, no toast.

## Requirements

- Display "Recent Orders" section on `/dashboard` below the "Recent Users" table with 5 mock records in an HTML `<table>`
- Columns: Order ID, Customer, Product, Status, Date (matching the data shape from `src/Orders.js`)
- Data is a static constant array (`recentOrdersData`) outside the component, using the same shape as `src/Orders.js` mockOrders
- Follow existing dark theme and table styling patterns (use `.recent-orders-*` CSS names following `.recent-users-*` pattern)
- No interaction required — display-only table (no buttons, no modals, no toggles)

## Acceptance Criteria

- "Recent Orders" heading renders below "Recent Users" table with a `<table>` of exactly 5 rows
- All 5 columns visible: Order ID, Customer, Product, Status, Date
- Each row displays mock order data from the static array
- Table styling matches existing Recent Users table pattern (dark theme, same dimensions)
- No backend calls, no new npm dependencies, plain CSS only
- No buttons, no interactivity in the Recent Orders section

## Impacted Areas

- `src/Dashboard.js` — add static `recentOrdersData` array (5 mock orders); add `<section className="recent-orders-section">` JSX below the recent-users section
- `src/App.css` — add `.recent-orders-*` CSS block (section, title, table-wrapper, table, th, td) following `.recent-users-*` patterns
- `src/Dashboard.test.js` — add tests for Recent Orders heading, 5 data rows, correct columns

## Open Questions

- None. Scope is fully defined.

## Assumptions

- Mock data shape: `{ id, customer, product, status, date }` with 5 varied records (matching `src/Orders.js` pattern)
- Data is a static array outside the component (not stateful — no interactivity needed)
- CSS classes follow BEM-ish naming: `.recent-orders-section`, `.recent-orders-title`, `.recent-orders-table-*`
- No new imports needed in `Dashboard.js` (no `useState`, no `toast`)
- Section placed after `</section>` closing the `.recent-users-section` block
- Dashboard already has all necessary imports for rendering basic JSX

## UI Notes

- Section below Recent Users section, inside `.dashboard-content`
- Title: white `28px` 700 weight (match `.recent-users-title` pattern)
- Table wrapper has `overflow-x: auto` for responsive scroll; table background `#112240`
- No action column, no buttons — just a read-only data table
- Reference `src/App.css` `.recent-users-*` classes for styling patterns

## Implementation Notes

- Edit `src/Dashboard.js`: add `recentOrdersData` array above the component; add `<section className="recent-orders-section">` after the closing `</section>` of recent-users inside the `.dashboard-content` div
- `src/Dashboard.js` needs no new imports — the component already has all required imports
- CSS in `src/App.css`: insert `.recent-orders-*` block right after the `recent-users-modal-close-action-btn:hover` rule (after line ~863), following the same properties as `.recent-users-*` with `recent-orders-` prefix
- No API calls, no localStorage, no new deps, no TypeScript — per governance rules
- No react-router or new page/route changes needed

## Test Notes

- `src/Dashboard.test.js` coverage:
  - Renders without crashing (already covered)
  - Shows "Recent Orders" heading
  - Renders 5 order data rows in addition to existing users rows — test total `<tr>` count matches (6 users rows + 6 orders rows = 12, including headers)
  - All 5 order columns visible (Order ID, Customer, Product, Status, Date)
- Run `npm test -- --watchAll=false` to validate

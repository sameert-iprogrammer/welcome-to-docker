## Source

- `docs/ai/stories/KAN-6/spec.md` — original story scope (read-only Recent Orders table)
- Two active change requests applied on top of spec:
  1. Plan-approval (2026-06-05T11:27:19Z): Add Action column + View CTA that opens modal with mock order details
  2. Final-review (2026-06-05T12:50:39Z): **Remove View button**, open modal on table row click instead. No backend.
- `src/Dashboard.js` — already has `recentOrdersData`, orders table with View button + modal, and `selectedOrder` state
- `src/App.css` — already has `.recent-orders-*` styles including modal + `.recent-orders-view-btn`
- `src/Dashboard.test.js` — already has tests for orders View button → modal flow

## Target Files

| File | Action |
|------|--------|
| `src/Dashboard.js` | Modify — remove Action column + View button, add row-click handler |
| `src/App.css` | Modify — remove `.recent-orders-view-btn` rules, add cursor-pointer on tbody tr |
| `src/Dashboard.test.js` | Modify — update View-button tests to row-click tests, adjust button count expectations |

## Steps

1. **`src/Dashboard.js` — Remove Action column header from orders table**
   - Delete `<th className="recent-orders-table-th">Action</th>` from the orders `<thead>` row.
   - Columns become: Order ID, Customer, Product, Status, Date (5 cols).

2. **`src/Dashboard.js` — Remove View button from each order `<tr>`, make row clickable**
   - Delete the `<td>` with the `.recent-orders-view-btn` button from each mapped `<tr>`.
   - Add `onClick={() => setSelectedOrder(o)}` and `style={{cursor: 'pointer'}}` to `<tr key={o.id}>`.
   - Do **not** remove `selectedOrder` state or the modal block — those stay.

3. **`src/App.css` — Remove unused View button styles**
   - Delete the entire `.recent-orders-view-btn` and `.recent-orders-view-btn:hover` rule blocks (~8 lines total).

4. **`src/App.css` — Add row cursor**
   - Insert `.recent-orders-table tbody tr { cursor: pointer; }` before or near the existing `.recent-orders-table tbody tr:hover` rule.

5. **`src/Dashboard.test.js` — Update View-button-dependent tests**
   - **"renders 5 View buttons"** — change expected count from `10` to `5` (only user View buttons remain).
   - **"shows modal with Order Details when View is clicked"** — replace `fireEvent.click(viewButtons[5])` with: find the 6th `<tr>` (first order data row) via `screen.getAllByRole("row")[6]` and `fireEvent.click(...)`. Keep assertion for "Order Details" + `role="dialog"`.
   - **"dismisses order modal when Close is clicked"** — same row-click trigger change. Keep the Close → dismiss assertions.
   - **No other test changes needed** — existing row count test (12 total rows) still passes, order data rendering tests unaffected.

6. **Run tests**
   - `npm test -- --watchAll=false` — confirm all tests pass. If any fail, adjust selectors (row indexes, button counts).

## Data/API Notes

- No backend, no API calls, no localStorage. Fully static frontend-only change.
- `recentOrdersData` shape: `{ id, customer, product, status, date }` — unchanged.
- `selectedOrder` state is kept and used for modal open/close via row click.

## UI Notes

- Orders table columns: **Order ID | Customer | Product | Status | Date** — Action column removed.
- Row click → opens `.recent-orders-modal-overlay` with the same order details modal (7 fields, Close button).
- Modal dismiss behavior unchanged: overlay click or Close button sets `selectedOrder` to `null`.
- `.recent-orders-view-btn` CSS removed; `.recent-orders-table tbody tr { cursor: pointer }` added.
- Visual effect: rows are clickable (pointer cursor + existing hover background).

## Tests

- **Modified tests in `src/Dashboard.test.js`**:
  - `"renders 5 View buttons"` — expect `5` (down from 10)
  - `"shows modal with Order Details when View is clicked"` → renamed to `"shows modal with Order Details when order row is clicked"` — uses `fireEvent.click(rows[6])`
  - `"dismisses order modal when Close is clicked"` — row click trigger
- **Unaffected tests**: renders heading, row count (12), user View/mark flows, confirmation dialog, toast.

## Risks

- Row index in test `screen.getAllByRole("row")[6]` must match the 1st order data row. If any structural JSX change shifts table order, the test breaks. Mark with a comment.
- The `selectedOrder` state variable is also used — ensure no naming collision or accidental removal since it's still needed for the modal.
- Keep the `cursor: pointer` style inline on `<tr>` to avoid complex CSS additions — but prefer a CSS class for consistency if `App.css` already follows that pattern. **Decision**: use inline `style={{cursor:'pointer'}}` for minimal diff; no new CSS class needed beyond the single `tbody tr` rule.

## Context Budget

- **Read only**: `src/Dashboard.js` (full), `src/App.css` (find/replace around `.recent-orders-view-btn` + `.recent-orders-table`), `src/Dashboard.test.js` (update 3 test blocks)
- **Do NOT read**: `src/Orders.js`, `src/Sidebar.js`, `src/Confetti.js`, `src/App.js`, `src/index.js`, any page components. The orders data shape is already known from `Dashboard.js`.
- **Do NOT create**: any new files. Only edit 3 existing files.

## Handoff

- The code-implementer agent should start with Step 1 (Dashboard.js Action column removal), then Step 2 (row click), then Steps 3-4 (CSS), then Step 5 (tests), then Step 6 (validate with `npm test`).
- All 3 files (`Dashboard.js`, `App.css`, `Dashboard.test.js`) are already up-to-date with the prior state (View button + modal is present). The agent only needs to apply the incremental removal of View button + addition of row-click behavior.
- If a file's current state differs from what's described (e.g., `Dashboard.js` doesn't have the View button), stop and re-read before editing.

## Source

- Story key: DS-23, Title: "Approvals Page"
- No spec.md or story-analyzer handoff exists; requirements sourced from task description.
- Context: `docs/ai/context-map.json`, `docs/ai/project-context.md` (React SPA, react-router v6, no TypeScript, no backend, localStorage auth, Font Awesome CDN, plain CSS, jest/RTL)
- Existing patterns: `src/Orders.js` (table+search), `src/Customers.js` (table+search+pagination+modal)

## Target Files

**Create:**
- `src/Approvals.js` — new page component
- `src/Approvals.test.js` — unit tests

**Modify:**
- `src/App.js` — add `/approvals` route + import
- `src/Sidebar.js` — add "Approvals" nav item
- `src/App.css` — add `.approvals-*` CSS classes

**No other files touched.**

## Steps

1. **Create `src/Approvals.js`**
   - Define `mockApprovals` array (8–12 entries) with fields: `id`, `requester`, `type`, `amount`, `date`, `status` (e.g. "Pending", "Approved", "Rejected").
   - Component state: `searchTerm`, `currentPage`, `approvals` (writable copy of mock data).
   - `filteredApprovals` via `useMemo`: filter by `searchTerm` across all string fields.
   - Reset `currentPage` to 1 via `useEffect` on `searchTerm` change.
   - Paginate: `PAGE_SIZE = 5`, compute `start`, `paginatedApprovals`.
   - Layout: `<div className="App App--sidebar">` → `<Sidebar />` → `<div className="approvals-container">`.
   - Header: `<h2 className="approvals-title">Approvals</h2>`.
   - Search input: reuse `.login-input` + custom `.approvals-search`.
   - Table: reuse `.orders-table`/`.orders-table-wrapper` pattern. Columns: ID, Requester, Type, Amount, Date, Status, Action.
   - Action column: `<button className="approvals-approve-btn" onClick={...}>Approve</button>`. Click handler updates the row's status to "Approved" in local state (shows toast via `react-toastify`).
   - Pagination controls: reuse `.customers-pagination`/`.customers-page-btn` pattern.
   - Empty state: "No approvals found matching ...".
   - Follow existing naming conventions exactly (no new CSS-in-JS, no libraries).

2. **Modify `src/App.js`**
   - Add import: `import Approvals from "./Approvals";`
   - Add route: `<Route path="/approvals" element={isAuthenticated ? <Approvals /> : <Navigate to="/login" />} />` (place after existing `/profile` route).

3. **Modify `src/Sidebar.js`**
   - Add nav item to `navItems` array: `{ label: "Approvals", path: "/approvals", icon: "fa-solid fa-check-circle" }` (insert after "Masters" entry to keep logical order).

4. **Add CSS to `src/App.css`**
   - `.approvals-container` — match `.orders-container` pattern (flex: 1, padding: 40px, max-width: 1100px).
   - `.approvals-title` — match `.orders-title`.
   - `.approvals-search` — match `.orders-search` (margin-bottom: 24px).
   - `.approvals-approve-btn` — green button style (`#27ae60` background, hover to `#219a52`, white text, 14px font, padding 8px 16px, border-radius 6px, cursor pointer, transition).
   - `.approvals-approve-btn:disabled` — muted style for already-approved rows (`opacity: 0.5, cursor: not-allowed`).

5. **Create `src/Approvals.test.js`**
   - Test: renders without crashing (wrap in `<MemoryRouter>`).
   - Test: renders title "Approvals".
   - Test: renders Approvals nav link in Sidebar (verify text "Approvals" appears).
   - Test: search filters the table rows.
   - Test: pagination shows/hides Previous/Next buttons based on page.
   - Test: clicking "Approve" button updates row status to "Approved".
   - Mock `react-router-dom`'s `useNavigate` for navigational safety per existing test pattern.

## Data/API Notes

- No backend integration. Mock data only (hardcoded in `src/Approvals.js`).
- Approval object shape:
  ```js
  { id: "APR-001", requester: "Alice Johnson", type: "Expense Report", amount: "$250.00", date: "2026-05-20", status: "Pending" }
  ```
- "Approve" action mutates local `approvals` state (finds by id, sets `status: "Approved"`).
- Toast notification: `toast.success("Approved APR-001")` on approve.

## UI Notes

- Route: `/approvals` (protected, redirects to `/login` if not authenticated).
- Sidebar icon: `fa-check-circle` (Font Awesome solid).
- Page uses same sidebar+content layout as Orders/Customers/Dashboard.
- Approve button per row: green, disables after approval, shows toast feedback.
- Search is client-side, triggers pagination reset.
- Pagination: 5 items per page, Previous/Next buttons with page counter.

## Tests

- `src/Approvals.test.js` (new) — see Step 5 details.
- Existing test: `src/Sidebar.test.js` — may need update if existing tests explicitly assert nav item count or specific items. Review after Step 3; add `expect(getByText("Approvals")).toBeInTheDocument()` if not already tested generically.

## Risks

- **Sidebar test hardcoding**: `Sidebar.test.js` has `expect(getByText("Masters")).toBeInTheDocument()` but does not assert a closed set — it should pass without changes. Verify after nav item addition.
- **CSS collision**: All page styles use shared classes (`.orders-table`, `.customers-pagination`). The new `.approvals-*` classes must not conflict. Safe as long as prefixes are unique.
- **Ordering**: Approvals nav item position in `navItems` array affects sidebar order only; no functional impact.

## Context Budget

- **Read only**: `src/Approvals.js` (new), `src/App.js` (add route + import), `src/Sidebar.js` (add nav item), `src/App.css` (append CSS), `src/Approvals.test.js` (new).
- **Do NOT read**: other page components (Dashboard, Orders, etc.) beyond what is provided here, mock files, or unrelated tests.
- **Do NOT modify**: `src/index.js`, `src/Dashboard.js`, `src/Navbar.js`, or any file not in the target list.
- **Pattern reference**: Use `src/Customers.js` as template for search+pagination approach. Use `src/Orders.js` as template for table layout. Use existing `Sidebar.test.js` pattern for testing.

## Handoff

State for the coding agent: All source material has been reviewed. The implementation plan covers 5 artifact steps. Begin with Step 1 (`src/Approvals.js`), then proceed to routing (`App.js`), sidebar (`Sidebar.js`), CSS (`App.css`), and tests (`Approvals.test.js`). Verify each step with `npm test` after all changes. No backend, no new dependencies, no external APIs.

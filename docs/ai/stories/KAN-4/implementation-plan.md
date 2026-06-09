## Source

- `docs/ai/stories/KAN-4/spec.md` (primary source of truth)
- Existing patterns: `src/Customers.js`, `src/Customers.test.js`, `src/Sidebar.js`, `src/App.js`, `src/App.css`
- `docs/ai/context-map.json` — React 18 SPA, CRA, plain CSS, localStorage auth, react-router-dom v6

## Target Files

**Create:**
- `src/Bookings.js` — new component with mock data, search, pagination
- `src/Bookings.test.js` — smoke test + optional search/pagination assertions

**Modify:**
- `src/Sidebar.js` — add `{ label: "Bookings", path: "/bookings", icon: "fa-solid fa-calendar-check" }` to `navItems`
- `src/App.js` — import `Bookings`, add `<Route path="/bookings">` with auth guard

**No changes expected:**
- `src/App.css` — reuse existing classes (`.orders-container`, `.orders-title`, `.orders-search`, `.login-input`, `.orders-table-wrapper`, `.orders-table`, `.orders-table-th`, `.orders-table-td`, `.orders-no-results`, `.customers-pagination`, `.customers-page-btn`, `.customers-page-btn--disabled`, `.customers-page-info`)

## Steps

1. **Create `src/Bookings.js`** — functional component following `Customers.js` pattern:
   - Hardcoded mock data: array of 10-12 booking objects `{ id, customer, service, date, status, amount }`
   - `useState` for `searchTerm` (default `""`) and `currentPage` (default `1`)
   - `useMemo` for filtered bookings: string-concatenate all fields, `.toLowerCase().includes(term)`
   - `useMemo` for paginated slice: `PAGE_SIZE = 5`, `(currentPage - 1) * PAGE_SIZE` offset
   - `useEffect` resetting `currentPage` to 1 on `searchTerm` change
   - Render: `App--sidebar` wrapper, `<Sidebar />`, container div (class `orders-container`), title "Bookings", search input (class `orders-search login-input`, placeholder "Search bookings..."), table with 6 columns (ID, Customer, Service, Date, Status, Amount), no-results message, pagination controls (Previous/Next + Page X of Y)
   - Import `Sidebar` from `"./Sidebar"`, import `React` + `{ useState, useEffect, useMemo }`
   - Default export

2. **Modify `src/Sidebar.js`** — add `{ label: "Bookings", path: "/bookings", icon: "fa-solid fa-calendar-check" }` into `navItems` array after `Approvals` entry (line 15, before the FAQ entry).

3. **Modify `src/App.js`** — add `import Bookings from "./Bookings";` after line 18 (`import Approvals`); add `<Route path="/bookings" element={isAuthenticated ? <Bookings /> : <Navigate to="/login" />} />` after the Approvals route (after line 98).

4. **Create `src/Bookings.test.js`** — smoke test: renders without crashing (wrap in `<MemoryRouter>`). Optionally add: search filters rows, no-results message appears, pagination controls work (following `Customers.test.js` patterns). No toast mock needed (Bookings has no toast usage).

5. **Run `npm test -- --watchAll=false`** — verify new test passes and no regressions.

## Data/API Notes

- No API calls, no localStorage, no backend. Mock data is hardcoded in `src/Bookings.js`.
- Mock data shape: `{ id: number, customer: string, service: string, date: string, status: string, amount: string }`
- Example statuses: "Confirmed", "Pending", "Cancelled", "Completed"
- Amount as string (e.g., `"$150.00"`) for display, consistent with no numeric formatting logic

## UI Notes

- Route: `/bookings` (auth-guarded)
- Sidebar icon: `fa-solid fa-calendar-check`
- Reuse CSS classes from `src/App.css`:
  - Container: `.orders-container` (same flex layout)
  - Title: `.orders-title` (h2)
  - Search: `.orders-search.login-input`
  - Table: `.orders-table-wrapper > table.orders-table > thead > tr > th.orders-table-th` / `td.orders-table-td`
  - No-results: `.orders-no-results` with text like `No bookings found for "{searchTerm}"`
  - Pagination: `.customers-pagination`, `.customers-page-btn`, `.customers-page-btn--disabled`, `.customers-page-info`
- No new CSS classes needed — existing set covers all requirements.

## Tests

- **New file: `src/Bookings.test.js`**
  - Smoke test: `render(<MemoryRouter><Bookings /></MemoryRouter>)` — no crash
  - Table data renders (assert first page mock row content)
  - Search filters across columns (case-insensitive)
  - No-results message on non-matching search
  - Pagination Previous/Next buttons work (disabled states, page indicator)
  - Search resets pagination to page 1
  - Follow exact patterns from `src/Customers.test.js` (MemoryRouter wrapper, fireEvent, getByLabelText, queryByText, getByText)
- **Run**: `npm test -- --watchAll=false` — confirm pass and no regressions

## Risks

- **navItems insertion order**: Must place `Bookings` after `Approvals` and before `FAQ` (or as spec suggests after "Approvals") to match expected sidebar layout. Inserting at wrong index breaks visual ordering.
- **Search input `aria-label`**: Must be unique (`"Search bookings"`) to avoid clashes with other page search labels in tests.
- **No-op change to App.css**: Verify no new CSS classes are introduced — reuse only.
- **Pagination edge case**: When filtered results ≤ 5, totalPages = 1, both buttons disabled. `displayTotal = totalPages || 1` guard needed (matches Customers.js pattern).
- **Bookings does NOT use toast** — test file must NOT mock react-toastify (unlike Customers.test.js).

## Context Budget

- Read patterns from `Customers.js`, `Customers.test.js` for the component and test shape.
- Reference `Sidebar.js` navItems array for insertion position.
- Reference `App.js` route block structure for the new route.
- Do NOT read other page components (Orders, Masters, etc.) — their patterns are already captured.
- Do NOT read `src/App.css` fully — it is 1299 lines and only class reuse is needed (listed above).
- All implementation is confined to the 4 target files.

## Handoff

State for the code-implementer agent:
1. Create `src/Bookings.js` following `Customers.js` component structure (useState + useMemo + useEffect pattern, PAGE_SIZE=5, string-concatenation search, paginated slice, no modal/add functionality)
2. Add nav item to `src/Sidebar.js` after the Approvals entry
3. Add import + route to `src/App.js` after the Approvals route block
4. Create `src/Bookings.test.js` with smoke test and search/pagination assertions
5. Run `npm test -- --watchAll=false` to validate

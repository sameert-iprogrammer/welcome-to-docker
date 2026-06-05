## Story Summary
Add a "Bookings" sidebar navigation item and a new Bookings page with a data table featuring client-side search and pagination using mock data. No backend integration.

## Requirements
- Add "Bookings" nav item in `src/Sidebar.js` linking to `/bookings`
- Add `/bookings` route in `src/App.js` (auth-guarded, same pattern as existing protected routes)
- Create new `src/Bookings.js` component with a table of mock booking data
- Implement client-side search filtering across all table columns
- Implement pagination (5 items per page, matching `Customers.js` / `Masters.js`)
- Mock data must be hardcoded in the component (no external files, no API calls)
- UI changes only — no backend, no localStorage, no data mutation

## Acceptance Criteria
- "Bookings" appears in the sidebar and navigates to `/bookings` on click
- Bookings page renders a table with mock booking data (columns: ID, Customer, Service, Date, Status, Amount)
- Search input filters the table across all columns in real-time
- Pagination controls (Previous/Next + page indicator) work correctly
- Search resets pagination to page 1
- No-results message shown when search matches zero rows
- Component renders without crashing (`npm test`)
- All existing tests pass

## Impacted Areas
- `src/Sidebar.js` — add `{ label: "Bookings", path: "/bookings", icon: "fa-solid fa-calendar-check" }` to `navItems`
- `src/App.js` — import `Bookings` + add `<Route path="/bookings">` with auth guard
- `src/Bookings.js` — new file: component + mock data + search + pagination
- `src/App.css` — new CSS classes for bookings page (optional; existing table/search/pagination CSS from Orders/Customers can be reused)

## Open Questions
- None identified. Requirements are clear and patterns exist in the codebase.

## Assumptions
- Icon for Bookings should be `fa-calendar-check` (consistent with Font Awesome solid icons used elsewhere)
- Mock data columns: ID, Customer, Service, Date, Status, Amount (typical booking fields)
- Pagination page size of 5, matching `Customers.js` and `Masters.js`
- Component follows the `Customers.js` / `Masters.js` pattern: `useState` + `useMemo` + `useEffect` (reset page on search)

## UI Notes
- Reuse existing CSS classes from `src/App.css`: `.orders-container`, `.orders-title`, `.orders-search` (`.login-input`), `.orders-table-wrapper`, `.orders-table`, `.orders-table-th`, `.orders-table-td`, `.orders-no-results`, `.customers-pagination`, `.customers-page-btn`, `.customers-page-btn--disabled`, `.customers-page-info`
- No new CSS classes required unless the booking table has unique column styling needs
- Follow BEM-ish naming if new styles are needed (e.g., `.bookings-container`)

## Implementation Notes
- Create `src/Bookings.js` as a new functional component with default export
- Mock data: array of ~10-12 booking objects with fields `id`, `customer`, `service`, `date`, `status`, `amount`
- Use `useState` for `searchTerm` and `currentPage`; `useMemo` for filtered/paginated data; `useEffect` to reset `currentPage` on `searchTerm` change
- Auth guard in `src/App.js` follows existing pattern (see lines 57-68 of `src/App.js`: `<Route path="/path" element={isAuthenticated ? <Component /> : <Navigate to="/login" />} />`)
- Sidebar item placement: consistent alphabetical or after a logical group (suggest adding after "Approvals" or before "Customers")
- **No conflict with governance-agent.md** — uses localStorage auth, plain CSS, react-router-dom (already established), no backend, no TypeScript

## Test Notes
- Add `src/Bookings.test.js` — smoke test: renders without crashing
- Run `npm test -- --watchAll=false` to verify no regressions
- Search input can be tested by asserting filtered rows; optional but recommended

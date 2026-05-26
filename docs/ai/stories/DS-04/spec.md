## Story Summary
Add a "Customers" navigation link to the existing sidebar, create a Customers page with a mock customer table supporting client-side search and pagination. No backend integration.

## Requirements
- Sidebar gains a "Customers" nav item with an appropriate icon (e.g. `fa-users`)
- Clicking "Customers" navigates to `/customers` route
- Customers page displays a table of mock customer data (no API calls)
- Customers table supports client-side text search (filter by any field)
- Customers table supports client-side pagination (configurable page size, e.g. 5 per page)
- No backend integration — all customer data is a static inline array
- `/customers` route is guarded by the existing auth check in `src/App.js`

## Acceptance Criteria
- Sidebar renders a "Customers" link alongside existing "Dashboard" and "Orders"
- `/customers` route renders a table with at least 10 mock customer rows (columns: ID, Name, Email, Company, Phone, Status)
- Search input above the table filters rows in real time as the user types (matches `Orders.js` search pattern)
- Pagination controls (Previous/Next buttons, page indicator) appear below the table
- Search resets pagination to page 1 when it changes the filtered result set
- Sidebar and customers page are accessible only when authenticated
- `npm run build` succeeds with all changes integrated

## Impacted Areas
- `src/App.js` — add `/customers` Route (same pattern as existing `/orders` route)
- `src/Customers.js` — new component: mock customer table with search and pagination
- `src/Sidebar.js` — add "Customers" entry to `navItems` array (icon: `fa-solid fa-users`)
- `src/App.css` — new styles for pagination controls (`.customers-pagination`, `.customers-page-btn`, `.customers-page-info`)

## Open Questions
- [CLARIFICATION NEEDED] Should the customers page use the sidebar layout (`App--sidebar` wrapper) like Orders, or a standalone layout like Settings/Profile? The story says "in Sidebar, show Customers link" — assume sidebar layout.
- Should pagination page size be configurable via a dropdown (5/10/20) or fixed at 5?
- Should the `fa-users` icon be used for Customers, or is a different Font Awesome icon preferred?

## Assumptions
- Customers page uses the same `App--sidebar` layout as Orders and Dashboard (sidebar on left, content on right)
- Pagination defaults to 5 items per page (fixed, no page size selector — can be enhanced later)
- Mock customer data is an inline array in `Customers.js` (same pattern as `Orders.js`)
- Customer mock data includes fields: id, name, email, company, phone, status
- Pagination controls show "Previous" / "Next" buttons with a "Page X of Y" indicator
- Search filters across all visible columns (id, name, email, company, phone, status)
- The sidebar already uses `useNavigate`/`useLocation` from react-router-dom — no change needed to routing infrastructure
- Sidebar collapse state is unaffected by adding a new nav item

## UI Notes
- Follow `Orders.js` layout pattern: `<div className="App App--sidebar"><Sidebar /><div className="customers-container">...</div></div>`
- Reuse existing CSS classes: `.orders-title` → reuse as `.customers-title`, `.orders-search` → reuse as `.customers-search` (or share `.orders-search` class), `login-input` for search input, `.orders-table`, `.orders-table-th`, `.orders-table-td`, `.orders-no-results`, `.orders-table-wrapper`
- New CSS classes in `src/App.css` for pagination controls:
  - `.customers-pagination` — flex container for pagination bar
  - `.customers-page-btn` — styled pagination buttons (match `.logout-btn` style)
  - `.customers-page-btn--disabled` — dimmed/disabled state
  - `.customers-page-info` — "Page X of Y" text style
- Dark theme colors: follow existing palette (background `#003f8c`, card `#112240`, text `#e6f1ff`, muted `#8892b0`)
- Table should be scrollable horizontally on small screens (same as Orders)

## Implementation Notes
- Create `src/Customers.js` — new functional component with:
  - `useState` for `searchTerm` and `currentPage`
  - `mockCustomers` inline array (10+ entries with id, name, email, company, phone, status fields)
  - `useEffect` to reset `currentPage` to 1 when `searchTerm` changes (so search doesn't land on empty page)
  - Filtered list: `useMemo` or inline filter similar to `Orders.js`
  - Pagination logic: slice filtered array by `(currentPage - 1) * pageSize` to `currentPage * pageSize`
  - Previous button disabled on page 1, Next button disabled on last page
- Update `src/Sidebar.js` — add `{ label: "Customers", path: "/customers", icon: "fa-solid fa-users" }` to `navItems` array
- Update `src/App.js` — add `<Route path="/customers" element={isAuthenticated ? <Customers /> : <Navigate to="/login" />} />` and import `Customers`
- All styles in `src/App.css` — no new CSS files per governance-agent.md
- No new npm dependencies; no TypeScript; no backend
- Update `docs/ai/context-map.json` `knownPaths` to include `"/customers"`

## Test Notes
- New test file: `src/Customers.test.js` — at minimum smoke test (render without crashing)
- Verify table renders mock customer rows
- Verify search input filters rows correctly
- Verify pagination: Previous/Next buttons, page indicator, search resets to page 1
- Run `npm test -- --watchAll=false` before completing

## References
- `src/Orders.js` — search + table pattern to follow
- `src/Sidebar.js` — nav items array to extend
- `src/App.js` — route registration pattern
- `src/App.css` — existing table and input styles to reuse
- `docs/ai/context-map.json` — update `knownPaths`

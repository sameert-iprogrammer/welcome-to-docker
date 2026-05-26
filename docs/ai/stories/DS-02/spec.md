## Story Summary
Add a collapsible sidebar to the dashboard with navigation between Dashboard and Orders views, and implement an Orders page with a searchable mock orders table.

## Requirements
- Dashboard must include a collapsible sidebar (expand/collapse toggle)
- Sidebar contains two navigation items: "Dashboard" and "Orders"
- Clicking "Dashboard" shows the existing dashboard view (congratulations + social sharing)
- Clicking "Orders" navigates to a new /orders route
- Orders page displays a mock list of orders in a table format
- Orders table supports client-side text search (filter rows by any field)
- No backend integration — all order data is static/mock (inline array)
- All authenticated routes remain guarded by the existing auth check in App.js

## Acceptance Criteria
- Sidebar renders on /dashboard and collapses/expands via a toggle button
- Sidebar "Dashboard" link navigates to /dashboard; "Orders" link navigates to /orders
- /orders route renders a table with at least 5 mock order rows (columns: ID, Customer, Product, Status, Date)
- Search input above the table filters rows in real time as the user types
- Sidebar and orders page are accessible only when authenticated (auth guard in App.js)

## Impacted Areas
- src/App.js — register /orders route in `renderView`, add "/orders" to known routes
- src/Dashboard.js — integrate sidebar alongside existing content
- src/Orders.js — new component: mock orders table with search
- src/Sidebar.js — new component: collapsible sidebar with nav links
- src/App.css — new styles for sidebar, orders table, search input

## Open Questions
- [CLARIFICATION NEEDED] Should the sidebar also appear on /settings and /profile, or only on /dashboard and /orders?
- Should the sidebar default to expanded or collapsed on first visit?
- Is the sidebar collapse state persisted across navigation (useState reset) or persisted in localStorage?

## Assumptions
- Sidebar is rendered inside both Dashboard and Orders components (not as a global layout wrapper)
- Sidebar default state is expanded
- Sidebar collapse state is local (resets on component unmount) — no localStorage persistence
- The existing top-right dashboard-nav bar (profile, settings, logout buttons) remains unchanged
- Orders page follows the same visual theme (dark blue gradient background, white text)

## UI Notes
- Follow existing BEM-ish naming: `.sidebar`, `.sidebar--collapsed`, `.sidebar-toggle`, `.sidebar-nav-item`, `.sidebar-nav-item--active`
- Orders table: `.orders-container`, `.orders-search`, `.orders-table`, `.orders-table-th`, `.orders-table-td`
- Use the existing dark theme colors: background `#003f8c`, card background `#112240`, input background `#0a192f`, accent `#1d63b8`
- Sidebar should be positioned on the left side with a toggle button (hamburger-style icon, use Font Awesome `fa-bars`)
- Orders search input should match `.login-input` styling pattern
- Orders table should be scrollable horizontally on small screens

## Implementation Notes
- Add `/orders` to `src/App.js` route handling: auth guard already covers it (default branch returns Dashboard for unknown authenticated paths; add an explicit `/orders` case in `renderView`)
- Create `src/Sidebar.js` — receives `navigateTo` and `currentPath` props, manages local `collapsed` state via `useState`
- Create `src/Orders.js` — receives `navigateTo` prop, manages local `searchTerm` state via `useState`, renders `Sidebar` + search input + table with mock data
- Mock orders data: inline array of objects with id, customer, product, status, date fields — no external file
- All styles go in `src/App.css` — no new CSS files (per governance-agent.md)
- No new npm dependencies; no react-router; no TypeScript
- Update `docs/ai/context-map.json` `knownPaths` array to include `"/orders"`

## Test Notes
- New test files: `src/Orders.test.js`, `src/Sidebar.test.js` — at minimum smoke tests (render without crashing)
- Orders.test.js: verify table renders, search input filters rows
- Sidebar.test.js: verify nav links render, collapse toggle works
- Run `npm test -- --watchAll=false` before completing

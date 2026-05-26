## Source

- `docs/ai/stories/DS-02/spec.md` (primary source of truth)
- `docs/ai/context-map.json` (knownPaths update)
- Governance: `.opencode/agents/governance-agent.md` — no react-router, plain CSS in App.css only, no new CSS files, test alongside source

## Target Files

**Create:**
- `src/Sidebar.js` — collapsible sidebar component
- `src/Orders.js` — orders page with mock table + search
- `src/Sidebar.test.js` — smoke test + nav/collapse
- `src/Orders.test.js` — smoke test + table render + search filter

**Modify:**
- `src/App.js` — register `/orders` route in `renderView`
- `src/Dashboard.js` — integrate Sidebar alongside existing content
- `src/App.css` — sidebar, orders table, search input styles
- `docs/ai/context-map.json` — add `"/orders"` to `knownPaths`

## Steps

1. **Create `src/Sidebar.js`**
   - Functional component receiving `{ navigateTo, currentPath }` props
   - Local `collapsed` state via `useState(false)` — default expanded (`false`)
   - Render: toggle button (`<i className="fa-solid fa-bars">`) + nav items ("Dashboard" → `/dashboard`, "Orders" → `/orders`)
   - Nav items call `navigateTo(path)` on click; apply `.sidebar-nav-item--active` class when `currentPath` matches
   - CSS classes: `sidebar`, `sidebar--collapsed`, `sidebar-toggle`, `sidebar-nav-item`, `sidebar-nav-item--active`

2. **Create `src/Orders.js`**
   - Functional component receiving `{ navigateTo }` prop
   - Inline mock array of ≥5 orders: `{ id, customer, product, status, date }`
   - Local `searchTerm` state via `useState("")` — filters rows client-side (case-insensitive, matches any field)
   - Render: `<Sidebar navigateTo={navigateTo} currentPath="/orders" />` + `.orders-container` with search input + table
   - Search input: `.orders-search` with class `.login-input` for consistent styling
   - Table: `.orders-table` with columns ID, Customer, Product, Status, Date; horizontally scrollable on small screens
   - Follow dark theme: background `#003f8c`, card bg `#112240`, accent `#1d63b8`

3. **Update `src/App.js`**
   - Import `Orders` from `"./Orders"`
   - In `renderView()`, add before the catch-all Dashboard return:
     ```js
     if (pathname === "/orders") {
       return <Orders navigateTo={navigateTo} />;
     }
     ```
   - No other route changes needed; auth guard already covers all authenticated paths

4. **Update `src/Dashboard.js`**
   - Import `Sidebar` from `"./Sidebar"`
   - Add `<Sidebar navigateTo={navigateTo} currentPath="/dashboard" />` inside the returned JSX
   - Wrap existing content (Confetti, dashboard-nav, App-header) in a `<div className="dashboard-content">` for layout alongside sidebar
   - Keep top-right dashboard-nav bar, Confetti, and all social links unchanged

5. **Add styles to `src/App.css`**
   - `.sidebar`: fixed left column, dark bg (`#112240`), flex column, transition width
   - `.sidebar--collapsed`: narrow width (e.g. `60px`), only icons visible
   - `.sidebar-toggle`: button to toggle collapse, Font Awesome `fa-bars`
   - `.sidebar-nav-item`: styled links/buttons, hover state, active state with accent color
   - `.orders-container`: card-style wrapper (`#112240` bg, padding, border-radius)
   - `.orders-search`: reuse `.login-input` block (or extend with same style)
   - `.orders-table`, `.orders-table-th`, `.orders-table-td`: table styles matching dark theme
   - Horizontal scroll on small screens: `overflow-x: auto` on table wrapper
   - `.dashboard-content`: flex-grow area next to sidebar
   - Layout: App or a wrapper div gets `display: flex` when sidebar present

6. **Update `docs/ai/context-map.json`**
   - Add `"/orders"` to the `knownPaths` array under `"routing"`

7. **Create `src/Sidebar.test.js`**
   - Smoke test: renders without crashing
   - Nav links render: check for "Dashboard" and "Orders" text
   - Collapse toggle: click toggle button, verify sidebar collapses
   - Use `render` from `@testing-library/react`; import `Sidebar`

8. **Create `src/Orders.test.js`**
   - Smoke test: renders without crashing
   - Table renders: verify all 5+ mock rows appear in the DOM
   - Search filters rows: type in search input, verify only matching rows visible
   - Use `render`, `fireEvent` from `@testing-library/react`; import `Orders`

9. **Verify**
   - Run `npm test -- --watchAll=false` — all tests pass
   - Run `npm run build` (or `npx react-scripts build`) — no ESLint errors
   - Confirm no new dependencies, no new CSS files, no react-router, no TypeScript

## Data/API Notes

- Mock orders data (inline in `Orders.js`):
  ```js
  const mockOrders = [
    { id: "ORD-001", customer: "Alice Johnson", product: "Docker Desktop", status: "Shipped", date: "2026-05-01" },
    { id: "ORD-002", customer: "Bob Smith", product: "Docker Compose", status: "Processing", date: "2026-05-10" },
    { id: "ORD-003", customer: "Carol White", product: "Docker Hub", status: "Delivered", date: "2026-04-28" },
    { id: "ORD-004", customer: "Dave Brown", product: "Docker Engine", status: "Pending", date: "2026-05-15" },
    { id: "ORD-005", customer: "Eve Davis", product: "Docker Swarm", status: "Shipped", date: "2026-05-12" },
  ];
  ```
- No API calls, no backend, no external data files

## UI Notes

- Sidebar: left-aligned, `width: ~220px` expanded, `width: 60px` collapsed, dark bg `#112240`
- Toggle button: `fa-solid fa-bars` (Font Awesome), top-right of sidebar
- Active nav item: accent color `#1d63b8` background or left border
- Orders search: full-width input above table, styled like `.login-input`
- Orders table: full-width inside card, `#0a192f` row stripes, white text, scrollable on mobile
- Layout: Dashboard and Orders use a flex container (sidebar + content area)
- Dashboard nav (profile/settings/logout buttons) stays top-right, unchanged

## Tests

- **`src/Sidebar.test.js`** — smoke, nav link rendering, collapse toggle
- **`src/Orders.test.js`** — smoke, table row count ≥5, search input filtering
- Run: `npm test -- --watchAll=false`

## Risks

- Dashboard.js currently wraps everything in `<div className="App">` — need to adjust layout to accommodate sidebar (flex container) while preserving `.App` background and centering for the content
- Sidebar collapse toggles `collapsed` state locally — unmounting Dashboard/Orders resets it (per spec)
- No global layout wrapper means sidebar + content layout must be replicated in both Dashboard and Orders; verify consistency
- `.App-header` uses `min-height: 100vh` and flex centering — sidebar might affect this; `.dashboard-content` may need `min-height: 100vh` instead

## Context Budget

- **Read fully**: `src/App.js`, `src/Dashboard.js`, `src/App.css` (already done above)
- **Read if needed** (for reference only): `src/Login.js` (`.login-input` pattern), `src/Settings.js` (layout pattern)
- **Do NOT read**: `src/Register.js`, `src/Profile.js`, `node_modules/`, `public/`, non-JS files
- **Target for writes**: only the 8 files listed in Target Files above

## Handoff

All relevant source files have been read and analyzed. The plan maps exactly to spec.md requirements. Key decisions: sidebar uses local state (no localStorage), default expanded, sidebar rendered inside Dashboard and Orders individually (no global wrapper). Proceed with implementing steps 1-9 in order. Validate with `npm test -- --watchAll=false` and `npx react-scripts build` at the end.

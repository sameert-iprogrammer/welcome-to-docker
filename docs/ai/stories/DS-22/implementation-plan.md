# Implementation Plan: DS-22 Add Masters Page

## Overview
Add a new "Masters" page to the React SPA accessible via a new sidebar link (post-login). The page renders a table of mock data with client-side search and pagination. Frontend only — no backend integration. Follow existing patterns established by `Customers.js` / `Products.js` (table + search + pagination + Sidebar layout).

## Assumptions
- "Masters" is a generic master-data page. We'll use a domain-neutral set of mock records (e.g., Branches/Departments/Categories). Final choice: **Categories** (id, code, name, description, type, status) — keeps the data tabular and easy to demo. Confirm during code review if a different domain is required.
- Reuses existing CSS classes from `App.css` (`orders-table`, `orders-search`, `customers-pagination`, `App App--sidebar`, etc.) — no new styling required.
- Route path: `/masters`. Protected by the same `isAuthenticated` localStorage check pattern in `App.js`.
- Page size: 5 rows (matches `Customers.js` pattern). Total mock rows: ≥ 15 to exercise pagination.
- Testing framework: Jest + React Testing Library + `MemoryRouter` (matches `Products.test.js` pattern).

## Target Files

### Create
- `src/Masters.js` — main Masters page component (table, search, pagination, Sidebar).
- `src/mastersMock.js` — exported `mockMasters` array (~15–20 rows).
- `src/Masters.test.js` — tests for rendering, search filter, pagination.

### Modify
- `src/App.js` — import `Masters`; add protected `<Route path="/masters" element={isAuthenticated ? <Masters /> : <Navigate to="/login" />} />`.
- `src/Sidebar.js` — add `{ label: "Masters", path: "/masters", icon: "fa-solid fa-database" }` entry to `navItems`.
- `src/Sidebar.test.js` — add assertion that "Masters" nav item is rendered and navigates to `/masters`.
- `docs/ai/context-map.json` — append `/masters` to `routing.knownPaths`.

## Context Budget
- Inspect target files first. Do not perform broad repo scans.
- Open non-target files only for direct imports, callers, tests, or required config (e.g., `Customers.js` as a pattern reference if needed, but do not re-open files already summarized in this plan).
- Use provider-native edit tools (`StrReplace`, `Write`) directly. Do not print full file contents, full diffs, or large code blocks in chat.
- Run only validation commands scoped to the changed surface (single-file Jest run for `Masters` and `Sidebar`, plus a build).

## Implementation Steps

### 1. Create mock data — `src/mastersMock.js`
- Export `mockMasters` array of ~18 objects with fields: `id`, `code`, `name`, `description`, `type`, `status`.
- Include a variety of `type` (e.g., `Category`, `SubCategory`) and `status` (`Active`, `Inactive`) values so search/filter is meaningful.

### 2. Create `src/Masters.js`
- Pattern: model on `Customers.js` minus the Add modal (read-only table).
- Imports: `React`, `useState`, `useMemo`, `useEffect`; `Sidebar` from `./Sidebar`; `mockMasters` from `./mastersMock`.
- State: `searchTerm` (string), `currentPage` (number, default 1). `PAGE_SIZE = 5`.
- `useMemo` to compute `filteredMasters`: case-insensitive substring match across all fields concatenated to a string (mirror Customers' filter approach).
- `useEffect` to reset `currentPage` to 1 when `searchTerm` changes.
- Compute `totalPages`, `start`, `paginatedMasters`, `displayTotal` (same shape as Customers).
- Render structure:
  - Outer wrapper: `<div className="App App--sidebar">` with `<Sidebar />`.
  - Inner container `<div className="customers-container">` (reuses existing layout class).
  - Header: `<h2 className="customers-title">Masters</h2>` (no Add button).
  - Search input: `className="orders-search login-input"`, `placeholder="Search masters..."`, `aria-label="Search masters"`.
  - Table: `className="orders-table"` with thead columns (ID, Code, Name, Description, Type, Status) and tbody mapping `paginatedMasters`.
  - Empty state: `<p className="orders-no-results">No masters found matching "{searchTerm}"</p>` when filtered length is 0.
  - Pagination block identical to Customers' (`Previous` / `Page X of Y` / `Next`), reusing `customers-pagination`, `customers-page-btn`, `customers-page-btn--disabled`, `customers-page-info` classes.
- `export default Masters;`

### 3. Wire route in `src/App.js`
- Add `import Masters from "./Masters";` next to other page imports.
- Add a new `<Route>` for `/masters` mirroring `/customers`:
  ```
  <Route path="/masters" element={isAuthenticated ? <Masters /> : <Navigate to="/login" />} />
  ```
- Place it adjacent to `/customers` route for readability.

### 4. Add sidebar entry in `src/Sidebar.js`
- Extend `navItems` array with a Masters entry. Suggested icon: `fa-solid fa-database` (already loaded via Font Awesome CDN per project context).
- Recommended placement: after `Products` and before `FAQ`, or at the end — match `App.css` visual order if relevant. Default: after `Products`.

### 5. Update context map — `docs/ai/context-map.json`
- Append `"/masters"` to `routing.knownPaths` array.

### 6. Tests — `src/Masters.test.js`
Model directly on `Products.test.js`:
- Setup: render with `<MemoryRouter><Masters /></MemoryRouter>`.
- Test cases:
  1. Renders without crashing.
  2. Renders first page rows (assert presence of first 5 mock names).
  3. Search filters case-insensitively by name, code, type, and status; rows not matching are not in the document.
  4. Empty search result shows `No masters found matching "..."`.
  5. Pagination: "Next" advances page and shows next batch; "Previous" returns; Previous is disabled on page 1; Next is disabled on last page; `Page X of Y` text reflects state.
  6. Search resets to page 1 after navigating to page 2.

### 7. Update `src/Sidebar.test.js`
- Add a test asserting a button with `aria-label="Masters"` is rendered and clicking it calls `navigate("/masters")` (mirror the existing nav-item tests in this file).

## Validation Commands
Run only the commands needed for the changed surface:

```
npm test -- --watchAll=false src/Masters.test.js
npm test -- --watchAll=false src/Sidebar.test.js
npm run build
```

Optional smoke check (manual): `npm start`, log in, click the new "Masters" sidebar item, exercise search + pagination.

## Risks & Edge Cases
- **Search across pages**: must filter the full data set, then paginate the filtered list (already covered by `useMemo` + reset-page effect).
- **Pagination disabled-button styling**: reuse `customers-page-btn--disabled` class — do not introduce a new disabled style.
- **Empty data set**: when filter produces zero rows, hide the pagination block (mirror `filteredCustomers.length > 0` guard in `Customers.js`).
- **Auth guard**: ensure the route is wrapped in the same `isAuthenticated ? <Masters /> : <Navigate to="/login" />` pattern; otherwise the page leaks to unauthenticated users.
- **Sidebar collapse state**: nav label hidden when collapsed — Masters entry automatically inherits this behavior via the existing `navItems` rendering loop.
- **CSS reuse**: new page intentionally uses existing classes; if a designer later wants a distinct look, add a `masters-*` namespace then.
- **Test mock for `react-toastify`**: only needed if Masters imports `toast` (it should not, since the page is read-only). Omit the mock to keep tests minimal.

## Out of Scope
- Backend integration / API calls.
- Add/Edit/Delete CRUD on master records.
- Column sorting, multi-select filters, or export.
- New CSS files or theme changes.
- Storybook or visual regression tests.

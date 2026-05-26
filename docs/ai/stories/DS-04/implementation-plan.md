## Source

- `docs/ai/stories/DS-04/spec.md` (primary source of truth)
- `.opencode/executions/exec-c5baa9f4-dd10-4643-9908-381f4c869c50/handoffs/story_analyzer.json` (handoff)
- Reference patterns: `src/Orders.js`, `src/Orders.test.js`, `src/Sidebar.js`, `src/App.js`, `src/App.css`

## Target Files

**Create:**
- `src/Customers.js` — new Customers page component (sidebar layout, mock table, search, pagination)
- `src/Customers.test.js` — smoke + search + pagination tests (follow `Orders.test.js` pattern)

**Modify:**
- `src/Sidebar.js` — add `{ label: "Customers", path: "/customers", icon: "fa-solid fa-users" }` to `navItems` array
- `src/App.js` — import `Customers`, add `<Route path="/customers">` behind auth guard
- `src/App.css` — add `.customers-container`/`.customers-title`/pagination classes
- `docs/ai/context-map.json` — append `"/customers"` to `knownPaths`

## Steps

1. **Create `src/Customers.js`** — functional component following `Orders.js` pattern:
   - Import `React`, `useState`, `useEffect`; import `Sidebar`
   - Inline `mockCustomers` array (12 entries, fields: id, name, email, company, phone, status)
   - `useState` for `searchTerm` (default `""`) and `currentPage` (default `1`)
   - `useEffect` — reset `currentPage` to 1 when `searchTerm` changes
   - Compute filtered list via `useMemo` (filter across all 6 fields, case-insensitive)
   - Compute paginated slice: `pageSize = 5`, `start = (currentPage - 1) * pageSize`, `end = start + pageSize`
   - Compute `totalPages = Math.ceil(filtered.length / pageSize)`
   - Render: `<div className="App App--sidebar"><Sidebar /><div className="customers-container">` ... `</div></div>`
   - Table: reuse `orders-table`, `orders-table-th`, `orders-table-td`, `orders-table-wrapper`, `orders-no-results` classes
   - Search input: `className="orders-search login-input"` with `aria-label="Search customers"`
   - Pagination bar: `<div className="customers-pagination">` with Previous button (disabled on page 1), `<span className="customers-page-info">Page X of Y</span>`, Next button (disabled on last page)
   - Pagination buttons: `className="customers-page-btn"` + `customers-page-btn--disabled` when disabled

2. **Modify `src/Sidebar.js`** — insert Customers nav item after Orders in the `navItems` array

3. **Modify `src/App.js`** — add `import Customers from "./Customers";` at top; add `<Route path="/customers" element={isAuthenticated ? <Customers /> : <Navigate to="/login" />} />` alongside the `/orders` route

4. **Modify `src/App.css`** — add new CSS:
   - `.customers-container` — copy `.orders-container` rules (flex:1, padding:40px, max-width:1100px, etc.)
   - `.customers-title` — copy `.orders-title` rules (color, font-size, margin, etc.)
   - `.customers-pagination` — `display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 24px;`
   - `.customers-page-btn` — `padding: 10px 20px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s ease;`
   - `.customers-page-btn:hover` — same as `.logout-btn:hover`
   - `.customers-page-btn--disabled` — `opacity: 0.4; cursor: not-allowed;` (no hover effect)
   - `.customers-page-info` — `color: #8892b0; font-size: 14px;`

5. **Create `src/Customers.test.js`** — follow `Orders.test.js` pattern:
   - Wrap in `<MemoryRouter>` for all tests
   - Test "renders without crashing"
   - Test "renders mock customer rows in the table" (spot-check 3-4 entries)
   - Test "filters rows by search term (case-insensitive)"
   - Test "shows no results message when search matches nothing"
   - Test "pagination controls render and work" (Previous disabled on page 1, Next advances page)
   - Test "search resets pagination to page 1"

6. **Modify `docs/ai/context-map.json`** — add `"/customers"` to `knownPaths` array

7. **Validate** — run `npm test -- --watchAll=false` and `npm run build`

## Data/API Notes

- No backend. All data is a static inline array in `Customers.js`.
- Mock customer shape: `{ id: number, name: string, email: string, company: string, phone: string, status: string }`
- Page size: fixed at 5 items per page.

## UI Notes

- Component uses sidebar layout: `<div className="App App--sidebar"><Sidebar />...content...</div>`
- Reuses existing table CSS: `orders-table`, `orders-table-wrapper`, `orders-table-th`, `orders-table-td`, `orders-no-results`
- Reuses existing `orders-search login-input` for the search field
- New CSS aliases: `customers-container`, `customers-title` (styled identically to `orders-container`/`orders-title`)
- New pagination CSS: `customers-pagination`, `customers-page-btn`, `customers-page-btn--disabled`, `customers-page-info`
- Font Awesome icon for sidebar: `fa-solid fa-users`
- Dark theme colors follow existing palette

## Tests

- **`src/Customers.test.js`** (new) — render with `<MemoryRouter>`, test table rows, search filtering, pagination, search-resets-page
- Run `npm test -- --watchAll=false` — all existing + new tests must pass
- Run `npm run build` — must succeed without errors

## Risks

- No react-router dependency issue (already installed, used by Sidebar)
- Search reset via `useEffect` could cause extra render; acceptable per spec
- Pagination edge case: search filtering to 0 results → `totalPages = 0` → "Page 1 of 0" — guard with `totalPages || 1` in display
- Sidebar collapse state must remain unaffected

## Context Budget

- **Read only**: `src/Customers.js` (after creation), `src/Sidebar.js` (after edit), `src/App.js` (after edit), `src/App.css` (after edit), `src/Customers.test.js` (after creation)
- **Do NOT read**: Login.js, Register.js, Settings.js, Profile.js, Confetti.js, Dockerfile, package.json (unless build fails)
- All implementation patterns are established in Orders.js, Orders.test.js, Sidebar.js

## Handoff

The coding agent should start with step 1 (create `src/Customers.js`), then proceed sequentially. After all file changes, run `npm test -- --watchAll=false` and `npm run build` to validate. Reference `src/Orders.js` as the canonical pattern for table structure, search, and layout. Reference `src/Orders.test.js` for test patterns. The plan is self-contained — no additional context reads should be needed beyond the target files.

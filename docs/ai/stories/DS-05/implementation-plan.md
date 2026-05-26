# DS-05: Products Page — Implementation Plan

## Summary

Add a **Products** route (`/products`) to the React SPA with sidebar navigation, a page component that lists **≥18 mock products** (name, SKU/id, price; optional category), **client-side search**, and **client-side pagination** on the filtered set. Mirror the **Customers** page pattern (`useMemo` filter, `useEffect` page reset, prev/next controls); reuse existing table and pagination CSS. No backend calls.

**Routing note:** `docs/ai/context-map.json` agent notes mention pushState without react-router, but the repo uses **`react-router-dom`** in `App.js` and `Sidebar.js`. Follow **react-router** like Orders/Customers.

---

## Assumptions

| Item | Decision |
|------|----------|
| Route path | `/products` |
| Auth gate | Same as `/orders` and `/customers`: render page if `localStorage.isAuthenticated === "true"`, else `<Navigate to="/login" />` |
| Page size | **10** items (document in `Products.js` constant; Customers uses 5) |
| Mock data location | `src/productsMock.js` exported array (keeps `Products.js` lean; Customers inlines mock data—either is fine; prefer separate file for 18+ rows) |
| UI pattern | Table + search above + pagination below (Customers layout) |
| Search fields | Name, SKU/id, category (if present on mock rows) |
| CSS | Reuse `orders-search`, `orders-table*`, `customers-pagination`, `customers-page-btn*`, `orders-no-results`; add `products-container` / `products-title` only if no suitable alias exists |

---

## Target Files

| File | Action |
|------|--------|
| `src/productsMock.js` | **Create** — static mock product array (≥18 items) |
| `src/Products.js` | **Create** — page: Sidebar shell, search, table, pagination, empty state |
| `src/App.js` | **Edit** — import `Products`, add `/products` route with auth guard |
| `src/Sidebar.js` | **Edit** — add Products nav item (`/products`, icon e.g. `fa-solid fa-box`) |
| `src/App.css` | **Edit only if needed** — minimal layout classes if `customers-container` naming is reused as-is, skip |

**Do not edit:** `docs/ai/stories/DS-05/spec.md`, execution folders, or unrelated pages.

---

## Context Budget

- Open **target files first** (`Products.js`, `productsMock.js`, `App.js`, `Sidebar.js`); skim **`Customers.js`** once for the canonical search/pagination pattern.
- Do **not** broad-scan the repo; avoid `node_modules`, `build`, `.opencode/executions`.
- Open **non-target** files only for: direct imports (`Sidebar`), route wiring (`App.js`), and **CSS class names** in `App.css` if reuse is unclear.
- Use native edit tools; **do not** paste full files or large diffs in chat.
- Validation: **`npm run build`** only (no new test files required unless you extend existing tests voluntarily).

---

## Implementation Steps

### 1. Mock data (`src/productsMock.js`)

- Export `mockProducts` array with **at least 18** entries.
- Each object: `id` (number or string), `sku` (string, e.g. `SKU-101`), `name` (string), `price` (number or formatted string—stay consistent in display), optional `category` (string) for search demos.
- Vary names/categories so search and pagination are visibly testable.

### 2. Products page (`src/Products.js`)

Structure parallel to `Customers.js`:

1. **Imports:** `React`, `useState`, `useEffect`, `useMemo`, `Sidebar`, `mockProducts` from `./productsMock`.
2. **Constants:** `PAGE_SIZE = 10`.
3. **State:** `searchTerm`, `currentPage`.
4. **Filter (`useMemo`):** Lowercase term; if empty, return full `mockProducts`. Else filter where concatenation of `id`, `sku`, `name`, and `category` (if defined) includes the term.
5. **Reset page:** `useEffect(() => setCurrentPage(1), [searchTerm])`.
6. **Pagination:** `totalPages = Math.ceil(filtered.length / PAGE_SIZE)`; slice `filtered` for current page; `displayTotal = totalPages || 1`.
7. **Layout:**
   - Outer: `className="App App--sidebar"` + `<Sidebar />`.
   - Main: container with title **Products**.
   - Search input: `className="orders-search login-input"`, placeholder `Search products...`, controlled `searchTerm`, `aria-label="Search products"`.
   - Table: `orders-table-wrapper` / `orders-table` with columns **SKU/ID**, **Name**, **Price** (add **Category** column if mock includes it).
   - Map `paginatedProducts` in `<tbody>`; `key` from stable id/sku.
8. **Empty state:** If `filteredProducts.length === 0`, show `orders-no-results` message (include search term when non-empty).
9. **Pagination controls:** Only when `filteredProducts.length > 0`; reuse `customers-pagination`, `customers-page-btn`, `customers-page-info`, disabled classes from Customers; Previous / Next with `Math.max` / `Math.min` bounds.
10. **No `fetch`/XHR** for products.

### 3. Sidebar (`src/Sidebar.js`)

- Add to `navItems` after Customers (or in logical order):

  ```js
  { label: "Products", path: "/products", icon: "fa-solid fa-box" }
  ```

- Active state already uses `location.pathname === item.path`.

### 4. Routing (`src/App.js`)

- `import Products from "./Products";`
- Add route (same pattern as `/customers`):

  ```jsx
  <Route
    path="/products"
    element={
      isAuthenticated ? <Products /> : <Navigate to="/login" />
    }
  />
  ```

- Place before catch-all `path="*"`.

### 5. Styles (`src/App.css`) — optional

- Prefer reusing `customers-container` / `customers-title` class names on Products markup **or** duplicate with `products-container` / `products-title` if semantic clarity matters—copy minimal rules from Customers block (~lines 540+) only if classes are missing.
- Do not introduce new CSS frameworks.

### 6. Manual smoke check (implementer)

1. Log in → sidebar shows **Products**.
2. Click **Products** → URL `/products`, no full reload.
3. Table shows mock rows with name, SKU/id, price.
4. Search narrows rows; clearing restores list.
5. With >10 filtered rows, pagination works; changing search resets to page 1.
6. Nonsense search → empty message, no broken table.
7. Logged out `/products` → redirect to login.

---

## Validation Commands

```bash
npm run build
```

Optional local UI: `npm start` and walk through AC-1–AC-8 manually.

---

## Acceptance Criteria Mapping

| AC | How verified |
|----|----------------|
| AC-1 | Products in `Sidebar` `navItems` |
| AC-2 | `navigate("/products")` + `Route` in `App.js` |
| AC-3 | Table columns for name, SKU/id, price |
| AC-4 | Data from `productsMock.js` only |
| AC-5 | Controlled search filters client-side |
| AC-6 | Prev/Next pagination when results > `PAGE_SIZE` |
| AC-7 | Filter then paginate; page resets on search change |
| AC-8 | `orders-no-results` when filter empty |
| AC-9 | `npm run build` succeeds |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Context map says “no react-router” | **Use existing `react-router-dom`** in `App.js` / `Sidebar.js`; do not add pushState routing |
| Pagination off-by-one on last page | Match Customers: `disabled={currentPage === totalPages}` when `totalPages >= 1` |
| Empty search vs empty dataset | Distinguish “no mock data” (should not happen) vs “no matches” (show empty message) |
| Price display inconsistency | Format once in render (e.g. `$${price.toFixed(2)}`) if numeric |
| Reusing Customers `PAGE_SIZE` confusion | Products uses **10**; document constant at top of `Products.js` |

---

## Out of Scope (confirm no scope creep)

- Backend/API, admin CRUD, persisting catalog, new dependencies, TypeScript migration, unit tests unless explicitly requested later.

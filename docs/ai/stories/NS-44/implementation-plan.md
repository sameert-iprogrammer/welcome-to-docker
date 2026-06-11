# NS-44 Implementation Plan — welcome-to-docker

**Story:** Product List  
**Repository:** `welcome-to-docker` (`project-1de5e191-54a3-4ffc-80f4-db0f75ac22dd`)  
**Branch:** `feature/KAN-5-recent-users-on-dashboard` (verified)  
**Predecessor:** slash-admin NS-44 complete — mirror DummyJSON contract only; no code import.

---

## Executive Summary

The branch already has a `/products` route (`src/App.js`), sidebar nav entry (`src/Sidebar.js`), and a `src/Products.js` page — but it uses **local mock data** (`productsMock.js`) with **client-side** search and pagination, plus an "Add Product" CRUD modal. NS-44 requires **replacing** that implementation with **live DummyJSON `fetch`**, **server-side** search/pagination against API `total`, thumbnail display, and loading/error/empty states. Routing and nav are done; primary work is refactoring `Products.js`, adding BEM styles, and updating tests.

**Governance override:** Compact context discourages API calls and new pages. NS-44 workspace mandate requires this feature; document override in implementation handoff.

---

## Pre-Execution Verification (completed)

| Check | Result |
|-------|--------|
| Branch | `feature/KAN-5-recent-users-on-dashboard` |
| Auth guard | `localStorage.getItem("isAuthenticated") === "true"` in `App.js`; unauthenticated → `<Navigate to="/login" />` |
| `/products` route | Registered in `App.js` (lines 75–80) |
| Nav link | `Sidebar.js` includes `{ label: "Products", path: "/products" }` |
| Existing `Products.js` | Mock-based; no `fetch`; reuses `customers-*` / `orders-*` CSS classes |
| Fetch elsewhere in `src/` | None — first live API integration in this repo |
| Context-map staleness | Map says "no react-router"; live app uses `react-router-dom` — follow `App.js` |

**No changes expected** to `src/App.js` or `src/Sidebar.js` unless verification fails at implementer runtime.

---

## Target Files

| Action | Path | Notes |
|--------|------|-------|
| **Modify** | `src/Products.js` | Replace mock/CRUD with DummyJSON fetch, server pagination, debounced search |
| **Modify** | `src/App.css` | Add BEM `.products-*` classes (search, table, thumbnail, pagination, states) |
| **Modify** | `src/Products.test.js` | Mock `global.fetch`; update assertions for API-driven behavior |
| **Verify only** | `src/App.js` | Route + auth guard already present |
| **Verify only** | `src/Sidebar.js` | Nav link already present |
| **Stop using** | `src/productsMock.js` | Remove import from `Products.js`; do not delete file unless unused elsewhere |

---

## Context Budget

- **Inspect target files first** (`Products.js`, `Products.test.js`, `App.css`); do not broad-scan `src/`.
- **Open non-target files only** for direct imports/layout: `Sidebar.js` (layout pattern), `App.js` (auth/route confirm).
- **Do not read** `docs/ai/`, `.opencode/`, `node_modules/`, or build artifacts unless a specific blocker requires it.
- **Use native edit tools**; do not paste full file contents or large diffs in chat.
- **Run only** `npm run build` and `npm test -- --watchAll=false src/Products.test.js` (or full test suite if Products tests fail in isolation).

---

## Shared API Contract (from slash-admin predecessor)

| Operation | URL | Params |
|-----------|-----|--------|
| List | `GET https://dummyjson.com/products` | `limit`, `skip` |
| Search | `GET https://dummyjson.com/products/search` | `q`, `limit`, `skip` |

**Response:** `{ products, total, skip, limit }`  
**Pagination:** `skip = (currentPage - 1) * pageSize`  
**Total UI:** Use API `total`, not `products.length`  
**Search:** Empty `q` → list endpoint; non-empty → search endpoint; reset `skip` to 0 on search change  
**Defaults:** `pageSize = 10` (matches current `PAGE_SIZE`); debounce `400ms` (align with slash-admin)

**Product fields to render:** `id`, `title`, `category`, `price`, `thumbnail`

---

## Implementation Steps

### 1. Refactor `src/Products.js`

**Remove:**
- Import of `mockProducts` from `productsMock.js`
- `useMemo` client-side filter
- Local `products` state for CRUD
- "Add Product" button, modal, form handlers, and `toast` usage for saves
- Client-side `slice()` pagination and `filteredProducts.length`-based totals

**Add state:**
```text
products, total, skip, pageSize (10), searchQuery, debouncedSearch, loading, error
```

**Debounce search (400ms):**
- `useEffect` on `searchQuery` → set `debouncedSearch` after timeout; cleanup on unmount/change
- When `debouncedSearch` changes, reset `currentPage` to 1 (equivalently `skip = 0`)

**Fetch effect** — depend on `[debouncedSearch, skip, pageSize]`:
- Build URL:
  - Empty search: `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`
  - Non-empty: `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedSearch)}&limit=${pageSize}&skip=${skip}`
- Set `loading = true`, clear `error` before fetch
- On success: `setProducts(data.products)`, `setTotal(data.total)`
- On failure: `setError(message)`, `setProducts([])`, `setTotal(0)`
- On finally: `setLoading(false)`
- Use `AbortController` cleanup on dependency change (optional but recommended)

**Pagination controls:**
- `currentPage = Math.floor(skip / pageSize) + 1`
- `totalPages = Math.ceil(total / pageSize)` (guard `total === 0`)
- Previous/Next buttons update `skip`; disable at boundaries
- Display: `Page {currentPage} of {totalPages}` and/or `Showing X–Y of {total}`

**Table columns (minimum):**
| Thumbnail | Title | Category | Price |
- Thumbnail: `<img src={thumbnail} alt="" onError={...} />` with fallback (placeholder div/text or broken-image hide)
- Price: `$${Number(price).toFixed(2)}`
- Row key: `product.id`

**UI states:**
- **Loading:** message or spinner above table (plain text acceptable)
- **Error:** user-visible error with retry option (button that re-triggers fetch)
- **Empty:** "No products found" when `!loading && !error && products.length === 0`

**Layout:** Preserve existing shell:
```jsx
<div className="App App--sidebar">
  <Sidebar />
  <div className="products-container">...</div>
</div>
```

Replace reused `customers-*` / `orders-*` class names with new `products-*` BEM classes (step 2).

### 2. Add BEM styles to `src/App.css`

Add a dedicated block (do not create new CSS files). Mirror spacing/typography from existing table pages (`orders-table`, `customers-pagination`) but use products-specific names:

| Class | Purpose |
|-------|---------|
| `.products-container` | Page wrapper (replaces `.customers-container`) |
| `.products-header` / `.products-title` | Page heading |
| `.products-search` | Search input |
| `.products-table-wrapper` / `.products-table` | Table layout |
| `.products-table-th` / `.products-table-td` | Cell styles |
| `.products-thumbnail` / `.products-thumbnail--fallback` | Image + fallback |
| `.products-pagination` / `.products-page-btn` / `.products-page-info` | Pagination |
| `.products-loading` / `.products-error` / `.products-empty` | State messages |

Use existing design tokens where possible (colors, borders from `.orders-table` / `.customers-pagination`). No CSS framework.

### 3. Update `src/Products.test.js`

**Mock `global.fetch`** in `beforeEach` with controllable responses matching DummyJSON envelope.

**Replace/remove tests** that assert:
- Mock product names ("Wireless Mouse", etc.)
- Client-side SKU/category filtering
- Add Product modal CRUD flows

**Add/update tests:**
1. Renders without crashing (keep)
2. Shows loading state while fetch pending
3. Renders API products after successful fetch (use fixture with `title`, `category`, `price`, `thumbnail`)
4. Search input triggers debounced fetch to `/products/search?q=...` (use `jest.useFakeTimers()` + `advanceTimersByTime(400)`)
5. Pagination Next/Previous sends fetch with updated `skip`
6. Displays error state on fetch rejection
7. Shows empty message when API returns `{ products: [], total: 0 }`
8. Thumbnail `onError` shows fallback (optional smoke)

Wrap renders in `<MemoryRouter>` (existing pattern). Mock `Sidebar` if it complicates tests: `jest.mock("./Sidebar", () => () => <div data-testid="sidebar" />)`.

### 4. Verify routing and nav (no-op expected)

Confirm `App.js` line 75–80 and `Sidebar.js` Products entry remain intact. No edits unless missing.

### 5. Handoff notes

Document in implementation handoff:
- Governance override applied (NS-44 mandate)
- Chosen `pageSize = 10`, debounce `400ms`
- Removed local CRUD modal (out of NS-44 scope; read-only API list)
- `productsMock.js` no longer imported by `Products.js`

---

## Validation Commands

```bash
# Required
npm run build

# Required if Products.test.js is updated (recommended)
npm test -- --watchAll=false src/Products.test.js

# Manual smoke (authenticated)
# 1. npm start
# 2. Login → Sidebar → Products
# 3. List loads from DummyJSON
# 4. Search "phone" → filtered results, page resets to 1
# 5. Next page → new fetch with skip=10
# 6. Pagination total reflects API total (~194), not page row count
# 7. Logout → /products redirects to /login
```

---

## Risks

| Risk | Mitigation |
|------|------------|
| **Existing tests break** | Mock `global.fetch`; remove CRUD assertions |
| **Debounce + test flakiness** | Use fake timers; `waitFor` after advancing 400ms |
| **CORS / network** | DummyJSON supports CORS; show error UI on failure |
| **Thumbnail 404s** | `onError` handler + CSS fallback |
| **Race conditions** | `AbortController` on effect cleanup |
| **Governance pushback** | Document NS-44 override in handoff |
| **Scope creep (CRUD modal)** | Remove add-product UI; spec is read-only list |
| **Reused CSS classes** | Migrate to `.products-*` per spec; avoids coupling to customers/orders |

---

## Assumptions

1. `/products` route path and sidebar label "Products" remain as implemented.
2. `pageSize = 10` and debounce `400ms` match slash-admin contract semantics.
3. `productsMock.js` may remain in repo but is unused by `Products.js` after refactor.
4. `App.js` and `Sidebar.js` require no edits on current branch.
5. No TypeScript, no new dependencies, no MSW mocks.
6. Add-product CRUD is removed as incompatible with external read-only API (not in NS-44 acceptance criteria).
7. Direct `https://dummyjson.com` calls from browser work in dev and production builds.

---

## Acceptance Criteria Mapping

| Criterion | Implementation |
|-----------|----------------|
| Authenticated `/products` | Already in `App.js`; verify only |
| List load with `limit`/`skip` | Fetch effect on mount |
| Thumbnail, title, category, price | Table columns + thumbnail fallback |
| Server pagination vs `total` | `skip`/`limit` in URL; UI from `data.total` |
| Search via `/products/search` | Conditional URL when `debouncedSearch` non-empty |
| Search resets page | Reset `skip`/`currentPage` on debounced search change |
| Empty search → list endpoint | URL branch on empty `q` |
| Loading/error/empty states | Conditional render blocks |
| Nav link | Already in `Sidebar.js`; verify only |
| `npm run build` | Validation gate |
| Independence from slash-admin | External API only |

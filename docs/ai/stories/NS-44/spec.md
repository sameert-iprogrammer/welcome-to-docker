# NS-44: Product List

**Story key:** NS-44  
**Title:** Product List  
**Repository:** welcome-to-docker (`project-1de5e191-54a3-4ffc-80f4-db0f75ac22dd`)  
**Branch:** `feature/KAN-5-recent-users-on-dashboard` (verify at implementation time)  
**Workspace execution:** `workspace-exec-0df951e1-8b54-4b96-995d-ae6fd7364f64`  
**Predecessor:** `project-fb115f76-fa37-4dcc-858d-6dd475b585c0` (slash-admin-main — contract reference only; no code import)

---

## Summary

Add an authenticated product listing screen to the CRA/plain-JS SPA. Integrate the public [DummyJSON Products API](https://dummyjson.com/products) with **text search** and **server-side pagination** using `limit` and `skip` against the API `total` field. This repository ships independently; alignment with slash-admin is via the external API contract only.

---

## Background

The story requires a product listing page that:

- Fetches products from `https://dummyjson.com/products`
- Supports pagination via `limit` and `skip` (default API page size is 30)
- Supports search against DummyJSON’s search endpoint
- Displays paginated results where the pagination UI reflects API `total`, not the current page’s `products.length`

Example API usage from the story:

```javascript
fetch('https://dummyjson.com/products')
  .then(res => res.json())
  .then(console.log);

fetch('https://dummyjson.com/products?limit=10&skip=10&select=title,price')
  .then(res => res.json())
  .then(console.log);
```

Response envelope:

```json
{
  "products": [ /* Product[] */ ],
  "total": 194,
  "skip": 0,
  "limit": 30
}
```

---

## Requirements

### Functional

1. **Product list component** — Create `src/Products.js` as a functional component using `useState` and `useEffect`.
2. **API integration** — Use browser `fetch` directly to `https://dummyjson.com` (no backend proxy required; DummyJSON supports CORS).
3. **List endpoint** — When search query is empty, call `GET https://dummyjson.com/products` with `limit` and `skip`.
4. **Search endpoint** — When search query is non-empty, call `GET https://dummyjson.com/products/search` with `q`, `limit`, and `skip`.
5. **Server-side pagination** — Compute `skip = (currentPage - 1) * pageSize`; pass `limit` and `skip` on every request; drive pagination UI from API `total`.
6. **Search behavior** — Text search input; reset `skip` to `0` when the search term changes; empty search falls back to the list endpoint. Debounce is recommended but timing is at implementer discretion.
7. **Display columns** — Show at minimum: thumbnail, title, category, and price for each product row.
8. **Thumbnail fallback** — Handle missing thumbnail URLs and image load errors with a sensible fallback (placeholder or text).
9. **Loading, error, and empty states** — Show appropriate UI while fetching, on network/API failure, and when no products match.
10. **Authenticated route** — Register `/products` in `src/App.js` behind the existing localStorage auth guard (`isAuthenticated === "true"`), mirroring patterns used for `/dashboard` and `/settings`.
11. **Navigation** — Add a link to `/products` from the dashboard navigation (e.g. `src/Dashboard.js` or the verified nav host in live `App.js`), following existing nav patterns.
12. **Styles** — Add BEM-style classes to `src/App.css` only (no new CSS files). Examples: `.products-container`, `.products-search`, `.products-table`, `.products-pagination`.

### Non-functional

1. **Build health** — `npm run build` must pass after changes.
2. **Optional smoke test** — `npm test -- --watchAll=false` may add a render-without-crash test for `Products.js`.
3. **Pattern preservation** — Match existing SPA conventions for routing, auth, and styling; do not introduce TypeScript, new state-management libraries, or CSS frameworks.

---

## API Contract

| Operation | Endpoint | Query parameters |
|-----------|----------|------------------|
| List products | `GET https://dummyjson.com/products` | `limit`, `skip`, optional `select` |
| Search products | `GET https://dummyjson.com/products/search` | `q` (required for search), `limit`, `skip` |

### Product (minimum fields for list display)

| Field | Type | Usage |
|-------|------|-------|
| `id` | number | Row key |
| `title` | string | Primary label |
| `description` | string | Optional subtitle/tooltip |
| `category` | string | Column display |
| `price` | number | Column display |
| `thumbnail` | string (URL) | Image column |

Additional DummyJSON fields (`brand`, `rating`, `stock`, `tags`, `images`, etc.) may be ignored unless trivially useful.

### Pagination semantics

- `skip = (currentPage - 1) * pageSize`
- `limit = pageSize` (implementer may choose 10 or 30; must honor API contract)
- Pagination total = API response `total`, **not** `products.length`

---

## UI Notes

- Plain HTML table or div-based row layout is acceptable; no UI framework is in scope.
- Search input above the product list; pagination controls below (or consistent with existing app patterns).
- Price display may use simple formatting (e.g. `$9.99`); no i18n requirement.
- Follow BEM naming in `src/App.css` consistent with existing classes in the repo.

---

## Files in Scope

| Action | Path |
|--------|------|
| Create | `src/Products.js` |
| Modify | `src/App.js` |
| Modify | `src/App.css` |
| Modify | `src/Dashboard.js` (or verified nav component from live `App.js`) |
| Optional | `src/Products.test.js` |

**Story artifacts (pipeline; not implementation scope):**

- `docs/ai/stories/NS-44/spec.md`
- `docs/ai/stories/NS-44/implementation-plan.md`

---

## Out of Scope

- Changes to slash-admin-main or any other repository
- TypeScript migration
- New state-management libraries (Redux, TanStack Query, etc.)
- New CSS files or CSS frameworks
- Dockerfile or `.github/workflows/` changes
- Backend proxy or server-side API layer
- MSW or offline mocks (optional; not required)

---

## Acceptance Criteria

1. **Authenticated access** — `/products` is reachable only when the user is authenticated via the existing localStorage auth guard; unauthenticated users are redirected per existing app behavior.
2. **List load** — On first visit, the page fetches `GET /products` with `limit` and `skip` and renders a paginated list.
3. **Column display** — Each row shows thumbnail (with fallback), title, category, and price.
4. **Server pagination** — Changing pages sends a new request with updated `skip` and `limit`; pagination UI reflects API `total`.
5. **Search** — Non-empty search calls `GET /products/search?q={query}` with the same `limit`/`skip` pagination; results update accordingly.
6. **Search reset** — Changing the search term resets pagination to the first page (`skip = 0`).
7. **Empty search** — Clearing the search input returns to the list endpoint (`/products`).
8. **States** — Loading, error, and empty-result states are visible and usable.
9. **Navigation** — An authenticated nav link routes to `/products` from the dashboard (or equivalent).
10. **Build** — `npm run build` succeeds.
11. **Independence** — Feature works without slash-admin being deployed; no cross-repo code dependency.

---

## Implementation Notes

1. **Pre-execution verification** — Read live `src/App.js` before editing. Confirm current branch, auth guard pattern, route registration, and nav host. Reconcile context-map paths (`/orders`, `/customers`, `/masters`) against actual routes; do not invent missing components.
2. **Component state** — Suggested state: `products`, `total`, `skip`, `limit` (or `pageSize`), `searchQuery`, `loading`, `error`. Fetch in `useEffect` keyed on search, skip, and limit.
3. **Direct fetch** — Call `https://dummyjson.com` directly from the browser; no app-level API client exists and none should be added.
4. **Governance override** — Compact context notes discourage API calls and new pages. **NS-44 workspace mandate requires implementation in both repositories.** Proceed per this spec; document the override in implementation handoff notes.
5. **Reference contract** — slash-admin predecessor established: debounced search (~400ms), TanStack Query keys `["products", debouncedSearch, pageSize, skip]`, route path `products`, nav label `"Products"`. welcome-to-docker should mirror API semantics; stack-specific patterns (hooks-only fetch, BEM CSS) differ appropriately.
6. **Default page size** — 10 or 30 acceptable; document chosen value in implementation plan/handoff.

---

## Validation

| Check | Command / action |
|-------|------------------|
| Production build | `npm run build` |
| Optional smoke test | `npm test -- --watchAll=false` |
| Manual smoke | Login → navigate to `/products` → list loads → search filters → page change fetches new data → `total` drives pagination |

---

## Assumptions

1. **Search endpoint** — `/products/search` is used for text search per DummyJSON documentation (story examples show only `/products`).
2. **CORS** — Direct browser calls to `dummyjson.com` work in dev and production.
3. **Auth pattern** — Existing localStorage check (`isAuthenticated === "true"`) remains the access gate.
4. **Route path** — `/products` unless live `App.js` conventions strongly suggest otherwise.
5. **No shared types package** — Product shapes are inline or local to `Products.js`; align with DummyJSON response structure.
6. **Network failures** — Error UI is sufficient; no local fallback data required.
7. **Story overrides governance** — NS-44 supersedes compact-context “no API calls / no new pages” guidance for this repository.

---

## Open Questions

| Item | Notes |
|------|-------|
| **Governance formal approval** | Whether welcome-to-docker governance override is human-approved before merge (non-blocking for spec; escalate if blocked at implementation). |
| **Context-map routing conflict** | Context map lists `strategy: "react-router"` while agent notes say no react-router; implementer must follow **live `App.js`** routing, not the map entry alone. |
| **Stale route entries** | `/orders`, `/customers`, `/masters` appear in context map but may not exist on the current branch; verify before adding nav alongside products. |
| **Debounce timing** | Unspecified; slash-admin used 400ms — welcome-to-docker may match or choose a reasonable default. |
| **Nav host file** | Confirm whether `Dashboard.js` or another component owns nav links on the active branch. |

---

## References

- [DummyJSON Products API](https://dummyjson.com/products)
- Workspace specification: `workspace-exec-0df951e1-8b54-4b96-995d-ae6fd7364f64`
- Predecessor summary: slash-admin NS-44 final review (contract reference)
- Context pack: `story_analyzer.md` (execution `exec-14782c8a-980c-4472-ab3f-d73c99789ac2`)
- Fallback artifacts: `docs/ai/project-context.md`, `docs/ai/context-map.json` (open only if live verification requires them)

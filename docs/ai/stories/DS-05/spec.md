# DS-05: Products page

## Overview

Add a **Products** page to the educational React SPA. Users reach it from a new **Products** item in the sidebar. The page lists **mock product data** (no API or backend). **Search** and **pagination** run entirely on the client.

## Goals

- Expose Products in primary navigation (sidebar).
- Provide a dedicated Products view with realistic mock catalog data.
- Support finding products via client-side search and browsing via client-side pagination.
- Stay consistent with existing SPA patterns (routing, layout, styling).

## Out of Scope

- Backend, REST/GraphQL, or any server integration.
- Persisting product data beyond in-memory/mock sources.
- Admin CRUD, inventory sync, or real authentication for catalog access.

## Requirements

### Navigation and routing

1. **Sidebar link** — Add a **Products** entry to the sidebar, visually and behaviorally consistent with existing nav items (e.g. Dashboard, Orders, Customers).
2. **Navigation** — Selecting **Products** opens the Products page (new route/path for products).
3. **Routing** — Register a products route following the app’s established routing approach (see Assumptions / Open Questions).

### Products page content

4. **Mock data** — Render a list (or table/grid) of products from **static mock data** defined in the frontend (inline module, constant, or small local mock module—no network calls).
5. **Product fields** — Each item shows at minimum: **name**, **identifier or SKU**, and **price**; additional fields (e.g. category, status, description) are optional if they match patterns used on similar pages.
6. **Layout** — Reuse the app shell (sidebar + main content) used by other authenticated/main views.

### Client-side search

7. **Search control** — Provide a search input on the Products page.
8. **Filtering** — Typing filters the **currently loaded mock dataset** (no server round-trips).
9. **Match scope** — Search matches at least **product name**; matching **SKU/id** and **category** (if present) is recommended.
10. **Reset behavior** — Clearing search restores the full mock list (subject to current pagination page rules below).

### Client-side pagination

11. **Pagination UI** — Show page controls (e.g. prev/next and/or page numbers) when results exceed a fixed page size.
12. **Page size** — Use a consistent default page size (e.g. 10 items); document the chosen value in implementation.
13. **Interaction with search** — Pagination applies to the **filtered** result set after search, not the raw mock set only.
14. **Empty states** — If search yields no matches, show a clear empty state (not a broken table).

### Quality and constraints

15. **No backend** — No `fetch`/XHR to load products; mock data only.
16. **Patterns** — Match existing conventions: component structure, CSS approach, and navigation patterns used by Orders/Customers/Dashboard (no new frameworks unless already in use).
17. **Build** — `npm run build` succeeds with no new errors attributable to this story.

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-1 | Sidebar displays a **Products** link alongside existing navigation items. |
| AC-2 | Clicking **Products** navigates to the Products page without full page reload (SPA navigation). |
| AC-3 | Products page shows mock product records with **name**, **id/SKU**, and **price** visible per row/card. |
| AC-4 | Data is sourced from **frontend mock data only** (no backend calls for products). |
| AC-5 | A **search** field filters displayed products on the client as the user types. |
| AC-6 | **Pagination** splits the (possibly filtered) list into pages; user can move between pages. |
| AC-7 | Search + pagination work together: filtered results paginate correctly. |
| AC-8 | Empty search results show an appropriate empty state. |
| AC-9 | Application builds successfully (`npm run build`). |

## UI Notes

- Place search above the product list; pagination below the list (or consistent with Orders/Customers if those pages already define a pattern).
- Use the same sidebar active/highlight treatment as other routes when Products is selected.
- Mock data should be large enough to demonstrate pagination (e.g. **≥ 15–20** products) and search (varied names/categories).

## Implementation Notes

- **New route** — Add a products path (recommended: `/products`) to the app’s route table / path handling alongside `/dashboard`, `/orders`, `/customers`, etc.
- **New components** — Likely: `Products.js` (page), optional small presentational subcomponents; mock data in a dedicated constant or `productsMock.js`.
- **Sidebar** — Update `Sidebar.js` (or equivalent) with Products link wired to the new route.
- **App entry** — Wire route in `App.js` (or central router module) per existing pattern.
- **Search** — Implement with controlled input + `useMemo`/`filter` on mock array (or equivalent).
- **Pagination** — Slice filtered array by `(page - 1) * pageSize`; reset to page 1 when search query changes.
- **Reference pages** — Mirror list/search/pagination UX from **Orders** or **Customers** if those stories already implemented similar behavior.

## Assumptions

- User is already in the authenticated/main app shell when using Products (same as other sidebar destinations).
- Mock products are defined once at build time or module load; no environment-specific data files required.
- **Routing** follows **existing app patterns** described in project agent notes: **no react-router** if the codebase uses **history `pushState`** and path-based views; implement Products the same way as Dashboard/Orders/Customers.
- Styling uses existing global/component CSS (no new CSS framework).

## Open Questions

1. **Routing strategy conflict** — Selected context map lists `"strategy": "react-router"` but agent notes state **“No react-router”** and **pushState routing**. Implementers should **inspect current `App.js` / routing** and follow what is actually in the repo; spec assumes parity with existing pages, not introducing react-router if absent.
2. **Exact path** — Confirm whether the products route should be `/products` or another path; `/products` is recommended for consistency with `/orders` and `/customers`.
3. **Visual pattern** — Table vs card grid: default to the same list/table pattern as Orders/Customers unless design specifies otherwise.

## References

- Context pack: `.opencode/executions/exec-5bfd4c1a-4f7b-4771-9358-1da2c251a040/context-packs/story_analyzer.md`
- Output path: `docs/ai/stories/DS-05/spec.md`
- Context map (selected): `docs/ai/context-map.json` — agent notes, build command, routing hints
- Fallback (only if needed during implementation): `docs/ai/project-context.md`, `docs/ai/stories/DS-05/implementation-plan.md`

# Story Specification: MIS-27 — Add Sessions Page

## Story Metadata

| Field | Value |
|---|---|
| JIRA Key | MIS-27 |
| Title | Add Sessions Page |
| Type | Feature |
| Priority | TBD |

## Description

Add a Sessions page that is accessible after login. The page follows the existing admin-dashboard pattern used by other data-management pages in the application.

## Acceptance Criteria

1. **Routing**: A `/sessions` route exists and is accessible when the user is authenticated; unauthenticated users are redirected to `/login`.
2. **Navigation**: The Sessions page is reachable from the sidebar navigation.
3. **Layout**: The page uses the `App--sidebar` wrapper with a `<Sidebar />` component, consistent with other inner pages.
4. **Search**: A search input filters sessions by id, title, date, or status (client-side).
5. **Table Display**: Sessions are displayed in a table with columns: ID, Title, Date, Duration, Status, Attendees.
6. **Pagination**: Results are paginated at `PAGE_SIZE` (30, matching existing pages). Pagination controls (Previous / Next / Page info) are rendered.
7. **Mock Data**: A `sessionsMock.js` file exports an array of mock session objects.
8. **Smoke Test**: A `Sessions.test.js` file renders the component without crashing.
9. **Styling**: All styles live in `src/App.css` using BEM-ish naming (`sessions-container`, `sessions-title`, etc.). No new CSS files are created.

## Requirements

### Functional

- The Sessions page is a client-side CRUD-readiness skeleton (display-only by default, mirroring the `Masters` read-only pattern unless the acceptance criteria for create/edit/delete are added later).
- Search filters in real time.
- Pagination resets to page 1 on search change.
- Toast notification on add/edit/delete (if CRUD operations are implemented).

### Non-Functional

- No backend calls; all data is local.
- No TypeScript; plain JavaScript.
- No new libraries beyond `react-particles` (confetti), `react-router-dom`, `react-toastify`.
- Follow existing component patterns: functional component, default export, `useState`/`useEffect`/`useCallback`/`useMemo` hooks.

## UI / UX Notes

| Element | Detail |
|---|---|
| Page wrapper | `<div className="App App--sidebar">` with `<Sidebar />` |
| Container | `.sessions-container` |
| Title | `.sessions-title` with text "Sessions" |
| Search input | `.orders-search .login-input`, placeholder "Search sessions…" |
| Table | `.orders-table-wrapper` > `.orders-table` with `.orders-table-th` / `.orders-table-td` |
| Pagination | `.customers-pagination` with `.customers-page-btn`, `.customers-page-btn--disabled`, `.customers-page-info` |
| Button(s) | `.customers-add-btn` if CRUD is enabled (not required for initial read-only view) |
| Empty state | `.orders-no-results` paragraph when search returns zero matches |

Column mapping (read-only default):

| Column | Field in mock object | Notes |
|---|---|---|
| ID | `id` | Number |
| Title | `title` | String |
| Date | `date` | String (YYYY-MM-DD) |
| Duration | `duration` | String (e.g., "1h 30m") |
| Status | `status` | String (e.g., "Scheduled", "Completed", "Cancelled") |
| Attendees | `attendees` | Number |

## Implementation Notes

### Files to create

1. **`src/Sessions.js`** — component, pattern mirrors `src/Masters.js` (read-only) or `src/Customers.js` (CRUD). Default assumption: read-only like `Masters`.
2. **`src/sessionsMock.js`** — exports `mockSessions` (array of 6-10 objects, following the `mastersMock.js` / `productsMock.js` pattern).
3. **`src/Sessions.test.js`** — minimal smoke test: renders without crashing.

### Files to modify

1. **`src/App.js`** — add a route: `<Route path="/sessions" element={<Sessions />} />` (authenticated).
2. **`src/App.css`** — add styles for `.sessions-*` classes if not reusing existing `.customers-*` classes (default: reuse existing classes from `Customers`/`Masters` for table, search, pagination).
3. **`src/Sidebar.js`** (possibly) — add a link to `/sessions` in the navigation menu.

### Code patterns to follow

- Import `useState`, `useMemo`, `useEffect` from `react`.
- Import `useNavigate` from `react-router-dom`.
- Import mock data from `./sessionsMock`.
- Define `const PAGE_SIZE = 30;` as a module-level constant (matching existing pages).
- Use `useMemo` for filtered results.
- Use `useEffect` to reset `currentPage` to 1 when `searchTerm` changes.
- Render paginated slice: `filteredSessions.slice(start, start + PAGE_SIZE)`.
- Use `toast` from `react-toastify` for any user feedback.

## Open Questions

1. **CRUD vs Read-only**: Should the Sessions page support Create/Edit/Delete operations (like `Customers`/`Products`) or be read-only (like `Masters`/`Orders`)? This determines whether modals, forms, and toast notifications are required.
2. **Data fields**: Are the six columns listed above (ID, Title, Date, Duration, Status, Attendees) correct, or should different fields be used?
3. **Sidebar link**: Should the Sessions navigation item be added to `Sidebar.js`, and if so, in what order (e.g., after Orders, before Profiles)?

See the clarification JSON below for structured answers to these questions.

## Assumptions

1. The page is read-only by default (mirrors `Masters`), with CRUD operations added later if needed. Risk: low — CRUD can be added incrementally.
2. `PAGE_SIZE` is 30, consistent with existing pages. Risk: low — standard pagination.
3. Mock data will contain 6-10 session objects with realistic values. Risk: low — can be adjusted.
4. All styles will be added to `src/App.css` using BEM-ish naming that reuses existing table/search/pagination classes where possible. Risk: low — follows project convention.
5. The route is placed under the authenticated routes block in `App.js`, after `/orders` and before `/profile` (alphabetical order among data pages). Risk: low — arbitrary placement within authenticated routes.

## References

- Project brief: `IFLOW.md`
- Repository context map: `docs/ai/context-map.json`
- Related pages (reference implementations): `src/Customers.js`, `src/Masters.js`, `src/Products.js`
- Routing entry: `src/App.js`
- Navigation: `src/Sidebar.js`
- Styles: `src/App.css`
- Governance: `.opencode/agents/governance-agent.md`

{"clarification": {"needed": true, "questions": [{"id": "q1", "question": "Should the Sessions page support CRUD operations (Create, Edit, Delete) like Customers/Products, or be read-only like Masters/Orders?", "whyItMatters": "CRUD adds modal forms, save/cancel buttons, toast notifications, and mock data mutation logic. Read-only is simpler and mirrors Masters.", "impactIfWrong": "If CRUD is required but not implemented, the page will need significant rework (modals, state mutations, toast calls). If CRUD is implemented but not needed, it adds unnecessary complexity.", "options": [{"key": "opt_a", "label": "Read-only (like Masters)", "consequence": "Simpler implementation; table + search + pagination only. No modals, no forms, no toast."}, {"key": "opt_b", "label": "CRUD (like Customers/Products)", "consequence": "Add Add button, modal with form fields, save/cancel handlers, toast success on save, delete confirmation dialog."}], "default": "opt_a", "allowFreeText": true, "blocking": true}, {"id": "q2", "question": "Are the six columns (ID, Title, Date, Duration, Status, Attendees) correct for the sessions table, or should different fields be used?", "whyItMatters": "Column definitions drive the mock data structure and table rendering.", "impactIfWrong": "Wrong columns mean mock data and table cells need to be rewritten. The spec would not match the business requirement.", "options": [{"key": "opt_a", "label": "Use the six columns listed above", "consequence": "Implementation proceeds as documented. Mock data populated with these fields."}, {"key": "opt_b", "label": "Different columns", "consequence": "Need to receive updated column list before implementation."}], "default": "opt_a", "allowFreeText": true, "blocking": true}, {"id": "q3", "question": "Where in the sidebar should the Sessions navigation link be placed?", "whyIt Matters": "Sidebar ordering affects user discoverability and code changes to Sidebar.js.", "impactIfWrong": "Link placed in wrong position may confuse users or require rework.", "options": [{"key": "opt_a", "label": "Alphabetically after Orders, before Profiles", "consequence": "Consistent alphabetical ordering of data pages."}, {"key": "opt_b", "label": "After Masters, before Orders", "consequence": "Grouped with master-data-like pages."}], "default": "opt_a", "allowFreeText": true, "blocking": false}], "assumptions": [{"statement": "PAGE_SIZE is 30, matching existing pages (Customers, Masters, Products).", "risk": "low"}, {"statement": "Styles reuse existing BEM-ish classes from Customers/Masters (e.g., .orders-table, .customers-pagination) rather than creating new session-specific class names.", "risk": "low"}, {"statement": "The /sessions route is placed in the authenticated routes block in App.js, after /orders.", "risk": "low"}]}}

# MIS-30: Implement Sessions Page — Implementation Plan

## 1. Story Overview

**JIRA Key**: MIS-30
**Title**: Implement Sessions Page
**Priority**: To be assigned
**Assignee**: To be assigned

## 2. Context Budget

This plan is scoped to 5 files: 3 new (`Sessions.js`, `Sessions.test.js`, `sessionsMock.js`), 3 modified (`App.js`, `Sidebar.js`, `App.css`). The implementer should read the existing `Customers.js` (full) and `Masters.test.js` (full) to reuse patterns; no repo-wide reads are needed.

## 3. Files to Touch

| File | Action |
|---|---|
| `src/Sessions.js` | Create — main Sessions page component (read-only table with search + pagination) |
| `src/Sessions.test.js` | Create — Jest + RTL tests following `Masters.test.js` pattern |
| `src/sessionsMock.js` | Create — mock session data export (≥12 items to test pagination across ≥3 pages) |
| `src/App.js` | Modify — add `<Route path="/sessions" element={<Sessions />} />` in auth-protected route group |
| `src/Sidebar.js` | Modify — add Sessions navigation link after existing items |
| `src/App.css` | Modify — add Sessions-specific styles |

## 4. Implementation Steps

### Step 1 — Create `src/sessionsMock.js`

- Export a `mockSessions` array of objects.
- Shape per item: `{ id, user, loginTime, logoutTime (string or null for active), device }`.
- Include ≥12 items so pagination spans at least 3 pages (with page size of 5).
- Make some `logoutTime` values `null` to test the "Active" display.
- Pattern: follows `src/mastersMock.js` / `src/productsMock.js`.

### Step 2 — Create `src/Sessions.js`

- Functional component, default export, `useState` / `useMemo` / `useEffect` hooks.
- **No CRUD modals** — read-only table, per spec assumption #3.
- Imports: `React`, `useState`, `useMemo`, `useEffect`, `useNavigate` from `react-router-dom`; `Sidebar` from `./Sidebar`; `mockSessions` from `./sessionsMock`.
- **State**:
  - `searchTerm` (string)
  - `currentPage` (number)
  - `pageSize` = `5` (const, consistent with `Customers.js` and `Masters.js`)
- **Filtered data** via `useMemo`: filter `mockSessions` by `searchTerm` against all columns (case-insensitive `includes()`).
- **Pagination**:
  - `useEffect` to reset `currentPage` to 1 whenever `searchTerm` changes.
  - `start` / `end` index calculation based on `currentPage` and `pageSize`.
  - `pageItems` = slice of filtered array.
  - `totalPages` = `Math.ceil(filtered.length / pageSize)` or 0 if filtered is empty.
- **JSX structure** follows the layout pattern from `Masters.js` / `Customers.js`:
  - Wrapper `<div className="App App--sidebar">`
  - `<Sidebar />`
  - `<div className="sessions-container">`
    - `<h2 className="sessions-header">Sessions</h2>`
    - `<input>` with placeholder `"Search sessions..."`, `onChange` handler updating `searchTerm`
    - `<table>` with headers: `Session ID`, `User`, `Login Time`, `Logout Time`, `Device`
    - Table rows from `pageItems`, with `logoutTime` displayed as `"Active"` when `null`
    - Pagination controls: "Previous" button (disabled if `currentPage === 1`), "Next" button (disabled if `currentPage === totalPages`), text showing `"Page X of Y"` (or `"No sessions found"` if filtered length is 0)
- Class names use BEM-ish convention: `.sessions-container`, `.sessions-header`, `.sessions-search`, `.sessions-table`, `.sessions-paginator`, `.sessions-prev-btn`, `.sessions-next-btn`.
- If the project has a `toast` import (used in `Profile.js`), do **not** add toast calls here — sessions is read-only; no modifications are made.

### Step 3 — Create `src/Sessions.test.js`

- Follow the exact test structure from `src/Masters.test.js`:
  - **Smoke test**: render with `MemoryRouter`, expect no crash.
  - **Renders table rows**: expect first `pageSize` items appear in DOM (e.g., `"User 1"`, `"User 2"`, etc. — use actual mock data values).
  - **Filters by search term**: use `getByLabelText("Search sessions")`, fire `change` event, verify expected rows present and others removed.
  - **No results message**: search for a term that matches nothing, expect `/(no sessions found|no results found|0 sessions found)/i` in DOM.
  - **Pagination controls**: verify "Previous" is disabled on first page, click "Next" and verify page text updates to `"Page 2 of X"`.
- Use `MemoryRouter` from `react-router-dom` for all renders.

### Step 4 — Modify `src/App.js`

- Import `Sessions` from `./Sessions`.
- Add `<Route path="/sessions" element={<Sessions />} />` inside the existing `<Routes>` block, within the authenticated route group (after the existing `<Navigate>` fallback and alongside other protected routes like `/orders`, `/customers`, `/masters`).

### Step 5 — Modify `src/Sidebar.js`

- Add a navigation item for "Sessions" in the sidebar menu list.
- Use the same `<li>` / `<a>` or `<NavLink>` structure as existing items.
- Path: `/sessions`.
- Icon: use a Font Awesome icon consistent with existing sidebar icons (e.g., `fa-clock` or `fa-right-to-bracket`), or reuse an existing icon style.
- Place after "Masters" (alphabetically or at the end of the list).

### Step 6 — Modify `src/App.css`

- Add BEM-ish classes for the Sessions page (`.sessions-container`, `.sessions-header`, `.sessions-search`, `.sessions-table`, `.sessions-table-header`, `.sessions-table-row`, `.sessions-paginator`, `.sessions-prev-btn`, `.sessions-next-btn`, `.sessions-prev-btn-disabled`, `.sessions-next-btn-disabled`).
- Follow the same CSS property values and conventions as the existing `.customers-table`, `.orders-table`, `.masters-table` styles already in the file.
- No new `.css` files.

## 5. Risk Assessment

| Risk | Mitigation |
|---|---|
| Sidebar navigation structure is not obvious (raw `<a>` vs `<NavLink>`) | Read `src/Sidebar.js` to copy the exact pattern used for existing items |
| App.css class names conflict with existing names | Use the `.sessions-*` prefix, which is unique to this component |
| Pagination logic off-by-one errors | Mirror the exact `pageSize`/`Math.ceil` logic from `Customers.js` / `Masters.js` |
| Mock data not diverse enough to test edge cases | Ensure ≥12 items with varied `user`, `loginTime`, `logoutTime` values and some `null` logout times |

## 6. Acceptance-Criterion Mapping

| AC | Implementation |
|---|---|
| `/sessions` route exists | Step 4 |
| Route protected (auth check) | Step 4 — placed in auth-protected `<Route>` group |
| Unauthenticated access redirects to `/login` | Already handled by the auth guard in `App.js` (existing pattern) |
| Navigation link in sidebar | Step 5 |
| Layout: `App App--sidebar` with Sidebar | Step 2 |
| Header "Sessions" | Step 2 |
| Search input with placeholder "Search sessions..." | Step 2 |
| Table with Session ID, User, Login Time, Logout Time, Device | Step 2 |
| Mock data from `sessionsMock.js` | Step 1 |
| Page size 5 | Step 2 |
| Pagination "Page X of Y" | Step 2 |
| Search filters all columns, case-insensitive | Step 2 |
| Search resets to page 1 | Step 2 (`useEffect` on `searchTerm`) |
| "No sessions found" message | Step 2 |
| Pagination controls (prev/next, disabled states) | Step 2 |
| CSS in App.css, BEM-ish naming | Step 6 |
| Tests: smoke, rows, filter, no results, pagination | Step 3 |

## 7. Open Questions / Assumptions

1. **Read-only assumption**: The spec assumes no CRUD for Sessions. If edit/delete is required, Steps 2 and 3 would need modal handlers and additional state — this would be a material change.
2. **Sidebar structure**: The exact DOM structure of `Sidebar.js` is assumed to use the same `<li>`/`<a>` pattern as existing items. The implementer should read `src/Sidebar.js` to confirm before modifying.
3. **Mock data volume**: 12+ items are assumed sufficient to test pagination across ≥3 pages with a page size of 5.
4. **Device column**: Listed as "optional" in the spec; included in the table for completeness since the mock data structure includes it.
5. **Font Awesome icon for Sessions**: An appropriate icon (e.g., `fa-clock`) is assumed acceptable. No change to `public/index.html` is needed since the CDN link already loads Font Awesome 6.4.2.

{"clarification":{"needed":true,"questions":[{"id":"q1","question":"Should the Sessions page include CRUD modals (add/edit/delete sessions) or remain read-only only?","whyItMatters":"This determines whether we need modal components, form handlers, and additional state management in Sessions.js, changing the component significantly.","impactIfWrong":"If CRUD is needed and we implement read-only, the feature will not meet acceptance criteria. If we implement CRUD but only need read-only, the extra code is wasted but not harmful.","options":[{"key":"opt_a","label":"Read-only only (no modals)","consequence":"Simpler component, smaller implementation, fewer test cases needed"},{"key":"opt_b","label":"Full CRUD with modals","consequence":"Component needs handleOpenModal, handleCloseModal, handleFormChange, handleSave like Customers.js; more CSS and test cases; mock data needs to support add/edit/delete scenarios"}],"default":"opt_a","allowFreeText":true,"blocking":true}],"assumptions":[{"statement":"Sessions is read-only with no add/edit/delete functionality, following the pattern for a view-only data display page.","risk":"low"}]}}

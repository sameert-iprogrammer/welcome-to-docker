# Implementation Plan: MIS-27 — Add Sessions Page

## Resolved decisions
- [story_analyzer] CRUD vs Read-only: **Read-only** (mirrors `Masters`, no modals/forms required)
- [story_analyzer] Data fields: **ID, Title, Date, Duration, Status, Attendees**
- [story_analyzer] Sidebar placement: **Alphabetically after Orders, before Profiles**

## Context Budget
- **Target files only**: `src/Sessions.js`, `src/sessionsMock.js`, `src/Sessions.test.js`, `src/App.js`, `src/Sidebar.js`, `src/App.css`.
- The implementer should only read the navigation/list sections of `Sidebar.js` and the authenticated route block of `src/App.js` to insert the new link and route.
- Reuse existing patterns from `src/Masters.js` (search, pagination, table rendering, `useMemo` filtering) and `src/mastersMock.js` (mock array structure).
- Avoid reading or modifying any backend, Docker, CI, or unrelated component files.

## Files to Touch
- `src/sessionsMock.js` (Create)
- `src/Sessions.js` (Create)
- `src/Sessions.test.js` (Create)
- `src/App.js` (Modify)
- `src/Sidebar.js` (Modify)
- `src/App.css` (Modify)

## Implementation Steps

### Step 1: Create Mock Data (`src/sessionsMock.js`)
- **Pattern**: Follow `src/mastersMock.js` / `src/productsMock.js`. Export a named constant `mockSessions`.
- **Structure**: Array of 6–10 objects matching the required fields:
  ```javascript
  {
    id: 1,
    title: "Docker Fundamentals",
    date: "2024-03-15",
    duration: "1h 30m",
    status: "Completed",
    attendees: 45
  }
  ```
- **Assumption**: IDs are numbers. Titles, dates, durations, and statuses are strings. Attendees is a number. Realistic placeholder data will be used.

### Step 2: Create Sessions Component (`src/Sessions.js`)
- **Pattern**: Functional component, default export. Mirrors `src/Masters.js` read-only pattern. Uses `useState`, `useEffect`, `useMemo`.
- **Imports**: `React`, `useState`, `useEffect`, `useMemo` from `react`; `useNavigate` from `react-router-dom`; `mockSessions` from `./sessionsMock`.
- **Constants**: `const PAGE_SIZE = 30;` at module level.
- **State**: 
  - `const [searchTerm, setSearchTerm] = useState("");`
  - `const [currentPage, setCurrentPage] = useState(1);`
- **Filtering**: 
  - Use `useMemo` to compute `filteredSessions`. Filter logic should case-insensitively match `searchTerm` against `id` (converted to string), `title`, `date`, or `status`.
- **Pagination Reset**: 
  - Use `useEffect(() => { setCurrentPage(1); }, [searchTerm]);` to reset pagination when search changes.
- **Slicing**: 
  - `const start = (currentPage - 1) * PAGE_SIZE;`
  - `const paginatedSessions = filteredSessions.slice(start, start + PAGE_SIZE);`
- **Rendering Structure**:
  - Wrapper: `<div className="App App--sidebar">`
  - `<Sidebar />`
  - `<div className="sessions-container">`
  - `<h2 className="sessions-title">Sessions</h2>`
  - Search: `<input type="text" className="login-input orders-search" placeholder="Search sessions…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search sessions" />`
  - Table: `<div className="orders-table-wrapper"><table className="orders-table">...</table></div>`
    - Headers: `ID`, `Title`, `Date`, `Duration`, `Status`, `Attendees`
    - Body: map over `paginatedSessions`
  - Empty State: If `filteredSessions.length === 0`, render `<p className="orders-no-results">No sessions found.</p>`
  - Pagination: `<div className="customers-pagination">` with Previous/Next buttons and text showing current page/range. Disable buttons at boundaries.

### Step 3: Create Smoke Test (`src/Sessions.test.js`)
- **Pattern**: Follow `src/Masters.test.js`. Use `@testing-library/react`, `MemoryRouter`, `render`, `fireEvent`, `getByText`, `getByLabelText`, `queryByText`.
- **Tests**:
  1. `it("renders without crashing")`
  2. `it("renders sessions in the table")` (assert visibility of at least one mock `title`)
  3. `it("filters sessions by search term")` (change input, assert filtered result appears, assert non-matching disappears)

### Step 4: Modify Routing (`src/App.js`)
- **Action**: Import `Sessions` at the top. Add `<Route path="/sessions" element={<Sessions />} />` inside the authenticated `<Routes>` block.
- **Placement**: Insert the route after the existing `/orders` route and before the `/profile` route to maintain alphabetical ordering among data pages.
- **Assumption**: The implementer will place it within the existing `<Route>` grouping that handles authenticated dashboards, preserving the existing `<Navigate>` fallback logic.

### Step 5: Modify Sidebar Navigation (`src/Sidebar.js`)
- **Action**: Add a navigation list item containing a `<Link to="/sessions">Sessions</Link>`.
- **Placement**: Insert the link item alphabetically after the existing "Orders" link and before the "Profiles" link.
- **Assumption**: The Sidebar renders a standard `<ul>`/`<li>` or equivalent flex/list structure using `react-router-dom`'s `<Link>`. The implementer will replicate the exact JSX structure, classes, and icon usage (if any) of the adjacent links to ensure visual consistency.

### Step 6: Add Styles (`src/App.css`)
- **Action**: Append new styles to the end of `src/App.css`.
- **New Classes**:
  ```css
  .sessions-container {
    /* Standard container padding/margins, consistent with other page wrappers */
  }
  .sessions-title {
    /* Standard page title styling (likely mirroring other H2 titles) */
  }
  ```
- **Reuse Strategy**: 
  - `.orders-search`, `.orders-table-wrapper`, `.orders-table`, `.orders-table-th`, `.orders-table-td`, `.customers-pagination`, `.customers-page-btn` will be applied directly to the Sessions component's JSX.
  - If minor overrides are strictly necessary, scope them under `.sessions-container .orders-*` or `.sessions-container .customers-*` to avoid global side-effects.
- **Assumption**: Existing BEM-ish classes from `Customers`/`Masters` are intentionally generic and visually compatible with the Sessions table and pagination controls.

## Risks & Mitigations
- **Pagination with small mock data**: `PAGE_SIZE` is 30, but mock data only contains ~10 items. Pagination controls will render but won't show multiple pages. The logic is correct for scalability and test coverage; no functional risk.
- **Numeric ID filtering**: Search inputs are strings. The filter must explicitly cast `item.id` to a string (`String(item.id).toLowerCase()`) before matching.
- **Sidebar/App.js exact placement**: Full file contents for `Sidebar.js` and `App.js` were not provided in the context pack. The implementer will visually scan for the existing Orders/Profiles anchors and insert the new link/route precisely between them, following the existing code style.
- **Style bleed**: Reusing `.orders-*` and `.customers-*` classes is safe per project conventions, but the implementer should verify in the browser during local dev that no unintended spacing/color inheritance occurs from unrelated components.

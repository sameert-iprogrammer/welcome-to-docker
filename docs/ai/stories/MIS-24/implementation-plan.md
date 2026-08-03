# MIS-24 Implementation Plan: Add Promotions Functionality

## Overview
This plan defines the implementation for adding a read-only Promotions page with client-side search and pagination. The implementation strictly follows the established UI and testing patterns from `Masters.js` and `Customers.js` to ensure consistency across the application.

## Files to Touch
- `src/promotionsMock.js` - Create
- `src/Promotions.js` - Create
- `src/Sidebar.js` - Modify
- `src/App.js` - Modify
- `src/Promotions.test.js` - Create

## Implementation Steps

### Step 1: Create Mock Data (`src/promotionsMock.js`)
- **Action**: Create file.
- **Details**: Export a named constant `mockPromotions` as an array of objects.
- **Object Schema**:
  ```javascript
  {
    id: number,
    code: string,       // e.g., "SUMMER24", "WINTER25"
    name: string,       // e.g., "Summer Sale", "Winter Clearance"
    discount: string,   // e.g., "20%", "Buy 1 Get 1", "$10 Off"
    startDate: string,  // ISO format "YYYY-MM-DD"
    endDate: string,    // ISO format "YYYY-MM-DD"
    status: string      // "Active", "Inactive", or "Expired"
  }
  ```
- **Quantity & Mix**: 15-18 entries to span multiple pages. Target mix: ~9 Active, ~5 Inactive, ~4 Expired.
- **Reference**: Match the export/import syntax and structure of `src/productsMock.js` and `src/mastersMock.js`.

### Step 2: Create Promotions Component (`src/Promotions.js`)
- **Action**: Create file.
- **Imports**: `useState`, `useMemo`, `useEffect` from `react`; `Sidebar` from `./Sidebar`; `mockPromotions` from `./promotionsMock`. Import `PAGE_SIZE` (see Assumptions).
- **State**:
  - `searchTerm` (default `""`)
  - `currentPage` (default `1`)
  - `promotions` (initialized with `mockPromotions`)
- **Logic**:
  - `useMemo` for `filteredPromotions`: case-insensitive filter across all string fields (`id`, `code`, `name`, `discount`, `startDate`, `endDate`, `status`). Return all if `searchTerm` is empty.
  - `useEffect` to reset `currentPage` to `1` when `searchTerm` changes.
  - Calculate `totalPages`, `start`, `paginatedPromotions`, and `displayTotal` using `PAGE_SIZE`.
- **UI Structure** (exact class names from `Masters.js`/`Customers.js`):
  - `<div className="App App--sidebar">`
  - `<Sidebar />`
  - `<div className="promotions-container">`
  - `<h2 className="promotions-title">Promotions</h2>`
  - `<input className="orders-search login-input" ... />` with `aria-label="Search promotions"`
  - `<div className="orders-table-wrapper">`
  - `<table className="orders-table">`
    - `<thead>` with `<th className="orders-table-th">` for ID, Code, Name, Discount, Start Date, End Date, Status.
    - `<tbody>` mapping `paginatedPromotions` to `<tr>` with `<td className="orders-table-td">`.
  - `<p className="orders-no-results">No promotions found matching "{searchTerm}"</p>` when `filteredPromotions.length === 0`.
  - `<div className="customers-pagination">` containing:
    - Prev button: `className="customers-page-btn"`, `disabled={currentPage === 1}`, `aria-label="Previous page"`
    - Info: `className="customers-page-info"` displaying `"Page {currentPage} of {displayTotal}"`
    - Next button: `className="customers-page-btn"`, `disabled={currentPage === totalPages}`, `aria-label="Next page"`
  - **Constraint**: No action buttons, modals, or edit fields. Read-only listing only.

### Step 3: Update Sidebar (`src/Sidebar.js`)
- **Action**: Modify file.
- **Details**: Add a new navigation item for "Promotions" that routes to `/promotions`.
- **Attributes**: Must include `aria-label="Promotions"`.
- **Implementation**: Follow the exact navigation pattern already established in `Sidebar.js` (the test suite mocks `useNavigate`, confirming programmatic navigation via `react-router-dom` is used). Ensure the active/highlighted state logic applies when the route is `/promotions`.

### Step 4: Update Routes (`src/App.js`)
- **Action**: Modify file.
- **Details**: Import `Promotions` from `./Promotions`. Add `<Route path="/promotions" element={<Promotions />} />` within the existing router configuration.
- **Placement**: Insert alphabetically or logically alongside existing page routes (e.g., between `/orders` and `/profile`).

### Step 5: Write Tests (`src/Promotions.test.js`)
- **Action**: Create file.
- **Setup**: Import `render`, `fireEvent` from `@testing-library/react`; `MemoryRouter` from `react-router-dom`. If `Sidebar` is rendered, mock `react-router-dom` hooks as done in `Sidebar.test.js`.
- **Test Cases**:
  1. **Renders without crashing**: Basic render in `MemoryRouter`.
  2. **Search filters results**: Type a term (e.g., "Active" or a specific code), verify matching rows appear and non-matching rows are removed.
  3. **Empty search results**: Search for a non-existent term (e.g., "zzzzz"), verify `orders-no-results` message appears.
  4. **Pagination controls render and work**: Verify Previous button is disabled on page 1, page indicator shows "Page X of Y", clicking Next advances to page 2, Next button is disabled on the last page.
  5. **Search resets pagination**: Navigate to page 2, then trigger a search, verify page resets to 1 and displays correct results.
  6. **Table displays all columns**: Verify table headers render correctly and mock data fields appear in table cells.
  7. **Navigation renders**: Verify "Promotions" link/button appears in the rendered sidebar.

## Context Budget
- **Read**: `src/Masters.js` and `src/Masters.test.js` to copy exact CSS class names, table structure, and testing conventions.
- **Read**: `src/Sidebar.js` to determine the exact navigation mechanism (`useNavigate` vs `Link`) before modifying it.
- **Read**: `src/App.js` to identify the existing route structure and insertion point.
- **Read**: `src/productsMock.js` to match mock data export syntax.
- **Scope**: Implementation is strictly confined to the 5 files listed above. No global styles, build config, or routing architecture changes are required.

## Assumptions
1. **PAGE_SIZE Constant**: The spec references a `PAGE_SIZE` constant shared across components. I assume it is imported from a shared constants/utils file or defined globally. Based on `Customers.test.js` showing 3 pages for ~7 items, `PAGE_SIZE` is `3`. If the import path is not found during implementation, I will define `const PAGE_SIZE = 3;` locally in `Promotions.js`.
2. **Sidebar Navigation Pattern**: `Sidebar.js` uses `react-router-dom`'s `useNavigate` hook (confirmed by test mocking). I will add the Promotions link using the same mechanism to maintain consistency.
3. **Route Configuration**: `src/App.js` uses React Router v6 (`<Route path="..." element={...} />`). I will insert the new route inline with existing route definitions.
4. **Read-Only Scope**: Per the story description and `Masters.js` precedent, the Promotions page will be strictly read-only with no CRUD modals or action buttons.
5. **Mock Data Quantity**: 15 entries divided by `PAGE_SIZE` (3) results in exactly 5 pages, satisfying the "3+ pages" pagination requirement.

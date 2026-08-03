# MIS-24: Add Promotions Functionality

## Story Overview
Add a Promotions page accessible via the sidebar after login. The page displays a mock listing of promotions with client-side search and pagination.

## Acceptance Criteria
1. A Promotions page is accessible via the sidebar navigation after login
2. The page displays a table of mock promotion data
3. Client-side search filters the table by all visible text fields
4. Pagination is implemented (consistent with existing PAGE_SIZE constant)
5. Search resets pagination to page 1
6. Empty search results display "No promotions found matching \"{searchTerm}\"" message
7. Page navigation buttons show disabled state when at first/last page
8. The sidebar includes a Promotions navigation item with aria-label
9. The Promotions page displays a table header with appropriate column names
10. Each row displays all mock promotion fields

## UI Requirements
- Table styling: Use `orders-table`, `orders-table-th`, `orders-table-td` classes (consistent with Orders, Customers, Approvals, Masters)
- Pagination: Use `customers-pagination` class with `customers-page-btn` buttons and `customers-page-info` span
- Search input: Use `orders-search` and `login-input` classes
- Page indicator: Display "Page X of Y"
- No results message: Use `orders-no-results` class
- Layout: Wrap with `App` and `App--sidebar` classes, include `<Sidebar />` component as first child
- No action buttons on the page (read-only listing)
- Previous button disabled on page 1 with `customers-page-btn--disabled` class
- Next button disabled on last page with `customers-page-btn--disabled` class

## Implementation Requirements

### Promotions.js (`src/Promotions.js`)
- Functional component using React hooks (useState, useMemo, useEffect)
- Imports: `useState`, `useMemo`, `useEffect` from React; mock data from `promotionsMock`
- State variables:
  - `searchTerm` (string)
  - `currentPage` (number, default 1)
  - `promotions` (array from mock data)
- Filter logic:
  - Use `useMemo` to compute `filteredPromotions` based on `searchTerm`
  - Case-insensitive search across all string fields
  - If `searchTerm` is empty, return all promotions
- Pagination:
  - `totalPages = Math.ceil(filteredPromotions.length / PAGE_SIZE)`
  - `start = (currentPage - 1) * PAGE_SIZE`
  - `paginatedPromotions = filteredPromotions.slice(start, start + PAGE_SIZE)`
  - `displayTotal = totalPages || 1`
  - Reset `currentPage` to 1 when `searchTerm` changes via `useEffect`
- Table columns:
  - ID
  - Code
  - Name
  - Discount
  - Start Date
  - End Date
  - Status
- No action column or buttons (read-only page, following Masters.js pattern)

### Mock Data (`src/promotionsMock.js`)
- Export named constant `mockPromotions` (array of objects)
- Minimum 15 entries to test pagination across 3+ pages (consistent with Masters mock having 18 entries)
- Object shape:
  ```js
  {
    id: number,
    code: string,        // e.g., "SUMMER24"
    name: string,        // e.g., "Summer Sale"
    discount: string,    // e.g., "20%" or "Buy 1 Get 1"
    startDate: string,   // e.g., "2024-06-01"
    endDate: string,     // e.g., "2024-08-31"
    status: string       // "Active", "Inactive", or "Expired"
  }
  ```
- Include a mix of statuses for search/filter testing:
  - ~8 Active
  - ~4 Inactive
  - ~3 Expired

### Sidebar Update (`src/Sidebar.js`)
- Add navigation link for "Promotions" with `to="/promotions"`
- Include `aria-label="Promotions"` on the link/button element
- Follow existing sidebar navigation pattern using react-router-dom's Link or Navigate component
- Active state should highlight when on `/promotions` route

### Route Configuration (`src/App.js`)
- Add route: `<Route path="/promotions" element={<Promotions />} />`
- (Assuming routes are centralized in App.js based on project pattern)

## Test Requirements (`src/Promotions.test.js`)
Create test file following the pattern established in `Customers.test.js` and `Masters.test.js`:

1. **Renders without crashing** — basic render test
2. **Search filters results** — type a term, verify matching items appear and non-matching are removed
3. **Empty search results** — search with non-matching term shows "No promotions found matching..." message
4. **Pagination controls render and work** — Previous button disabled on page 1; page indicator shows "Page X of Y"; clicking Next shows next page; Next button disabled on last page
5. **Search resets pagination** — navigate to page 2, then search, should reset to page 1 with correct page count
6. **Table displays all columns** — verify headers render; verify mock data fields appear in table cells
7. **Navigation renders** — sidebar contains "Promotions" link

## Open Questions
None at this time.

## Assumptions
1. The promotions page is read-only (no Create/Update/Delete operations). This is based on the description explicitly stating "show mock listing with client side search and pagination" and the acceptance criteria not mentioning CRUD. This aligns with the Masters.js page pattern, which is also read-only.
2. The PAGE_SIZE constant is already defined and available for import (consistent usage across Customers.js, Approvals.js, Masters.js). The value is likely 3 or 5 based on test assertions (Customers.test.js shows "page 1 of 3" with ~7 customers, implying PAGE_SIZE=3).
3. Route configuration is centralized in `src/App.js` following the existing pattern observed in the project structure where each page component is rendered via React Router.
4. The sidebar uses `react-router-dom`'s `useLocation` for active state and `useNavigate` or `<Link>` for navigation (confirmed by Sidebar.test.js).
5. The Promotions page follows the same layout wrapper pattern as other pages: `<div className="App App--sidebar">` with `<Sidebar />` as the first child.
6. No Figma design or attachments were provided, so the implementation follows existing UI patterns from Masters.js and Customers.js as the closest precedents.

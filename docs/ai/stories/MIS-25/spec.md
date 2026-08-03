# MIS-25: Add Promotions Functionality

## Story Metadata

| Field | Value |
|-------|-------|
| JIRA Key | MIS-25 |
| Title | Add promotions functionality |
| Type | Frontend Feature |
| Priority | Normal |

## Background

The application currently provides CRUD-like interfaces for several entity types: Customers, Products, Masters, Orders, and Approvals. Each follows a consistent pattern: a sidebar navigation item, a table view with client-side search and pagination, and a modal form for adding new entries. This story adds a Promotions page following the same architectural pattern.

No backend integration is required — all data is mocked client-side.

## Acceptance Criteria

- [ ] A "Promotions" nav item appears in the sidebar navigation, positioned after the existing items (Dashboard, Orders, FAQ, Masters, Approvals, Customers, Products)
- [ ] Clicking the Promotions nav item navigates to a `/promotions` route
- [ ] The Promotions page displays a table of mock promotion records
- [ ] Each promotion record displays: ID, Name/Title, Description, Start Date, End Date, Discount Type, Discount Value, Status
- [ ] Client-side search filters promotions by any visible field (ID, name, description, dates, discount type, discount value, status)
- [ ] Pagination displays 5 records per page (consistent with existing `PAGE_SIZE` constant)
- [ ] Pagination controls show "Previous" / "Next" buttons with current page info (e.g., "Page 1 of 4")
- [ ] The "Previous" button is disabled on page 1; the "Next" button is disabled on the last page
- [ ] Searching resets pagination to page 1
- [ ] No promotions shown displays a message: `No promotions found matching "{searchTerm}"`
- [ ] The page includes an "Add Promotion" button that opens a modal form
- [ ] The modal form allows adding a new promotion with fields: Name, Description, Start Date, End Date, Discount Type, Discount Value, Status
- [ ] Saving the form adds the promotion to the client-side list with an auto-incremented ID and displays a success toast
- [ ] All interactive elements have appropriate `aria-label` attributes for accessibility
- [ ] The component renders without crashing in tests
- [ ] Sidebar navigation highlights the active path (promotions) with the `sidebar-nav-item--active` class

## Requirements

### Functional

#### Data Model

Each promotion record has the following shape:

```typescript
interface Promotion {
  id: number;
  name: string;        // Promotion title/identifier
  description: string; // Description of the promotion
  startDate: string;   // ISO date string or readable date format
  endDate: string;     // ISO date string or readable date format
  discountType: string; // e.g., "Percentage", "Fixed Amount"
  discountValue: number; // Numeric discount value
  status: string;      // e.g., "Active", "Upcoming", "Expired", "Draft"
}
```

#### Mock Data

A minimum of 10-15 mock promotion records should be provided in `src/promotionsMock.js`, following the naming convention of existing mock files (e.g., `productsMock.js`, `customersMock.js`). The mock data should include a mix of statuses and discount types to exercise filtering.

#### Search

- Client-side filtering across all displayed fields
- Case-insensitive matching
- Empty search returns all records

#### Pagination

- 5 records per page (consistent with `PAGE_SIZE` used in Customers, Products, Masters, Orders, Approvals)
- Page 1 is default on load and after search resets
- Previous/Next buttons disabled appropriately at boundaries

#### Modal Form

- "Add Promotion" button triggers modal
- Modal includes fields for all promotion properties
- Form validates required fields (name, start date, end date, discount type, discount value)
- Save appends to local state with next sequential ID
- Cancel closes modal without changes
- Success toast on save

### Non-Functional

- **No backend calls** — all state is local
- **Consistent styling** — reuse existing CSS class naming conventions
- **Accessibility** — aria labels on all interactive elements
- **No breaking changes** — existing pages must continue to function

## UI Notes

### Sidebar Integration

The Promotions nav item should be added to the `Sidebar` component. Following the existing pattern:

- Nav item label: "Promotions"
- Route: `/promotions`
- Icon: A relevant icon (consistent with other nav items)
- Active state: Apply `sidebar-nav-item--active` class when `location.pathname === '/promotions'`
- Position: After "Products" (alphabetical order)

### Page Layout

The Promotions page follows the established template used by Customers, Products, Masters, Orders, and Approvals:

```
<div className="App App--sidebar">
  <Sidebar />
  <div className="customers-container">
    <div className="customers-header">
      <h2 className="customers-title">Promotions</h2>
      <button type="button" className="customers-add-btn" onClick={handleOpenModal} aria-label="Add promotion">
        Add Promotion
      </button>
    </div>
    <input
      type="text"
      className="orders-search login-input"
      placeholder="Search promotions..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      aria-label="Search promotions"
    />
    <div className="orders-table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th className="orders-table-th">ID</th>
            <th className="orders-table-th">Name</th>
            <th className="orders-table-th">Description</th>
            <th className="orders-table-th">Start Date</th>
            <th className="orders-table-th">End Date</th>
            <th className="orders-table-th">Discount Type</th>
            <th className="orders-table-th">Discount Value</th>
            <th className="orders-table-th">Status</th>
            <th className="orders-table-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Paginated rows */}
        </tbody>
      </table>
    </div>
    {/* Empty state */}
    {/* Pagination controls */}
    {/* Modal */}
  </div>
</div>
```

### Modal Design

The promotion modal mirrors the Products modal structure:

- Overlay with `role="dialog"` and `aria-modal="true"`
- Title: "Add Promotion"
- Form fields with labels and `login-input` class
- Two action buttons: Cancel (type="button") and Save (type="submit")
- Cancel triggers `handleCloseModal`
- Save triggers `handleSave` with toast notification

### Styling

- Reuse existing CSS classes: `customers-container`, `customers-title`, `customers-header`, `customers-add-btn`, `orders-search`, `login-input`, `orders-table-wrapper`, `orders-table`, `orders-table-th`, `orders-table-td`, `orders-no-results`, `customers-pagination`, `customers-page-btn`, `customers-page-info`
- Modal classes: `product-modal-overlay`, `product-modal`, `product-modal-title`, `product-modal-form`, `form-group`, `product-modal-actions`, `product-modal-cancel-btn`, `product-modal-save-btn`
- No new CSS file required — existing utility classes are sufficient

## Implementation Notes

### Files to Create/Modify

1. **New file**: `src/Promotions.js`
2. **New file**: `src/Promotions.test.js`
3. **New file**: `src/promotionsMock.js`
4. **Modified file**: `src/Sidebar.js` — add Promotions nav item

### Component Structure

`src/Promotions.js` should follow the exact pattern of `src/Products.js`:

- Imports: `useState`, `useMemo`, `useEffect` from React; `toast` from react-toastify
- Mock data import: `import { mockPromotions } from './promotionsMock';`
- Constants: `const PAGE_SIZE = 5;` (import or define consistently)
- State:
  - `searchTerm` (string)
  - `currentPage` (number)
  - `promotions` (array)
  - `isModalOpen` (boolean)
  - `form` (object with empty defaults)
- Derived:
  - `filteredPromotions` via `useMemo`
  - `totalPages`, `start`, `paginatedPromotions`, `displayTotal`
- Handlers:
  - `handleOpenModal`
  - `handleCloseModal`
  - `handleFormChange(field)` → returns `(e) => setForm(...)`
  - `handleSave(e)` — prevents default, creates new promotion, updates state, closes modal, shows toast
- Render: Sidebar + container + search + table + pagination + modal

### Route Configuration

The route for Promotions must be registered in the router. Based on the existing pattern (see `App.js`), add:

```jsx
<Route path="/promotions" element={<Promotions />} />
```

### Mock Data Requirements

`src/promotionsMock.js` exports `mockPromotions`, an array of at least 10 objects matching the Promotion interface. Include:

- Diverse statuses: "Active", "Upcoming", "Expired", "Draft"
- Multiple discount types: "Percentage", "Fixed Amount"
- Varied date ranges to ensure pagination works across different search results

Example structure:

```javascript
export const mockPromotions = [
  {
    id: 1,
    name: "Summer Sale",
    description: "20% off all items",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    discountType: "Percentage",
    discountValue: 20,
    status: "Active",
  },
  // ... more records
];
```

### Testing Requirements

`src/Promotions.test.js` should mirror the test coverage of `src/Products.test.js`:

- Renders without crashing
- Displays header title "Promotions"
- Search input filters results
- Empty search results show "no promotions found" message
- Pagination controls render and work
- Clicking Next updates page and shows correct records
- Searching resets to page 1
- "Add Promotion" button renders with aria-label
- Modal opens with empty form fields on button click
- Modal has correct field labels and aria-labels
- Cancel button closes modal without saving
- Save button adds promotion to list and shows toast
- Form validates required fields

### Sidebar Changes

In `src/Sidebar.js`:

1. Add a new nav item after "Products":
   ```jsx
   <NavLink to="/promotions" aria-label="Promotions" className={({ isActive }) => `sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`}>
     Promotions
   </NavLink>
   ```

2. Ensure `react-router-dom`'s `useLocation` or `useNavigate` hooks are used to determine active state consistently with existing patterns

### Integration with App.js

In `src/App.js`, add the Promotions route within the `BrowserRouter`. The route should be added alphabetically or after the Products route:

```jsx
import Promotions from './Promotions';

// In Routes:
<Route path="/promotions" element={<Promotions />} />
```

## Open Questions

1. **Route placement**: Should Promotions appear before or after existing items in the sidebar? (Assumption: alphabetical position, after "Products")
2. **Discount Value formatting**: Should the discount value display as a percentage (e.g., "20%") or raw number (e.g., "20")? (Assumption: raw number, matching the data type)
3. **Date display format**: Should dates display as ISO strings or formatted strings (e.g., "Jun 1, 2024")? (Assumption: ISO strings for simplicity, unless mock data uses formatted strings)
4. **Action column**: Should the table include an "Action" column with edit/delete buttons, or only show an "Add Promotion" button at the top? (Assumption: only "Add Promotion" button, no edit/delete per the minimal scope of the story)

## Assumptions

1. The `PAGE_SIZE` constant is defined in the application and shared across pages, or will be defined locally as `5` to maintain consistency.
2. The `toast` utility from `react-toastify` is already configured and available (confirmed by usage in Products, Customers, etc.).
3. The `Sidebar` component uses `react-router-dom`'s `NavLink` with `isActive` prop for styling (confirmed by `Sidebar.test.js` showing `sidebar-nav-item--active` class).
4. No new CSS files are required; existing utility classes (`customers-*`, `orders-*`, `login-*`) are sufficient.
5. The Promotions page does not require edit/delete functionality beyond the "Add" flow described in the story.
6. Mock data includes at least 10 records to exercise pagination (5 per page = 2 pages minimum).
7. The router is configured with `BrowserRouter` and routes are added in `App.js`.

## Test Strategy

### Unit Tests

- Component rendering (no crash)
- Search filtering (case-insensitive, multi-field)
- Pagination behavior (page navigation, boundary states, search reset)
- Modal open/close behavior
- Form save (state update, toast, auto-increment ID)
- Form cancel (no state change, modal closes)
- Accessibility (aria-labels present on buttons and inputs)

### Integration Tests

- Sidebar navigation to Promotions route
- Active state styling in sidebar
- End-to-end flow: navigate to promotions, search, paginate, add promotion

### Mock Data Tests

- Verify mock data shape and field presence
- Ensure diverse values for status, discount type, and date ranges

## References

- **Existing page patterns**: `src/Products.js`, `src/Customers.js`, `src/Masters.js`, `src/Orders.js`, `src/Approvals.js`
- **Sidebar component**: `src/Sidebar.js`
- **Router configuration**: `src/App.js`
- **Test patterns**: `src/Products.test.js`, `src/Customers.test.js`, `src/Sidebar.test.js`
- **Toast notification**: `react-toastify` (already used in multiple components)

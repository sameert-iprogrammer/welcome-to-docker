## Objective
Implement the Promotions page (`/promotions`) with mock data, client-side search, pagination, and an "Add Promotion" modal form, strictly following the architectural patterns established in `src/Products.js`, `src/Customers.js`, and `src/Masters.js`.

## Files to Touch
- `src/promotionsMock.js` (Create)
- `src/Promotions.js` (Create)
- `src/Promotions.test.js` (Create)
- `src/Sidebar.js` (Modify)
- `src/App.js` (Modify)

## Implementation Steps

### Step 1: Create Mock Data (`src/promotionsMock.js`)
- Export `mockPromotions` as an array of 15 objects.
- Match the shape: `{ id, name, description, startDate, endDate, discountType, discountValue, status }`.
- Ensure diversity in `status` (`Active`, `Upcoming`, `Expired`, `Draft`) and `discountType` (`Percentage`, `Fixed Amount`) to exercise search filtering.
- Follow the naming and export convention of `productsMock.js` and `mastersMock.js`.

### Step 2: Implement Promotions Component (`src/Promotions.js`)
- **Imports**: `useState`, `useMemo`, `useEffect` from `react`; `toast` from `react-toastify`; `Sidebar` from `./Sidebar`; `mockPromotions` from `./promotionsMock`.
- **Constants**: Define `const PAGE_SIZE = 5;` locally to maintain consistency with existing pages.
- **State**:
  - `searchTerm` (default `""`)
  - `currentPage` (default `1`)
  - `promotions` (initialized from `mockPromotions`)
  - `isModalOpen` (default `false`)
  - `form` (object: `{ name: '', description: '', startDate: '', endDate: '', discountType: '', discountValue: '', status: 'Draft' }`)
- **Derived State**:
  - `filteredPromotions` via `useMemo`: case-insensitive filtering across all fields.
  - `totalPages`, `start`, `paginatedPromotions`, `displayTotal` calculated per page.
- **Handlers**:
  - `useEffect` to reset `currentPage` to `1` when `searchTerm` changes.
  - `handleOpenModal`: sets `isModalOpen` to `true`, resets `form` to defaults.
  - `handleCloseModal`: sets `isModalOpen` to `false`.
  - `handleFormChange(field)`: returns `(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))`.
  - `handleSave(e)`: `e.preventDefault()`. Validates required fields (`name`, `startDate`, `endDate`, `discountType`, `discountValue`). Generates `id` as `Math.max(...promotions.map(p => p.id)) + 1`. Updates state: `setPromotions((prev) => [...prev, newPromotion])`. Shows toast: `toast.success("Promotion added successfully")`. Calls `handleCloseModal()`.
- **Render Structure** (mirror `Customers.js` / `Products.js`):
  - Wrapper: `<div className="App App--sidebar">`
  - `<Sidebar />`
  - Container: `<div className="customers-container">`
  - Header: `<h2 className="customers-title">Promotions</h2>` + `<button className="customers-add-btn" onClick={handleOpenModal} aria-label="Add promotion">Add Promotion</button>`
  - Search: `<input className="orders-search login-input" placeholder="Search promotions..." value={searchTerm} onChange={...} aria-label="Search promotions" />`
  - Table: `<div className="orders-table-wrapper"><table className="orders-table">...</table></div>`
    - Headers: ID, Name, Description, Start Date, End Date, Discount Type, Discount Value, Status
    - Rows: map `paginatedPromotions`
    - *Note*: Omit the "Action" column per the story assumption (no edit/delete required).
  - Empty State: `<p className="orders-no-results">No promotions found matching "{searchTerm}"</p>`
  - Pagination: Reuse `customers-pagination`, `customers-page-btn`, `customers-page-info` classes. Disable prev on page 1, disable next on last page.
  - Modal: Overlay with `product-modal-overlay`, `product-modal`, `product-modal-title`, `product-modal-form`, `form-group`, `product-modal-actions`, `product-modal-cancel-btn`, `product-modal-save-btn`. Include all fields with matching `aria-label`s. Cancel triggers `handleCloseModal`, Save triggers `handleSave`.

### Step 3: Update Sidebar (`src/Sidebar.js`)
- Locate the existing nav items.
- Insert a new `NavLink` after the "Products" entry:
  ```jsx
  <NavLink to="/promotions" aria-label="Promotions" className={({ isActive }) => `sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`}>
    Promotions
  </NavLink>
  ```
- Ensure `NavLink` is imported from `react-router-dom`.

### Step 4: Update Router (`src/App.js`)
- Import `Promotions` from `./Promotions`.
- Add `<Route path="/promotions" element={<Promotions />} />` inside the existing `<Routes>` block, positioned alphabetically or immediately after the `/products` route.

### Step 5: Write Tests (`src/Promotions.test.js`)
- Mirror the structure of `src/Products.test.js` and `src/Customers.test.js`.
- **Imports**: `react`, `@testing-library/react`, `MemoryRouter`, `Promotions`, `mockPromotions`.
- **Test Cases**:
  1. Renders without crashing.
  2. Renders header title "Promotions".
  3. Renders first page rows in the table (validate first 5 items from mock data).
  4. Filters rows by search term (case-insensitive, multi-field).
  5. Shows "no promotions found" message when search matches nothing.
  6. Pagination controls render and work (prev disabled on page 1, next disabled on last, page info updates correctly).
  7. Searching resets pagination to page 1.
  8. Renders "Add Promotion" button with correct `aria-label`.
  9. Modal opens with empty form fields on button click.
  10. Modal contains correct labels and `aria-label`s for all promotion fields.
  11. Cancel button closes modal without saving (verify `toast.success` not called, modal title null).
  12. Save button adds promotion to list, fires toast, closes modal, and newly added row appears in filtered view.

## Context Budget
- Scope is strictly limited to the 5 files listed above.
- Component structure, CSS class naming, and test patterns must closely follow `src/Products.js`, `src/Customers.js`, and `src/Products.test.js`.
- No backend integration, no new CSS files, and no additional dependencies are permitted.
- Assume `toast` is globally configured in the app root.
- Assume `PAGE_SIZE = 5` is defined locally in `Promotions.js` to avoid cross-file coupling.
- Maintain existing code style (PascalCase filenames, functional components, `useState`/`useMemo`/`useEffect` hooks).

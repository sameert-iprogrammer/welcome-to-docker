# MIS-34: Products Management View

## 1. Story Overview
- **ID**: MIS-34
- **Title**: Implement Products Management View with Search, Pagination, and Add Modal
- **Type**: Feature
- **Priority**: High
- **Story Points**: 5
- **Parent Epic**: Master Data Management Suite

## 2. User Story
As an **admin user**, I want to **view, search, filter, and add new products via a modal form**, so that I can **manage the product catalog efficiently without leaving the application**.

## 3. Acceptance Criteria
- [ ] **AC1**: The `/products` route renders the `Products` component inside the main `App` layout (with `Sidebar`).
- [ ] **AC2**: A table displays product columns: `SKU/ID`, `Name`, `Category`, `Price`.
- [ ] **AC3**: Client-side search filters across `id`, `sku`, `name`, `category`, and `price` (case-insensitive).
- [ ] **AC4**: Pagination controls (`Previous`/`Next`) respect a default `PAGE_SIZE` of 10. Current page resets to 1 on search change.
- [ ] **AC5**: An "Add Product" button triggers a modal dialog.
- [ ] **AC6**: Modal form requires `SKU`, `Name`, `Category` (dropdown), and `Price`.
- [ ] **AC7**: Submitting the form appends the new product to local state and displays a success toast via `react-toastify`.
- [ ] **AC8**: Modal can be closed via a "Cancel" button; form resets on open.
- [ ] **AC9**: No products found message displays when search yields empty results.

## 4. Technical Implementation Plan

### 4.1 Routing & Layout
- **File**: `src/App.js`
- Add protected route:
  ```jsx
  <Route path="/products" element={<Products />} />
  ```
- Ensure `Sidebar` includes a navigation link to `/products`. If `Sidebar.js` already contains a link, verify `active` class logic includes `/products`.

### 4.2 Component: `Products.js`
- **File**: `src/Products.js` (Create/Update based on existing snippet)
- **State**:
  - `searchTerm`: string
  - `currentPage`: number
  - `products`: array (initialized from mock data)
  - `isModalOpen`: boolean
  - `form`: object `{ sku: '', name: '', category: '', price: '' }`
- **Logic**:
  - `filteredProducts` via `useMemo`: concatenates string representations of fields, checks `.includes(searchTerm.toLowerCase())`.
  - `handleSave(e)`: validates required fields (HTML5 `required`), calculates `nextId`, converts `price` to `Number`, updates state, closes modal, calls `toast.success()`.
  - `handleFormChange(field)`: generic input change handler.
- **Pagination Math**:
  - `totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)`
  - `start = (currentPage - 1) * PAGE_SIZE`
  - `paginatedProducts = filteredProducts.slice(start, start + PAGE_SIZE)`
  - Reset `currentPage` to 1 when `searchTerm` changes via `useEffect`.

### 4.3 Styling (`src/App.css`)
- Append BEM-ish class definitions to `src/App.css`. Reuse existing `.login-input` and `.login-submit-btn` for form consistency.
  ```css
  .products-container { padding: 20px; }
  .products-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .products-title { margin: 0; }
  .products-add-btn { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
  .products-table-wrapper { overflow-x: auto; }
  .products-table { width: 100%; border-collapse: collapse; }
  .products-table-th, .products-table-td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
  .products-pagination { display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 16px; }
  .products-page-btn { padding: 6px 12px; cursor: pointer; }
  .products-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .products-page-info { font-weight: bold; }
  .products-no-results { text-align: center; color: #666; margin-top: 20px; }

  /* Modal Overrides */
  .product-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .product-modal { background: white; padding: 24px; border-radius: 8px; width: 400px; max-width: 90%; }
  .product-modal-title { margin-top: 0; }
  .product-modal-form .form-group { margin-bottom: 12px; }
  .product-modal-form label { display: block; margin-bottom: 4px; font-weight: 500; }
  .product-modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
  .product-modal-cancel-btn { padding: 8px 16px; border: 1px solid #ccc; background: #f8f9fa; border-radius: 4px; cursor: pointer; }
  .product-modal-save-btn { padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
  ```

### 4.4 Mock Data
- **File**: `src/productsMock.js`
- Export array of ~20 products to exercise pagination.
  ```js
  export const mockProducts = [
    { id: 1, sku: "SKU-001", name: "Wireless Mouse", category: "Accessories", price: 29.99 },
    { id: 2, sku: "SKU-002", name: "USB-C Hub", category: "Accessories", price: 49.99 },
    // ... add more to reach ~20+ items
  ];
  ```

## 5. Testing Strategy
- **File**: `src/Products.test.js`
- **Framework**: Jest + React Testing Library (via `react-scripts test`)
- **Tests**:
  1. `renders without crashing` (wrapped in `MemoryRouter`)
  2. `displays all initial products in table`
  3. `filters products based on search input`
  4. `opens modal when Add Product button is clicked`
  5. `closes modal and resets form on Cancel click`
  6. `adds new product to list and shows success toast on Save`
  7. `paginates correctly when results exceed PAGE_SIZE`

## 6. Constraints & Rules
- **Stack**: React 18, Create React App, Plain CSS, `react-router-dom` v6, `react-toastify`.
- **Styling**: All styles in `src/App.css`. No new CSS files. BEM-ish naming.
- **State**: Local `useState` only. No Context/Redux.
- **Validation**: HTML5 `required` attributes on form inputs. Inline regex not required for products, but strict type validation for `price` (`Number()` conversion).
- **No Server**: All operations are local state updates.
- **Testing**: `npm test -- --watchAll=false` for CI verification.

## 7. Files to Modify/Create
| File | Action | Notes |
|---|---|---|
| `src/Products.js` | Create/Update | Core component logic & UI |
| `src/Products.test.js` | Create | 7 smoke & interaction tests |
| `src/App.js` | Modify | Add `/products` route inside auth guard |
| `src/Sidebar.js` | Modify | Add "Products" nav link if missing |
| `src/App.css` | Modify | Append product-specific styles |
| `src/productsMock.js` | Create | Export `mockProducts` array |
| `src/index.js` / `src/App.js` | Verify | Ensure `<ToastContainer />` is mounted globally |

## 8. Risks & Assumptions
- **Assumption**: `ToastContainer` from `react-toastify` is already mounted in `App.js` or `index.js`. If not, add it outside `<Routes>` to ensure toast visibility across all pages.
- **Assumption**: `react-toastify` is listed in `package.json`. If missing, add `npm install react-toastify`.
- **Risk**: Existing `Sidebar` may not have the `/products` route configured. Verification and patching required during implementation.
- **Risk**: CSS class collisions with existing `.products-*` or `.modal-*` classes. Namespaceing under `.product-` prefix avoids conflicts.

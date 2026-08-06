# MIS-34: Implementation Plan

## 1. Objective
Implement the Products Management View, enabling admin users to view, search, filter, paginate, and add new products via a modal form. All operations will be handled via local React state without server communication.

## 2. Files to Touch
- `src/productsMock.js` (Modify)
- `src/Sidebar.js` (Modify)
- `src/Products.js` (Modify)
- `src/App.css` (Modify)
- `src/App.js` (Modify)
- `src/Products.test.js` (Create)

## 3. Context Budget
- **Target Scope**: Strictly the 6 files listed above.
- **Read Scope**: Only target files. Mirror DOM structure and test patterns from `src/Customers.js` and `src/Masters.test.js` where the spec references existing conventions (e.g., pagination layout, toast mocking), but rely exclusively on the exact CSS classes and logic provided in the MIS-34 spec to avoid drift.
- **Ignored Scope**: CI/CD pipelines, Dockerfiles, backend services, routing configs outside `src/App.js`, and unrelated components (Login, FAQ, etc.).

## 4. Implementation Steps

### Step 1: Update Mock Data (`src/productsMock.js`)
- Ensure `mockProducts` is exported correctly to match the existing file signature.
- Populate the array with at least 25 product objects to exercise pagination.
- Each object must contain: `id` (number), `sku` (string), `name` (string), `category` (string), `price` (number).
- *Convention*: Follow the exact shape shown in Section 4.4 of the spec.

### Step 2: Update Sidebar Navigation (`src/Sidebar.js`)
- Add a navigation link (`<Link to="/products">`) for the Products route.
- Ensure the active route highlighting logic (if present) includes `/products` in its comparison set.
- *Convention*: Mirror the exact `<Link>` structure and active-class logic used for `/customers` or `/masters`.

### Step 3: Implement `Products` Component (`src/Products.js`)
- **Imports**: `useState`, `useMemo`, `useEffect` from React. Import `Sidebar`, `mockProducts`, and `toast` from `react-toastify`.
- **State Setup**:
  - `searchTerm: ""`
  - `currentPage: 1`
  - `products: mockProducts`
  - `isModalOpen: false`
  - `form: { sku: '', name: '', category: '', price: '' }`
- **Filtering Logic**:
  - Use `useMemo` to create `filteredProducts`.
  - Concatenate string representations of `id`, `sku`, `name`, `category`, `price`.
  - Check `.includes(searchTerm.toLowerCase())`.
- **Pagination Logic**:
  - Define `PAGE_SIZE = 10`.
  - Calculate `totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)`.
  - Calculate `start = (currentPage - 1) * PAGE_SIZE`.
  - Slice `paginatedProducts = filteredProducts.slice(start, start + PAGE_SIZE)`.
  - Use `useEffect` to reset `currentPage` to `1` whenever `searchTerm` changes.
- **Form Handling**:
  - `handleOpenModal`: Reset `form` to empty state, set `isModalOpen(true)`.
  - `handleCloseModal`: Set `isModalOpen(false)`.
  - `handleFormChange(field)`: Generic handler to update `form` state: `setForm((prev) => ({ ...prev, [field]: e.target.value }))`.
  - `handleSave(e)`: Prevent default. HTML5 `required` attributes handle basic validation. Calculate `nextId` (max existing ID + 1). Convert `price` to `Number` via `Number(e.target.value)`. Append new product to `products` state. Close modal. Trigger `toast.success("Product added successfully")`.
- **UI Structure**:
  - Root wrapper: `<div className="App App--sidebar">` containing `<Sidebar />`.
  - Container: `<div className="products-container">`.
  - Header: `<div className="products-header">` with `<h2 className="products-title">Products</h2>` and `<button className="products-add-btn">Add Product</button>`.
  - Search & Table: Use `.products-table-wrapper` and `.products-table` as defined in the spec. Reuse `.login-input` for the search field.
  - Pagination: Use `.products-pagination`, `.products-page-btn`, `.products-page-info` as defined in the spec.
  - Modal: Overlay `.product-modal-overlay` with inner `.product-modal`. Form inside `.product-modal-form`. Inputs use `.login-input`. Buttons use `.product-modal-cancel-btn` and `.product-modal-save-btn`.

### Step 4: Add Component Styles (`src/App.css`)
- Append the exact CSS block provided in Section 4.3 of the spec to the end of `src/App.css`.
- Verify no conflicting classes exist. The spec explicitly namespaces modal/product styles under `.product-*` to avoid collisions with `.customers-*` or `.orders-*`.

### Step 5: Wire Routing (`src/App.js`)
- Locate the protected route block (or main `<Routes>` block).
- Insert: `<Route path="/products" element={<Products />} />`.
- Verify `ToastContainer` from `react-toastify` is rendered globally (e.g., in `App.js` or `index.js`). If missing, add it outside `<Routes>` but inside the root layout to ensure toast visibility across all pages.

### Step 6: Write Component Tests (`src/Products.test.js`)
- Follow the exact structure, mocking patterns, and test names of `Masters.test.js` and `Customers.test.js`.
- Mock `react-toastify` at the top: `jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }))`.
- Implement the 7 required tests exactly as specified in Section 5:
  1. `renders without crashing` (wrapped in `MemoryRouter`)
  2. `displays all initial products in table` (verify first `PAGE_SIZE` items render)
  3. `filters products based on search input`
  4. `opens modal when Add Product button is clicked`
  5. `closes modal and resets form on Cancel click`
  6. `adds new product to list and shows success toast on Save`
  7. `paginates correctly when results exceed PAGE_SIZE`

## 5. Risks & Constraints
- **CSS Class Collisions**: The spec introduces `.products-*` and `.product-modal-*` namespaces. Ensure these are appended cleanly to `App.css` without breaking existing `.customers-*` or `.orders-*` styles.
- **State Persistence**: The spec explicitly forbids server persistence. All data mutations remain in local `useState`.
- **Form Validation**: Rely strictly on HTML5 `required` attributes and `type="number"` for price, as requested in Section 6. No custom regex validation is required for products.
- **Dropdown Options**: The spec requires a `Category` dropdown but does not provide the options list. Default to extracting unique categories from `mockProducts` or hardcoding a sensible set (e.g., `["Accessories", "Electronics", "Furniture"]`).

{"clarification": {"needed": true, "questions": [{"id": "q1", "question": "The prompt header states 'Title: Integrate get all users API' and provides a `dummyjson.com/users` endpoint description, but the inlined spec (labeled 'source of truth') describes a 'Products Management View'. Which scope should the implementation follow?", "whyItMatters": "Building the Users API integration requires fetching remote data, parsing a deeply nested user schema, and mapping it to a table. Building the Products Management View requires local CRUD state, a specific modal form with SKU/Name/Category/Price fields, and product-specific mocks. The two are mutually exclusive in this context.", "impactIfWrong": "The implementer will write code for the wrong feature, resulting in 100% rework and a complete mismatch with the provided spec.", "options": [{"key": "opt_spec", "label": "Follow the inlined 'Products Management View' spec", "consequence": "Implementation focuses on local state, mock products, modal form, and pagination as detailed in Section 4."}, {"key": "opt_header", "label": "Follow the header 'Integrate get all users API'", "consequence": "Implementation must fetch `https://dummyjson.com/users`, parse the nested user object, map it to a table, and likely replace the products view entirely."}], "default": "opt_spec", "allowFreeText": false, "blocking": true}], "assumptions": [{"statement": "If the header title is ignored, the implementation will strictly follow the inlined spec for 'Products Management View', including the exact CSS classes, component structure, and local state patterns provided.", "risk": "low"}]}}

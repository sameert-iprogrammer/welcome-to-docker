# Implementation Plan: DS-12 — Add Product Button & Modal

## Source

- `docs/ai/stories/DS-12/spec.md` (primary)
- `src/Customers.js` — reference modal pattern
- `src/Products.js` — target modification
- `src/productsMock.js` — mock data definitions
- `src/App.css` (lines 641–724) — existing modal CSS to replicate
- `src/Customers.test.js` — test pattern to follow

## Target Files

| Action | File |
|--------|------|
| **Modify** | `src/Products.js` |
| **Modify** | `src/App.css` |
| **Create** | `src/Products.test.js` |

## Steps

### 1. Update `src/Products.js` — mutable state & modal plumbing

- Add `import { toast } from "react-toastify";` (same import as Customers.js)
- Convert `mockProducts` from direct reference to `useState(mockProducts)` initializer:
  - Remove `const products = mockProducts` (currently used implicitly via `filteredProducts`)
  - Add `const [products, setProducts] = useState(mockProducts);`
- Add modal state: `const [isModalOpen, setIsModalOpen] = useState(false);` and `const [form, setForm] = useState(emptyForm);`
- Define `emptyForm` outside component: `const emptyForm = { sku: "", name: "", category: "", price: "" };`
- Add handlers:
  - `handleOpenModal`: `setForm(emptyForm); setIsModalOpen(true);`
  - `handleCloseModal`: `setIsModalOpen(false);`
  - `handleFormChange`: curried `(field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))`
  - `handleSave`: `e.preventDefault()`, compute `nextId = Math.max(...products.map(p => p.id)) + 1`, build new product object with `id, ...form, price: Number(form.price)`, call `setProducts(prev => [...prev, newProduct])`, close modal, `toast.success("Product added successfully")`
- Update `filteredProducts` useMemo dependency: change `[searchTerm]` → `[searchTerm, products]`
- Update `filteredProducts` body: replace `mockProducts` references with `products`

### 2. Update `src/Products.js` — header & button

- Wrap `<h2 className="customers-title">Products</h2>` in `<div className="customers-header">`
- Inside that div, after the `<h2>`, add:
  ```jsx
  <button type="button" className="customers-add-btn" onClick={handleOpenModal} aria-label="Add product">
    Add Product
  </button>
  ```

### 3. Update `src/Products.js` — modal JSX

- After the pagination block (closing `</div>` of `customers-pagination`), add the modal JSX:
  ```jsx
  {isModalOpen && (
    <div className="product-modal-overlay" role="dialog" aria-modal="true" aria-label="Add Product">
      <div className="product-modal">
        <h3 className="product-modal-title">Add Product</h3>
        <form className="product-modal-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="product-sku">SKU</label>
            <input id="product-sku" type="text" className="login-input" value={form.sku} onChange={handleFormChange("sku")} aria-label="SKU" required />
          </div>
          <div className="form-group">
            <label htmlFor="product-name">Name</label>
            <input id="product-name" type="text" className="login-input" value={form.name} onChange={handleFormChange("name")} aria-label="Name" required />
          </div>
          <div className="form-group">
            <label htmlFor="product-category">Category</label>
            <select id="product-category" className="login-input" value={form.category} onChange={handleFormChange("category")} aria-label="Category" required>
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Office">Office</option>
              <option value="Furniture">Furniture</option>
              <option value="Storage">Storage</option>
              <option value="Wearables">Wearables</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="product-price">Price</label>
            <input id="product-price" type="number" step="0.01" min="0" className="login-input" value={form.price} onChange={handleFormChange("price")} aria-label="Price" required />
          </div>
          <div className="product-modal-actions">
            <button type="button" className="product-modal-cancel-btn" onClick={handleCloseModal} aria-label="Cancel add product">Cancel</button>
            <button type="submit" className="login-submit-btn product-modal-save-btn" aria-label="Save product">Save</button>
          </div>
        </form>
      </div>
    </div>
  )}
  ```

### 4. Update `src/App.css` — add `.product-modal-*` classes

- After the `.customer-modal-cancel-btn:hover` block (end of customer modal section), append new `.product-modal-*` classes by copying and renaming from `.customer-modal-*`:
  - `.product-modal-overlay` ← copy of `.customer-modal-overlay`
  - `.product-modal` ← copy of `.customer-modal`
  - `.product-modal-title` ← copy of `.customer-modal-title`
  - `.product-modal-form` ← copy of `.customer-modal-form`
  - `.product-modal-actions` ← copy of `.customer-modal-actions`
  - `.product-modal-save-btn` ← copy of `.customer-modal-save-btn`
  - `.product-modal-cancel-btn` ← copy of `.customer-modal-cancel-btn`
- Content is identical to customer-modal equivalents (same colors, sizing, spacing).

### 5. Create `src/Products.test.js`

- Pattern: mirror `src/Customers.test.js` — use `@testing-library/react`, mock `react-toastify`
- Tests:
  - Renders without crashing
  - Renders product rows in table (first 10 on page 1)
  - Filters rows by search term (case-insensitive, across id/sku/name/category/price)
  - Shows "No products found" on empty search
  - Pagination controls render and work (10 per page, 20 products = 2 pages)
  - Search resets pagination to page 1
  - Renders "Add Product" button
  - Opens modal with empty form fields on button click
  - Cancel closes modal without saving (no toast call)
  - Saves new product: fills form, submits, verifies modal closes, toast fires, row appears in search
- Use same mocking patterns: `jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }))`
- Run: `npm test -- --watchAll=false src/Products.test.js`

## Data/API Notes

- **Mock data** (`src/productsMock.js`): `{ id, sku, name, price, category }`
- **Price**: stored as string in form, parsed to `Number()` on save (matching existing pattern)
- **ID generation**: `Math.max(...products.map(p => p.id)) + 1` (same as Customers)
- **Categories**: Electronics, Accessories, Office, Furniture, Storage, Wearables
- **No persistence**: products reset on page refresh (same as Customers)

## UI Notes

- **"Add Product" button**: reuses `.customers-add-btn` and `.customers-header` wrapper classes (no new CSS needed for button)
- **Modal**: dedicated `.product-modal-*` CSS classes (copied from `.customer-modal-*`)
- **Form field order**: SKU (text) → Name (text) → Category (select) → Price (number)
- **Modal title**: "Add Product"
- **Toast message**: "Product added successfully"

## Tests

- New file: `src/Products.test.js`
- Requirements: smoke test, search, pagination, modal open/close, save flow
- Follow Customers.test.js structure (MemoryRouter wrapper, mock toast, `getByLabelText`/`getByText`/`queryByText` patterns)
- Verify existing search & pagination unaffected

## Risks

- **Mutable state conversion**: `filteredProducts` must depend on `[searchTerm, products]` (not just `[searchTerm]`), otherwise new products won't appear in filtered results. The useMemo body must reference `products` state, not the `mockProducts` import.
- **CSS duplication**: `.product-modal-*` and `.customer-modal-*` classes are identical — any future styling change must be made in both places (acceptable trade-off per spec).
- **Test obfuscation**: `Customers.test.js` uses mapped identifiers (`α1=toBeInTheDocument`, etc.) — the test source file on disk may use standard names. Write `Products.test.js` with standard names (not mapped).

## Context Budget

- **Read only**: `src/Products.js`, `src/App.css`, `src/productsMock.js`, `src/Customers.js`, `src/Customers.test.js`, `src/App.js`
- **Do NOT read**: any other page component (Orders, Settings, Profile, Dashboard), any other mock file, any config files beyond package.json (only if needed to verify `react-toastify` dependency)
- **Do NOT modify**: any file outside the 3 target files listed above

## Handoff

Implementation steps in order:
1. Edit `src/Products.js`: add imports (`toast`, `useState`), convert mockProducts to useState, add modal state/handlers, add header wrapper + button, add modal JSX
2. Edit `src/App.css`: append `.product-modal-*` classes at end of file
3. Create `src/Products.test.js`: mirror Customers.test.js for add-product modal flow
4. Run `npm test -- --watchAll=false src/Products.test.js` to verify

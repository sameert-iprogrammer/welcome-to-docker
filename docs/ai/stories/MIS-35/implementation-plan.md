# MIS-35: Add Product API - Implementation Plan

## Resolved Decisions
- **Error Toast Message**: On network failure or non-2xx response, a generic, sanitized error toast ("Failed to add product. Please try again.") will be displayed, regardless of the raw API error body.

## Open Questions & Assumptions
1. **DummyJSON Response Shape**: The DummyJSON API may return fields that differ slightly from our internal `mockProducts` shape (e.g., missing `sku` or returning additional fields like `createdAt`). 
   - *Assumption*: We will merge the API response with the form fields, ensuring `name` (mapped from `title`) and `id` are explicitly set. Any extra fields from the API will be passed through to the local state, which is harmless for rendering.
2. **Toast Import**: The provided code snippet for `src/Products.js` starts at line 10, so it is unclear if `react-toastify` is already imported.
   - *Assumption*: If `import { toast } from "react-toastify";` is missing at the top of `src/Products.js`, it must be added to support `toast.success()` and `toast.error()`.

## Files to Touch
- `src/Products.js` (Modify)
- `src/Products.test.js` (Modify)

## Implementation Steps

### Step 1: Update `src/Products.js` (API Integration & Loading State)
1. **Verify Imports**: Ensure the top of `src/Products.js` contains `import { toast } from "react-toastify";`. If missing, add it.
2. **Add Loading State**: Introduce a new state variable to track the API request status:
   ```javascript
   const [isSaving, setIsSaving] = useState(false);
   ```
3. **Refactor `handleSave` to Async**:
   - Change `const handleSave = (e) => {` to `const handleSave = async (e) => {`.
   - Immediately set `setIsSaving(true);` after `e.preventDefault()`.
   - Wrap the fetch logic in a `try/catch/finally` block:
     - **Payload**: Construct the request body exactly as specified: `{ title: form.name, sku: form.sku, category: form.category, price: Number(form.price) }`.
     - **Fetch**: Call `POST https://dummyjson.com/products/add` with `Content-Type: application/json`.
     - **Success Path**:
       - Check `if (!res.ok) throw new Error("Failed");`.
       - Await `res.json()` to get `data`.
       - Normalize the response: `const newProduct = { ...data, name: data.title, id: data.id || (products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1) };`
       - Update local state: `setProducts((prev) => [...prev, newProduct]);`
       - Close modal: `setIsModalOpen(false);`
       - Show success toast: `toast.success("Product added successfully");`
     - **Error Path**:
       - Show generic error toast: `toast.error("Failed to add product. Please try again.");`
       - Leave modal open and form data intact (do not change `setIsModalOpen` or `setProducts`).
     - **Finally**:
       - `setIsSaving(false);`

### Step 2: Update Save Button UI
- Locate the "Save" button inside the `product-modal-form` (around line 170).
- Update it to reflect the loading state:
  ```jsx
  <button
    type="submit"
    className="login-submit-btn product-modal-save-btn"
    disabled={isSaving}
    aria-label="Save product"
  >
    {isSaving ? "Saving..." : "Save"}
  </button>
  ```

### Step 3: Update `src/Products.test.js` (Testing)
1. **Mock Fetch**: Use `jest.spyOn(global, 'fetch')` to mock the API call. Create a mock success response that returns a product object (including `id`, `title`, `price`, `category`).
2. **Test Success Path**:
   - Render `<Products />` inside `<MemoryRouter>`.
   - Open the modal ("Add product" button).
   - Fill in form fields (SKU, Name, Category, Price).
   - Click "Save".
   - Assert `fetch` was called with the correct URL, method, headers, and payload.
   - Assert `toast.success` was called with "Product added successfully".
   - Assert the modal is closed (query by `aria-label="Add Product"` should be null).
   - Assert the new product appears in the table (search for the entered name).
3. **Test Error Path**:
   - Mock `fetch` to resolve with `{ ok: false, status: 500 }`.
   - Fill form and click "Save".
   - Assert `toast.error` was called with "Failed to add product. Please try again.".
   - Assert the modal is still open (`queryByLabelText("Add Product")` is not null).
   - Assert local `products` state was not modified.
4. **Test Loading State**:
   - Mock `fetch` to return a pending promise (e.g., `new Promise(() => {})`).
   - Click "Save".
   - Assert the Save button has the `disabled` attribute.
   - Assert the button text is "Saving...".

## Context Budget
- **Scope**: Implementation is strictly limited to `src/Products.js` and `src/Products.test.js`.
- **Exclusions**: No modifications to `src/App.css` are required (the existing `.login-submit-btn` and `.product-modal-save-btn` classes handle styling; we only add the `disabled` attribute). Do not read or modify routing logic, auth guards, or other components.
- **Efficiency**: Only the specific `handleSave` function and the Save button JSX require reads/edits in `Products.js`. In `Products.test.js`, only append the new test cases to the existing `describe("Products")` block.

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "The DummyJSON API response may not include 'sku' or may return additional metadata fields. We will merge the API response with form fields, ensuring 'name' (mapped from 'title') and 'id' are explicitly set in the internal state.", "risk": "low"}, {"statement": "The 'react-toastify' import might be missing from the top of 'src/Products.js' since the provided snippet starts at line 10. The implementation will verify and add 'import { toast } from \"react-toastify\";' if absent.", "risk": "low"}]}}

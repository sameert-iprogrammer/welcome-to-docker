# MIS-30: Products API Implementation Plan

## Resolved Decisions
- **Remove mock data**: `mockProducts` import will be removed entirely, and the `src/productsMock.js` file will be deleted.
- **Disable Add Product**: The "Add Product" button will be visually disabled with a tooltip explaining the limitation, deferring the feature.
- **Update tests**: Existing `Products.test.js` tests will be updated to mock `window.fetch` and assert against a deterministic, locally-defined API response structure.

## Files to Touch
- `src/Products.js` (Modify) - Replace mock state with API fetch logic, add loading/error states, update search mapping, map table columns to API fields, and disable the Add Product button.
- `src/Products.test.js` (Modify) - Mock `window.fetch` and update assertions to reflect the new API data structure.
- `src/productsMock.js` (Delete) - Remove unused mock data source.

## Context Budget
This implementation is strictly scoped to the `src/Products` component files. No changes to `App.js`, `Sidebar.js`, or global styles are required. The `productsMock.js` file will be deleted.

## Implementation Phases

### Phase 1: API Integration and UI Adjustments
**Goal**: Replace local mock data with live API fetch, add loading/error states, map API fields to table columns, and disable the Add Product button.

**Acceptance Criteria**:
- [ ] Products page loads and displays products from the DummyJSON API
- [ ] Table columns show correct mapped data (SKU/ID, Name, Category, Price)
- [ ] At least 30 products are visible (API returns 30 per default request)
- [ ] Search filters products by name, SKU, category, description, brand, or tags
- [ ] Pagination controls work correctly with API data (10 per page)
- [ ] Page indicator shows correct totals (e.g., "Page 1 of 2")
- [ ] Search resets to page 1 when typed
- [ ] Loading state is shown during API fetch
- [ ] Error state is shown if API request fails
- [ ] "Add Product" button is present but indicates limitation (disabled or tooltip)

**Implementation Steps**:
1. **Remove mock data dependency**: Remove `import { mockProducts } from "./productsMock";` from `src/Products.js`.
2. **Update state initialization**:
   - Change `const [products, setProducts] = useState(mockProducts)` to `const [products, setProducts] = useState([])`.
   - Add `const [loading, setLoading] = useState(true)`.
   - Add `const [error, setError] = useState(null)`.
3. **Implement fetch logic**: Add a `useEffect` that calls the DummyJSON API on component mount:
   ```javascript
   useEffect(() => {
     const fetchProducts = async () => {
       try {
         setLoading(true);
         const res = await fetch("https://dummyjson.com/products");
         const data = await res.json();
         setProducts(data.products);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };
     fetchProducts();
   }, []);
   ```
4. **Expand search fields**: Update the `filteredProducts` `useMemo` to include `title`, `description`, `brand`, and `tags` alongside the existing `id`, `sku`, `category`, and `price` fields.
5. **Map table columns**: Update the `<tbody>` mapping to use the new API fields:
   - SKU/ID: `{product.sku} ({product.id})`
   - Name: `{product.title}`
   - Category: `{product.category}`
   - Price: `{formatPrice(product.price)}`
6. **Disable Add Product**: Add the `disabled` attribute and a descriptive `title` to the "Add Product" button:
   ```jsx
   <button
     type="button"
     className="customers-add-btn"
     disabled
     title="Add product feature is currently unavailable with live API data."
     onClick={handleOpenModal}
     aria-label="Add product"
   >
     Add Product
   </button>
   ```
7. **Render loading and error states**: Early-return loading and error messages if `loading` or `error` states are active:
   ```jsx
   if (loading) return <div className="loading-message">Loading products...</div>;
   if (error) return <div className="error-message">Failed to load products: {error}</div>;
   ```

**Test Strategy**:
- No test changes in this phase. The component will now rely on a live external API, which is expected to function correctly in a browser environment.

### Phase 2: Test Updates
**Goal**: Update `Products.test.js` to mock `fetch` and assert against deterministic API response data.

**Acceptance Criteria**:
- [ ] Existing tests pass (verify search and pagination tests with new data structure)
- [ ] No console errors or warnings

**Implementation Steps**:
1. **Mock `window.fetch`**: In `src/Products.test.js`, define a deterministic mock API response object containing 3 products with distinct names and categories. Assign `global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(mockApiData) })` in `beforeEach`.
2. **Update search assertions**: Change search assertions to look for the deterministic mock product names (e.g., searching for "A" should find "Test Product A", searching for "furniture" should find "Test Product B").
3. **Update pagination assertions**: Adjust pagination checks to account for the new product count (3 products will fit on a single page with `PAGE_SIZE = 10`, resulting in "Page 1 of 1").
4. **Verify disabled button**: Assert that the "Add product" button is disabled and contains the expected tooltip text.

**Dependencies**: Phase 1.

## Assumptions
- `PAGE_SIZE` is a constant defined at the top of `src/Products.js` (likely `10`). If it is imported or missing, the implementer will add it locally.
- Navigating pages via "Next" and "Previous" buttons does not clear the search input text; only typing in the search input resets the page to 1, preserving existing user experience.
- `global.fetch` is available and can be mocked in the Jest test environment used by `react-scripts`.

{"phases": [{"id": "phase-1", "title": "API Integration and UI Adjustments", "goal": "Replace local mock data with live API fetch, add loading/error states, map API fields to table columns, and disable the Add Product button.", "files": ["src/Products.js"], "acceptanceCriteria": ["Products page loads and displays products from the DummyJSON API", "Table columns show correct mapped data (SKU/ID, Name, Category, Price)", "At least 30 products are visible (API returns 30 per default request)", "Search filters products by name, SKU, category, description, brand, or tags", "Pagination controls work correctly with API data (10 per page)", "Page indicator shows correct totals (e.g., \"Page 1 of 2\")", "Search resets to page 1 when typed", "Loading state is shown during API fetch", "Error state is shown if API request fails", "\"Add Product\" button is present but indicates limitation (disabled or tooltip)"], "testStrategy": "No test changes in this phase. The component will now rely on a live external API, which is expected to function correctly in a browser environment.", "dependsOn": [], "estimatedComplexity": "medium"}, {"id": "phase-2", "title": "Test Updates", "goal": "Update Products.test.js to mock fetch and assert against deterministic API response data.", "files": ["src/Products.test.js"], "acceptanceCriteria": ["Existing tests pass (verify search and pagination tests with new data structure)", "No console errors or warnings"], "testStrategy": "Mock window.fetch in beforeEach to return a deterministic set of 3 products. Update assertions to check for deterministic product names, verify pagination totals match the new count (1 page), and assert the Add Product button is disabled.", "dependsOn": ["phase-1"], "estimatedComplexity": "low"}]}

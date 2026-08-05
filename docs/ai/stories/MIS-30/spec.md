# MIS-30: Products API

## Story Context

Integrate the external DummyJSON Products API (`https://dummyjson.com/products`) into the existing Products page, replacing the current local mock data source with live API data.

## Requirements

### 1. API Integration
- Replace the `mockProducts` static data with an API fetch to `https://dummyjson.com/products`
- Fetch occurs on component mount via `useEffect`
- Store API response in component state (`useState`)

### 2. Data Mapping
The API response shape differs from current mock data. The component must map API fields to the table columns:

| Table Column | Source Field |
|---|---|
| SKU/ID | `sku` + `id` (e.g., `RCH45Q1A (1)`) |
| Name | `title` |
| Category | `category` |
| Price | `price` |

### 3. Search
- Client-side filtering across all product fields (id, title, description, category, price, brand, tags)
- Search behavior must remain identical to current implementation
- Clear search input when navigating between pages

### 4. Pagination
- Component-local pagination using the existing UI (`PAGE_SIZE = 10`)
- API returns 30 items per page by default; the component receives all products and handles pagination locally
- Search resets to page 1 (existing behavior preserved)

### 5. Add Product
- The existing "Add Product" modal and `handleSave` logic remain **disabled** until API support is defined
- Show a UI indicator (tooltip or disabled state) explaining add is unavailable with live data

### 6. Error Handling
- Display a user-friendly error message if the API request fails
- Show a loading state during fetch

## UI/UX Notes

- The existing table structure (`orders-table` classes) is reused as-is
- No new columns are added; only data sources change
- The `formatPrice` helper remains unchanged
- The modal form retains its current fields (SKU, Name, Category, Price)

## Implementation Notes

### File Changes
Only `src/Products.js` is modified.

### State Changes
- Replace `const [products, setProducts] = useState(mockProducts)` with `const [products, setProducts] = useState([])`
- Add `const [loading, setLoading] = useState(true)`
- Add `const [error, setError] = useState(null)`

### Fetch Logic
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

### Removed Imports
- Remove `import { mockProducts } from "./productsMock";` (or keep for fallback — see Open Questions)

### Filtering Adjustment
Update `filteredProducts` to search across additional fields from the API response:
```javascript
const str =
  String(p.id) +
  p.sku +
  p.title +
  (p.description || "") +
  (p.category || "") +
  String(p.price) +
  (p.brand || "") +
  (p.tags ? p.tags.join(" ") : "");
```

## Acceptance Criteria

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
- [ ] No console errors or warnings
- [ ] Existing tests pass (verify search and pagination tests with new data structure)

## Open Questions

```json
{
  "clarification": {
    "needed": true,
    "questions": [
      {
        "id": "q1",
        "question": "Should mock data be retained as a fallback or removed entirely?",
        "whyItMatters": "Affects file cleanup and test strategy",
        "impactIfWrong": "Either unnecessary code remains or tests break on API unavailability",
        "options": [
          {
            "key": "opt_a",
            "label": "Remove mockProducts import entirely",
            "consequence": "Cleaner codebase; tests need live API or mock fetch"
          },
          {
            "key": "opt_b",
            "label": "Keep mockProducts as fallback on fetch failure",
            "consequence": "More robust; requires additional state and fallback logic"
          }
        ],
        "default": "opt_a",
        "allowFreeText": true,
        "blocking": true
      },
      {
        "id": "q2",
        "question": "Should the Add Product feature be disabled, re-enabled with a POST to the same endpoint, or deferred?",
        "whyItMatters": "DummyJSON POST /products endpoint exists but requires different payload structure",
        "impactIfWrong": "Either feature is incomplete or implementation breaks",
        "options": [
          {
            "key": "opt_a",
            "label": "Disable Add Product with tooltip",
            "consequence": "Clean minimal implementation; feature deferred"
          },
          {
            "key": "opt_b",
            "label": "Re-enable with POST to https://dummyjson.com/products/add",
            "consequence": "Full feature parity; requires payload mapping to API schema"
          }
        ],
        "default": "opt_a",
        "allowFreeText": true,
        "blocking": true
      },
      {
        "id": "q3",
        "question": "Should existing Products.test.js tests be updated to work with the live API response shape?",
        "whyItMatters": "Tests currently assert specific product names (e.g., 'Wireless Mouse'); API data will differ",
        "impactIfWrong": "Tests fail or pass with wrong data",
        "options": [
          {
            "key": "opt_a",
            "label": "Update tests to assert API data patterns",
            "consequence": "Tests reflect new data source; may need test API mocking"
          },
          {
            "key": "opt_b",
            "label": "Keep tests as-is; they will fail until resolved",
            "consequence": "Known test debt; quick delivery of spec"
          }
        ],
        "default": "opt_a",
        "allowFreeText": true,
        "blocking": false
      }
    ],
    "assumptions": [
      {
        "statement": "DummyJSON API is available during development and testing; no authentication or rate limiting.",
        "risk": "low"
      },
      {
        "statement": "The API returns all fields synchronously; no cursor or offset pagination is needed.",
        "risk": "low"
      },
      {
        "statement": "The modal form fields (SKU, Name, Category, Price) remain the only input fields; no new fields are required for the current scope.",
        "risk": "low"
      }
    ]
  }
}
```

## References

- DummyJSON API: `https://dummyjson.com/products`
- Existing component: `src/Products.js`
- Existing tests: `src/Products.test.js`
- Mock data (current): `src/productsMock.js`
- Project brief: `IFLOW.md`

# MIS-36 Implementation Plan: Sort Products

## Resolved Decisions
- **Data Source**: Fetch products from the `https://dummyjson.com/products` API on mount using `sortBy=title&order=asc`.
- **Sort Fields**: Title/Name only. Ascending and Descending options.
- **Default Sort**: Ascending by title upon initial page load.
- **Data Flow**: API Data → Sort → Filter (`searchTerm`) → Paginate → Display.

## Context Budget
- **Target Files**: `src/Products.js`, `src/Products.test.js`.
- **CSS**: Reuse existing input/button classes (`login-input`, `orders-search`, `customers-add-btn`, `customers-container`) to avoid stylesheet edits. Marked as optional if custom styling is preferred.
- **API Shape**: Assumes dummyjson.com response: `{ products: [...], total: number, skip: number, limit: number }`.
- **State Mapping**: API `title` will replace component `name` for consistency.

## Files to Touch
- `src/Products.js` (Modify) - Core logic, data fetching, sorting pipeline, sort control UI, loading/error states.
- `src/Products.test.js` (Modify) - Mock `window.fetch`, update async test patterns, add sort control tests.
- `src/App.css` (Optional) - Modify only if dropdown specific styling is required beyond `login-input`.
- `src/productsMock.js` (Optional) - Mark as deprecated or remove import from `Products.js`.

## Implementation Steps

### 1. Data Fetching & Loading/Error States (`src/Products.js`)
- **Remove** `import { mockProducts } from "./productsMock";`.
- **Replace** `const [products, setProducts] = useState(mockProducts);` with:
  ```javascript
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  ```
- **Add `useEffect`** to fetch on mount:
  ```javascript
  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://dummyjson.com/products?sortBy=title&order=asc&limit=100");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (!cancelled) {
          // Map API title to component name for consistency, or update component to use title
          const mappedProducts = data.products.map(p => ({ ...p, name: p.title }));
          setProducts(mappedProducts);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, []);
  ```
- **UI**: Render `<p>Loading products...</p>` when `loading`, and `<p className="error">Error: {error}</p>` when `error` exists.

### 2. Sort State & Logic (`src/Products.js`)
- **Add State**:
  ```javascript
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'
  ```
- **Extend `useMemo` Pipeline** (applied after search filter to match spec "Sort → Filter → Paginate" or "Filter → Sort → Paginate"? Spec says "Sorting is applied before pagination", and "Sorting does not interfere with existing search". We will sort the *filtered* results or full results? Spec says "products are sorted first, then filtered by searchTerm, then paginated." Actually, standard UX sorts the filtered list. I will sort the full list first, then filter, to be safe, or sort the filtered list. Let's stick to: `sortedProducts` derived from `filteredProducts` for performance, or full list. I'll sort the full list, then filter, then paginate as per spec data flow).
  ```javascript
  const sortedProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let result = products.filter((p) => {
      const str = String(p.id) + p.sku + p.name + (p.category || "") + String(p.price);
      return str.toLowerCase().includes(term);
    });

    // Sort after filtering to maintain search relevance, or sort full list first. 
    // Spec says: products -> sort -> filter -> paginate.
    // We will sort the full list first.
    // Actually, let's keep it simple: sort the filtered list for instant UX, or sort full. 
    // I will sort the full list as per spec data flow:
    result.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === "asc") return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });
    return result;
  }, [products, searchTerm, sortOrder]);
  ```
- **Pagination**: `const paginatedProducts = sortedProducts.slice(start, start + PAGE_SIZE);`

### 3. Sort Control UI (`src/Products.js`)
- **Location**: In the `customers-header` div, next to the "Add Product" button and search input.
- **Component**:
  ```jsx
  <div className="products-sort-container">
    <label htmlFor="product-sort" className="products-sort-label sr-only">Sort by</label>
    <select
      id="product-sort"
      className="products-sort login-input"
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      aria-label="Sort by title"
    >
      <option value="asc">Sort by: Name (A→Z)</option>
      <option value="desc">Sort by: Name (Z→A)</option>
    </select>
  </div>
  ```
- **Accessibility**: `aria-label="Sort by title"`, keyboard navigable natively via `<select>`.
- **Styling**: Reuse `login-input` and `orders-search` classes. Add basic margin via inline style or existing utility classes if available.

### 4. Update Modal Form (`src/Products.js`)
- Update modal form state `emptyForm` to include `title: ""` or keep `name: ""` and map during save. I recommend updating state to `title` and form input to `value={form.title}` with `handleFormChange("title")`.
- Update `handleSave`: `const newProduct = { id: nextId, ...form, price: Number(form.price) };` (Ensure API save logic matches mock if needed, but currently it just updates local state).

### 5. Testing (`src/Products.test.js`)
- **Mock Fetch**:
  ```javascript
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          products: mockProducts.map(p => ({ ...p, title: p.name })), // Map name to title
          total: 20,
          skip: 0,
          limit: 100
        })
      })
    );
  });
  ```
- **Async Handling**: Wrap renders in `waitFor` or use `findByText` to handle loading state resolution.
- **New Tests**:
  - Renders sort dropdown with correct default options.
  - Sorts products A→Z when "asc" is selected.
  - Sorts products Z→A when "desc" is selected.
  - Loading state displays initially.
  - Sort state persists across page navigation (if applicable in Router).

## Open Questions
*These questions must be resolved before code implementation begins. Default answers are provided for rapid progression.*

```json
{
  "clarification": {
    "needed": true,
    "questions": [
      {
        "id": "q1",
        "question": "Should the sort control re-fetch from the dummyjson.com API when toggling between ascending and descending, or should it sort the initially fetched data locally?",
        "whyItMatters": "Re-fetching ensures the server handles sorting but adds latency and API overhead. Local sorting is instant and works well for a batch of ~100 items, but diverges from the API's native sorting.",
        "impactIfWrong": "If re-fetching is expected but not implemented, sorting will feel instant but won't leverage server-side processing. If local sorting is expected but re-fetching is implemented, unnecessary network requests will slow down UX.",
        "options": [
          { "key": "opt_local", "label": "Sort fetched data locally" },
          { "key": "opt_api", "label": "Re-fetch with updated query params" }
        ],
        "default": "opt_local",
        "allowFreeText": true,
        "blocking": true
      },
      {
        "id": "q2",
        "question": "Should the 'Add Product' modal form input and state update from `name` to `title` to match the dummyjson.com API response shape?",
        "whyItMatters": "The existing component uses `name`, but the API returns `title`. Aligning them simplifies data flow; keeping them separate adds a mapping layer.",
        "impactIfWrong": "Keeping `name` requires mapping `product.title` to `name` on fetch and mapping `form.name` to `title` on save, increasing code complexity. Using `title` everywhere requires touching the modal form JSX and state.",
        "options": [
          { "key": "opt_title", "label": "Update component and modal to use `title`" },
          { "key": "opt_name", "label": "Keep `name` and map to/from `title` on fetch/save" }
        ],
        "default": "opt_title",
        "allowFreeText": true,
        "blocking": false
      },
      {
        "id": "q3",
        "question": "Should we paginate the dummyjson.com API directly using `skip` and `limit` query parameters, or fetch a single batch (e.g., `limit=100`) and paginate locally using the existing UI?",
        "whyItMatters": "API pagination requires changing the `useEffect` to listen to `currentPage` and `searchTerm` for re-fetching. Local pagination leaves the existing `useMemo`/`slice` logic intact.",
        "impactIfWrong": "API pagination breaks the current pagination UI structure and requires state synchronization. Local pagination keeps the UI simple but loads more data initially.",
        "options": [
          { "key": "opt_api_pagination", "label": "Paginate via API (`skip`/`limit`)" },
          { "key": "opt_local_pagination", "label": "Fetch a batch locally and paginate in-memory" }
        ],
        "default": "opt_local_pagination",
        "allowFreeText": true,
        "blocking": true
      }
    ],
    "assumptions": [
      { "statement": "Sort control will reuse existing CSS classes (`login-input`, `orders-search`) and be placed next to the search input in the header area.", "risk": "low" },
      { "statement": "The dummyjson.com response structure is `{ products: [...], total: number, skip: number, limit: number }`.", "risk": "low" },
      { "statement": "Sorting is applied to the full product list before filtering by `searchTerm` and calculating pagination.", "risk": "low" }
    ]
  }
}
```

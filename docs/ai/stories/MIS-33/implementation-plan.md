# Implementation Plan: MIS-33 - Show view product page

## Resolved Decisions
The following decisions were pre-validated by the story analyzer and must be implemented exactly as stated:
1. **Data Source**: Fetch live data directly from `https://dummyjson.com/products/:id`.
2. **Image Display**: Display the `thumbnail` as the primary image, with any items from the `images` array rendered as a secondary list/strip below the thumbnail.
3. **Reviews Layout**: Calculate and display the average rating prominently at the top of the reviews section; list individual reviews below it, ordered chronologically (newest first or as provided).
4. **Availability Status**: Render the `availabilityStatus` string directly from the API without combining it with the numeric `stock` field.
5. **Pricing Display**: Show both the original price (strikethrough) and the discounted price (calculated as `price * (1 - discountPercentage / 100)`).

## Open Questions & Assumptions
1. **Navigation to Product Detail**: The plan assumes that clicking a product row or its name/ID in the existing `src/Products.js` table will navigate the user to `/products/:id`. The row will be wrapped in a `<Link>` from `react-router-dom` to trigger this transition. *(Risk: low)*
2. **Authentication Guard**: `ProductDetail` will be treated as a protected route within `src/App.js`, consistent with the existing dashboard and settings pages, checking for `isAuthenticated` in `localStorage`. *(Risk: low)*
3. **Loading & Error States**: The component will display a simple text loading message (e.g., "Loading product details...") during the fetch. On fetch failure or HTTP 4xx/5xx, it will render a user-friendly error message with a "Retry" button. *(Risk: low)*
4. **CSS Styling**: New CSS classes will follow the repository's BEM-ish naming convention in `src/App.css` (e.g., `.product-detail-container`, `.product-detail-header`, `.product-detail-section`, `.product-reviews-list`). Existing utility classes like `.login-input` will be avoided for display fields unless they provide perfect styling matches. *(Risk: low)*

## Context Budget
- **Target Files**: `src/ProductDetail.js`, `src/ProductDetail.test.js`, `src/Products.js`, `src/App.js`, `src/App.css`.
- **Scope Boundaries**: 
  - Do not modify `src/Login.js`, `src/Register.js`, or backend configuration files.
  - Do not introduce new npm dependencies; rely on `react-router-dom` (already installed) and standard `fetch`.
  - Reuse the exact `<div className="App App--sidebar"><Sidebar /></div>` layout wrapper seen in `src/Products.js` and `src/Customers.js` for `ProductDetail`.
  - Keep the implementation strictly read-only as per the spec.
  - Avoid reading or modifying files outside the target list to prevent scope creep.

## Files to Touch
- `src/ProductDetail.js` (Create) - Main component fetching and rendering product data.
- `src/ProductDetail.test.js` (Create) - Unit tests mocking `fetch` and verifying UI states.
- `src/App.js` (Modify) - Add `<Route path="/products/:id" element={<ProductDetail />} />` to the route configuration.
- `src/Products.js` (Modify) - Update product table rows to include a `<Link>` to `/products/:id`.
- `src/App.css` (Modify) - Add CSS rules for the new product detail layout, review section, and pricing display.

## Implementation Steps

### Step 1: Setup & Routing
1. In `src/App.js`, locate the `Routes` block.
2. Add a new route: `<Route path="/products/:id" element={<ProductDetail />} />`.
3. Ensure this route is placed appropriately relative to existing routes (e.g., before catch-all routes, if any exist).

### Step 2: Create `src/ProductDetail.js`
1. **Imports**: `React`, `useState`, `useEffect`, `useNavigate`, `useParams` from `react-router-dom`; `Sidebar` from `./Sidebar`.
2. **Component Structure**:
   ```jsx
   const ProductDetail = () => {
     const { id } = useParams();
     const navigate = useNavigate();
     const [product, setProduct] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     const fetchProduct = () => {
       setLoading(true);
       setError(null);
       fetch(`https://dummyjson.com/products/${id}`)
         .then(res => {
           if (!res.ok) throw new Error(`Product not found (HTTP ${res.status})`);
           return res.json();
         })
         .then(data => {
           setProduct(data);
           setLoading(false);
         })
         .catch(err => {
           setError(err.message);
           setLoading(false);
         });
     };

     useEffect(() => {
       fetchProduct();
     }, [id]);
     
     // ... render logic
   }
   ```
3. **Layout Wrapper**: Strictly return:
   ```jsx
   <div className="App App--sidebar">
     <Sidebar />
     <div className="product-detail-container">
       {/* Content */}
     </div>
   </div>
   ```
4. **Data Fetching**: Use `useEffect` with the `id` dependency. Include a check for `loading` and `error` states. Provide a "Back to Products" button that calls `navigate('/products')`.

### Step 3: Implement UI Rendering
1. **Header Section**: Display product `title` prominently. Show the calculated average rating and a brief `availabilityStatus` badge.
2. **Pricing**: Calculate `discountedPrice = product.price * (1 - product.discountPercentage / 100)`. Render original price with `<s>` or CSS `text-decoration: line-through`, followed by the `discountedPrice`. Format using a local helper `const formatPrice = (p) => '$' + Number(p).toFixed(2);` (mirroring `src/Products.js`).
3. **Image Section**: 
   - Render `<img src={product.thumbnail} alt={product.title} className="product-detail-thumbnail" />`.
   - If `product.images` exists and has length, render them in a horizontal strip or grid below the main thumbnail using `<img>` tags with the same `alt` text.
4. **Detailed Information Section**: Create sections for Basic Info (SKU, Brand, Category, Stock) and Detailed Info (Dimensions, Weight, Warranty, Shipping, Return Policy, Min Order Qty). Use `label: value` pairs styled cleanly without input elements (e.g., `<dt>` and `<dd>` or styled `<div>` pairs).
5. **Reviews Section**:
   - Calculate average rating: `product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length`.
   - Display average prominently.
   - Map over `product.reviews`, displaying `reviewerName`, `rating`, `date`, and `comment` inside a list (`<ul>` or `<div>` list).

### Step 4: Styling (`src/App.css`)
1. Add `.product-detail-container` to handle padding/margins, mirroring `.customers-container`.
2. Add `.product-detail-header`, `.product-info-grid`, `.product-reviews-section` for clear sectioning.
3. Style `.product-price-original` with `line-through` and `.product-price-discounted` with a distinct color (e.g., dark red or green).
4. Ensure the layout is responsive (CSS flex/grid for the info grid and image strip).

### Step 5: Update `src/Products.js`
1. Import `Link` from `react-router-dom`.
2. Inside the table row (`<tr>`), wrap the product name or SKU/ID cell in a `<Link to={`/products/${product.id}`}>` to make it clickable and navigable.

### Step 6: Testing (`src/ProductDetail.test.js`)
1. Mock `fetch` globally or inline:
   ```javascript
   global.fetch = jest.fn();
   ```
2. **Test 1: Renders without crashing**: Render `<ProductDetail />` inside `<MemoryRouter>`.
3. **Test 2: Fetches and displays data**: Mock `fetch` to return a resolved Promise with dummy product data. Assert that the title, price, and SKU are in the document.
4. **Test 3: Handles loading state**: Mock `fetch` to return a pending Promise. Assert that the loading text is present.
5. **Test 4: Handles error state**: Mock `fetch` to reject. Assert that the error message is displayed and a retry mechanism (or just the message) is visible.
6. **Test 5: Renders reviews and calculated average**: Ensure the reviews list renders correctly and the average rating matches the mocked data.

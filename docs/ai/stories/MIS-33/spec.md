# Story: MIS-33 - Show view product page

## Description
Implement a read-only product detail view page that fetches and renders comprehensive product information using the `https://dummyjson.com/products/:id` API endpoint. The page should integrate into the existing application layout and provide a clear, structured presentation of product attributes, pricing, inventory status, reviews, and metadata.

## Acceptance Criteria
1. **Route & Navigation**: The page is accessible via a dedicated route (e.g., `/products/:id`). A "Back to Products" button navigates to the main Products list.
2. **Data Fetching**: On mount, the component fetches product data using the ID from the URL route. It handles loading and error states gracefully.
3. **Basic Information Display**: Renders product title, SKU, Brand, Category, Price, Rating, and Stock availability.
4. **Detailed Information Display**: Renders description, dimensions (width/height/depth), weight, warranty information, shipping information, return policy, and minimum order quantity.
5. **Image Display**: Displays the product thumbnail. If an `images` array is present, renders them as a gallery/strip below the thumbnail.
6. **Reviews Section**: Displays the average rating (calculated from reviews if not provided, or fetched if available) and lists individual reviews with rating, comment, reviewer name, and date.
7. **Layout Consistency**: Wraps content in the existing `App--sidebar` layout structure, including the `Sidebar` component.
8. **Responsive/Readable UI**: Uses consistent typography and spacing. Read-only fields are styled clearly without input elements.

## API Specification
**Endpoint**: `GET https://dummyjson.com/products/:id`
**Response Schema** (selected fields relevant to UI):
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "category": "string",
  "price": "number",
  "discountPercentage": "number",
  "rating": "number",
  "stock": "number",
  "brand": "string",
  "sku": "string",
  "weight": "number",
  "dimensions": { "width": "number", "height": "number", "depth": "number" },
  "warrantyInformation": "string",
  "shippingInformation": "string",
  "availabilityStatus": "string",
  "returnPolicy": "string",
  "minimumOrderQuantity": "number",
  "reviews": [ { "rating": "number", "comment": "string", "date": "string", "reviewerName": "string", "reviewerEmail": "string" } ],
  "thumbnail": "string",
  "images": [ "string" ]
}
```

## UI/UX Notes
- **Layout Structure**: Follow the existing pattern seen in `src/Products.js`, `src/Customers.js`, etc. Use `<div className="App App--sidebar">` wrapping a `<Sidebar />` and a main content container.
- **Styling**: Reuse existing utility classes where applicable (e.g., `login-input` for styled divs if needed, or create new semantic classes like `product-detail-*`, `product-detail-header`, `product-detail-section`). Maintain the CSS variable/theme already established in `src/index.css`.
- **Typography**: Use standard heading levels (`<h2>`, `<h3>`, `<p>`) consistent with the app's design system.
- **Feedback**: Show a loading indicator during the API call. Show a user-friendly error message if the fetch fails or the product is not found (404).
- **Accessibility**: Ensure all images have `alt` text derived from the title. Use semantic HTML for lists and sections.

## Implementation Notes
- Create `src/ProductDetail.js` (or `src/ProductView.js`).
- Use `react-router-dom`'s `useParams` to extract the `id` from the URL.
- Use `useEffect` for the data fetch. Debounce or guard against rapid route changes to avoid race conditions.
- Calculate average rating from the `reviews` array if the API doesn't return a standalone `rating` field, or use the top-level `rating`.
- Format currency values using `Intl.NumberFormat` or a simple `$${number.toFixed(2)}` helper consistent with `src/Products.js`'s `formatPrice`.
- Handle the `availabilityStatus` string to potentially apply conditional styling (e.g., green for in-stock, red for low stock/out of stock).
- Add unit tests using `@testing-library/react` and `jest.mock` for the fetch call, verifying rendering of key fields and error/loading states.

## Assumptions
1. The route will be `/products/:id`, allowing navigation from the Products list page.
2. The view is strictly read-only; no editing or purchasing functionality is required for this story.
3. Product images will be displayed with fallback placeholders if URLs are missing or broken.
4. The API response will be available immediately; no pagination or caching is required for the detail view.
5. Standard React hooks (`useState`, `useEffect`, `useMemo`) and functional components will be used, matching the project's existing code style.

## Open Questions & Clarifications
```json
{
  "clarification": {
    "needed": true,
    "questions": [
      {
        "id": "q1",
        "question": "Should the product detail page fetch live data from dummyjson.com during local development, or should we configure a proxy/mock server?",
        "whyItMatters": "dummyjson.com may have CORS restrictions or rate limits that block local React dev server requests, breaking the development workflow.",
        "impactIfWrong": "Developers cannot test the UI locally without network/workaround changes, slowing down implementation and testing.",
        "options": [
          {"key": "opt_live_api", "label": "Fetch live API directly"},
          {"key": "opt_proxy_mock", "label": "Use a local proxy or mock data in src/"}
        ],
        "default": "opt_proxy_mock",
        "allowFreeText": true,
        "blocking": true
      },
      {
        "id": "q2",
        "question": "How should product images be presented in the UI? Single thumbnail, or a gallery/carousel?",
        "whyItMatters": "Determines the complexity of the UI component and whether custom carousel logic or existing UI library components are needed.",
        "impactIfWrong": "Over-engineering a gallery if a simple list is sufficient, or under-delivering UX if a gallery is expected.",
        "options": [
          {"key": "opt_gallery", "label": "Image gallery/gallery grid"},
          {"key": "opt_thumbnail_list", "label": "Single thumbnail + list of URLs"}
        ],
        "default": "opt_thumbnail_list",
        "allowFreeText": true,
        "blocking": false
      },
      {
        "id": "q3",
        "question": "Should the average rating be displayed prominently, and how should individual reviews be ordered?",
        "whyItMatters": "Affects UI layout priority and whether we need to implement sorting/grouping logic for reviews.",
        "impactIfWrong": "Poor information hierarchy or cluttered review section.",
        "options": [
          {"key": "opt_avg_prominent", "label": "Show calculated average rating prominently, list reviews below by date"},
          {"key": "opt_raw_list", "label": "Just list reviews as returned by API"}
        ],
        "default": "opt_avg_prominent",
        "allowFreeText": true,
        "blocking": false
      },
      {
        "id": "q4",
        "question": "Does the 'stock' field map directly to `availabilityStatus`, or should we combine them?",
        "whyItMatters": "Influences how we calculate and display inventory state text.",
        "impactIfWrong": "Displaying contradictory or redundant status messages.",
        "options": [
          {"key": "opt_use_status", "label": "Use availabilityStatus string directly"},
          {"key": "opt_combine", "label": "Combine stock number and status string"}
        ],
        "default": "opt_use_status",
        "allowFreeText": true,
        "blocking": false
      },
      {
        "id": "q5",
        "question": "Should we include discount pricing (original vs discounted price) in the display?",
        "whyItMatters": "The API returns `discountPercentage`. Showing both prices affects pricing UI logic.",
        "impactIfWrong": "Missing expected promotional display or calculating prices incorrectly.",
        "options": [
          {"key": "opt_show_both", "label": "Show original price strikethrough + discounted price"},
          {"key": "opt_show_final", "label": "Show only the final `price` field"}
        ],
        "default": "opt_show_both",
        "allowFreeText": true,
        "blocking": false
      }
    ],
    "assumptions": [
      {"statement": "The page will be implemented as a new standalone route (`/products/:id`) rather than a modal or drawer.", "risk": "low"},
      {"statement": "Product images will be rendered as standard `<img>` tags with basic CSS grid/flex layout.", "risk": "low"},
      {"statement": "Tests will mock the fetch API using `jest.mock('node-fetch')` or `cy.intercept`/MSW, ensuring tests run offline.", "risk": "low"},
      {"statement": "Error states will display a generic 'Failed to load product. Please try again.' message with a retry button.", "risk": "low"}
    ]
  }
}
```

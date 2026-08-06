# MIS-36: Sort Products

## Story Summary
Add product sorting functionality to the Products page. The story references an external API for fetching and sorting products, but current implementation uses local mock data. This spec addresses both the sort UI/UX and the integration approach.

## Acceptance Criteria

- **AC-1**: Users can sort products by title (name) in ascending and descending order via a visible sort control
- **AC-2**: Sorting is applied before pagination, so each page displays correctly sorted products
- **AC-3**: The sort state persists during user interaction on the same session (page reload is not required)
- **AC-4**: Sorting does not interfere with existing search/filter functionality — search filters are applied after sorting, or vice versa, but results are consistent
- **AC-5**: Products fetched from `https://dummyjson.com/products?sortBy=title&order=asc` are displayed when the API integration is active

## Requirements

### Functional Requirements

**FR-1: Sort Control**
- Add a sort control (dropdown or toggle) to the Products page header area
- Support at minimum: sort by product name/title, ascending and descending
- Default to no sort or ascending by title (unless overridden)

**FR-2: Sort Logic**
- Sorting must be deterministic and stable
- Case-insensitive alphabetical comparison for string fields
- Sorting is applied to the full product list before pagination is calculated

**FR-3: API Data Integration**
- When fetching from `https://dummyjson.com/products?sortBy=title&order=asc`, use the response data to populate the product list
- Handle loading and error states for the API call

### Non-Functional Requirements

- Performance: Sorting operation on the client-side (or server-side) should complete within acceptable timeframes
- Accessibility: Sort control must have an accessible label and support keyboard navigation
- Consistency: Follow existing styling conventions (CSS classes from `App.css` / `index.css`)

## UI Notes

- Place the sort control in the header area alongside the "Add Product" button and search input
- Consider a dropdown selector with options: "Sort by: Name (A→Z)", "Sort by: Name (Z→A)"
- Use existing component patterns (e.g., the search input's class naming convention: `orders-search login-input`)
- The sort control should be visible above the product table

## Implementation Notes

**Current State (from `Products.js`):**
- State: `searchTerm`, `currentPage`, `products` (initialized from `mockProducts`), `isModalOpen`, `form`
- Search logic: filters the `products` array based on `searchTerm` across id, sku, name, category, and price
- Pagination: calculated from filtered results
- Modal: used to add new products

**Proposed Changes:**
1. Add sort state: `sortBy` (e.g., `"title"` or `null`) and `sortOrder` (e.g., `"asc"` or `"desc"`)
2. Add a sort control to the JSX
3. Modify the filtering/sorting pipeline to: sort first, then search-filter, then paginate
4. Optionally: add a `useEffect` that fetches from the external API when sort state changes or on mount
5. Update or replace `mockProducts` with API data if API integration is chosen

**Data Flow:**
```
products (from mock or API) → sort → filter by searchTerm → paginate → display
```

## Assumptions

- Sort control is placed in the header section of the Products page, near the search input and "Add Product" button, consistent with the existing layout
- Only title/name sorting is required for this story (other sort fields like price or category may be added in follow-up stories)
- If API integration is used, the sort control triggers a fetch with the appropriate query parameters (`sortBy=title&order=asc|desc`)
- Existing search, pagination, and modal functionality continue to work unchanged alongside sorting

## Open Questions

See clarification questions below.

---

{"clarification": {"needed": true, "questions": [{"id": "q1", "question": "Should the implementation fetch products from the external dummyjson.com API, or should sorting be implemented locally using the existing mockProducts data?", "whyItMatters": "This changes the implementation from a simple state sort to an API integration with loading/error handling, data mapping, and potentially different response shape.", "impactIfWrong": "If API integration is required but not implemented, sorting may use stale or incorrect data. If API is not required but is implemented, unnecessary complexity is introduced.", "options": [{"key": "opt_api", "label": "Fetch from dummyjson.com API", "consequence": "Replace or supplement mock data with live API data; add loading and error states; map API response to component expectations"}, {"key": "opt_local", "label": "Local-only sort with mock data", "consequence": "Add sort state and logic to existing Products.js without any API calls; simpler implementation"}], "default": "opt_local", "allowFreeText": true, "blocking": true}, {"id": "q2", "question": "What sort fields should be available? Only title/name, or other fields (price, category, SKU, etc.)?", "whyItMatters": "Scope of the sort control UI and the sort logic implementation.", "impactIfWrong": "Implementing only title when others are expected requires a follow-up story. Over-implementing now adds unnecessary code.", "options": [{"key": "opt_title_only", "label": "Title/Name only", "consequence": "Sort control has two options: A-Z and Z-A"}, {"key": "opt_multiple", "label": "Multiple fields (title, price, category)", "consequence": "Sort control includes a field selector plus direction; sort logic handles multiple data types"}], "default": "opt_title_only", "allowFreeText": true, "blocking": false}, {"id": "q3", "question": "What should be the default sort state when the Products page first loads?", "whyItMatters": "Affects user experience and initial data ordering.", "impactIfWrong": "Users may see unsorted data initially and be confused.", "options": [{"key": "opt_unsorted", "label": "No default sort (original mock order)", "consequence": "Display mock data as-is; user must explicitly sort"}, {"key": "opt_ascending", "label": "Default to ascending by title", "consequence": "Page loads with A-Z sort applied immediately"}], "default": "opt_ascending", "allowFreeText": true, "blocking": false}], "assumptions": [{"statement": "Sort is applied before search filtering and pagination: products are sorted first, then filtered by searchTerm, then paginated.", "risk": "low"}, {"statement": "The sort control UI will be a dropdown or toggle with ascending/descending options for title/name.", "risk": "low"}, {"statement": "If API integration is not chosen, the API reference in the story description is considered context for a future story or optional enhancement.", "risk": "low"}]}}

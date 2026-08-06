# MIS-34: Integrate get all users API

## Story Overview
Integrate the DummyJSON Users API to fetch and display customer data, replacing the current mock data in the Customers feature. The API returns 208 total users with built-in pagination support (30 items per page by default).

## Requirements
1. Fetch users from `GET https://dummyjson.com/users` with pagination support via `skip` and `limit` query parameters
2. Display user data in a paginated table matching the existing Customers UI structure
3. Support search/filter across relevant user fields
4. Handle loading and error states appropriately during API calls
5. Map API response fields to display columns consistently with existing UI patterns

## API Endpoint
- `GET https://dummyjson.com/users?skip=0&limit=30`
- Response body:
  ```json
  {
    "users": [{ /* user object */ }],
    "total": 208,
    "skip": 0,
    "limit": 30
  }
  ```

## Data Mapping
| API Field | Display Column | Transformation |
|-----------|---------------|----------------|
| `id` | ID | Direct |
| `firstName` + `lastName` | Name | Concatenated with space |
| `email` | Email | Direct |
| `company.name` | Company | Nested object property |
| `phone` | Phone | Direct |
| `role` | Status | Mapped string (admin → Admin, moderator → Moderator, user → User) |

## UI Notes
- Reuse existing `Customers` component as the implementation base
- Maintain BEM-ish class naming convention in `src/App.css` (e.g., `.customers-container`, `.customers-title`, `.customers-pagination`)
- Preserve existing search input, pagination controls, and table layout patterns
- Use existing CSS classes: `orders-table`, `orders-table-wrapper`, `customers-page-btn`, `customers-page-info`, `orders-search`, `login-input`
- Apply Font Awesome icons via existing CDN pattern if needed for UI polish

## Implementation Notes
- Use `useEffect` for API call on component mount
- Implement server-side pagination matching API `skip`/`limit` parameters (30 items per page)
- Filter/search client-side on the current page of fetched data (or implement server-side search using API `q` parameter if available)
- Handle loading state with a spinner or placeholder during API calls
- Handle error state with a message and retry mechanism
- Use `async/await` or `.then()` for fetch calls
- Include error boundaries or try/catch blocks around API calls
- Derive total page count from API response `total` field

## Test Cases
1. API call succeeds and displays 30 users on initial load
2. Search filters users by name, email, or company (case-insensitive)
3. Pagination buttons update page and fetch correct data range
4. Loading state displays during API call
5. Error state displays when API is unavailable or returns an error
6. Table renders all mapped fields correctly
7. No users match search → shows "No customers found" message
8. Page count updates based on API response `total` field

## Assumptions
1. The `Customers` component will be updated rather than creating a new `Users` component
2. User roles map to Status column as capitalized strings (Admin/Moderator/User)
3. Pagination is server-side matching API `skip`/`limit` parameters, 30 items per page
4. The DummyJSON API will be available during development and testing
5. The Add Customer button will be disabled for API-sourced data
6. Search/filter will be client-side on the first fetched page unless server-side search parameter is available
7. The component does not require authentication for API access (DummyJSON is public)

## Open Questions
1. **Component scope**: Should we update the existing `Customers` component or create a new `Users` component for API integration?
2. **Role mapping**: How should the `role` field map to the Status column in the table?
3. **Pagination strategy**: Server-side (API-driven) or client-side (all data fetched)?
4. **Error handling**: What should display when the API fails?
5. **Add Customer button**: Should it remain enabled for API-sourced users?

{"clarification": {"needed": true, "questions": [{"id": "q1", "question": "Should we update the existing Customers component or create a new Users component for API integration?", "whyItMatters": "Determines whether we modify Customers.js or create Users.js and update routing", "impactIfWrong": "Wrong choice means we create unnecessary files or modify the wrong component", "options": [{"key": "opt_a", "label": "Update Customers", "consequence": "Minimal changes, consistent with existing patterns"}, {"key": "opt_b", "label": "Create new Users component", "consequence": "Clearer separation, but more files and routing updates needed"}], "default": "opt_a", "allowFreeText": true, "blocking": true}, {"id": "q2", "question": "How should the user role field map to the Status column in the table?", "whyItMatters": "Affects how role data is displayed and whether Status column is sufficient", "impactIfWrong": "Wrong mapping could show incorrect role information or require UI redesign", "options": [{"key": "opt_a", "label": "Direct mapping (admin/moderator/user)", "consequence": "Shows role directly in Status column"}, {"key": "opt_b", "label": "Capitalized roles (Admin/Moderator/User)", "consequence": "Cleaner display, consistent with existing Status values"}, {"key": "opt_c", "label": "Separate Role column", "consequence": "Requires adding column, changing existing table structure"}], "default": "opt_b", "allowFreeText": true, "blocking": true}, {"id": "q3", "question": "Should pagination be server-side (using API skip/limit) or client-side (fetch all data)?", "whyItMatters": "Determines the data fetching strategy and affects performance", "impactIfWrong": "Wrong choice affects API call frequency and search/filter complexity", "options": [{"key": "opt_a", "label": "Server-side pagination", "consequence": "One API call per page, efficient, search may require re-fetch"}, {"key": "opt_b", "label": "Client-side pagination", "consequence": "All 208 items fetched once, search/filter is instant"}], "default": "opt_a", "allowFreeText": true, "blocking": true}, {"id": "q4", "question": "What should happen when the API returns an error or is unavailable?", "whyItMatters": "Affects error handling strategy and user experience during failures", "impactIfWrong": "Wrong handling could hide errors or cause crashes", "options": [{"key": "opt_a", "label": "Show error message with retry button", "consequence": "Clear feedback, user can retry"}, {"key": "opt_b", "label": "Fallback to mock data", "consequence": "Graceful degradation, but shows stale data"}, {"key": "opt_c", "label": "Show cached/localStorage data if available", "consequence": "Minimal disruption, but complex state management"}], "default": "opt_a", "allowFreeText": true, "blocking": true}, {"id": "q5", "question": "Should the Add Customer button remain enabled for API-sourced users?", "whyItMatters": "Determines whether the component is read-only or supports mixed data sources", "impactIfWrong": "Wrong choice could lead to data inconsistency or complex state handling", "options": [{"key": "opt_a", "label": "Disable/Hide Add Customer", "consequence": "Read-only view, simpler implementation"}, {"key": "opt_b", "label": "Keep enabled with mixed data", "consequence": "Supports adding to API data, but requires careful state management"}], "default": "opt_a", "allowFreeText": true, "blocking": true}], "assumptions": [{"statement": "The Customers component will be updated rather than creating a new Users component", "risk": "low"}, {"statement": "User roles map to Status column as capitalized strings (Admin/Moderator/User)", "risk": "low"}, {"statement": "Pagination is server-side matching API skip/limit parameters", "risk": "low"}, {"statement": "The DummyJSON API will be available during development and testing", "risk": "medium"}, {"statement": "The Add Customer button will be disabled for API-sourced data", "risk": "low"}, {"statement": "Search/filter will be client-side on the first fetched page unless server-side search parameter is available", "risk": "low"}]}}

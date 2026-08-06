# MIS-34 Implementation Plan: Integrate get all users API

## Resolved Decisions
- **Component Scope**: Update the existing `Customers` component in place rather than creating a new `Users` component.
- **Role Mapping**: Map `role` field to `Status` column as capitalized strings (`Admin`, `Moderator`, `User`).
- **Pagination Strategy**: Server-side pagination using API `skip` and `limit` query parameters (`limit=30`).
- **Error Handling**: Show a clear error message with a "Retry" button when the API fails.
- **Add Customer Button**: Disable/Hide the "Add Customer" button since data is now sourced externally.

## Context Budget
- **Target Files**: `src/Customers.js`, `src/Customers.test.js`, `src/App.css`.
- **Read Scope**: Prioritize understanding the existing DOM structure, CSS class names, and test selectors from the provided `src/Customers.test.js` snippet. Do not read or modify routing (`src/App.js`), state management, or other components.
- **Constraints**: Preserve existing BEM-ish class names (`.customers-container`, `.orders-table`, `.orders-search`, `.customers-page-btn`) and aria-labels (e.g., `Search customers`) to maintain test compatibility and UI consistency.

## Files to Touch
- `src/Customers.js` (Modify) — Replace mock data, implement API fetching, add loading/error states, map new fields.
- `src/Customers.test.js` (Modify) — Mock `fetch`, update assertions to match API response structure, add loading/error/retry tests.
- `src/App.css` (Optional Modify) — Add CSS for `.customers-loading` and `.customers-error` states if existing utility classes are insufficient.

## Implementation Steps

### 1. State & Fetch Logic (`src/Customers.js`)
- Remove mock data imports and hardcoded arrays.
- Initialize state using `useState`:
  - `users`: `[]`
  - `loading`: `false`
  - `error`: `null`
  - `searchTerm`: `""`
  - `currentPage`: `1`
  - `totalUsers`: `0` (from API `total` field)
- Create an async `fetchUsers(page)` function:
  - Construct URL: `https://dummyjson.com/users?skip=${(page - 1) * 30}&limit=30`
  - Handle `try/catch` for network errors.
  - On success: `setUsers(response.users)`, `setTotalUsers(response.total)`, `setLoading(false)`.
  - On failure: `setError("Failed to load users. Please try again.")`, `setLoading(false)`.
- Use `useEffect` to call `fetchUsers(currentPage)` on component mount and whenever `currentPage` changes.
- When `searchTerm` changes, reset `currentPage` to `1` and trigger a new fetch.

### 2. Search & Filter Logic
- Implement client-side filtering on the `users` array returned by the API.
- Filter criteria (case-insensitive): `firstName`, `lastName`, `email`, `company.name`.
- If no results match the `searchTerm`, render the existing "No customers found" message to preserve UI expectations.

### 3. UI Mapping & Table Structure
- Map API fields to the existing table columns:
  - `id` → ID
  - `firstName + " " + lastName` → Name
  - `email` → Email
  - `company.name` → Company
  - `phone` → Phone
  - Capitalized `role` → Status
- Preserve the exact table structure, CSS classes (`orders-table`, `orders-table-wrapper`), and pagination controls (`customers-page-btn`, `customers-page-info`).
- Hide or disable the "Add Customer" button.

### 4. Loading & Error States
- **Loading**: Show a centered loading indicator (e.g., "Loading customers...") when `loading` is `true`. Disable pagination and search inputs while loading.
- **Error**: Show an error message when `error` is not `null`. Include a "Retry" button that re-triggers `fetchUsers(currentPage)`.

### 5. Test Updates (`src/Customers.test.js`)
- Mock `window.fetch` to return DummyJSON-compatible payloads:
  - Payload for initial load: `{ users: [...30 items matching test names...], total: 208, skip: 0, limit: 30 }`
  - Payload for error test: throw an Error or mock a 500 response.
- Update existing assertions to work with mocked data.
- Add new test cases:
  - `it("shows loading state on initial fetch")`
  - `it("shows error message and retry button on API failure")`
  - `it("refetches data when retry button is clicked")`
  - `it("disables/hides Add Customer button")`
- Ensure all original tests (search, pagination, row rendering) still pass with the mocked API responses.

## Risks & Assumptions
- **DummyJSON Availability**: The external API may be slow or rate-limited. Mocking `fetch` in tests isolates the component from network variability.
- **Client-Side Search**: Assumption that filtering on the currently fetched page (30 items) is acceptable. If global search across all 208 users is required, switch to DummyJSON's `q` query parameter.
- **CSS Stability**: Assumption that existing BEM-ish classes in `src/App.css` cover the new layout without needing overrides.
- **Button Visibility**: Assumption that hiding the "Add Customer" button is sufficient; removing it from the DOM is not required to prevent layout shifts.

{"clarification": {"needed": false, "assumptions": [{"statement": "Client-side filtering on the currently fetched page is used for search, preserving existing UI behavior.", "risk": "low"}, {"statement": "Existing CSS class names (.customers-container, .orders-table, etc.) are sufficient and require no updates.", "risk": "low"}, {"statement": "The Add Customer button is simply hidden/disabled rather than removed from the DOM to maintain layout stability.", "risk": "low"}]}}

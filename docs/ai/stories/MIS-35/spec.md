# MIS-35: Add Product API

## Context
Currently, the "Add Product" feature in `src/Products.js` operates entirely client-side. The `handleSave` function generates a synthetic `id`, appends the new product to the local `products` state array, closes the modal, and displays a success toast. This story requires integrating the `https://dummyjson.com/products/add` API to persist the product server-side.

## Acceptance Criteria
1. **API Integration**: Clicking "Save" on the Add Product modal must trigger a `POST` request to `https://dummyjson.com/products/add`.
2. **Request Payload**: The request body must be a JSON object containing form data. `form.name` must map to `title` in the payload. Include `sku`, `category`, and `price` (converted to a number).
   Example payload: `JSON.stringify({ title: form.name, sku: form.sku, category: form.category, price: Number(form.price) })`
3. **Headers**: The request must include `Content-Type: application/json`.
4. **Success Handling**: 
   - On a successful response, the modal must close.
   - A success toast ("Product added successfully") must be displayed.
   - The local `products` state must be updated with the newly created product data.
   - Pagination and search must remain functional with the updated data.
5. **Error Handling**: 
   - On network failure or non-2xx response, an error toast must be displayed.
   - The modal must remain open with the form data intact for retry.
   - Local state must not be modified on failure.
6. **Loading State**: The "Save" button must indicate a loading state (e.g., text changes to "Saving...") and be disabled while the request is in flight to prevent duplicate submissions.

## Implementation Notes
- **File to Modify**: `src/Products.js`
- **Current Flow**: The `handleSave` function is synchronous, manipulates state directly, and calls `toast.success`.
- **Required Changes**:
  - Convert `handleSave` to an `async` function.
  - Add a `isSaving` state variable to track the API request status.
  - Wrap the `fetch` call in a `try/catch` block.
  - Map form fields to the API payload carefully. Note that the DummyJSON API returns `title`, but the internal component schema and table render logic rely on `name`. Ensure the implementation maps `response.title` back to `name` when updating state.
  - If the API returns a different `id`, prefer the API's `id` over the locally generated one. If the API fails to return an `id`, fallback to the local generation logic.
  - Replace the static `toast.success` with conditional logic handling both success and failure paths.
- **Styling**: Reuse existing `.login-submit-btn` and `.product-modal-save-btn` classes. Apply the `disabled` attribute to the button when `isSaving` is true.
- **Testing (`src/Products.test.js`)**: 
  - Mock `fetch` globally using `jest.spyOn(window, 'fetch').mockResolvedValueOnce(...)` or a similar pattern.
  - Test success path: verify payload structure, state update, toast, and modal closure.
  - Test failure path: verify error toast and that local state remains unchanged.
  - Test loading state: verify button is disabled and shows "Saving..." during the mock fetch delay.

## Assumptions
- The DummyJSON API `/products/add` endpoint is publicly accessible, does not require authentication, and has low latency suitable for a frontend demo.
- The API response will contain a product object compatible with the existing `mockProducts` shape. If keys differ (e.g., `title` vs `name`, or additional fields like `createdAt`), the implementation will normalize the response to match the internal shape before updating state.
- No additional form fields (like `description`, `brand`, `images`) are required for this story, even if the API supports them. We will only send fields present in the current modal form.
- Error messages will be generic ("Failed to add product. Please try again.") rather than displaying raw API error strings, to avoid leaking internal error structures to the UI.

## Open Questions
```json
{"clarification": {"needed": true, "questions": [{"id": "q1", "question": "How should the UI handle a failed API request regarding the error toast message?", "whyItMatters": "Determines whether we expose internal API error strings or use a sanitized generic message.", "impactIfWrong": "Displaying raw API errors could confuse users or leak technical details if the dummy API returns verbose JSON error bodies.", "options": [{"key": "opt_a", "label": "Show a generic, sanitized message", "consequence": "Safe, consistent UX regardless of API response format."}, {"key": "opt_b", "label": "Show the raw error string from the API response", "consequence": "Might provide more context but risks breaking the UI if the API returns unexpected JSON structures."}], "default": "opt_a", "allowFreeText": true, "blocking": true}], "assumptions": [{"statement": "The internal component schema relies on 'name' for product display, while the DummyJSON API expects and returns 'title'.", "risk": "low"}]}}
```

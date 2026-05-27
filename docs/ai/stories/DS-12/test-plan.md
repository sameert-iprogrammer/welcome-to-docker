# Test Plan: DS-12 — Add Product

## Scope

Tests for the new "Add Product" button and modal form in `src/Products.js`. Follows the same pattern as `src/Customers.test.js` add-modal tests. Focuses only on modified behavior: modal open/close, form state, save flow, and toast integration.

## Files

- `src/Products.test.js` — new: smoke-test, modal open/close, cancel (no save), full save flow (toast + row appears)

## Approach

- **Render smoke-test**: Products page renders without crashing (coverage minimum).
- **"Add Product" button renders**: button is present with correct aria-label `"Add product"`.
- **Opens modal with empty form fields**: clicking button opens modal dialog with empty SKU, Name, Category, Price fields.
- **Cancel closes modal without saving**: Cancel button dismisses modal; `toast.success` is NOT called; form input is discarded.
- **Save adds product, fires toast, closes modal, shows row**: fill all form fields, submit, verify modal closed, toast called with `"Product added successfully"`, and the new product row appears in the table after searching by name.

Unchanged behavior (search, pagination, product rendering) is NOT re-tested — those are already covered by the component's existing design.

## Test Details

| # | Test | Scenario | Key Assertion |
|---|------|----------|--------------|
| 1 | renders without crashing | Render in MemoryRouter | No crash |
| 2 | renders Add Product button | Check button by aria-label | `getByLabelText("Add product")` is in document |
| 3 | opens modal with empty form | Click button | Modal title `"Add Product"` and empty form fields visible |
| 4 | Cancel closes modal without saving | Open modal, click Cancel | Modal gone, `toast.success` not called |
| 5 | Save adds product, fires toast, closes modal, shows row | Fill form, click Save | Modal closed, toast called, new row visible via search |

## Implementation Notes

- Mock `react-toastify` with `jest.mock` (same pattern as Customers.test.js).
- Clear `toast.success` mock in `beforeEach`.
- Use `MemoryRouter` wrapper (Products reads no router state, but Customers.test.js uses it for consistency).
- Form label aria-labels: `"SKU"`, `"Name"`, `"Category"`, `"Price"` — align with implementation's `aria-label` attributes.
- Save test: use `getByLabelText` + `fireEvent.change` to fill fields, then `getByLabelText("Save product")` to submit.
- Cancel test: use `getByLabelText("Cancel add product")` to close.

## Validation

- `npm test -- --watchAll=false src/Products.test.js` — expected: all 5 tests pass after implementation of DS-12.

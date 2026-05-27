## Story Summary
Add an "Add Product" button and modal form to the Products page, following the same pattern as the existing "Add Customer" modal in Customers.js.

## Requirements
- Add an "Add Product" button in the Products page header (above the search bar)
- Clicking "Add Product" opens a modal overlay with a form containing fields: SKU, Name, Category (dropdown), Price
- Form fields use HTML5 `required` validation (inline, no custom validation logic)
- Category dropdown options sourced from existing categories in mock data: Electronics, Accessories, Office, Furniture, Storage, Wearables
- On save: auto-generate next ID (max existing ID + 1), add product to local state, close modal, show success toast
- On cancel / close modal: discard form input, close modal, no data change
- Product list state must be mutable (`useState` initialized from `mockProducts`) to support additions

## Acceptance Criteria
- "Add Product" button is visible in Products page header, styled consistently with Customers "Add Customer" button
- Clicking "Add Product" opens centered modal overlay with form fields
- Modal form has required fields: SKU (text), Name (text), Category (select), Price (number)
- Submitting valid form data adds the product to the table immediately
- Success toast "Product added successfully" appears on save
- Cancel button closes modal without saving
- New product appears in search results and respects pagination
- Existing search, pagination, and table display continue to work unchanged

## Impacted Areas
- `src/Products.js` — add modal state (`isModalOpen`, `form`, `emptyForm`), handlers (`handleOpenModal`, `handleCloseModal`, `handleFormChange`, `handleSave`), modal JSX block; convert `mockProducts` from direct reference to `useState` initializer; add `customers-header` wrapper; import `toast` from `react-toastify`
- `src/App.css` — add `.product-modal-*` CSS classes (overlay, modal card, title, form, actions, cancel/save buttons) following the same pattern as `.customer-modal-*` at lines 641-724; OR reuse existing modal classes if no visual differentiation needed
- `src/Products.test.js` — new test file for add-product smoke test and save flow

## Open Questions
- No blocking questions. Implementation detail: should the product modal reuse `.customer-modal-*` CSS classes or create dedicated `.product-modal-*` classes? (See Implementation Notes for recommendation.)

## Assumptions
- Following `src/Customers.js` pattern: modal opens via state toggle, form uses `handleFormChange` curried handler, ID auto-generated from `Math.max(...ids) + 1`
- Price stored as string in form state, parsed to number on save (matching mock data `price: 29.99` numeric pattern)
- No localStorage persistence — products reset on page refresh (same as Customers)
- `react-toastify` is already a project dependency (confirmed in `package.json` and `src/App.js:3`)
- No routing changes needed — `/products` route already registered in `src/App.js:65-69`

## UI Notes
- "Add Product" button: same style as `.customers-add-btn` (blue, right-aligned in header)
- Modal: same card style as customer modal (`.customer-modal` / `.customer-modal-overlay`) — dark card `#112240` background, `max-width: 480px`
- Form field order: SKU, Name, Category (select), Price (number input)
- Category select options: Electronics, Accessories, Office, Furniture, Storage, Wearables (+ optional default placeholder)
- Modal title: "Add Product"
- Follow BEM-ish naming: `.product-modal-overlay`, `.product-modal`, `.product-modal-title`, `.product-modal-form`, `.product-modal-actions`, `.product-modal-save-btn`, `.product-modal-cancel-btn` (if creating dedicated classes)

## Implementation Notes
- **Recommendation**: Create dedicated `.product-modal-*` CSS classes in `src/App.css` to avoid coupling Products to Customer-named classes. Copy the existing `.customer-modal-*` block (lines 641-724) and rename prefix.
- Convert `mockProducts` import usage from direct reference to `useState(mockProducts)` initializer — this is the critical change enabling mutable state
- Add `toast` import from `react-toastify` (same import as `src/Customers.js:2`)
- Modal JSX placed after the pagination block, same conditional pattern as `src/Customers.js:147-240`
- Governance check: no routing changes, no backend, no TypeScript, plain CSS only, no new components or dependencies — all aligned

## Test Notes
- New file `src/Products.test.js`
- Smoke test: Products renders without crashing
- "Add Product" button renders and opens modal on click
- Form submission adds a product row to the table
- Cancel button closes modal without adding
- Success toast appears on save (mock `react-toastify`)
- Run: `npm test -- --watchAll=false src/Products.test.js`

## References
- `src/Customers.js` — reference implementation for add-modal pattern (modal state, form handlers, save logic, toast)
- `src/Products.js` — file to modify
- `src/productsMock.js` — source of initial product data and field/category definitions
- `src/App.css:641-724` — existing modal overlay/CSS pattern to replicate

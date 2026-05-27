# DS-10 Add Customer — Implementation Plan

## Summary
Add an "Add Customer" button to the Customers listing page. Clicking it opens a modal with a form whose fields match the listing columns. Saving the form appends the new customer to local state, closes the modal, and fires a `react-toastify` success toast. No backend changes.

## Assumptions
- Listing columns drive the form: `ID` (auto-generated, not editable), `Name`, `Email`, `Company`, `Phone`, `Status` (dropdown: `Active`, `Inactive`, `Pending`).
- The current `mockCustomers` constant must be moved into component state (`useState`) so new entries persist for the session. No `localStorage` required (not mentioned in spec; matches existing in-memory pattern for `Orders`/`Products`).
- Reuse existing `react-toastify` setup (already wired in `App.js`). `toast.success("Customer added successfully")` on save.
- Modal is built inline in `Customers.js` using a div overlay + card pattern (no new dependency); keeps with project convention (no UI framework).
- Required fields: Name, Email, Company, Phone, Status. Simple HTML5 `required` validation; Email uses `type="email"`. No regex beyond that.
- New ID = `Math.max(...customers.map(c => c.id)) + 1`.
- Tests mock `react-toastify` the same way `Profile.test.js` does.

## Target Files
- `src/Customers.js` — convert `mockCustomers` to state; add Add Customer button, modal, form, save handler, toast call.
- `src/Customers.test.js` — add tests for button → modal open, form submit → row appears + toast + modal closes, cancel → modal closes without save, validation prevents empty save.
- `src/App.css` — add styles for `.customers-header` (row holding title + Add button), `.customers-add-btn`, `.customer-modal-overlay`, `.customer-modal`, `.customer-modal-title`, `.customer-modal-form`, `.customer-modal-actions`, `.customer-modal-cancel-btn`. Reuse `.login-input`, `.form-group`, `.login-submit-btn` for inputs/buttons where appropriate.

## Implementation Steps

### 1. `src/Customers.js`
1. Replace top-level `const mockCustomers = [...]` usage with a `useState` initializer:
   - `const [customers, setCustomers] = useState(initialCustomers);` where `initialCustomers` is the existing array (rename the constant).
2. Update `filteredCustomers` `useMemo` to depend on `[searchTerm, customers]` and filter `customers` instead of `mockCustomers`.
3. Add modal + form state:
   - `const [isModalOpen, setIsModalOpen] = useState(false);`
   - `const emptyForm = { name: "", email: "", company: "", phone: "", status: "Active" };`
   - `const [form, setForm] = useState(emptyForm);`
4. Handlers:
   - `handleOpenModal`: reset `form` to `emptyForm`, `setIsModalOpen(true)`.
   - `handleCloseModal`: `setIsModalOpen(false)`.
   - `handleFormChange(field)`: returns `(e) => setForm(prev => ({ ...prev, [field]: e.target.value }))`.
   - `handleSave(e)`: `e.preventDefault();` compute `nextId = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;` push `{ id: nextId, ...form }`; `setCustomers(prev => [...prev, newCustomer]);` `setIsModalOpen(false);` `toast.success("Customer added successfully");`.
5. Render:
   - Wrap `<h2>` and a new button in `<div className="customers-header">`. Button: `<button type="button" className="customers-add-btn" onClick={handleOpenModal} aria-label="Add customer">Add Customer</button>`.
   - Conditionally render modal when `isModalOpen`:
     - Overlay `<div className="customer-modal-overlay" role="dialog" aria-modal="true" aria-label="Add Customer">`.
     - Inner `<div className="customer-modal">` containing `<h3 className="customer-modal-title">Add Customer</h3>` and a `<form className="customer-modal-form" onSubmit={handleSave}>`.
     - Fields (each in a `.form-group` with `<label htmlFor>` + `<input className="login-input" required>` or `<select>` for Status). Field order: Name, Email (type=email), Company, Phone, Status. `aria-label` matches label text.
     - Actions `<div className="customer-modal-actions">` with `<button type="submit" className="login-submit-btn" aria-label="Save customer">Save</button>` and `<button type="button" className="customer-modal-cancel-btn" onClick={handleCloseModal} aria-label="Cancel add customer">Cancel</button>`.
6. Add `import { toast } from "react-toastify";` at the top.

### 2. `src/App.css`
Append below the existing customers section (after line ~604):
- `.customers-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }` and remove the `margin: 0 0 24px 0;` from `.customers-title` only if it conflicts (otherwise reset bottom margin via header). Simplest: keep `.customers-title` and adjust `.customers-header` to have `margin-bottom: 0` on the title via `.customers-header .customers-title { margin-bottom: 0; }`.
- `.customers-add-btn` — primary button styling (background `#2496ed` or reuse colors from `.login-submit-btn`; padding `10px 20px`, radius 6px, white text, hover lift).
- `.customer-modal-overlay` — fixed full-screen, `background: rgba(0,0,0,0.6)`, flex center, z-index 1000.
- `.customer-modal` — dark card matching `.login-card` palette (`background: #1a2332` or similar), padding `28px 32px`, radius 10px, min/max widths (`min-width: 360px; max-width: 480px; width: 90%`).
- `.customer-modal-title` — white, 22px, weight 700, margin bottom 16px.
- `.customer-modal-form` — `display: flex; flex-direction: column; gap: 14px;`.
- `.customer-modal-actions` — `display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;`.
- `.customer-modal-cancel-btn` — secondary style mirroring `.settings-back-btn` (transparent bg, border, hover state).

### 3. `src/Customers.test.js`
Add at top:
```
jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }));
import { toast } from "react-toastify";
beforeEach(() => { toast.success.mockClear(); });
```
Add new test cases:
1. `"renders an Add Customer button"` — `getByLabelText("Add customer")` is in the document.
2. `"opens the modal with empty form fields on Add Customer click"` — click button; `getByRole("dialog")` (or `getByLabelText("Add Customer")` on overlay) present; `getByLabelText("Name")` etc. are empty inputs; `getByLabelText("Save customer")` and `getByLabelText("Cancel add customer")` present.
3. `"closes the modal without saving when Cancel is clicked"` — open modal, click Cancel, dialog gone, `toast.success` not called, no new row.
4. `"saves a new customer and shows it in the table, fires toast, closes modal"` — open modal; fill Name=`Zara Test`, Email=`zara@example.com`, Company=`TestCo`, Phone=`555-9999`, leave Status default `Active`; click Save; assert `getByText("Zara Test")` (may need to navigate to last page — easier: search for `"Zara"` after save and assert the row is visible); assert `toast.success` called with `"Customer added successfully"`; assert dialog removed from DOM.
5. (Optional) `"requires Name to save"` — open modal, leave Name blank, click Save, form does not submit (dialog still open, no toast).

Note: existing pagination test `expect(getByText(/page 1 of 3/i))` continues to pass because new customers are only added during the add-customer test, and tests render fresh component instances.

## Validation Commands
- `npm test -- --watchAll=false src/Customers.test.js` (run only the changed test file first).
- `npm test -- --watchAll=false` (full suite to catch regressions in `Profile`/`Orders` tests that share patterns).
- `npm run build` (sanity build).

## Context Budget
- Inspect only the target files above first. Do not perform broad repo scans.
- Open non-target files only if needed for direct imports, callers, tests, or required config — likely `src/App.js` (toast container already there; do not modify), `src/Profile.js` + `src/Profile.test.js` (reference patterns for toast + form), `src/App.css` lines 540–610 (existing customers styles).
- Use provider-native edit tools to apply changes; do not print full file contents, full diffs, or large code blocks in chat — show only the changed lines/regions.
- Run only the validation commands listed above (scoped test file first, then full suite + build). Skip Docker, lint configs, or other surfaces not touched by this change.

## Risks
- Existing pagination test (`page 1 of 3`) assumes 12 seed customers. Keep the seed array identical; only mutate via the form. Verified safe.
- Adding `.customers-header` flexbox could shift title spacing — mitigate by zeroing `.customers-title` margin inside the header only.
- Modal may trap focus/scroll; spec does not require keyboard trap or ESC-to-close. Keep minimal to match project's "no extra libraries" rule.
- `react-toastify` mock must be added to `Customers.test.js`; without it, real toast renders and test assertion would still pass but pollute DOM.

## Out of Scope
- Backend persistence, localStorage hydration, edit/delete customer flows, field-level error messages beyond HTML5 validation, accessibility focus trap, animations.

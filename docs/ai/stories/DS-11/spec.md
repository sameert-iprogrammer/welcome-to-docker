## Story Summary
Add Edit and Delete icon actions to each customer row in the Customers listing. Edit reuses the existing modal (pre-filled) to update a customer; Delete shows a confirmation popup before removing the customer from local state.

## Requirements
- Add an "Actions" column to the customers table with Edit and Delete icon buttons per row
- On Edit icon click: open the existing modal with the customer's current data pre-filled; change modal title to "Edit Customer"; on save, update the customer in state instead of adding new
- On Delete icon click: show a confirmation popup ("Are you sure you want to delete {name}?") with Confirm and Cancel buttons
- On Delete confirm: remove customer from state, close popup, show success toast "Customer deleted successfully"
- On Delete cancel: close popup, no action
- Show success toast "Customer updated successfully" on edit save
- Both modal and confirmation popup close when clicking overlay backdrop

## Acceptance Criteria
- Each customer row shows Edit (pencil) and Delete (trash) Font Awesome icons in an Actions column
- Clicking Edit opens the modal with existing customer name/email/company/phone/status values filled in
- Editing a customer and saving updates the row in the table, closes modal, shows success toast
- Clicking Delete opens a confirmation overlay with customer name displayed
- Confirming delete removes the row, closes popup, shows success toast
- Cancelling delete closes popup, no data change
- Add new customers still works (DS-10 behavior preserved)

## Impacted Areas
- `src/Customers.js` — add `editingCustomer`, `isConfirmOpen`, `customerToDelete` state; add Edit/Delete handlers; conditionally render Actions column header + icon buttons; repurpose modal for edit; render delete confirmation popup
- `src/App.css` — add `.customers-action-btn`, `.customers-confirm-overlay`, `.customers-confirm-modal`, `.customers-confirm-actions` styles
- `src/Customers.test.js` — add tests for edit flow (pre-fill, save update, toast), delete flow (open confirm, confirm removes row, cancel closes popup)

## Open Questions
- [CLARIFICATION NEEDED] Should clicking the modal overlay backdrop close the modal? (Project pattern for DS-10: modal closes via Cancel button only, no backdrop click; delete confirmation should match whichever pattern is chosen)
- Should the delete confirmation popup also close on backdrop click, or only via Cancel/Confirm buttons?

## Assumptions
- Edit icon = `fa-pen`, Delete icon = `fa-trash` (Font Awesome CDN already loaded in `public/index.html`)
- Editing preserves the original customer `id` — no ID reassignment
- Confirmation popup reuses the same overlay pattern as the existing modal (`.customer-modal-overlay`) but with distinct CSS classes for clarity
- State is component-local (matches DS-10 pattern); no localStorage persistence
- Validation on edit uses the same HTML5 `required` as the Add flow (no new validation logic)
- `react-toastify` mock pattern from existing tests (`Customers.test.js`) is extended for new toast messages

## UI Notes
- New Actions column: narrow width, no header label text or just a gear icon — keep minimal
- Edit/Delete icon buttons: transparent background, white icon, hover color change, consistent sizing (~32x32px)
- Edit icon color on hover: `#4fc3f7` (light blue); Delete icon color on hover: `#ef5350` (red)
- Delete confirmation popup: centered overlay, same card style as customer modal, with the customer name highlighted, and Confirm (red/danger) + Cancel (secondary) buttons
- Follow existing BEM-ish naming: `.customers-action-btn`, `.customers-confirm-overlay`, `.customers-confirm-modal`, `.customers-confirm-title`, `.customers-confirm-actions`, `.customers-confirm-cancel-btn`, `.customers-confirm-delete-btn`
- Reference `src/App.css` lines 641-724 for existing modal/overlay patterns

## Implementation Notes
- Reuse the existing modal infrastructure in `src/Customers.js` — add `editingCustomer` state (null = add mode, object = edit mode). When `editingCustomer` is set, pre-fill form and toggle modal title + save behavior
- Add `isConfirmOpen` (boolean) and `customerToDelete` (customer object) state; render a second conditional overlay block for delete confirmation
- Add an Actions `<th>` in the table header and a new `<td>` in each row with two `<i>` / `<button>` elements using Font Awesome classes
- Update `handleSave`: if `editingCustomer` is set, find-and-replace in `customers` array; else append (existing behavior). Reset `editingCustomer` to null after save
- No new component files — everything stays in `src/Customers.js`. No new CSS files — all styles in `src/App.css`
- No new npm dependencies needed (Font Awesome and react-toastify already in use)
- Governance check: no react-router changes, no backend, no TypeScript, plain CSS only — all aligned
- See `src/Customers.js:147-240` for the existing modal overlay pattern to replicate for the confirmation popup

## Test Notes
- Extend `src/Customers.test.js` with:
  - Edit icon renders per row
  - Clicking Edit opens modal with customer data pre-filled
  - Saving edit updates row data, shows "Customer updated successfully" toast
  - Delete icon renders per row
  - Clicking Delete shows confirmation popup with customer name
  - Confirming delete removes row, shows "Customer deleted successfully" toast
  - Canceling delete closes popup, no toast, row still present
- Use existing mock pattern: `jest.mock("react-toastify", ...)` with `toast.success`
- Run: `npm test -- --watchAll=false src/Customers.test.js`

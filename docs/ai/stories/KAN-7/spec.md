## Story Summary

Add full CRUD to the Masters page: Add (modal form), Edit (same modal pre-filled), and Delete (confirmation dialog via existing `ConfirmDialog`). All operations show success toasts. Frontend-only, no backend.

## Requirements

- "Add Master" CTA button on Masters page, right of the title
- On Add click, open modal overlay with form fields: Code (text), Name (text), Description (text), Type (dropdown: Category/SubCategory), Status (dropdown: Active/Inactive). Auto-generate `id` as `max(existing ids) + 1`
- On Save, close modal, show `toast.success("Master added successfully")`
- Edit CTA in each table row; on click, open **same modal** pre-filled with that row's data, title changes to "Edit Master", button text changes to "Update"
- On Update click, update record in state, close modal, show `toast.success("Master updated successfully")`
- Delete CTA in each table row (alongside Edit); on click, open confirmation popup reusing existing `ConfirmDialog` component
- On Delete confirm, remove record from state, close dialog, show `toast.success("Master deleted successfully")`
- On Cancel or overlay click in modal/dialog, dismiss without action
- Masters data managed via `useState(mockMasters)` — session-only, no persistence

## Acceptance Criteria

- "Add Master" button renders with `aria-label="Add master"`
- Clicking "Add Master" opens modal (`role="dialog"`, `aria-modal="true"`, `aria-label="Add Master"`) with empty form: Code, Name, Description (text inputs), Type/Status (dropdowns), Save + Cancel buttons
- Saving a new master closes modal, fires toast("Master added successfully"), new row appears in table with auto-calculated `id`
- Canceling/overlay-click in modal closes it without saving or toast
- Each row has an **Edit** button (`aria-label="Edit {master.name}"`) that opens the same modal pre-filled with that row's data
- Editing and clicking Update closes modal, fires toast("Master updated successfully"), updates row in table
- Each row has a **Delete** button (`aria-label="Delete {master.name}"`) that opens `ConfirmDialog` with title "Delete Master", message "Are you sure you want to delete {master.name}?"
- Confirming Delete fires toast("Master deleted successfully"), removes row from table
- Canceling Delete dismisses dialog without action
- Search, pagination, and all existing functionality preserved

## Impacted Areas

- `src/Masters.js` — add `masterToDelete` state, `handleDeleteClick`, `handleConfirmDelete`, `handleCancelDelete`; import `ConfirmDialog`; render `ConfirmDialog` + Delete button in Actions td
- `src/App.css` — add `.masters-delete-btn` style (alongside existing `.masters-edit-btn`)
- `src/Masters.test.js` — add tests for Delete flow (dialog open, cancel, confirm + toast, row removed)

## Open Questions

- None. All patterns clear from existing Edit implementation and `ConfirmDialog` interface.

## Assumptions

- `ConfirmDialog` is already reusable — props: `isOpen`, `title`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`
- Delete button CSS class: `.masters-delete-btn` (new), styled to look distinct from Edit (e.g., red/danger tone)
- `masterToDelete` state initialized as `null`; when set to a master object, triggers `ConfirmDialog` open
- Toast message on delete: "Master deleted successfully"
- Delete removes record from `masters` state array via `filter()` — no undo
- All existing Add + Edit behavior remains unchanged per prior approved scope
- No routing changes, no new npm deps, no TypeScript, no backend — per governance

## UI Notes

- Delete button inside Actions `<td>` alongside Edit button, separated by a space or margin
- Delete button style: `.masters-delete-btn` — red/muted danger tone (bg `#dc3545` or similar), white text, small padding, rounded, matching `masters-edit-btn` size
- `ConfirmDialog` renders as fixed overlay with centered card (existing CSS from `src/App.css` — `.confirm-dialog-overlay`, `.confirm-dialog`, `.confirm-dialog-title`, `.confirm-dialog-message`, `.confirm-dialog-actions`, `.confirm-dialog-cancel-btn`, `.confirm-dialog-confirm-btn`)
- All form modals unchanged (Add/Edit reuse existing `.masters-modal-*` classes)
- Reference `src/App.css` existing `.confirm-dialog-*` classes (lines ~225-260) for dialog styling

## Implementation Notes

- **`src/Masters.js` changes**:
  1. Import `ConfirmDialog` from `./ConfirmDialog`
  2. Add state: `const [masterToDelete, setMasterToDelete] = useState(null);`
  3. Add handler `handleDeleteClick(master) => setMasterToDelete(master)`
  4. Add handler `handleConfirmDelete()`: `setMasters(prev => prev.filter(m => m.id !== masterToDelete.id)); setMasterToDelete(null); toast.success("Master deleted successfully");`
  5. Add handler `handleCancelDelete() => setMasterToDelete(null)`
  6. In Actions `<td>`, add Delete button after Edit button: `<button onClick={() => handleDeleteClick(master)} className="masters-delete-btn" aria-label={\`Delete ${master.name}\`}>Delete</button>`
  7. After the modal JSX (before closing `</div></div>`), render `ConfirmDialog`: `<ConfirmDialog isOpen={!!masterToDelete} title="Delete Master" message={\`Are you sure you want to delete ${masterToDelete?.name}?\`} confirmLabel="Delete" cancelLabel="Cancel" onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />`
- **`src/App.css` changes**: Add `.masters-delete-btn` class after `.masters-edit-btn` — danger red bg, white text, 4px 10px padding, 4px border-radius, cursor pointer, no border. Optionally add `:hover` with darker red.
- **All existing Add + Edit code unchanged** — only appending Delete functionality
- Pattern follows the same structure as `src/Dashboard.js` status change confirmation (uses `ConfirmDialog` with `confirmUser` state)
- Component already has `toast` imported from prior Add/Edit work — no new import needed

## Test Notes

- Add to `src/Masters.test.js` (following existing patterns with toast mock already in place):
  1. "renders Delete buttons for each row" — assert `getAllByText("Delete")` length = 5 (page 1)
  2. "opens confirmation dialog on Delete click" — click Delete on first row, verify dialog title "Delete Master", message with master name, Delete + Cancel buttons
  3. "closes confirmation dialog when Cancel is clicked" — open dialog, click Cancel, verify dialog gone, toast not called, row still present
  4. "deletes master on Confirm, fires toast, closes dialog, and removes row" — open dialog, click Delete confirm, verify toast("Master deleted successfully"), dialog gone, row no longer in DOM
- Run `npm test -- --watchAll=false` to validate

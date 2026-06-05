## Source

- `docs/ai/stories/KAN-7/spec.md` — Add + Edit + Delete CRUD, frontend-only
- `src/ConfirmDialog.js` — props: `isOpen`, `title`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`
- `src/Dashboard.js` — existing `ConfirmDialog` usage pattern (confirmUser state)

**State of codebase**: Add + Edit (steps 1-8 below) are **already implemented** in `src/Masters.js`, `src/App.css`, and `src/Masters.test.js`. The plan below is the **combined full scope**; only the **Delete** portion (steps 7b, 8, 9e) needs code changes.

## Target Files

- **Modify**: `src/Masters.js` — add `masterToDelete` state, delete handlers, Delete button, `ConfirmDialog` render, `ConfirmDialog` import
- **Modify**: `src/App.css` — add `.masters-delete-btn` block after `.masters-edit-btn:hover` (~line 1481)
- **Modify**: `src/Masters.test.js` — add 4 Delete-flow tests (dialog open, cancel, confirm+toast+row removal)

## Steps

1. **State & Data (already done)**: `useState(mockMasters)`, `emptyForm`, `isModalOpen`, `form`, `editingMaster`, `filteredMasters` depends on `[searchTerm, masters]`
2. **Handlers: Add/Edit/Modal (already done)**: `handleOpenModal`, `handleEdit`, `handleCloseModal`, `handleFormChange`, `handleSave` (saves new or updates existing based on `editingMaster`)
3. **Header: Add Master button (already done)**: Title wrapped in `.customers-header` div, button `aria-label="Add master"`
4. **Table: Actions column + Edit button (already done)**: `<th>Actions</th>`, each row `<td>` with Edit button `aria-label={`Edit ${master.name}`}` class `masters-edit-btn`
5. **Modal JSX (already done)**: Fixed overlay `role="dialog"`, form with Code/Name/Description/Type/Status fields, dynamic title/button text, Cancel+Save/Update buttons
6. **CSS: Modal & Edit button (already done)**: `.masters-modal-overlay` through `.masters-modal-cancel-btn:hover` + `.masters-edit-btn` + `.masters-edit-btn:hover` inserted before `/* Dashboard Metric Cards */`
7. **Tests: Add + Edit (already done)**: toast mock, 7 tests (render button, open modal with empty fields, cancel closes, save+toast+row, Edit buttons rendered, Edit pre-fills, Update saves+toast+row)
8. **NEW — Delete button in each row**: In Actions `<td>` (after Edit button), add: `<button onClick={() => handleDeleteClick(master)} className="masters-delete-btn" aria-label={\`Delete ${master.name}\`}>Delete</button>`
9. **NEW — Delete state & handlers in `src/Masters.js`**:
   - Add import: `import ConfirmDialog from "./ConfirmDialog";`
   - Add state: `const [masterToDelete, setMasterToDelete] = useState(null);`
   - `handleDeleteClick(master) => setMasterToDelete(master)`
   - `handleConfirmDelete()`: `setMasters(prev => prev.filter(m => m.id !== masterToDelete.id)); setMasterToDelete(null); toast.success("Master deleted successfully");`
   - `handleCancelDelete() => setMasterToDelete(null)`
   - After the modal `{isModalOpen && (...)}` block (before `</div></div>`), render: `<ConfirmDialog isOpen={!!masterToDelete} title="Delete Master" message={\`Are you sure you want to delete ${masterToDelete?.name}?\`} confirmLabel="Delete" cancelLabel="Cancel" onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />`
10. **NEW — `.masters-delete-btn` CSS**: Insert after `.masters-edit-btn:hover` (~line 1481):
    ```css
    .masters-delete-btn {
      padding: 4px 10px;
      background: #dc3545;
      border: none;
      border-radius: 6px;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .masters-delete-btn:hover {
      background: #c0392b;
    }
    ```
11. **NEW — Delete tests in `src/Masters.test.js`** (append inside existing `describe`):
    - "renders Delete buttons for each row" — `getAllByText("Delete")` length = 5 (page 1)
    - "opens confirmation dialog on Delete click" — click Delete on first row, assert dialog title "Delete Master", message with master name, Delete + Cancel buttons
    - "closes confirmation dialog when Cancel is clicked" — open dialog, click Cancel, verify dialog gone, toast not called, row still present
    - "deletes master on Confirm, fires toast, closes dialog, removes row" — open dialog, click Delete confirm, verify `toast.success("Master deleted successfully")`, dialog gone, row no longer in DOM
12. **Validate**: Run `npm test -- --watchAll=false`

## Data/API Notes

- **No backend** — all state is component-local `useState(mockMasters)` in `src/Masters.js`
- **Record shape**: `{ id: number, code, name, description, type: "Category"|"SubCategory", status: "Active"|"Inactive" }`
- **Add**: `nextId = Math.max(...masters.map(m => m.id)) + 1`, spread form, push; toast `"Master added successfully"`
- **Edit**: map over array, replace matching `id`; toast `"Master updated successfully"`
- **Delete**: filter out `masterToDelete.id`; toast `"Master deleted successfully"`
- **Empty state for Delete**: `masterToDelete` starts `null`; ConfirmDialog only renders when truthy

## UI Notes

- **Delete button**: inside Actions `<td>` after Edit, class `.masters-delete-btn`, `aria-label={`Delete ${master.name}`}`; danger red (#dc3545), white text, 4px 10px padding, 6px border-radius, same size as `.masters-edit-btn`
- **ConfirmDialog**: reuses existing component with overlay click dismiss (calls `onCancel`) — no new CSS needed
- **All existing Add + Edit UI preserved** (Add Master button, modal, Edit button, pagination, search)
- **No routing changes, no new npm deps, no TypeScript, plain CSS only**

## Tests

- **Existing (8 tests)**: render, search, pagination, no-results, search-reset-pagination, Add button, Add modal/save, Edit buttons/pre-fill/update — all pass
- **New (4 tests in `src/Masters.test.js`)**:
  1. "renders Delete buttons for each row" — assert 5 Delete buttons on page 1
  2. "opens confirmation dialog on Delete click" — click Delete, verify dialog title/message/buttons
  3. "closes confirmation dialog when Cancel is clicked" — click Cancel, dialog gone, toast not called, row present
  4. "deletes master on Confirm, fires toast, closes dialog, removes row" — confirm Delete, verify toast, dialog gone, row removed
- **Run**: `npm test -- --watchAll=false`

## Risks

- **Ordering**: CSS block for `.masters-delete-btn` must go after `.masters-edit-btn:hover` to keep action-button styles grouped and before `/* Dashboard Metric Cards */`
- **ConfirmDialog import**: Must be added at top of `Masters.js` (currently imports `React`, `useState`, `useEffect`, `useMemo`, `toast`, `Sidebar`, `mockMasters`)
- **masterToDelete null safety**: `handleConfirmDelete` uses `masterToDelete.id` — only called when dialog is open (masterToDelete is non-null). Use optional chaining in JSX message: `${masterToDelete?.name}`
- **Session-only**: masters state resets on page navigation (no persistence) — matches existing pattern
- **Toast already imported**: `toast` is already imported from prior Add/Edit work — no new import needed for delete toast

## Context Budget

When implementing, read only:
- `src/Masters.js` (287 lines fully)
- `src/App.css` lines 1466-1482 (`.masters-edit-btn` section — insert delete-btn after)
- `src/Masters.test.js` (258 lines fully — append tests at end of describe block)
- `src/ConfirmDialog.js` (read once to confirm props interface)

Do **NOT** read: `App.js`, `Dashboard.js`, `Login.js`, `index.js`, `Sidebar.js`, `Navbar.js`, `Products.js`, `Customers.js`, Dockerfile, package.json, workflow YMLs.

## Handoff

`Masters.js` needs: `ConfirmDialog` import, `masterToDelete` state (null init), `handleDeleteClick`/`handleConfirmDelete`/`handleCancelDelete` handlers, Delete button in each Actions td (after Edit), `<ConfirmDialog ... />` render after modal. `App.css` needs `.masters-delete-btn` + `:hover` block after `.masters-edit-btn:hover`. `Masters.test.js` needs 4 Delete-flow tests appended. No other files touched. Frontend only, no backend.

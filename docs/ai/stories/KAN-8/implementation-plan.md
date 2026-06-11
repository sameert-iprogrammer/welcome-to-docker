# KAN-8: Orders Add / Edit / Delete — Implementation Plan

## Summary

Extend the Orders page with frontend-only CRUD affordances: **Add** (header CTA + modal form), **Edit** (per-row, reuses the same modal), and **Delete** (per-row, shared `ConfirmDialog`, success toast). No API or persistence beyond in-component state.

**Baseline:** `src/Orders.js` already implements Add, Edit, shared modal, local `orders` state, and `react-toastify` toasts. **Remaining scope for this story:** wire **Delete** using the same pattern as `Masters.js` + `ConfirmDialog.js`, and add matching tests in `Orders.test.js`.

## Requirements

| Action | Trigger | Behavior | Toast |
|--------|---------|----------|-------|
| Add | Header “Add Order” | Open modal; empty form (customer, product, status, date); auto ID on save | `Order added successfully` |
| Edit | Row “Edit” | Open same modal pre-filled; ID read-only | `Order updated successfully` |
| Delete | Row “Delete” | Open `ConfirmDialog`; on confirm remove from state | `Order deleted successfully` |

- Fields align with table columns: ID, Customer, Product, Status, Date.
- Status options: Pending, Processing, Shipped, Delivered.
- New order IDs: `ORD-###` via existing `getNextOrderId`.
- Frontend only; mock data stays in component state (resets on refresh).

## Reference Patterns (read only if needed)

- **Delete flow:** `src/Masters.js` — `masterToDelete` state, `handleDeleteClick`, `handleConfirmDelete`, `handleCancelDelete`, `ConfirmDialog` at bottom of JSX.
- **Delete tests:** `src/Masters.test.js` (lines ~259–317).
- **Shared dialog:** `src/ConfirmDialog.js` + `.confirm-dialog-*` styles in `src/App.css`.
- **Row button styles:** reuse `masters-edit-btn` / `masters-delete-btn` (already used for Edit on Orders).

## Implementation Steps

### 1. Verify Add / Edit (no regression)

Confirm `src/Orders.js` already has:

- `customers-add-btn` “Add Order”, `handleOpenModal`, `handleEdit`, `editingOrder`, shared modal, `handleSave` branching add vs update.
- Per-row Edit in Actions column.

If any piece is missing, restore per existing modal/form structure before Delete work.

### 2. Add Delete to `src/Orders.js`

1. **Import** `ConfirmDialog` from `./ConfirmDialog`.
2. **State:** `const [orderToDelete, setOrderToDelete] = useState(null);`
3. **Handlers** (mirror Masters):
   - `handleDeleteClick(order)` → `setOrderToDelete(order)`
   - `handleConfirmDelete()` → `setOrders(prev => prev.filter(o => o.id !== orderToDelete.id))`, `setOrderToDelete(null)`, `toast.success("Order deleted successfully")`
   - `handleCancelDelete()` → `setOrderToDelete(null)`
4. **Actions column:** beside Edit, add Delete button:
   - `className="masters-delete-btn"`
   - `aria-label={`Delete order ${order.id}`}`
   - `onClick={() => handleDeleteClick(order)}`
5. **Render** `ConfirmDialog` after the add/edit modal block (sibling inside `orders-container`):

```jsx
<ConfirmDialog
  isOpen={!!orderToDelete}
  title="Delete Order"
  message={`Are you sure you want to delete ${orderToDelete?.id}?`}
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
/>
```

Use order **id** in the message (orders are identified by ID, unlike master name).

### 3. Extend `src/Orders.test.js`

Follow `Masters.test.js` delete tests; keep existing `toast` mock and `MemoryRouter` wrapper.

Add cases:

1. **renders Delete buttons for each row** — `getAllByText("Delete")` length `5`.
2. **opens confirmation dialog on Delete click** — click `getByLabelText("Delete order ORD-001")` (or first Delete); assert title `Delete Order`, message contains `ORD-001`, confirm/cancel labels present.
3. **closes confirmation dialog when Cancel is clicked** — row remains; `toast.success` not called.
4. **deletes order on Confirm, fires toast, closes dialog, removes row** — confirm via `getByLabelText("Delete")` on dialog; assert `Order deleted successfully`, `ORD-001` absent, dialog closed.

Prefer `getByLabelText("Delete order ORD-001")` for row clicks to avoid ambiguity with dialog confirm button.

### 4. CSS

**No changes expected.** Reuse `masters-delete-btn` and existing `confirm-dialog-*` / `orders-modal-*` rules in `src/App.css`.

## Target Files

| File | Action |
|------|--------|
| `src/Orders.js` | Add Delete handlers, row button, `ConfirmDialog` |
| `src/Orders.test.js` | Add Delete + confirmation tests |

**Do not create** new components unless `ConfirmDialog` import fails (it already exists).

**Out of scope:** `docs/ai/stories/KAN-8/*` (orchestrator artifacts), `App.js` (toast container already global), backend, routing changes.

## Context Budget

- Open **`src/Orders.js`** and **`src/Orders.test.js`** first.
- Open **`src/Masters.js`** / **`src/Masters.test.js`** only for Delete/ConfirmDialog pattern copy.
- Open **`src/ConfirmDialog.js`** only if props/API unclear.
- Do **not** scan the full repo, `node_modules`, build output, or execution-history folders.
- Use native edit tools; do not paste full files or large diffs in chat.
- Run only targeted tests below.

## Validation Commands

```bash
npm test -- --testPathPattern=Orders.test.js --watchAll=false
```

Optional smoke:

```bash
npm start
```

Navigate to `/orders`; exercise Add, Edit, Delete (confirm/cancel).

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Multiple “Delete” buttons in DOM | Use row `aria-label` (`Delete order ORD-xxx`) in tests |
| Deleting while add/edit modal open | Unlikely in tests; optional guard: close modal on delete click if needed |
| Filtered list after delete | Delete from full `orders` state by `id`; search/filter unchanged |
| Final-review CR vs partial impl | Treat Add/Edit as done; implement Delete only if already present |

## Assumptions

- `react-toastify` and `ToastContainer` in `App.js` are already configured (used by Add/Edit).
- Working tree Add/Edit/modal CSS/tests are the intended baseline; implementer completes **Delete** increment.
- No `spec.md` in repo for KAN-8; context pack + change requests are authoritative.
- Story analyzer handoff missing; no extra attachments beyond described scope.

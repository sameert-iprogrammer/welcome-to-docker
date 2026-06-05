## Findings

- id: R1
  severity: LOW
  file: src/Masters.js
  evidence: The spec requires "Clicking overlay backdrop: closes modal" (docs/ai/stories/KAN-7/spec.md, Acceptance Criteria), but the modal overlay `<div className="masters-modal-overlay">` (line 184) has no onClick handler to close on backdrop click. The existing Products.js and Customers.js modals have the same omission, so this is consistent with the codebase but deviates from the written spec.
  fix: Add `onClick={handleCloseModal}` to the overlay `<div>` at line 184, and add `e.stopPropagation()` on the inner modal `<div>` at line 190 to prevent close when clicking inside the modal card.

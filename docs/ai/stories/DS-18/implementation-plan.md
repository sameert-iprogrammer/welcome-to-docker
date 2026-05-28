# DS-18: FAQ Page — Implementation Plan

## Summary

Add an authenticated `/faq` route with a sidebar nav link. The FAQ page uses the existing sidebar layout (`App App--sidebar` + `Sidebar`) and displays mock Q&A pairs in a client-side accordion (no backend, no new dependencies).

## Assumptions

- FAQ is available only when `localStorage.isAuthenticated === "true"`, same as Dashboard/Orders/Customers/Products.
- Mock FAQ content is a static array in `FAQ.js` (5–8 items), themed loosely around the app/Docker learning context.
- Accordion allows one open item at a time (toggle same item to close); implementer may allow multiple open if simpler—prefer single-open for typical FAQ UX.
- Styles live in `src/App.css` only (no new `.css` files).
- Font Awesome icon for nav: `fa-solid fa-circle-question` (or `fa-regular fa-circle-question` if solid unavailable in CDN set).
- `docs/ai/stories/DS-18/spec.md` is missing; requirements come from story setup and context pack.

## Target Files

| Action | File |
|--------|------|
| Create | `src/FAQ.js` |
| Create | `src/FAQ.test.js` |
| Edit | `src/App.js` |
| Edit | `src/Sidebar.js` |
| Edit | `src/App.css` |
| Edit | `src/Sidebar.test.js` |

## Context Budget

- Read **target files first**; do not scan the whole repo.
- Open non-target files only for direct patterns: `src/Dashboard.js` or `src/Customers.js` (layout), `src/Sidebar.test.js` (test patterns).
- Do not open `node_modules/`, `build/`, execution artifacts, or full working-tree diffs.
- Use native edit tools; do not paste full files or large diffs in chat.
- Run only: focused Jest for changed tests, then `npm run build` if tests pass.

## Implementation Steps

### 1. Create `src/FAQ.js`

- Functional component, default export, hooks only.
- Import `Sidebar` from `./Sidebar`.
- Define `const faqItems = [{ id, question, answer }, ...]` with mock data (at least 5 entries).
- Page shell (match sidebar pages):

```jsx
<div className="App App--sidebar">
  <Sidebar />
  <div className="faq-container">
    <h2 className="faq-title">FAQ</h2>
    {/* accordion */}
  </div>
</div>
```

- Accordion state: `useState` for `openId` (`null` or item `id`).
- Each item:
  - Outer: `faq-item`, modifier `faq-item--open` when expanded.
  - Question: `<button type="button" className="faq-question">` with `aria-expanded`, `aria-controls={`faq-answer-${id}`}`, chevron icon (`fa-chevron-down` / rotate when open).
  - Answer panel: `<div id={...} className="faq-answer" role="region">` shown when `openId === id`.
- Click handler: if same id, set `openId` to `null`; else set to clicked id.

### 2. Register route in `src/App.js`

- `import FAQ from "./FAQ";`
- Add protected route (mirror `/orders`):

```jsx
<Route
  path="/faq"
  element={isAuthenticated ? <FAQ /> : <Navigate to="/login" />}
/>
```

- Place with other authenticated routes (before `/` and `*` catch-alls).

### 3. Add sidebar link in `src/Sidebar.js`

- Append to `navItems` (after Products or before Settings if Settings were in sidebar—it is not; append after Products is fine):

```js
{ label: "FAQ", path: "/faq", icon: "fa-solid fa-circle-question" }
```

- Existing `location.pathname === item.path` active styling applies automatically.

### 4. Add styles in `src/App.css`

- BEM-ish blocks: `.faq-container`, `.faq-title`, `.faq-list`, `.faq-item`, `.faq-item--open`, `.faq-question`, `.faq-answer`.
- Reuse visual language from sidebar pages: spacing, borders, hover on question button, chevron transition.
- Ensure answer text is readable (padding, line-height); hide/collapse answer when closed (`display: none` or `max-height` + overflow hidden—keep simple).
- Do not add a separate CSS file.

### 5. Tests

**`src/FAQ.test.js`** (new):

- Wrap with `MemoryRouter` + `initialEntries={["/faq"]}`.
- Smoke: renders without crash, title "FAQ" visible.
- Accordion: first question click shows first answer; second click on same question hides it; click second question shows second answer and hides first (if single-open).
- Use RTL `getByRole` / `getByText` where possible.

**`src/Sidebar.test.js`** (update):

- Extend "renders Dashboard and Orders nav links" (or add case) to expect `FAQ` label.
- Add test: `initialEntries={["/faq"]}` → FAQ nav item has `sidebar-nav-item--active`.
- **Avoid brittle index-based assertions** if nav order changes; query by label/text or `aria-label` instead of `navItems[1]`.

## Validation Commands

```bash
npm test -- --watchAll=false --testPathPattern="FAQ|Sidebar"
npm run build
```

Manual (optional): `npm start` → login → click FAQ in sidebar → verify accordion and active nav state.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| `Sidebar.test.js` uses fixed nav item indices | Query by label/aria-label; update tests when adding FAQ |
| No prior accordion pattern | Keep markup/CSS minimal; no external UI libs |
| `context-map.json` omits `/faq` | Out of scope for runtime; optional doc update later |
| Governance note “no new pages” in `project-context.md` | Story DS-18 explicitly requires FAQ page—treat as approved exception |

## Acceptance Checklist (for implementer)

- [ ] Sidebar shows **FAQ** link with icon
- [ ] Click navigates to `/faq` (authenticated)
- [ ] Unauthenticated `/faq` redirects to `/login`
- [ ] FAQ page shows mock Q&A in accordion
- [ ] Active sidebar highlight on `/faq`
- [ ] Tests pass; production build succeeds

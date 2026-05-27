# Implementation Plan: DS-13 — Dashboard Metrics

## Source

- Story key: DS-13, Title: Dashboard Metrics
- Description: On Dashboard, remove existing data and show 4 mock metrics with icons. Only frontend changes. No backend integration.
- `src/Dashboard.js` — target component
- `src/App.css` — target stylesheet
- `docs/ai/context-map.json` — project structure
- `docs/ai/project-context.md` — architecture rules (plain CSS, no new CSS files, flat src/)

## Target Files

| Action | File |
|--------|------|
| **Modify** | `src/Dashboard.js` |
| **Modify** | `src/App.css` |

## Steps

### 1. Modify `src/Dashboard.js` — remove existing content

- Remove `import Confetti from "./Confetti";` (no longer needed)
- Remove `<Confetti />` JSX line
- Remove the entire `<header className="App-header">...</header>` block (the h1, p, and social-links div)
- Keep: imports for React, useNavigate, toast, Sidebar; the dashboard-nav (profile/settings/logout buttons); the Sidebar component

### 2. Modify `src/Dashboard.js` — add 4 mock metrics

- Define a `metrics` array **outside the component** as a const:

```js
const metrics = [
  { id: 1, icon: "fa-cubes", value: "12", label: "Total Containers" },
  { id: 2, icon: "fa-play-circle", value: "8", label: "Running" },
  { id: 3, icon: "fa-layer-group", value: "24", label: "Images" },
  { id: 4, icon: "fa-database", value: "6", label: "Volumes" },
];
```

- Inside the `<div className="dashboard-content">`, after the `dashboard-nav` div and **before** the closing `</div>` of `dashboard-content`, add:

```jsx
<div className="metrics-grid">
  {metrics.map((m) => (
    <div className="metric-card" key={m.id}>
      <i className={`fa-solid ${m.icon} metric-icon`}></i>
      <span className="metric-value">{m.value}</span>
      <span className="metric-label">{m.label}</span>
    </div>
  ))}
</div>
```

- The structure of `dashboard-content` after changes: Sidebar on left, then `dashboard-content` div containing `dashboard-nav` (profile/settings/logout) + `metrics-grid` (4 cards).

### 3. Modify `src/App.css` — add metric card styles

- Append at end of file:

```css
/* Dashboard Metric Cards */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 100px 40px 40px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.metric-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.metric-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

.metric-icon {
  font-size: 32px;
  color: #61dafb;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  display: block;
  border-radius: 0;
  background: none;
  text-decoration: none;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.metric-label {
  font-size: 14px;
  color: #8892b0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

- Note: `.fa-solid` base styles may already be loaded by Font Awesome CDN. Override any unwanted `.fa-brands` inheritance by scoping to `.metric-icon` (no padding/margin/border-radius override needed since `.fa-brands` rules use class-specific selectors).

### 4. Verify

- Run `npm test` to confirm no regressions (no Dashboard test exists, but ensure other tests still pass).
- Run `npm start` and visually confirm: 4 metric cards in 2×2 grid, dashboard-nav still works, sidebar still present.

## Data/API Notes

- **No API calls, no backend**. Metrics are static mock values defined as a JS const array.
- **No state management** needed — metrics never change within a session.
- **Font Awesome icons** used: `fa-cubes`, `fa-play-circle`, `fa-layer-group`, `fa-database` — all part of Font Awesome Free Solid set (already loaded via CDN in `public/index.html`).

## UI Notes

- **Layout**: 2×2 centered grid of cards, replacing the old full-height centered header.
- **Card content**: icon (top), value (middle), label (bottom), stacked vertically.
- **Dashboard-nav** (profile/settings/logout buttons) remains at top-right, unchanged.
- **Sidebar** remains unchanged.
- **Old content removed**: Confetti, "Congratulations!!!" heading, social share buttons (X/LinkedIn/Reddit).
- **Colors**: card bg `rgba(255,255,255,0.06)`, icon `#61dafb` (accent), value white, label `#8892b0`. Matches existing palette.

## Tests

- No existing `src/Dashboard.test.js` — no new test file required by spec.
- Run `npm test -- --watchAll=false` to confirm existing tests (Products.test.js, Customers.test.js, Orders.test.js, Profile.test.js, Sidebar.test.js) still pass.
- Visual smoke test via `npm start` to confirm layout renders correctly.

## Risks

- **fa-cubes icon**: Confirm Font Awesome 6.4.2 includes `fa-cubes` (Solid). If missing, fall back to `fa-cube` or `fa-boxes-stacked`.
- **`.fa-solid` specificity**: The existing `.fa-brands` rules in App.css should not interfere (different class names), but verify `.metric-icon` renders correctly without inherited padding/margin.
- **Confetti removal**: The Confetti.js component itself is imported by Dashboard.js only. Verify no other file imports it (it should be safe, but Confirm no regressions).
- **No Dashboard test**: Visual regression is manual. The sidebar and navigation should still function.

## Context Budget

- **Read only**: `src/Dashboard.js`, `src/App.css`
- **Do NOT read**: any other component file, any mock file, any config files
- **Do NOT modify**: any file outside the 2 target files listed above

## Handoff

Implementation steps in order:
1. Edit `src/Dashboard.js`: remove Confetti import, remove `<Confetti />`, remove `<header className="App-header">` block, add `metrics` array, add `<div className="metrics-grid">` JSX
2. Edit `src/App.css`: append metric card CSS classes at end of file
3. Run `npm test -- --watchAll=false` to confirm no regressions
4. Run `npm start` for visual confirmation

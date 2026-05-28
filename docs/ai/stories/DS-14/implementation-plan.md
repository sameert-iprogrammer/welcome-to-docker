# Implementation Plan: DS-14 — Dashboard Leaderboard

## Source

- **Story assignment (no spec.md yet):** DS-14 — Dashboard leaderboard.
  Show mock data on dashboard. No backend integration. Frontend-only.
- **Context map:** `docs/ai/context-map.json`
- **Existing patterns observed:**
  - `src/Dashboard.js` — inline `const metrics = [...]` mock data array rendered as `.metrics-grid`
  - `src/App.css` — `.orders-table`, `.orders-table-th`, `.orders-table-td` patterns for table styling
  - Dashboard layout: `.dashboard-content` flex container with `.dashboard-nav` (absolute top-right) + `.metrics-grid` (centered, max-width 600px)

## Target Files

| Action | File |
|--------|------|
| Modify | `src/Dashboard.js` |
| Modify | `src/App.css` |

No new files needed. No test file exists for Dashboard.js — do **not** create one (out of scope).

## Steps

1. **Add leaderboard mock data to Dashboard.js**
   - Define a `const leaderboard = [...]` array (inline, same pattern as `const metrics`)
   - Columns: `{ rank, name, containers, points, badge }` — 5–8 entries, realistic Docker-themed names
   - Place after the `metrics` definition

2. **Render leaderboard table below metrics grid**
   - After the closing `</div>` of `metrics-grid`, add:
     - A section `<h2 className="leaderboard-title">Leaderboard</h2>`
     - A `<div className="leaderboard-wrapper"><table className="leaderboard-table">` block
     - Table header: Rank, User, Containers, Points, Badge
     - Table body: `.map()` over `leaderboard` array
   - Use `key={entry.rank}` for rows
   - Reuse semantic table structure from Orders page pattern

3. **Add leaderboard CSS to App.css**
   - Append new block after the `/* Dashboard Metric Cards */` section:
     - `.leaderboard-title` — white heading, 24px, with top margin to separate from grid
     - `.leaderboard-wrapper` — overflow-x auto, border-radius, matching `orders-table-wrapper` style
     - `.leaderboard-table` — full-width, collapse borders, matching `orders-table` colors
     - `.leaderboard-table th` — matching `orders-table-th` style
     - `.leaderboard-table td` — matching `orders-table-td` style
     - `.leaderboard-table tbody tr:hover` — highlight on hover
     - `.badge-icon` — inline style for the badge emoji/icon column

## Data/API Notes

- **No API calls.** All data is static mock data defined inline in `src/Dashboard.js`.
- Mock leaderboard shape:
  ```js
  const leaderboard = [
    { rank: 1, name: "Captain Whale", containers: 42, points: 9850, badge: "🐳" },
    // ... 5–8 entries total
  ];
  ```
- Use Font Awesome icons (already available via CDN) for rank highlights (e.g., trophy for #1).

## UI Notes

- Layout: Leaderboard section sits **below** the metrics grid inside `dashboard-content`.
- Width: `max-width: 700px; width: 100%;` matching the `.orders-container` constraint pattern.
- Styling: Follow the dark theme (`#112240` background cards, `#e6f1ff` text, `#8892b0` header text) — reuse `.orders-table-*` CSS variables/values exactly so the table is consistent with the existing Orders page table.
- No new routes, no sidebar changes.

## Tests

- No test file for Dashboard.js exists. Not required per story scope.
- Existing tests (`npm test`) must still pass. Run them after changes.

## Risks

- Avoid breaking the `.metrics-grid` / `.dashboard-content` layout — add the leaderboard section **after**, not inside, the grid.
- CSS class names for the leaderboard table should **not** reuse `.orders-table` classes directly (to avoid cross-page style coupling if Orders changes). Instead, define `.leaderboard-table` that duplicates the visual tokens.
- Do **not** import any new dependencies.

## Context Budget

For the implementer agent:
- Read `src/Dashboard.js` (full) and `src/App.css` (full) to see exact insertion points
- Do **not** read any other files — no router, no tests, no other components
- The leaderboard block goes after line 50 of Dashboard.js (after `</div>` of `metrics-grid` and before the closing `</div>`)
- The CSS block goes after line ~524 of App.css (after the `/* Dashboard Metric Cards */` section)

## Handoff

Start with Step 1. Edit `src/Dashboard.js` to add the `leaderboard` mock array, then render the table. Then edit `src/App.css` to add leaderboard styles. Run `npm test` to verify no regressions.

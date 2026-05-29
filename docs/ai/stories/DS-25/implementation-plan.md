## Source

- Story key: DS-25 (no spec.md — requirements: "Dashboard pie chart — sample, custom, no libraries, frontend only" + change request: "Along with pie chart, show one bar chart also. use mock data.")
- `docs/ai/project-context.md` — stack, conventions, file map
- `docs/ai/context-map.json` — project overview
- `src/Dashboard.js` — current component to extend
- `src/App.css` — styles to append

## Target Files

| Action | File |
|--------|------|
| **Modify** | `src/Dashboard.js` — add pie chart + bar chart sections |
| **Modify** | `src/App.css` — add chart styles (pie + bar) at end of file |
| **Create** | `src/Dashboard.test.js` — smoke test covering both charts |

## Steps

1. **Add mock data constants in `Dashboard.js`**
   - `pieData` — 4 slices: `{ label, value, color }` (Containers 40, Images 30, Volumes 20, Networks 10).
   - `barData` — 6 items: `{ label, value, color }` for monthly resource usage (e.g. Jan–Jun with values like 65, 80, 45, 90, 55, 70).
   - Keep both as module-level constants outside the component (same pattern as existing `metrics`).

2. **Build `<PieChart>` SVG component**
   - Render a custom SVG inside `<div className="pie-chart-container">`.
   - Compute arc `d` paths using `Math.cos`/`Math.sin` (formula: `M cx cy L x1 y1 A r r 0 large 1 x2 y2 Z`).
   - Colors: `#61dafb`, `#1d63b8`, `#27ae60`, `#e74c3c` (existing palette).
   - Center `<text>` showing total or "Resources".
   - Legend below SVG as `.pie-legend` with color swatch + label per slice.

3. **Build `<BarChart>` SVG component**
   - Render a custom SVG inside `<div className="bar-chart-container">`.
   - Compute bar heights proportionally: `height = (value / maxValue) * chartHeight`.
   - SVG viewBox approach: `width="400" height="220"`.
   - Draw `<rect>` for each bar with `rx="4"` for rounded corners.
   - Use the same color palette as pie chart (cycle through 4 colors).
   - Draw `<text>` labels below each bar (x-axis labels) and optional value on top.
   - Include `<line>` y-axis guides (horizontal gridlines) for readability.
   - Chart title via `<h2>` above the SVG.

4. **Insert both charts into Dashboard layout**
   - After the `.metrics-grid` div, add `<div className="charts-row">`.
   - Inside charts-row, place `<div className="chart-section pie-chart-wrapper"><PieChart /></div>` and `<div className="chart-section bar-chart-wrapper"><BarChart /></div>`.
   - Add headings: "Resource Distribution" (pie), "Monthly Activity" (bar).
   - Keep existing metric cards unchanged above the charts row.

5. **Append chart CSS to `src/App.css`** (at end of file, before EOF)
   - `.charts-row` — `display: flex; gap: 32px; justify-content: center; flex-wrap: wrap; padding: 0 40px 40px; width: 100%; max-width: 1000px; box-sizing: border-box;`
   - `.chart-section` — `flex: 1; min-width: 300px; max-width: 460px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px;`
   - `.chart-section h2` — white heading, `font-size: 18px`, `font-weight: 700`, `margin: 0 0 16px 0`, color `#e6f1ff`.
   - `.pie-chart-container` / `.bar-chart-container` — center SVG, `margin: 0 auto`.
   - `.pie-legend` — `display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 12px;`
   - `.pie-legend-item` — `display: flex; align-items: center; gap: 6px; font-size: 13px; color: #8892b0;`
   - `.pie-legend-color` / `.bar-legend-color` — `width: 10px; height: 10px; border-radius: 2px; display: inline-block;`
   - `.bar-chart-wrapper` styles to match chart-section card.
   - SVG inside charts: `max-width: 100%; height: auto; display: block;`.
   - BEM-ish naming consistent with existing `.metric-card`, `.dashboard-content` conventions.

6. **Update `src/Dashboard.test.js`** (new file)
   - Smoke: render `<Dashboard />` wrapped in `<MemoryRouter>` (Sidebar uses `useNavigate`).
   - Assert presence of both headings: "Resource Distribution" and "Monthly Activity".
   - Assert `<svg>` elements render (at least 1, ideally 2).
   - Assert legend labels appear (e.g., "Containers", "Jan").

7. **Run validation**
   - `npm test -- --watchAll=false` — verify Dashboard test + all existing tests pass.
   - `npm run build` — verify no build errors.

## Data/API Notes

- No backend. All data hardcoded as module-level constants in `Dashboard.js`.
- Pie data shape:
  ```js
  const pieData = [
    { label: "Containers", value: 40, color: "#61dafb" },
    { label: "Images",     value: 30, color: "#1d63b8" },
    { label: "Volumes",    value: 20, color: "#27ae60" },
    { label: "Networks",   value: 10, color: "#e74c3c" },
  ];
  ```
- Bar data shape:
  ```js
  const barData = [
    { label: "Jan", value: 65, color: "#61dafb" },
    { label: "Feb", value: 80, color: "#1d63b8" },
    { label: "Mar", value: 45, color: "#27ae60" },
    { label: "Apr", value: 90, color: "#e74c3c" },
    { label: "May", value: 55, color: "#61dafb" },
    { label: "Jun", value: 70, color: "#1d63b8" },
  ];
  ```
- Bar height calc: `(d.value / maxBarValue) * barHeight` where `barHeight = 160`.
- Pie total = 100; angles = `(value / total) * 2 * Math.PI`.

## UI Notes

- Both charts live in a flex row below the existing metric cards grid on `/dashboard`.
- On narrow screens (< 700px wide), flex-wrap stacks them vertically.
- No new npm packages, no canvas, no Chart.js, no external charting lib.
- Pie: ~240px SVG, Bar: ~400px SVG viewBox.
- Colors reuse the project's existing accent palette (blue + green + red + cyan tones).
- Legend for pie chart is HTML-based (not SVG text) to match existing patterns.

## Tests

- **New file**: `src/Dashboard.test.js`
  1. Renders without crashing (MemoryRouter wrapper for Sidebar's `useNavigate`).
  2. Contains heading "Resource Distribution" (pie chart).
  3. Contains heading "Monthly Activity" (bar chart).
  4. Contains at least one `<svg>` element.
  5. Contains legend labels like "Containers" and "Jan".

## Risks

- Sidebar uses `useNavigate()` — Dashboard tests **must** wrap in `<MemoryRouter>`.
- Do **not** import any chart library or add npm deps.
- Do **not** modify `src/App.js`, `Sidebar.js`, or any file outside the three targets.
- Keep pie + bar as separate components (or inline functions) inside `Dashboard.js` — no new files beyond the three listed.
- Coordinate colors with existing `App.css` palette — no new color tokens beyond the four used.
- SVG attributes for bar chart: `viewBox` must match declared `width`/`height` ratio to avoid distortion.

## Context Budget

- **Read**: Only `src/Dashboard.js` (modify), `src/App.css` (append styles at end). No other files needed.
- **Skip**: `src/App.js`, `src/Sidebar.js`, `src/Navbar.js`, other components — no routing/config changes.
- **Write**: `src/Dashboard.test.js` only.
- Implementation agent should avoid full-file scans of App.css; target the end of the file (after line 1343) for new chart styles.

## Handoff

Files ready to modify:
- `src/Dashboard.js` — add `<PieChart>` + `<BarChart>` SVG components + mock data + `.charts-row` section below metrics grid
- `src/App.css` — append chart styles (`.charts-row`, `.chart-section`, `.pie-chart-container`, `.bar-chart-container`, `.pie-legend`, `.pie-legend-item`, `.pie-legend-color`) at end of file
- `src/Dashboard.test.js` — new smoke + content tests

Start with Step 1 (mock data constants), then Step 2 (PieChart), Step 3 (BarChart), Step 4 (layout), Step 5 (CSS), Step 6 (test), Step 7 (validation). Verify with `npm test` and `npm run build`.

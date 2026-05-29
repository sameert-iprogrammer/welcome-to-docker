## Source

- `docs/ai/stories/DS-26/spec.md` (primary)
- Change request: add 2 line charts (instead of 1) — increment from spec
- Existing patterns: `src/Dashboard.js` PieChart (line 27), BarChart (line 72); `src/App.css` chart styles (lines 1344–1418); `src/Dashboard.test.js`

## Target Files

| File | Action |
|------|--------|
| `src/Dashboard.js` | Modify — add 2 datasets, add reusable `LineChart` component, render 2 instances in JSX |
| `src/App.css` | Modify — add `.line-chart-container` styles |
| `src/Dashboard.test.js` | Modify — add assertions for 2 new chart headings |

No new files. No other files touched.

## Steps

1. **Add two mock datasets in `src/Dashboard.js`**
   - `cpuData` — 7 data points `{ label, value }`, e.g. "08:00"–"14:00", values ~30–95, topic "CPU Usage (%)"
   - `networkData` — 7 data points `{ label, value }`, e.g. "Mon"–"Sun", values ~20–85, topic "Network Traffic (MB/s)"
   - Place after `barData` (~line 25), same array-of-objects shape

2. **Create reusable `LineChart` component in `src/Dashboard.js`**
   - Local arrow-function component above `Dashboard` export, after `BarChart` (~line 116)
   - Props: `{ data, color, title }`
   - SVG dimensions: `width=400, height=220`, margins `{ top: 20, bottom: 36, left: 44, right: 20 }`
   - Compute x/y scales:
     - `xScale(i) = margin.left + (i / (data.length - 1)) * chartW`
     - `yScale(v) = margin.top + chartH - (v / maxValue) * chartH`
   - Render SVG elements:
     - Horizontal grid lines (4 values) with `<line>` + `<text>` labels (same pattern as BarChart lines 85–96)
     - `<polyline>` for the data line with `fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"`
     - `<circle>` at each data point (`r=4`, `fill={color}`)
     - X-axis `<text>` labels for each data point at bottom
     - Y-axis value labels above each point (optional, follow BarChart line 104 pattern)
   - **Do NOT** hardcode data or title inside the component — read from props
   - Wrap in `<div className="line-chart-container">` (matches existing `.pie-chart-container` / `.bar-chart-container` pattern)

3. **Render 2 LineChart instances in Dashboard JSX**
   - In `.charts-row`, after `.bar-chart-wrapper`, add:
     ```jsx
     <div className="chart-section line-chart-wrapper">
       <h2>CPU Usage</h2>
       <LineChart data={cpuData} color="#61dafb" />
     </div>
     <div className="chart-section line-chart-wrapper">
       <h2>Network Traffic</h2>
       <LineChart data={networkData} color="#27ae60" />
     </div>
     ```
   - `.charts-row` flex-wrap will push the new charts to the next row as needed

4. **Add CSS styles in `src/App.css`**
   - After `.bar-chart-container` block (~line 1418), append:
     ```css
     .line-chart-container {
       display: flex;
       flex-direction: column;
       align-items: center;
     }
     .line-chart-container svg {
       max-width: 100%;
       height: auto;
       display: block;
     }
     ```
   - No new CSS files. No changes to existing `.chart-section` or `.charts-row` styles.

5. **Update `src/Dashboard.test.js`**
   - Add two new test cases: `"contains CPU Usage heading"` (`getByText("CPU Usage")`) and `"contains Network Traffic heading"` (`getByText("Network Traffic")`)
   - Optionally update `"renders at least one SVG element"` — now expects `>= 3` SVGs (or leave `>= 1` which still passes)

6. **Run smoke test**
   - `npm test -- --watchAll=false` — confirm Dashboard renders without crashing and all tests pass

## Data/API Notes

- No API calls, no backend, no localStorage
- All data is static mock arrays defined at module level in `src/Dashboard.js`
- `LineChart` props contract:
  ```
  data: Array<{ label: string, value: number }>
  color: string       // CSS color, e.g. "#61dafb"
  title: string       // not used by component, rendered by parent <h2>
  ```

## UI Notes

- No routing changes (`src/App.js` untouched)
- `.line-chart-wrapper` reuses existing `.chart-section` styles
- Chart dimensions: 400×220 viewBox (matches BarChart)
- Grid lines: `stroke="rgba(255,255,255,0.1)"`, labels `fill="#8892b0" fontSize="11"` (matches BarChart)
- Axis labels: `fill="#e6f1ff"` (spec design notes)
- Line stroke: `2.5px`, rounded caps/joins via `strokeLinecap="round" strokeLinejoin="round"`
- Data circles: `r=4`, fill matches line color
- `.line-chart-container` flex column + center (follows `.bar-chart-container` pattern)

## Tests

- **Existing tests must still pass** (render, headings, SVG count, legend, bar labels)
- New assertions for `"CPU Usage"` and `"Network Traffic"` headings
- Test file: `src/Dashboard.test.js`
- Run: `npm test -- --watchAll=false`

## Risks

- **LineChart with `<polyline>` vs `<path>`**: `<polyline points="...">` is simpler and sufficient for static data. If smooth curves are desired later, switch to `<path d="M...C...">` — out of scope for this story.
- **Dependency on existing layout**: `.charts-row` has `max-width: 1000px`. With 2 new 460px-max charts, `flex-wrap` pushes them to a new row on most viewports. This is expected and acceptable.
- **No test for SVG content**: The LineChart is presentation-only, no state. The heading assertion + existing SVG count test provide adequate smoke coverage.
- **Ordering constraint**: Steps 1–4 can be done in any order, but Step 5 (test update) must come after Step 3 (JSX change). Step 6 (run tests) must be last.

## Context Budget

The coding agent should read these files only:
1. `docs/ai/stories/DS-26/spec.md` — requirements
2. `src/Dashboard.js` — to understand existing component patterns and placement
3. `src/App.css:1344-1418` — existing chart CSS patterns
4. `src/Dashboard.test.js` — existing test patterns
5. `docs/ai/stories/DS-26/implementation-plan.md` — this plan

Do NOT read `src/App.js`, `src/index.js`, or any page/component outside the Dashboard. Do NOT read any CSS outside the chart section. Scope is strictly `Dashboard.js` + chart portion of `App.css` + `Dashboard.test.js`.

## Handoff

Story: DS-26 — Add 2 pure-SVG line charts to Dashboard (change request: 2 charts instead of 1).

**State for coding agent**: All source files read and analyzed. The plan above is ready to execute. Start with Step 1 (add mock datasets to `src/Dashboard.js`), then Step 2 (create reusable `LineChart` component), Step 3 (wire into JSX), Step 4 (CSS), Step 5 (tests), Step 6 (smoke test). The dashboard already has `PieChart` and `BarChart` patterns you can mirror exactly.

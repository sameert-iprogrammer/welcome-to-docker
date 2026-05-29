## Story Summary
Add a mock SVG-based line chart (no libraries) to the Dashboard page alongside the existing pie and bar charts, following the same pure-SVG pattern already used by PieChart and BarChart in `src/Dashboard.js`.

## Requirements
- Add a new inline LineChart component within `src/Dashboard.js` using pure SVG (no Chart.js, no other dependencies)
- Display the line chart in a new `.chart-section` within the existing `.charts-row` in the Dashboard
- Use mock/static data (no backend, no API calls, no localStorage)
- Follow the same visual style and color palette as the existing PieChart and BarChart

## Acceptance Criteria
- A line chart renders on the Dashboard page without crashing
- The line chart uses only SVG elements (`path`, `line`, `circle`, `text`, `g`) — no external charting libraries
- The chart displays mock data points with a plotted line, axis labels, and optional dots at data points
- The chart fits within the existing Dashboard layout (`.charts-row` flex container)
- No new CSS files are created; all styles go into `src/App.css`
- Smoke test passes: `src/Dashboard.test.js` renders Dashboard without crashing (update if needed)

## Impacted Areas
- `src/Dashboard.js` — add LineChart component + render it in the JSX
- `src/App.css` — add `.line-chart-container` and related styles

## Open Questions
- [CLARIFICATION NEEDED] Should the line chart replace one of the existing charts, or be added alongside them as a third chart? The spec assumes it is added as a third chart wrapped within `.charts-row` (flex-wrap will push it to a new row).
- [CLARIFICATION NEEDED] What mock data should the line chart display? Options: "Container CPU Usage Over Time", "Network Traffic (MB/s)", or "Docker Pulls per Day". Assumption: "CPU Usage Over Time" (6-8 data points).

## Assumptions
- LineChart follows the same inline-SVG pattern as PieChart and BarChart (local component in `src/Dashboard.js`, not a separate file)
- LineChart uses existing color variables (`#61dafb`, `#1d63b8`, `#27ae60`, `#e74c3c` from `src/App.css`)
- LineChart dimensions match existing charts (~400x220 SVG viewBox)
- The chart area in `.charts-row` with `flex-wrap: wrap` naturally accommodates the third chart

## UI Notes
- Follow existing BEM-ish naming: `.line-chart-container` (cf. `.pie-chart-container`, `.bar-chart-container`)
- Chart title: e.g., "CPU Usage" — same `<h2>` within a `.chart-section` wrapper
- Use `rgba(255,255,255,0.1)` for grid lines (see `src/App.css:89` for existing pattern)
- Use `#e6f1ff` for axis labels, `#8892b0` for tick labels (match existing chart aesthetics)
- Line stroke should be ~2-3px, rounded caps
- Data point circles: radius ~4px with fill matching line color
- Follow `.bar-chart-container` pattern: `display: flex; flex-direction: column; align-items: center;`
- Keep `svg { max-width: 100%; height: auto; display: block; }` pattern

## Implementation Notes
- Add LineChart as a local arrow function component above the Dashboard export in `src/Dashboard.js` (same pattern as PieChart at line 27 and BarChart at line 72)
- Mock data structure: array of `{ label, value }` objects, same shape as `barData` (line 18-25)
- SVG approach: compute `<polyline>` or sequential `<path d="M...L...">` from data points, with x/y scaling based on chart dimensions
- Add grid lines and axis labels matching the BarChart pattern (lines 85-96 of `src/Dashboard.js`)
- Render the new LineChart inside a `.chart-section.line-chart-wrapper` div in the `.charts-row` (after the existing `.bar-chart-wrapper`)
- No routing changes (`src/App.js` untouched), no state management changes, no new dependencies
- **Governance check**: "no library" requirement aligns with governance-agent.md — this project must not add charting libraries. Pure SVG is the correct approach.

## Test Notes
- Verify existing `src/Dashboard.test.js` still passes (or create one if absent — no test files currently exist per `docs/ai/project-context.md:60`)
- Smoke test: render `<Dashboard />` without crashing via `npm test -- --watchAll=false`
- The LineChart is presentation-only (mock data, no state), so no logic tests needed

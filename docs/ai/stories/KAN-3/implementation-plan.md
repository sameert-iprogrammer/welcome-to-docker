## Source

- **Story key**: KAN-3 — Dashboard Card
- **Spec**: N/A (no `spec.md` exists; setup inputs used as source of truth)
- **Figma context**: `.opencode/executions/exec-a48a4ef7-dfd4-4d4e-8e59-93c23e12ff5a/figma-context.md` + `figma-context.json`
- **Project context**: `docs/ai/project-context.md`
- **SDLC rules**: `.opencode/agents/_sdlc-rules.md`

## Target Files

| Action | File |
|--------|------|
| **Modify** | `src/Dashboard.js` |
| **Modify** | `src/App.css` |
| **Create** | `src/DashboardCard.js` (new component) |
| **Create** | `src/DashboardCard.test.js` (smoke test) |
| **(Optional) Modify** | `public/index.html` (add Google Fonts link for Inter) |

## Steps

1. **Add Inter font to `public/index.html`** (if not already present via CDN) — insert a `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">` in `<head>` to match Figma's Inter Bold usage. Skip if already present.

2. **Create `src/DashboardCard.js`** — new functional component rendering the card from Figma:
   - Outer `.dashboard-card` wrapper (light background `#FBF7FF`, purple border `#E4CCFF`, rounded corners).
   - `<h1>` "Enter your team name" (120px bold, dark `#1E1E1E`, letter-spacing `-2.76px`).
   - `<h2>` "Roadmap review" (40px bold, dark `#1E1E1E`, letter-spacing `-0.88px`).
   - Status badge `.dashboard-card-status` with purple fill (`#9747FF`) and text "NOT STARTED".
   - No props, no state, no backend — pure presentational.

3. **Add CSS to `src/App.css`** — append classes:
   - `.dashboard-card` — flex column, padding, bg `#FBF7FF`, border `2px solid #E4CCFF`, border-radius, max-width, box-shadow.
   - `.dashboard-card h1` — font-family `Inter, sans-serif`, 120px bold, `#1E1E1E`, letter-spacing `-2.76px`.
   - `.dashboard-card h2` — font-family `Inter, sans-serif`, 40px bold, `#1E1E1E`, letter-spacing `-0.88px`.
   - `.dashboard-card-status` — inline-block badge, bg `#9747FF`, white text, 100px height, padded, border-radius, flex center, font Inter Bold ~28px (sized to fit the 488x100 Figma box).

4. **Modify `src/Dashboard.js`** — import `DashboardCard`, render it inside `.dashboard-content` **above** the existing `.metrics-grid`.

5. **Create `src/DashboardCard.test.js`** — smoke test following project pattern (`MemoryRouter` wrapper even if no routing deps, `render`, check "Enter your team name" text exists).

6. **Verify** — run `npm test -- --watchAll=false` and `npm run build` to confirm no regressions.

## Data/API Notes

- No backend integration. No API calls. No state changes.
- Purely presentational: static text and styling.

## UI Notes

- Card placed **above** the existing metric cards in `.dashboard-content`.
- Figma card dimensions: 1792×816 (accounts for full content area width with sidebar).
- Light background card (`#FBF7FF`) contrasts with the dark blue dashboard (`#003f8c`).
- Inter font added via Google Fonts CDN to match Figma's Inter Bold.

## Tests

- **New**: `src/DashboardCard.test.js` — smoke test rendering without crashing, text assertions for "Enter your team name" and "NOT STARTED".
- **Verify existing**: `npm test -- --watchAll=false` must pass.

## Risks

- Google Fonts CDN: requires network for first load; existing pattern already loads Font Awesome from CDN so this is acceptable.
- Font size 120px may overflow on narrow viewports — add `overflow-wrap: break-word` and responsive `max-width`; Figma doesn't show mobile variant so keep desktop-first with basic overflow protection.
- The `Inter` font PostScript name is `Inter-Bold` in Figma — use CSS `font-weight: 700` to ensure bold renders correctly.
- Card background is light (`#FBF7FF`) against dark dashboard — ensure proper contrast for accessibility (already good: dark text on light bg).

## Context Budget

| File | Read | Write | Notes |
|------|------|-------|-------|
| `src/Dashboard.js` | ✅ Read above | ✅ Modify (import + render) | ~5 lines changed |
| `src/App.css` | ✅ Read above | ✅ Append ~40 lines CSS | New classes only |
| `src/DashboardCard.js` | — | ✅ Create | ~25 lines |
| `src/DashboardCard.test.js` | — | ✅ Create | ~15 lines |
| `public/index.html` | ✅ (known pattern) | ☐ Optional | Inter CDN link only |
| Everything else | ❌ | ❌ | No reads/writes needed |

No full-file or repo-wide reads required beyond what's already loaded in this plan. Agent should scope reads to the 5 files listed above.

## Handoff

All upstream context (Figma JSON, project-context, SDLC rules) has been read and distilled. The code-implementer should:

1. Open `src/Dashboard.js`, `src/App.css`, `public/index.html` for targeted edits.
2. Create `src/DashboardCard.js` and `src/DashboardCard.test.js` from scratch.
3. Follow CSS class naming conventions (BEM-ish: `.dashboard-card`, `.dashboard-card-status`).
4. Run `npm test -- --watchAll=false` and `npm run build` to validate.
5. Do NOT modify any other files, add dependencies, or introduce backend logic.

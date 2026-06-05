# Implementation Plan: KAN-2 — Add Loyalty Points

## Source

- **Story input** (no spec.md exists): KAN-2 "Add Loyalty Points" — sidebar link + loyalty points page matching Figma design
- **Figma design**: `.opencode/executions/exec-17a1993b-cb79-4771-9291-a9804c0cfe00/figma-context.md` + `figma-context.json` (node "Instructions", 800x1907, purple-bg layout with title section, numbered step blocks, dividers)
- **Project context**: `docs/ai/project-context.md` (React SPA, react-router v6, plain CSS, Font Awesome CDN, flat `src/` structure)
- **SDLC rules**: `.opencode/agents/_sdlc-rules.md`

## Target Files

| Action | File |
|--------|------|
| **Modify** | `src/Sidebar.js` — add nav item |
| **Create** | `src/LoyaltyPoints.js` — new page component |
| **Modify** | `src/App.js` — register route `/loyalty-points` |
| **Modify** | `src/App.css` — add LoyaltyPoints page styles |
| **Create** | `src/LoyaltyPoints.test.js` — smoke test |

## Steps

### 1. Add nav item to `src/Sidebar.js`

- Add to `navItems` array (after FAQ entry):
  ```js
  { label: "Add Loyalty Points", path: "/loyalty-points", icon: "fa-solid fa-star" }
  ```
- `fa-solid fa-star` is available via the existing Font Awesome 6.4.2 CDN.

### 2. Create `src/LoyaltyPoints.js`

Pattern: Match `src/Approvals.js` structure (functional component, imports Sidebar, wrapped in `App App--sidebar`).

**Component structure:**
- Import `Sidebar` from `"./Sidebar"`
- Render `<div className="App App--sidebar"><Sidebar /><div className="loyalty-points-container">...</div></div>`

**Page content (following Figma design):**
- **Header section** (`.loyalty-points-header`):
  - Eyebrow text: `<span className="loyalty-points-eyebrow">LOYALTY PROGRAM</span>`
  - Title: `<h1 className="loyalty-points-title">Loyalty Rewards Program</h1>`
  - Description: `<p className="loyalty-points-desc">Earn points with every purchase and redeem them for exclusive rewards. Learn how it works below.</p>`
- **Step 1** (`.loyalty-points-step`):
  - Thumbnail area: placeholder illustration box (`.loyalty-points-thumbnail`) with star icon or simple "YOU ARE HERE"-style text
  - Step row (`.loyalty-points-step-row`): number circle (`.loyalty-points-number`) + description text
- **Divider** (`.loyalty-points-divider`)
- **Step 2**: thumbnail + number circle "2" + description about earning points
- **Divider**
- **Step 3**: thumbnail + number circle "3" + description about redeeming points
- **Divider**
- **Step 4**: (shorter step) number circle "4" + description about referrals
- **Divider**
- **Step 5**: number circle "5" + description about points expiry

Content for steps (adapt Figma's instructional layout to loyalty points context):
- Step 1: "Sign up and create your account to start earning loyalty points automatically."
- Step 2: "Earn 10 points for every $1 spent on eligible purchases across all categories."
- Step 3: "Redeem your points at checkout — 100 points = $1 discount on your order."
- Step 4: "Refer a friend and earn 500 bonus points when they make their first purchase."
- Step 5: "Points expire after 12 months. Check your balance anytime in your profile."

### 3. Register route in `src/App.js`

- Add import: `import LoyaltyPoints from "./LoyaltyPoints";`
- Add route in the `<Routes>` block (before catch-all, after FAQ route):
  ```jsx
  <Route
    path="/loyalty-points"
    element={
      isAuthenticated ? <LoyaltyPoints /> : <Navigate to="/login" />
    }
  />
  ```

### 4. Add styles to `src/App.css`

Append after the last rule. New classes:

- **`.loyalty-points-container`**: flex: 1, padding: 40px, max-width: 800px, width: 100%, box-sizing: border-box
- **`.loyalty-points-header`**: margin-bottom: 40px
- **`.loyalty-points-eyebrow`**: display: block, font-size: 14px, font-weight: 700, color: rgba(255,255,255,0.6), text-transform: uppercase, letter-spacing: 1px, margin-bottom: 8px
- **`.loyalty-points-title`**: font-size: 32px, font-weight: 700, color: #ffffff, margin: 0 0 12px
- **`.loyalty-points-desc`**: font-size: 16px, color: #a8b2d1, line-height: 1.5, margin: 0
- **`.loyalty-points-step`**: margin-bottom: 24px
- **`.loyalty-points-thumbnail`**: background: rgba(218,157,255,0.2), border-radius: 12px, height: 200px, display: flex, align-items: center, justify-content: center, margin-bottom: 16px, border: 1px solid rgba(218,157,255,0.3)
- **`.loyalty-points-thumbnail-text`**: font-size: 24px, font-weight: 700, color: rgba(218,157,255,0.8), text-align: center (for the centered placeholder text)
- **`.loyalty-points-step-row`**: display: flex, gap: 20px, align-items: center
- **`.loyalty-points-number`**: width: 48px, height: 48px, border-radius: 50%, background: rgba(218,157,255,0.3), display: flex, align-items: center, justify-content: center, font-size: 20px, font-weight: 700, color: #ffffff, flex-shrink: 0
- **`.loyalty-points-step-desc`**: font-size: 16px, color: #e6f1ff, line-height: 1.5, margin: 0
- **`.loyalty-points-divider`**: height: 1px, background: rgba(255,255,255,0.1), margin: 32px 0, border: none
- **`.loyalty-points-container h2`**: for compact step variant (steps 4-5 without thumbnail): margin-top: 0

Keep the purple accent (#DA9DFF derived from Figma background fill color) as the accent color for elements. Main background remains the app default (#003f8c), content area uses the existing sidebar layout.

### 5. Create `src/LoyaltyPoints.test.js`

Pattern: mirror `src/Sidebar.test.js` — MemoryRouter wrapper, mock useNavigate.

```jsx
import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoyaltyPoints from "./LoyaltyPoints";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoyaltyPoints", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <LoyaltyPoints />
      </MemoryRouter>
    );
  });

  it("renders the title and sidebar", () => {
    const { getByText } = render(
      <MemoryRouter>
        <LoyaltyPoints />
      </MemoryRouter>
    );
    expect(getByText("Loyalty Rewards Program")).toBeInTheDocument();
    expect(getByText("Add Loyalty Points")).toBeInTheDocument();
  });

  it("renders step descriptions", () => {
    const { getByText } = render(
      <MemoryRouter>
        <LoyaltyPoints />
      </MemoryRouter>
    );
    expect(getByText(/Sign up and create your account/i)).toBeInTheDocument();
    expect(getByText(/Earn 10 points/i)).toBeInTheDocument();
  });
});
```

## Data/API Notes

- No backend integration — static content only (UI-only story)
- No mock data modules needed (content is hardcoded JSX text)
- Route: `/loyalty-points` (authenticated-only)
- Sidebar label: "Add Loyalty Points"
- Sidebar icon: `fa-solid fa-star`

## UI Notes

- **Sidebar**: New nav item placed after FAQ (bottom of nav list)
- **Page**: Follows existing `App--sidebar` layout pattern (Sidebar on left, content on right)
- **Design**: Purple accent theme based on Figma (#DA9DFF), numbered step layout with dividers
- **No new icon/CDN dependencies** — `fa-star` is a core Font Awesome free icon
- **Thumbnail areas**: Placeholder boxes with purple background/tint (no actual artwork/svg needed for UI-only scope)
- **Responsive**: Match existing page patterns (stack at narrow widths)

## Tests

- New file: `src/LoyaltyPoints.test.js`
- Smoke test (renders without crashing)
- Verify title text ("Loyalty Rewards Program") is present
- Verify sidebar nav item ("Add Loyalty Points") is present
- Verify at least one step description renders
- Run: `npm test -- --watchAll=false src/LoyaltyPoints.test.js`

## Risks

- **Sidebar import unchanged**: All page components import Sidebar directly. The new LoyaltyPoints component must follow the same pattern (import Sidebar, wrap in `<div className="App App--sidebar">`).
- **Route ordering**: Place `/loyalty-points` route before the catch-all `"*"` route in App.js to avoid being shadowed.
- **Auth gate**: Route must check `isAuthenticated`, same as other protected routes.
- **CSS collisions**: Prefix all new CSS classes with `loyalty-points-` to avoid collisions (existing convention: `approvals-`, `customers-`, `orders-`, `faq-`).

## Context Budget

- **Read only**: `src/Sidebar.js`, `src/App.js`, `src/App.css`, `src/Approvals.js` (page pattern reference)
- **Do NOT read**: any other page component (Orders, Customers, Products, Masters, Settings, Profile), any mock file, any config files
- **Do NOT modify**: any file outside the 5 target files listed above

## Handoff

1. Edit `src/Sidebar.js` — add nav item to `navItems` array
2. Create `src/LoyaltyPoints.js` — new page component (pattern: Approvals.js) with Figma-inspired layout
3. Edit `src/App.js` — add import + Route for `/loyalty-points`
4. Edit `src/App.css` — append all `.loyalty-points-*` classes
5. Create `src/LoyaltyPoints.test.js` — smoke test
6. Run `npm test -- --watchAll=false src/LoyaltyPoints.test.js` to verify

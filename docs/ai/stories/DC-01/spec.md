# DC-01: Implement Client-Side Login Page and Routing

## Description
As a user visiting the application, I want to encounter a secure login interface before accessing the main page, so that only users providing valid input structure can view the application dashboard.

### Context & Behavior
The application currently functions on a single root route (`/`). We need to introduce basic client-side routing to support two distinct views without a backend infrastructure:
- `/login` (New): The entry point containing the authentication form.
- `/dashboard` (Existing): The current "Congratulations" landing page container view.

---

## Acceptance Criteria

### 1. Routing & Access Control
- [ ] Set up client-side routing to support `/login` and `/dashboard` paths.
- [ ] Accessing the root path (`/`) must automatically redirect unauthenticated users to `/login`.
- [ ] If a user attempts to manually navigate to `/dashboard` without completing the login sequence, they should be redirected back to `/login` (mock route guard).

### 2. UI Components (`/login`)
- [ ] Implement a clean, responsive login card centered on the screen.
- [ ] Email Input: Must include client-side validation for proper email format (`type="email"`).
- [ ] Password Input: Must obscure characters (`type="password"`).
- [ ] Submit Button: A prominent button labeled "Login" or "Sign In".

### 3. Authentication Logic (Mock)
- [ ] The submission process will execute entirely on the frontend (no backend API integration required).
- [ ] Upon clicking the submit button with filled inputs, persist a mock session token (e.g., in `localStorage` or local component state).
- [ ] Successfully triggering submission must immediately redirect the user to the `/dashboard` path.

### 4. Dashboard View (`/dashboard`)
- [ ] The current landing page displaying "Congratulations!!! You ran your first container" must now live exclusively on this protected route.

---

## Technical & Architecture Constraints

- **Technology Stack**: React v18.2.0 (Single Page Application via `react-scripts`).
- **Client-Side Routing Approach**: Since we must not introduce external libraries or packages without explicit approval, routing should be implemented using a simple, lightweight custom React state-based router or pathname listener (e.g., using `window.location.pathname` or a simple route-state hook). This keeps the footprint small and avoids installing `react-router-dom` unless explicitly requested.
- **Styling Architecture**: Vanilla CSS exclusively (`src/App.css` and `src/index.css`). Utility frameworks (like TailwindCSS) or CSS-in-JS libraries are strictly prohibited. The login card should use standard CSS rules defined inside these stylesheets, aligning with the existing styles and cohesive with the main blue brand color seen on the current landing page.
- **State Management**: Use React Hooks (`useCallback`, `useState`, `useEffect`) exclusively for minimal reactive state. Do not introduce any external state management libraries (Redux, Context API, etc.).
- **Security Rules**:
  - No secrets or credentials committed to the codebase.
  - All external anchor tags targeting `_blank` must include `rel="noopener noreferrer"` to prevent reverse tab-nabbing.
- **Asset/Footprint Budget**: No large images, fonts, or external assets should be added to `/public` or `/src`. Keep the bundle size optimized.

---

## UI & Accessibility Notes

- **Layout**: Center the login card vertically and horizontally on the viewport. Use a high-quality, modern, and polished design with standard CSS styles (e.g., modern typography, subtle borders, box shadow, cohesive blue primary brand colors).
- **Semantics**: Use correct HTML5 semantic tags: `<header>`, `<main>`, `<form>`, `<input>`, `<button>`.
- **Accessibility**: Include standard label elements or descriptive `aria-label` attributes for both input fields and the submit button.
- **Confetti Trigger**: The existing confetti particle rendering (`src/Confetti.js`) should only run when the dashboard view is active.

---

## Assumptions & Open Questions

### Assumptions
1. **Mock Authentication**: Any non-empty password and properly formatted email is considered valid.
2. **Client-Side Routing**: Handled natively in React state or `window.location.pathname` to prevent dependency size increases.
3. **Session State**: Standard local persistence (e.g., a simple token key in `localStorage` such as `isLoggedIn = "true"` or similar) is sufficient to mock the session.

### Open Questions
- Should the mock session be cleared upon closing the tab/browser (`sessionStorage`) or remain persistent across sessions (`localStorage`)? *Plan: Default to localStorage or simple state persistence as indicated in the description, or make it clearable via a logout mechanism if requested later.*

---

## Verification Plan

### Automated Tests
- [ ] Run `npm test` to ensure all existing tests pass and verify that new logic does not break existing test suites.

### Build and Package Verification
- [ ] Run `npm run build` to verify the static build compiles without errors or warnings.
- [ ] Verify the Docker build compiles successfully:
  ```bash
  docker build -t welcome-to-docker .
  ```
- [ ] Verify that running the container serves the app correctly on port `8088`:
  ```bash
  docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker
  ```
- [ ] Manually verify behavior at `http://localhost:8088`:
  - Check that visiting `http://localhost:8088/` or `http://localhost:8088/dashboard` when unauthenticated redirects to `/login`.
  - Validate email format handling.
  - Submit login and verify transition to the dashboard with confetti particle animations.
  - Verify browser console does not contain any errors or warnings.

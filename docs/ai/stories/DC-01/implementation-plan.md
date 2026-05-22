# DC-01: Implement Client-Side Login Page and Routing

## User Review Required

> [!IMPORTANT]
> - **Routing Framework**: Since we must not introduce external dependencies (e.g., `react-router-dom`), routing is implemented using a custom, ultra-lightweight client-side router powered by React state, standard browser history APIs (`window.history.pushState`), and a `popstate` event listener.
> - **Authentication Mechanics**: The entire sequence operates purely client-side. The session is persisted via `localStorage` with a key named `isAuthenticated`.
> - **User Experience Addition**: A subtle "Log Out" action will be integrated into the dashboard to allow end-to-end traversal of the login and logout flows seamlessly.

---

## Open Questions

> [!NOTE]
> There are no outstanding blocker questions. We will proceed with the client-side `localStorage` state approach for simple persistent sessions as detailed in the specifications.

---

## Context Budget

The implementer should follow these strict context efficiency rules:
- **Inspect target files first** and avoid broad repository scans or wildcards.
- **Open non-target files only** when absolutely necessary for direct imports, caller contexts, or configuration details.
- **Use provider-native edit tools directly** (like `replace_file_content` or `multi_replace_file_content`) and avoid printing full file contents, full diffs, or large code blocks in the chat workspace.
- **Run only the specific validation commands** needed for the changed surface (e.g., testing, building, and running the target Docker container).

---

## Target Files

The implementer should create or modify the following repo-relative files:
- `src/App.js` [MODIFY]: Houses the routing shell, pathname change listener, and route guards.
- `src/App.css` [MODIFY]: Contains centering layouts, login card styles, responsive input rules, and interactive brand styles.
- `src/Login.js` [NEW]: Implements the custom login screen featuring semantic form validation, obscure fields, and standard accessibility patterns.
- `src/Dashboard.js` [NEW]: Contains the protected "Congratulations" landing page container view, social share actions, and standard logout triggers.

---

## Proposed Changes

Grouped logically by architectural dependency.

### Core Routing and Styling Shell

#### [MODIFY] [App.js](file:///Users/sameert/Documents/projects/learning/welcome-to-docker/src/App.js)
- Add React hooks (`useState`, `useEffect`, `useCallback`) to manage the current client-side route path (`window.location.pathname`).
- Implement the client-side router and route guards:
  - Expose a `navigateTo(path)` action to push paths onto the history stack (`window.history.pushState`) and update the local route state.
  - Subscribe to standard browser back/forward buttons using the `popstate` event listener.
  - Enforce route-guard logic:
    - If unauthenticated (`localStorage.getItem('isAuthenticated') !== 'true'`) and accessing any route other than `/login`, automatically redirect to `/login`.
    - If authenticated and attempting to view `/login` or `/`, redirect automatically to `/dashboard`.
- Render the appropriate view (`<Login />` or `<Dashboard />`) conditionally based on the active path state.

#### [MODIFY] [App.css](file:///Users/sameert/Documents/projects/learning/welcome-to-docker/src/App.css)
- Implement a flex/grid centering rule to center the login container perfectly inside the viewport.
- Design a premium, modern login card:
  - Cohesive dark-blue color theme using the Docker palette (`#003f8c`, active/hover `#1D63B8`).
  - Subtle shadows, modern typography, rounded borders, and scale transition micro-animations.
  - Smooth focus borders and box-shadow outlines for active fields.
- Make the login card layout fully responsive, adapting seamlessly to small mobile viewports.

---

### View Components

#### [NEW] [Login.js](file:///Users/sameert/Documents/projects/learning/welcome-to-docker/src/Login.js)
- A highly structured, modular login form:
  - Semantic `<form>` wrapping inputs to support native submission and keyboard submission (Enter).
  - Obscured password field (`type="password"`) and proper email-validated field (`type="email"`).
  - Clear descriptive `<label>` elements and explicit `aria-label` tags for enhanced screen reader support.
  - Triggers the persistence of `isAuthenticated = 'true'` in `localStorage` on submit and redirects to `/dashboard`.

#### [NEW] [Dashboard.js](file:///Users/sameert/Documents/projects/learning/welcome-to-docker/src/Dashboard.js)
- House the existing landing page template, migrating it out of the old `App.js`:
  - "Congratulations!!! You ran your first container" heading and description text.
  - Social media share links (X, LinkedIn, Reddit) with `target="_blank"` and strict security parameter `rel="noopener noreferrer"`.
  - The confetti particle component (`<Confetti />`) so that particle emitters only instantiate and animate when the dashboard view is active.
  - Introduce a subtle "Logout" action that clears `localStorage` session state and redirects to `/login`.

---

## Verification Plan

### Automated Tests
- Run `npm test` to verify that existing test suites remain functional and pass without errors.

### Manual Verification
1. **Static Build Check**: Run `npm run build` to confirm the production distribution bundle compiles cleanly without warnings or errors.
2. **Container Build Verification**: Build the local Docker image:
   ```bash
   docker build -t welcome-to-docker .
   ```
3. **Container Service Launch**: Run the multi-platform target container mapping to port `8088`:
   ```bash
   docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker
   ```
4. **Behavioral and Navigation Checks** at `http://localhost:8088`:
   - Navigate to `/` -> Ensure instant redirection to `/login`.
   - Navigate manually to `/dashboard` while unauthenticated -> Ensure instant redirect to `/login`.
   - Test invalid email format -> Ensure the native browser validation blocks submission.
   - Enter standard credentials, submit the form -> Ensure instant URL change to `/dashboard`, execution of the confetti animation, and display of the congratulatory banner.
   - Refresh the page at `/dashboard` -> Verify you remain on the dashboard.
   - Click the "Logout" button -> Verify redirection back to `/login` and that direct access to `/dashboard` is once again restricted.

---

## Assumptions & Risks

### Assumptions
- **Authentication**: No backend server connection is needed. Any standard syntax-valid email address combined with a non-empty password is authenticated successfully.
- **Client-Side Routing**: Direct address bar entries are routed correctly. The base image serving process utilizes `serve -s build`, which maps all unknown sub-routes back to `index.html`, allowing client-side routes like `/login` or `/dashboard` to load without raising HTTP 404 errors.

### Risks
- **Global CSS Pollution**: Ensure styling definitions are prefixed with isolated classes (such as `.login-page-container` or `.login-card`) to avoid stylesheet overrides on other page views.

# Governance AI Agent Rulebook

This document defines the strict governance rules, security controls, architectural constraints, and operational guidelines for all AI agents and automated workflows operating within the `welcome-to-docker` repository.

All AI agents MUST first read and strictly adhere to the shared SDLC rules defined in [.opencode/agents/_sdlc-rules.md](file:///.opencode/agents/_sdlc-rules.md) in addition to this document.

---

## 1. Project Type and Technology Assumptions

### 1.1 Project Context & Purpose
The `welcome-to-docker` repository contains a minimal, extremely lightweight React web application. Its sole purpose is to serve as the default "first-run container" for new Docker users. It displays a "Congratulations" heading, triggers a confetti/particle animation, and provides social sharing links.

> [!IMPORTANT]
> The primary operational goal of this repository is to maintain an extremely small Docker image footprint and a simple, lightning-fast load time. Any changes that inflate the image size, introduce heavy external libraries, or add latency violate the core purpose of this project.

### 1.2 Technology Stack
*   **Frontend Library**: React 18.2.0 (Single Page Application created via Create React App / `react-scripts` 5.0.1).
*   **Styling**: Vanilla CSS (`src/App.css` and `src/index.css`). Utility-first or CSS-in-JS frameworks (such as TailwindCSS or Styled Components) are not permitted.
*   **Animations**: `react-particles` and `tsparticles` (v2.9.3) for the confetti particle effect.
*   **Infrastructure / Containerization**:
    *   **Base Image**: `node:22-alpine` (providing a tiny and secure Node runtime environment).
    *   **Production Hosting**: Served via the lightweight `serve` NPM package (`serve -s build`).
    *   **Exposed Port**: Port `3000` inside the Docker container, mapped locally during execution.
    *   **Multi-Platform Target**: `linux/amd64` and `linux/arm64` via Docker Buildx.
*   **Branching & CI/CD Workflow**:
    *   `main`: Active development branch for testing and adding changes.
    *   `small-image`: The production branch used for building the final Docker Hub image `docker/welcome-to-docker:latest`.
    *   **Sync Automation**: A GitHub Action (`.github/workflows/merge-main-into-small-image.yml`) automatically merges changes from `main` into `small-image` whenever a pull request targeting `main` is merged.

---

## 2. Core Constraints: Preventing Unsafe & Unrelated Code Changes

*   **Zero-Unrelated-Edits**: Agents MUST NOT perform speculative enhancements, cleanups, formatting modifications (unless directly requested), or refactors on untouched parts of the codebase.
*   **Simplicity Preservation**: The application is meant for beginners. Do not add complex state management, routing, telemetry, tracking scripts, or excessive animations.
*   **Footprint Budget**:
    *   Node dependencies must not be added. The `node_modules` are stripped from the final Docker build, but installing large dev or prod dependencies increases build time.
    *   The production bundle should be kept within a strict size limit.
*   **No Unapproved Public Assets**: Do not add large images, videos, or binary files to `/public` or `/src` without explicit approval. Currently, only `favicon.ico` is allowed.

---

## 3. Code Quality & Linting Rules

*   **No Dead or Unused Code**: Every import, function, variable, or constant must be actively used. Unused imports, redundant console logs, or orphaned variables are strictly forbidden.
*   **Linting Standards**:
    *   Adhere to the `eslintConfig` rules inherited from `react-app` and `react-app/jest` defined in `package.json`.
    *   Ensure all code compiles clean of warning or lint alerts before handoff.
*   **Styling Consistency**:
    *   Maintain the existing class-based CSS architecture. Avoid adding inline styles unless dynamically calculated. Keep components clean of inline JSX styles.

---

## 4. Architecture & Design Rules

*   **Component Anatomy**:
    *   Keep components fully modular and small. Currently, the app comprises `src/App.js` and `src/Confetti.js`.
    *   If a new UI feature is requested, encapsulate it within its own file under `src/` (e.g., `src/ShareButton.js` or similar) rather than dumping huge JSX blocks into `src/App.js`.
*   **Minimal/Stateless Flow**:
    *   Use React Hooks (`useCallback`, `useState`, `useEffect`) exclusively for minimal reactive state.
    *   Do not introduce Redux, Context API, MobX, or other external state machines.
*   **Semantic HTML & Accessibility**:
    *   Use semantic elements (`<header>`, `<main>`, `<h1>`, `<p>`, `<a>`).
    *   Follow proper accessibility conventions: all images must have an `alt` attribute, and buttons/links must have clear text or `aria-label` tags.

---

## 5. Security Rules

*   **Zero Secrets**: Under no circumstances should any API keys, tokens, developer credentials, or environment-specific values be committed to the repository.
*   **Safe External Links**:
    *   All external anchor tags (`<a>`) targeting `_blank` must strictly include `rel="noopener noreferrer"` to prevent reverse tab-nabbing vulnerabilities. (See current implementation in `src/App.js` lines 17-53).
*   **Secure Base Images**:
    *   The `Dockerfile` must continue utilizing official alpine-based slim images (e.g., `node:22-alpine`) to minimize vulnerability exposure.
*   **No Unsanitized Inputs**:
    *   Since the application handles social sharing URLs, ensure that any URL generation is fully sanitized and escaped. No direct `dangerouslySetInnerHTML` injections.

---

## 6. Testing & Verification Expectations

Because the repository does not run intensive CI-based automated tests on every push, the AI agent is heavily responsible for local validation before submitting pull requests:

### 6.1 Local Build Verification
Before finishing work, the agent must run the production build process to ensure the React bundle compiles without errors, warnings, or chunk size issues:
```bash
npm run build
```

### 6.2 Local Docker Container Verification
Every change affecting code or packaging must be verified using the local Docker pipeline:
1. Build the Docker image locally:
   ```bash
   docker build -t welcome-to-docker .
   ```
2. Run the container mapping host port 8088 to container port 3000:
   ```bash
   docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker
   ```
3. Verify that the app loads properly on `http://localhost:8088` and check the browser console for any warnings or runtime errors.

### 6.3 Test Automation
If components are modified or added, ensure Jest tests under `react-scripts test` are run and verify that all test suites pass.

---

## 7. File & Folder Modification Constraints

### 7.1 Protected Configs (Strictly Read-Only)
*   `.github/workflows/merge-main-into-small-image.yml`: Must not be modified or deleted, as it controls critical branch synchronization.
*   `package.json` / `package-lock.json`: Do not modify unless adding an explicitly requested package or adjusting configuration scripts.
*   `.gitignore` & `.dockerignore`: Must not be modified or bypassed.

### 7.2 Safe Application Code (Mutable)
*   `src/App.js`, `src/Confetti.js`, `src/App.css`, `src/index.css`: Allowed to modify when implementing verified UI enhancements, social link updates, or bug fixes.
*   `public/index.html` & `public/robots.txt`: Allowed to modify if meta tags, search engine rules, or core markup require authorized edits.

---

## 8. Dependency Usage Rules

*   **Anti-Dependency Bloat**:
    *   To maintain the optimal first-run experience, do not install packages for utilities that can easily be written natively (e.g., custom hooks, simple styles, standard network fetch, social sharing buttons).
    *   External JS libraries are strictly forbidden unless explicitly requested in the story definition.
*   **Development Tooling**:
    *   Maintain the clean, lightweight environment of CRA without introducing complex bundler overrides (e.g., `craco`, `react-app-rewired`) unless specifically instructed.

---

## 9. AI Development & Handoff Checklist

Before completing a task, the AI agent MUST verify:

- [ ] **Traceability**: Every change is traceable to the task/issue description.
- [ ] **Scope Minimization**: No unrelated lines of code were modified, reformatted, or removed.
- [ ] **Security**: No secrets, credentials, or unencrypted variables are checked in.
- [ ] **Best Practices**: All external `target="_blank"` anchor tags include `rel="noopener noreferrer"`.
- [ ] **Build Validation**: The production build (`npm run build`) runs and completes without errors or warnings.
- [ ] **Docker Validation**: The local Docker build succeeds (`docker build -t welcome-to-docker .`) and runs successfully on port 8088 with no runtime console errors.
- [ ] **Dependency Check**: No new dependencies have been added to `package.json` without explicit approval.
- [ ] **Handoff Summary**: A concise, token-efficient handoff summary of all modifications and validations is generated.

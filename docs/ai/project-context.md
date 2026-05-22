# Project Context

## Stack
- **Frontend Framework**: React v18.2.0 (Single Page Application via Create React App / `react-scripts` v5.0.1)
- **Rendering & DOM**: `react-dom` v18.2.0
- **Animations**: Particle confetti effect powered by `react-particles` and `tsparticles` v2.9.3
- **CSS Icons**: FontAwesome Free v6.4.2 loaded via CDN in `public/index.html`
- **Hosting Platform**: Served via `serve` NPM package in production
- **Containerization**: alpine-based runtime container using `node:22-alpine` as standard base image

## Commands
- `npm start`: Start the local React development server via `react-scripts`
- `npm run build`: Build the production-ready optimized static React assets into `build/`
- `npm test`: Run automated unit tests using Jest
- `docker build -t welcome-to-docker .`: Build the production multi-platform target Docker image locally
- `docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker`: Run the container mapping host port `8088` to container port `3000` (`serve -s build`)

## Folder Map
- `.github/workflows/`: Automation pipelines, including branch synchronization (`merge-main-into-small-image.yml`)
- `.opencode/agents/`: Definitive rulebooks and SDLC guidelines for AI workflows
- `docs/ai/`: Indexing and context artifacts for AI agents
- `public/`: Public static web assets (`index.html`, `favicon.ico`, `robots.txt`)
- `src/`: Mutable frontend React application components and Vanilla CSS styling

## Architecture Rules
- **No Complex Global State**: External state management engines (Redux, MobX, Context API) are forbidden. React Hooks (`useCallback`, `useState`, `useEffect`) manage minimal state.
- **No Client-Side Routing**: The application is a single static screen with a confetti trigger and social share buttons.
- **Production Asset Delivery**: Static production bundle is served via lightweight standard npm `serve` command on port `3000`.
- **Target Image Size Optimization**: Strip development dependencies and compile React assets; ensure minimal alpine node image base footprint.
- **Branch Synchronization Pipeline**: Development is done on `main`. Pull requests merged into `main` trigger a GitHub action merging changes to the production build branch `small-image` automatically.

## Testing Rules
- Jest unit tests are configured through `react-scripts test`. Run `npm test` to verify.
- AI agents are heavily responsible for manual container verification locally before submitting PRs.
- Local container lifecycle validation must run using:
  1. `docker build -t welcome-to-docker .`
  2. `docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker`
  3. Validate UI loads at `http://localhost:8088` and inspect console for errors.

## Styling and Component Rules
- **Styling Architecture**: Vanilla CSS is used exclusively (`src/App.css` and `src/index.css`). Utility frameworks (TailwindCSS) or CSS-in-JS (Styled Components) are not permitted.
- **Component Anatomy**: Code must be modular. Keep components clean, small, and distinct (e.g., separate animation in `src/Confetti.js` from structural markup in `src/App.js`). Avoid inline styles in React JSX files.
- **Accessibility & Semantics**: Use HTML5 semantic elements (`<header>`, `<main>`, `<h1>`, `<p>`, `<a>`) with precise `aria-label` or description texts.

## Common Paths
- [.opencode/agents/_sdlc-rules.md](file:///.opencode/agents/_sdlc-rules.md): Shared SDLC core constraints and execution guidelines.
- [.opencode/agents/governance-agent.md](file:///.opencode/agents/governance-agent.md): Strict security, performance budgets, and file modification constraints.
- [package.json](file:///package.json): Package metadata, npm scripts, and dependencies configuration.
- [Dockerfile](file:///Dockerfile): Container image compilation sequence.
- [src/App.js](file:///src/App.js): Core application page framework.
- [src/Confetti.js](file:///src/Confetti.js): Confetti particles rendering component.

## Deeper Docs
- [MAINTAINERS.md](file:///MAINTAINERS.md): Maintainer guidelines and release structure notes.

## Agent Notes
- **DO NOT** perform speculative enhancements, cleanups, or styling refactors on unrelated parts of the codebase.
- **DO NOT** introduce any external packages or libraries without explicit approval.
- **ALWAYS** check that external `target="_blank"` anchor tags include `rel="noopener noreferrer"` to avoid reverse tab-nabbing.
- **ALWAYS** run local production build checks (`npm run build`) and Docker container validation to ensure clean builds.
- **REFER** to [.opencode/agents/governance-agent.md](file:///.opencode/agents/governance-agent.md) for full quality budgets, strict security controls, and read-only protected configuration files.

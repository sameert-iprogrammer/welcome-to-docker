# Project Technical Specification

This document describes the overall architecture, technology choices, and implementation details for the entire project.

---

# Technical Specification: Docker Business Management Application

## Architecture Overview

A single-page application (SPA) built with React 18 and Create React App (CRA), deployed as a containerized Node.js application. The architecture is entirely client-side with no backend services, relying on localStorage for session state and mock data for all business logic. The application uses a flat component structure organized by feature/page, with no state management framework (Redux, Context API), only local component state via React hooks.

```
┌──────────────────────────────────────────┐
│      React SPA (React Router v6)        │
│  ┌──────────────────────────────────────┐│
│  │  App Component (Routing & Auth)      ││
│  │  ├─ Login / Register (Public)        ││
│  │  ├─ Dashboard (Protected)            ││
│  │  ├─ Orders / Customers / Products    ││
│  │  ├─ Masters / Approvals / Sessions   ││
│  │  ├─ Profile / Settings / FAQ         ││
│  │  └─ Navbar / Sidebar (Navigation)    ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │  Browser localStorage (Persistence) ││
│  │  - isAuthenticated flag              ││
│  │  - registeredUsers JSON array        ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
        │
        ├─ Font Awesome 6.4.2 CDN (Icons)
        ├─ react-particles / tsparticles (Confetti)
        ├─ react-toastify (Notifications)
        └─ (No backend API calls)
```

## Technology Stack

### Frontend Framework & Build
- **React 18.2.0**: Modern UI framework with hooks (useState, useEffect, useMemo, useCallback)
- **Create React App 5.0.1**: Zero-configuration build tool; Webpack + Babel bundling
- **React DOM 18.2.0**: DOM rendering for React components
- **Node.js 22 (Alpine)**: Runtime for build and production serving

### Routing & Navigation
- **React Router DOM v6.30.3**: Client-side routing with `BrowserRouter`, `Routes`, `Route`, `Navigate` components; hash/pushState navigation

### UI & Styling
- **Plain CSS (src/App.css)**: 272 lines; all component styles in single file
- **Plain CSS (src/index.css)**: 13 lines; minimal body reset
- **Font Awesome 6.4.2**: Icon library via CDN (`<link>` in `public/index.html`)
- **BEM-like naming convention**: `.component-element`, `.component-element--modifier`
- **No CSS frameworks**: No Tailwind, Bootstrap, or CSS-in-JS

### Animations & Effects
- **react-particles 2.9.3**: Particle effect wrapper library
- **tsparticles 2.9.3**: Lightweight particle engine (used for confetti on dashboard)
- **CSS transitions**: Smooth state changes (sidebar collapse, modal open/close)

### Notifications
- **react-toastify 11.1.0**: Toast notification system
- **Toast variants**: Success, info, error messages with auto-dismiss (3s default)

### Testing & Quality
- **Jest**: Test framework via react-scripts (not actively used in current codebase)
- **React Testing Library**: Component testing utilities (included in devDependencies)
- **ESLint**: Static analysis via `react-app` preset

### Development Dependencies
- **@testing-library/react 16.3.2**: Testing component rendering and user interactions
- **@testing-library/jest-dom 6.9.1**: Custom Jest matchers for DOM assertions
- **@testing-library/user-event 14.6.1**: Simulating user events in tests

### No External Backend
- No Express, Django, or server-side framework
- No API layer or HTTP client library (no axios, fetch wrapper, or GraphQL)
- No database driver (no PostgreSQL, MongoDB, or ORM)
- No authentication service integration (no Auth0, OAuth provider libraries)

## Component/Service Breakdown

### Page Components (Feature Modules)

| Component | Purpose | Route | Auth Required | State Management |
|-----------|---------|-------|---------------|------------------|
| **Login.js** | User authentication form | /login | No | useState (email, password) |
| **Register.js** | New user registration with validation | /register | No | useState (name, email, password, errors) |
| **Dashboard.js** | Metrics overview with static cards | /dashboard | Yes | None (renders mock metrics) |
| **Orders.js** | Searchable, non-editable order list | /orders | Yes | useState (searchTerm) |
| **Customers.js** | Paginated customer CRUD with modal | /customers | Yes | useState (searchTerm, page, customers, isModalOpen, form) |
| **Products.js** | Paginated product CRUD with modal | /products | Yes | useState (searchTerm, page, products, isModalOpen, form) |
| **Masters.js** | Paginated masters data (read-only) | /masters | Yes | useState (searchTerm, page) |
| **Approvals.js** | Approval workflow with status toggle | /approvals | Yes | useState (searchTerm, page, approvals) |
| **Sessions.js** | Session history tracking (read-only) | /sessions | Yes | useState (searchTerm, page) |
| **Profile.js** | User profile view/edit | /profile | Yes | useState (profile, isEditing, draft) |
| **Settings.js** | Account settings and password change | /settings | Yes | useState (name, email, bio, password fields) |
| **FAQ.js** | Collapsible Docker FAQs | /faq | Yes | useState (openId for toggle) |
| **PrivacyPolicy.js** | Legal policy page | /privacy | No | None |
| **TermsAndConditions.js** | Legal terms page | /terms | No | None |

### Layout Components

| Component | Purpose | Parent |
|-----------|---------|--------|
| **App.js** | Root component; routing logic; auth guard via localStorage | Entry point |
| **Navbar.js** | Top bar with profile, settings, logout; visible when authenticated | App (conditionally) |
| **Sidebar.js** | Left navigation menu; 8 items; collapsible; shows active route | Dashboard + all protected pages |

### UI Components (Reusable)

| Component | Purpose | Usage |
|-----------|---------|-------|
| **ConfirmDialog.js** | Modal confirmation dialog (logout confirmation) | Navbar |

### Mock Data Modules

| File | Purpose | Exports |
|------|---------|---------|
| **mastersMock.js** | Master data array for Masters.js | mockMasters (array) |
| **sessionsMock.js** | Session history data | mockSessions (array) |
| **productsMock.js** | Pre-populated product catalog | mockProducts (array) |
| **privacyPolicyMock.js** | Privacy policy content | (assumed structure) |
| **mockProfile.js** | Default user profile for Profile.js | mockProfile (object) |

### Entry Point
- **src/index.js**: React root rendering via `createRoot()` API; renders `<App />` into `#root` DOM element

### Styling
- **src/App.css**: Consolidated styles (272 lines)
  - Login/register form styles (`.login-*`)
  - Dashboard layout (`.dashboard-*`, `.metric-*`)
  - Table styles (`.orders-table-*`, `.customers-*`)
  - Modal styles (`.customer-modal-*`, `.product-modal-*`)
  - Sidebar styles (`.sidebar-*`)
  - FAQ styles (`.faq-*`)
  - Pagination styles (`.customers-pagination-*`)
  - Form styles (`.form-group`, `.validation-error`)
  - Responsive breakpoints (implied desktop-first)

- **src/index.css**: Body reset (13 lines)
  - Default font, margin, padding reset

## Data Architecture

### Storage Model: localStorage

#### Authentication State
```javascript
localStorage.setItem("isAuthenticated", "true" | "false" | undefined)
localStorage.getItem("isAuthenticated") === "true" // Boolean check
```

#### Registered Users
```javascript
// JSON array of user objects
localStorage.setItem("registeredUsers", JSON.stringify([
  { name: string, email: string, password: string },
  ...
]))
```

#### Component-Level State (Non-Persistent)
- Customers, Products, Approvals, Sessions: Stored in component `useState` only
- Page reload resets to original mock data
- No inter-session memory

### Data Flow
```
User Input (Form)
    │
    ├─ Component State (useState)
    │  │
    │  └─ Re-render on state change
    │
    └─ localStorage (if auth-related)
       │
       └─ Persist across page reloads
```

### Mock Data Examples

**Orders** (src/Orders.js):
```javascript
[
  { id: "ORD-001", customer: "Alice Johnson", product: "Docker Desktop", status: "Shipped", date: "2026-05-01" },
  ...
]
```

**Customers** (src/Customers.js):
```javascript
[
  { id: 1, name: "Alice Johnson", email: "alice@example.com", company: "Tech Corp", phone: "555-0101", status: "Active" },
  ...
]
```

**Products** (src/Products.js):
```javascript
[
  { id: 1, sku: "SKU-001", name: "Product Name", category: "Electronics", price: 99.99 },
  ...
]
```

## Security Architecture

### Authentication (Client-Side Mock)
- **No Real Authentication**: Credentials validated against localStorage only
- **Session Token**: Single `isAuthenticated` flag in localStorage
- **No JWT/OAuth**: Simple boolean flag; no token expiration
- **No Encryption**: Passwords stored as plain text in localStorage (demo only)
- **Route Guards**: `isAuthenticated` checked in `App.js` for protected routes; unauthenticated users redirected to login

### Authorization
- **Role-Based Access**: No role validation; all authenticated users see all pages
- **No Permissions**: All users can perform all CRUD operations within their view

### Data Protection
- **Client-Side Only**: No server-side validation or sanitization
- **No HTTPS Enforcement**: Assumed by deployment environment
- **XSS Prevention**: React escapes content by default; no `dangerouslySetInnerHTML` usage observed
- **CSRF**: Not applicable (no backend forms or state-changing requests)

### Sensitive Data Handling
- **No Sensitive Operations**: No real credit cards, PII, or secrets stored
- **No API Keys**: No external service authentication required
- **localStorage Accessible**: Vulnerable to browser extensions and XSS if present

### Accessibility (WCAG 2.1 Level AA Target)
- **Semantic HTML**: `<form>`, `<button>`, `<dialog>` roles used
- **ARIA Labels**: `aria-label`, `aria-expanded`, `aria-controls`, `aria-modal` on interactive elements
- **Keyboard Navigation**: Tab order maintained; buttons keyboard-accessible
- **Semantic Structure**: Proper heading hierarchy (`<h1>`, `<h2>`, `<h3>`)
- **Color Contrast**: Form and button styles designed for readability
- **Screen Reader Support**: Icon + text labels; landmark roles for navigation

## Infrastructure & Deployment

### Development Environment
- **Dev Server**: `npm start` runs react-scripts dev server on port 3000 (hot reload)
- **Build**: `npm run build` outputs optimized bundle to `build/` directory
- **Testing**: `npm test` runs Jest with React Testing Library
- **Environment Variables**: Loaded from `.env` file (REACT_APP_* prefix)

### Production Deployment

#### Docker Image (Multi-Stage Build)
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install && npm install -g serve && npm run build && rm -fr node_modules
EXPOSE 3000
CMD ["serve", "-s", "build"]
```

**Build Strategy**:
1. Install dependencies: `npm install`
2. Globally install `serve` for static file serving
3. Build optimized production bundle: `npm run build`
4. Clean up `node_modules` to reduce image size (dependencies not needed at runtime)
5. Expose port 3000
6. Start server: `serve -s build` (serves `build/` directory on port 3000)

**Image Optimization**:
- Alpine Linux base (22 MB vs. ~200 MB for node:22)
- Multi-stage approach: Remove build tools after compilation
- Result: Lightweight image suitable for container orchestration

### CI/CD Pipeline

#### GitHub Actions Workflow (.github/workflows/merge-main-into-small-image.yml)
- **Trigger**: On merged PR to `main` branch
- **Job**: Automatically merges `main` into `small-image` branch (assumed image-building branch)
- **Steps**:
  1. Checkout code with full history
  2. Configure git user (github-actions bot)
  3. Fetch remote; checkout `small-image` branch
  4. Merge `main` into `small-image` with `--no-ff` flag
  5. Push to origin

**Purpose**: Ensures parallel branches stay in sync for different build/deployment pipelines

### Container Orchestration
- **Assumed**: Docker Compose or Kubernetes for production
- **Port Mapping**: 8088 (host) → 3000 (container) in example commands
- **Volume Mounting**: None required (SPA is stateless)
- **Environment**: Can set REACT_APP_* vars at build time via .env

### Production Deployment Example
```bash
docker build -t welcome-to-docker .
docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker
# Browse: http://localhost:8088
```

## API Design

### No External API
- **Zero Backend Integration**: No RESTful endpoints, GraphQL, or RPC calls
- **No HTTP Client**: No axios, fetch wrapper, or request library
- **No API Documentation**: Not applicable

### Internal Data Binding
- **Direct Component Props**: Parents pass data to children
- **Callback Props**: Children call parent-provided callbacks for state updates
- **No Context API**: No centralized state management layer
- **No Event Bus**: No publish/subscribe pattern

**Example Pattern** (Customers.js):
```javascript
const [customers, setCustomers] = useState(initialCustomers);

const handleSave = (e) => {
  const newCustomer = { id: nextId, ...form };
  setCustomers((prev) => [...prev, newCustomer]); // Update parent state
};
```

### Form Handling
- **Controlled Inputs**: `value` bound to state; `onChange` updates state
- **Validation**: Inline regex (email, password) with `validateEmail()`, `validatePassword()`
- **Error Display**: `.validation-error` divs below inputs
- **No External Form Library**: No Formik, React Hook Form, or similar

### Data Search & Filtering
- **Client-Side Search**: All filtering done in component with `useMemo`
- **Pattern**: `.filter()` on full dataset based on lowercased search term
- **Debouncing**: None; instant search (no performance impact for small datasets)

## Testing Strategy

### Current State
- **No Tests Written**: Repository has test files (`.test.js`) but no implemented test cases
- **Test Setup**: Jest + React Testing Library configured via react-scripts
- **ESLint Config**: `react-app` and `react-app/jest` presets

### Recommended Test Coverage

#### Unit Tests (Component-Level)
- **Form Validation**: Login/Register/Settings password rules
- **Search Filtering**: Masters, Customers, Products, Approvals
- **Pagination Logic**: Page calculations, boundary conditions
- **Data Transformation**: Price formatting, date parsing

#### Integration Tests (Feature-Level)
- **Authentication Flow**: Register → Login → Dashboard → Logout
- **CRUD Workflows**: Add customer/product, verify in list, search, delete
- **Modal Interactions**: Open modal, fill form, submit, verify list updated
- **Navigation**: Sidebar clicks navigate to correct route

#### E2E Tests (User Journey)
- **Complete User Flow**: Register new user → Login → Browse orders → Approve request → Logout
- **Search Pagination**: Search for term → verify results → paginate → verify items

#### Accessibility Tests
- **WCAG Compliance**: Axe-core for automated a11y scanning
- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader**: VoiceOver/NVDA testing for semantic HTML

### Test Execution
```bash
npm test                          # Interactive watch mode
npm test -- --watchAll=false     # Single run (CI mode)
npm run build                     # Pre-deployment validation
```

## Deployment Checklist

### Pre-Deployment
- [ ] All test suites pass (`npm test -- --watchAll=false`)
- [ ] No ESLint warnings (`npm run eject` to inspect, or use IDE plugin)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] Environment variables set in `.env` or CI/CD config
- [ ] Docker image builds successfully (`docker build -t welcome-to-docker .`)
- [ ] Container runs and serves on expected port

### Post-Deployment
- [ ] Application accessible at deployment URL
- [ ] Login/Register flows functional
- [ ] All sidebar routes load without errors
- [ ] Search and pagination working
- [ ] Add/Edit modals functional
- [ ] Toast notifications display correctly
- [ ] No console errors in browser DevTools
- [ ] localStorage persists across page reloads

## Performance Considerations

### Optimization Strategies Employed
- **useMemo**: Filtering expensive calculations (search term matching)
- **Component Split**: Each page is its own component (code splitting candidates)
- **Icon CDN**: Font Awesome loaded from CDN (not bundled)

### Potential Improvements
- **Code Splitting**: React.lazy() for route-based code splitting
- **Image Optimization**: Placeholder for avatar images; lazy load if added
- **Minification**: Handled by CRA build process
- **Caching**: Service Worker for offline capability (not currently implemented)
- **Bundle Analysis**: `npm run build` + `source-map-explorer` for bundle size analysis

### Monitoring Recommendations
- **Sentry / LogRocket**: Client-side error tracking
- **Google Analytics / Hotjar**: User behavior and heatmaps
- **Performance Metrics**: Web Vitals (LCP, FID, CLS) tracking

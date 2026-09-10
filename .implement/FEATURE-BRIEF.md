# Feature Brief: Orders Reporting Feature

## feature_id
a1c98032-3a76-421a-9d06-4e4dfbce9340
<!-- feature id — sourced from top-level `uuid` in .implement/work-breakdown.json. Label as "feature id", never "uuid". Used as `featureId` at telemetry call sites only; never hardcoded in shared telemetry infrastructure. -->

## feature_slug
orders-reporting-feature

## mandatory_skills
- agiloop-instrumentation: .claude/skills/agiloop-instrumentation/SKILL.md
- code-quality: .claude/skills/code-quality/SKILL.md

## stories
| id | title | acceptance_criteria |
|----|-------|---------------------|
| F1.S1 | Add Reports Navigation Item | Authenticated user sees a Reports sidebar link with correct styling and icon; Reports item visible and clickable when sidebar expanded; Reports item highlighted active on /reports |
| F1.S2 | Implement Reports Route and Page | Clicking Reports navigates to /reports and loads Reports component; unauthenticated access to /reports redirects to login; page renders filter controls and empty table initially |
| F1.S3 | Build Filter Controls and Report Generation | Valid filters + Apply Filters shows correct aggregated data via useMemo; invalid date range on apply shows error toast; Clear Filters resets all selections and empties table |
| F1.S4 | Render Summary Report Table | Matching orders show Status, Count, Date Range columns plus grand total row; no matching orders shows empty-state message; table is responsive on desktop |
| F1.S5 | Integrate Toast Notifications and Accessibility | Successful report generation shows success toast via react-toastify; error condition shows error toast; all filter and table elements fully keyboard operable |

## acceptance_criteria
- A "Reports" sidebar navigation item is visible to authenticated users, matches existing sidebar styling/icons/active-route highlighting, and preserves collapse behavior.
- A protected `/reports` route renders the Reports component; unauthenticated users are redirected to login via the existing `isAuthenticated` localStorage guard.
- The Reports view provides a date range picker (ISO dates), a status multi-select (Pending, Processing, Shipped, Delivered), an Apply Filters button, and a Clear Filters button.
- Filtering and aggregation run entirely client-side against the existing mock orders data using `useMemo`; no persistence across sessions.
- The summary table shows columns Status, Total Orders Count, Date Range Covered, plus a grand-total row; an empty-state message appears when no orders match.
- Invalid date range or no-data conditions surface an error toast; successful generation surfaces a success toast (react-toastify).
- WCAG 2.1 AA compliance: semantic HTML, ARIA labels, keyboard navigation, and readable contrast matching the existing app.
- All new feature code is instrumented with Agiloop telemetry (impression, interaction, error, goal) using the feature id above as `featureId`.

## artifact_contracts
| skill | artifact | path | required |
|-------|----------|------|---------|
| agiloop-instrumentation | Client telemetry SDK — no secrets; posts events to the same-origin proxy only | src/lib/agiloopTelemetry.js | true |
| agiloop-instrumentation | Same-origin server proxy route forwarding events to Inspect with `X-API-Key` attached server-side | server route `/api/telemetry` (same-origin with the SPA) | true |
| agiloop-instrumentation | Telemetry env vars documented with placeholder values, server-only (no client prefix) | .env.example | true |
| agiloop-instrumentation | Telemetry call sites wired into feature UI (impression on view render, interaction on apply, goal on report generated, error on failure) | src/Reports.js, src/Sidebar.js | true |
| code-quality | Production-grade feature module — single-purpose functions, early returns, no swallowed errors, controlled inputs | src/Reports.js | true |
| code-quality | Route + navigation integration following existing conventions | src/App.js, src/Sidebar.js | true |
| code-quality | Unit/integration tests for filter logic, summary calculations, route protection, and navigation | src/Reports.test.js | true |

## env_requirements
| var | scope | required | description |
|-----|-------|----------|-------------|
| AGILOOP_INSPECT_API_KEY | server | true | Inspect API key. Server-only secret; NEVER exposed to the browser and never given a client prefix (`REACT_APP_` / `NEXT_PUBLIC_` / `VITE_`). Read only by the proxy route. |
| AGILOOP_INSPECT_URL | server | false | Inspect base URL. Defaults to `https://inspect.api.agiloop.app` when unset. |
| AGILOOP_PROJECT_ID | server | true | Agiloop project id used to construct the Inspect event URL server-side. Server-only. |
| FRONTEND_URL | server | true | Origin of the SPA, wired as `{{frontend.url}}` in deploy config; used for CORS allow-list alongside a localhost wildcard on the telemetry proxy. |

Telemetry infrastructure (client SDK, proxy route, env vars) is feature-id-neutral. The feature id `a1c98032-3a76-421a-9d06-4e4dfbce9340` appears only at call sites as `featureId`, never baked into shared infrastructure. Feature runtime honors an env-optional real/mock contract: with telemetry env vars absent, the app still runs (proxy returns 202 / events no-op) — env presence toggles real vs mock delivery.

## deploy_requirements
| service | change | notes |
|---------|--------|-------|
| frontend | modify | Adds the `/reports` route, Sidebar item, Reports component, and client telemetry SDK. Static CRA build served via `serve -s build`. `.agiloop/deploy.json` buildCommand/startCommand must invoke the built artifact directly (no vendor-specific manifest); use deploy variable syntax `{{serviceName.url}}`. |
| telemetry-proxy | depends-on | Telemetry requires a same-origin `/api/telemetry` proxy. A pure static CRA host has no server — this is the split-origin `/api/*` route trap. The proxy MUST be reachable same-origin as the SPA (co-located backend or reverse-proxy rewrite); a cross-origin `/api/*` call is a deploy defect. Set `FRONTEND_URL: {{frontend.url}}` and configure CORS as localhost wildcard + `FRONTEND_URL`. |

`.agiloop/deploy.json` must be generated/maintained with exact buildCommand and startCommand values that build and directly launch the produced artifacts. No vendor-specific deploy manifests. Deploy build/runtime parity is validated by the verify agent.

## telemetry_call_sites
| story_id | event_type | featureId_source | attributes |
|----------|-----------|-----------------|-----------|
| F1.S1 | interaction | work-breakdown.json uuid | source: string ("sidebar"), target: string ("reports-nav") |
| F1.S2 | impression | work-breakdown.json uuid | view: string ("reports"), authenticated: boolean |
| F1.S3 | interaction | work-breakdown.json uuid | action: string ("apply_filters"), statuses: string[], hasDateRange: boolean |
| F1.S3 | goal | work-breakdown.json uuid | matchedCount: number, statusCount: number |
| F1.S3 | error | work-breakdown.json uuid | reason: string ("invalid_date_range" \| "no_data") |
| F1.S4 | impression | work-breakdown.json uuid | rows: number, empty: boolean |
| F1.S5 | error | work-breakdown.json uuid | toast: string ("error"), reason: string |

Telemetry metadata must remain privacy-safe: no PII, no credentials, no raw order records — only counts, flags, and enum-like reason codes. `featureId` at every call site resolves to the feature id above and to nothing else.

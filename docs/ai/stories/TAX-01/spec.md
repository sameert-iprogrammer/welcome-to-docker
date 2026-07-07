# TAX-01: Add Active Sessions Table on Dashboard

## Summary

Add an **Active Sessions** table to the Dashboard page that displays mock session data for five users. This is a UI-only change: no API calls, backend work, or data persistence beyond what the app already uses for mock/local data.

## Story Metadata

| Field | Value |
|-------|-------|
| **Key** | TAX-01 |
| **Title** | Add Active Sessions table on dashboard |
| **Type** | UI enhancement |
| **Scope** | Dashboard (`/dashboard`) only |

## Background

The application is a minimal educational React SPA with localStorage-based mock auth and client-side routing. Dashboard changes should follow existing layout, table, and styling patterns already used on other pages.

## Requirements

### Functional

1. **Active Sessions section on Dashboard**
   - Add a clearly labeled **Active Sessions** section/table on the Dashboard page.
   - The section must be visible when a user navigates to `/dashboard`.

2. **Mock data**
   - Populate the table with mock user/session data defined in the frontend (inline constants or an existing mock-data module pattern).
   - Display **exactly 5 records** — no pagination, “load more,” or dynamic fetching.
   - Data is static/hardcoded for this story; no API integration.

3. **Table content**
   - Each row represents one active session.
   - Include at minimum:
     - **User** — display name or identifier
     - **Session status** — e.g. “Active” (all rows may show active for mock purposes)
     - **Last active** — human-readable timestamp or relative time string
   - Additional columns (device, browser, IP, location) are optional if they match existing dashboard table conventions; do not add columns that break visual consistency with other tables in the app.

4. **UI-only scope**
   - No new routes, auth changes, or backend endpoints.
   - No real session management, revocation, or logout-from-other-device behavior unless already present elsewhere and trivial to wire with mock handlers (default: display-only).

### Non-Functional

1. Match existing Dashboard layout, typography, spacing, and table styling.
2. Preserve current routing and navigation behavior.
3. Build must pass: `npm run build`.
4. Follow project governance and SDLC rules before merging.

## Acceptance Criteria

- [ ] Dashboard (`/dashboard`) renders an **Active Sessions** table/section with a clear heading.
- [ ] The table shows **exactly 5** mock session records.
- [ ] Each row includes user identity and session-relevant fields (at minimum: user, status, last active).
- [ ] All data is mock/static; **no API or network calls** are introduced for this feature.
- [ ] Styling and structure are consistent with existing Dashboard and table patterns in the codebase.
- [ ] No regressions to existing Dashboard content or navigation.
- [ ] `npm run build` completes successfully.

## Out of Scope

- Real session tracking, authentication backend, or WebSocket updates
- API integration or fetching session data from a server
- Pagination, filtering, sorting, or search (unless already standard on similar tables and trivial to apply)
- Session termination / “Sign out other sessions” actions (unless explicitly requested in a follow-up story)
- TypeScript migration, new CSS frameworks, or react-router introduction
- Changes to routes other than `/dashboard`

## UI Notes

- **Placement:** Integrate into the existing Dashboard layout — below or alongside current dashboard widgets/content, following the same section/card pattern used elsewhere on the page.
- **Heading:** Use the label **Active Sessions** (or equivalent casing consistent with other section titles on Dashboard).
- **Table:** Reuse existing table markup/components and CSS classes where possible; avoid one-off styling.
- **Mock data:** Use realistic but clearly fake values (names, timestamps, optional device/browser strings) so the UI reads credibly in demos.
- **Record count:** Hard-limit display to 5 rows; do not show empty placeholder rows or a “showing X of Y” footer unless that pattern already exists on Dashboard tables.

## Implementation Notes

- **Routing:** Dashboard is served at `/dashboard` per project routing configuration.
- **Data source:** Define mock active-session records in a local module or inline constant array; export exactly 5 items.
- **Patterns:** Inspect existing Dashboard page and any other list/table views (e.g. Orders, Customers) for column structure, wrapper elements, and mock-data placement — mirror those patterns rather than introducing new abstractions.
- **Auth:** No change to localStorage mock auth; this table does not need to reflect the currently logged-in user’s real sessions.
- **Testing:** If the project has component or snapshot tests for Dashboard, update or add minimal coverage for the new section; only if consistent with existing test practices.

## Assumptions

1. **Display-only table** — rows are informational; row actions (revoke, view details) are not required unless an existing table pattern mandates an actions column with inert/mock buttons.
2. **Column set** — user, status, and last active are sufficient unless existing dashboard tables use a richer standard column set that should be mirrored for consistency.
3. **Single locale** — English labels and static date/time strings are acceptable for mock data.
4. **No Figma/design attachment** — visual design follows existing in-app Dashboard and table styles.

## Open Questions

1. **Routing note conflict:** Context map `agentNotes` states “No react-router” while `routing.strategy` is listed as `react-router`. Implementation should follow **whatever routing mechanism is actually used in the codebase** on `/dashboard` without introducing a new routing library.
2. **Exact column list:** If product/design expects specific columns (e.g. Device, IP Address, Location), confirm against existing table patterns or add in a follow-up; this spec defaults to user + status + last active.

## References

| Resource | Path |
|----------|------|
| Context map | `docs/ai/context-map.json` |
| Project context | `docs/ai/project-context.md` |
| Governance | `.opencode/agents/governance-agent.md` |
| SDLC rules | `.opencode/agents/_sdlc-rules.md` |
| Build command | `npm run build` |

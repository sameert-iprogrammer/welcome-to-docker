# DS-01: Profile page

## Metadata

| Field | Value |
|-------|--------|
| **Key** | DS-01 |
| **Title** | Profile page |
| **Type** | Feature (UI, read-only) |
| **Output** | `docs/ai/stories/DS-01/spec.md` |

## Summary

After a user logs in, the app navbar shows a profile icon. Clicking the icon navigates to a dedicated profile page that displays user information from mock data only. The page is informational (no forms, no edits, no backend).

## Goals

- Give logged-in users a clear way to view profile information from the navbar.
- Add a profile route/view consistent with existing SPA routing and auth patterns.
- Use static mock data for all profile fields; no API or persistence beyond existing mock auth.

## Non-Goals

- Profile editing, forms, or validation.
- Backend integration or real user data.
- New routing libraries (e.g. react-router).
- TypeScript, CSS frameworks, or architectural changes outside current patterns.

## Requirements

### Authentication and visibility

1. Profile icon appears in the navbar **only when the user is logged in** (same condition as other authenticated UI).
2. When logged out, the profile icon must not be shown.

### Navigation

3. Clicking the profile icon opens the profile page (new view/route in the existing pushState-based routing model).
4. User can return to the main app flow (e.g. dashboard) via existing navigation patterns (back link, navbar, or equivalent—match current app conventions).

### Profile page content

5. Profile page displays **read-only** information using **mock data** (hardcoded or a local mock object/module—not fetched from a server).
6. Include **standard profile fields**, for example:
   - Display name (or full name)
   - Email
   - Username or user ID (if applicable to mock auth)
   - Avatar or profile image (placeholder acceptable)
   - Optional: role, member since, timezone, or bio—only if they fit mock data and layout without expanding scope
7. No input fields, submit buttons, or save actions on the profile page.

### Data and backend

8. No backend calls for profile data.
9. Mock profile data may align with the logged-in mock user in localStorage where practical, but must remain client-side only.

### Technical constraints (from project context)

10. Preserve existing React SPA patterns: no react-router, no TypeScript, no CSS frameworks.
11. Use existing localStorage mock auth and pushState routing; extend—not replace—them.
12. Follow governance and SDLC rules referenced in the context map before implementation.

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-1 | Given a logged-out user, the navbar does not show a profile icon. |
| AC-2 | Given a logged-in user, the navbar shows a profile icon. |
| AC-3 | When the logged-in user clicks the profile icon, the profile page is displayed. |
| AC-4 | The profile page shows read-only mock profile details (no forms). |
| AC-5 | Profile fields cover standard identity/contact fields (at minimum: name and email; avatar/placeholder encouraged). |
| AC-6 | No network requests are made to load profile data. |
| AC-7 | Navigation between profile page and other authenticated views works without breaking existing login/logout or dashboard behavior. |
| AC-8 | `npm run build` succeeds with the new profile UI integrated. |

## UI Notes

- **Navbar:** Add a profile icon control visible only in authenticated state; placement should match existing navbar layout (e.g. near user/session indicators if present).
- **Profile page:** Simple, informational layout—labels + values (card, list, or sectioned blocks). No edit affordances.
- **Avatar:** Use a placeholder image or initials if no real asset exists.
- **Accessibility:** Icon should be keyboard-focusable and have an accessible name (e.g. “Profile” or “View profile”).
- **Empty/error states:** Not required for mock-only data unless routing fails; keep scope minimal.

## Implementation Notes

- **Likely touchpoints** (from architecture overview): `src/App.js` (routing/nav), `src/Dashboard.js` or shared navbar if profile icon lives there, possible new `src/Profile.js` (or equivalent) for the profile view.
- **Routing:** Register a new path/view in the existing pushState mechanism used by login/dashboard flows.
- **Mock data:** Define a single mock profile object (or map keyed by mock user id) colocated with profile UI or a small mock module; document fields in code for planners/implementers.
- **Auth gate:** Reuse the same logged-in check used for dashboard/post-login UI before showing icon or rendering profile route.
- **Styling:** Inline or existing CSS patterns only; no new framework.

## Assumptions

- “Standard profile fields” means common identity fields (name, email, avatar); optional fields are nice-to-have, not blockers.
- Profile icon can be an SVG, emoji, or simple icon consistent with the educational demo style.
- Mock profile data does not need to sync with a real backend; consistency with localStorage mock user email/name is desirable but not mandatory if not already modeled.
- Logout from profile page (if offered) behaves like logout elsewhere—no special profile session.

## Open Questions

- None blocking from story description. If mock auth already stores a display name/email, implementers should prefer that over unrelated mock values for consistency.

## References

| Resource | Path |
|----------|------|
| Context map | `docs/ai/context-map.json` |
| Project context | `docs/ai/project-context.md` |
| Governance | `.opencode/agents/governance-agent.md` |
| SDLC rules | `.opencode/agents/_sdlc-rules.md` |
| Implementation plan (downstream) | `docs/ai/stories/DS-01/implementation-plan.md` |

## Traceability

| Source | Used in spec |
|--------|----------------|
| Story title/description | Summary, requirements, acceptance criteria |
| Additional context (“standard fields”) | Profile page content, UI notes |
| Selected context map (`agentNotes`, `buildCommand`) | Non-goals, technical constraints, AC-8 |

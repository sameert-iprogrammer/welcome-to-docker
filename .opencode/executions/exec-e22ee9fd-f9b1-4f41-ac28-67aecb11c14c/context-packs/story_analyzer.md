# Context Pack: story_analyzer

Read this pack first. Open full artifacts only when a necessary detail is missing.

## Story
- Key: DS-01
- Title: Profile page
- Description: When user logs in, then in the navbar, show a profile icon and on click of it, open a profile page with mock data. page should show information only. Forms are not required. also no backend. Only mock data.
- Additional context: Show profile details as per standard fields

## Handoffs
None for this stage.

## Target Files
- docs/ai/stories/DS-01/spec.md

## Selected Context Map
{
  "agentEntryPoints": {
    "contextMap": "docs/ai/context-map.json",
    "governance": ".opencode/agents/governance-agent.md",
    "projectContext": "docs/ai/project-context.md",
    "sdlcRules": ".opencode/agents/_sdlc-rules.md"
  },
  "schemaVersion": 1,
  "selectedEntries": {
    "agentNotes": "Minimal educational React SPA. No react-router, no backend, no TypeScript, no CSS frameworks. localStorage mock auth. pushState routing. Preserve existing patterns. Reference governance before changes.",
    "buildCommand": "npm run build"
  }
}

## Fallback Artifacts
- Story spec: docs/ai/stories/DS-01/spec.md
- Implementation plan: docs/ai/stories/DS-01/implementation-plan.md
- Project context: docs/ai/project-context.md
- Context map: docs/ai/context-map.json

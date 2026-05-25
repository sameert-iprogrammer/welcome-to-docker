# Context Pack: implementation_planner

Read this pack first. Open full artifacts only when a necessary detail is missing.

## Story
- Key: DS-01
- Title: Profile page
- Description: When user logs in, then in the navbar, show a profile icon and on click of it, open a profile page with mock data. page should show information only. Forms are not required. also no backend. Only mock data.
- Additional context: Show profile details as per standard fields

## Handoffs
### story_analyzer
{
  "acceptanceCriteria": [
    "| ID | Criterion |",
    "|----|-----------|",
    "| AC-1 | Given a logged-out user, the navbar does not show a profile icon. |",
    "| AC-2 | Given a logged-in user, the navbar shows a profile icon. |",
    "| AC-3 | When the logged-in user clicks the profile icon, the profile page is displayed. |"
  ],
  "contextPointers": [
    "docs/ai/context-map.json",
    "docs/ai/project-context.md (only relevant sections if needed)"
  ],
  "fullArtifacts": [
    "docs/ai/stories/DS-01/spec.md"
  ],
  "keyOutputs": [
    "Requirements captured from story title and description",
    "Acceptance criteria normalized in spec",
    "Open questions noted for downstream planning"
  ],
  "nextAgentHints": [
    "Read the handoff first. Open the full artifact only when needed for details.",
    "Use the spec to build an actionable implementation plan."
  ],
  "primaryArtifact": "docs/ai/stories/DS-01/spec.md",
  "risks": [],
  "schemaVersion": 1,
  "status": "completed",
  "stepKey": "story_analyzer",
  "summary": "Story spec generated and ready for implementation planning.",
  "targetFiles": [
    "docs/ai/stories/DS-01/spec.md"
  ]
}

## Target Files
- docs/ai/stories/DS-01/spec.md
- docs/ai/stories/DS-01/implementation-plan.md

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
    "commonPaths": {
      "components": "src/",
      "config": [
        "package.json"
      ],
      "deployment": [
        "Dockerfile"
      ],
      "source": "src/",
      "styles": [
        "src/App.css",
        "src/index.css"
      ]
    },
    "testing": {
      "command": "npm test",
      "framework": "jest"
    }
  }
}

## Fallback Artifacts
- Story spec: docs/ai/stories/DS-01/spec.md
- Implementation plan: docs/ai/stories/DS-01/implementation-plan.md
- Project context: docs/ai/project-context.md
- Context map: docs/ai/context-map.json

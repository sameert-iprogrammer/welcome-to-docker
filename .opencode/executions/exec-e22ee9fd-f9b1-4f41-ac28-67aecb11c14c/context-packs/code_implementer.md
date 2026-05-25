# Context Pack: code_implementer

Read this pack first. Open full artifacts only when a necessary detail is missing.

## Story
- Key: DS-01
- Title: Profile page
- Description: When user logs in, then in the navbar, show a profile icon and on click of it, open a profile page with mock data. page should show information only. Forms are not required. also no backend. Only mock data.
- Additional context: Show profile details as per standard fields

## Handoffs
### implementation_planner
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
    "docs/ai/project-context.md (only relevant sections if needed)",
    "docs/ai/stories/DS-01/spec.md"
  ],
  "fullArtifacts": [
    "docs/ai/stories/DS-01/implementation-plan.md"
  ],
  "keyOutputs": [
    "Actionable implementation steps documented",
    "Target files identified for planned edits"
  ],
  "nextAgentHints": [
    "Read the handoff first. Open the full artifact only when needed for details.",
    "Implement the plan and inspect listed target files first.",
    "Keep edits scoped; avoid printing full file contents, full diffs, or large code blocks in chat."
  ],
  "primaryArtifact": "docs/ai/stories/DS-01/implementation-plan.md",
  "risks": [],
  "schemaVersion": 1,
  "status": "completed",
  "stepKey": "implementation_planner",
  "summary": "Implementation plan generated for code implementation.",
  "targetFiles": [
    "src/App.js",
    "src/Dashboard.js",
    "src/Profile.js",
    "src/mockProfile.js",
    "src/App.css",
    "src/Settings.js"
  ]
}
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
- src/App.js
- src/Dashboard.js
- src/Profile.js
- src/mockProfile.js
- src/App.css
- src/Settings.js
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
    "keyFiles": {
      "appRoot": "src/App.js",
      "dockerfile": "Dockerfile",
      "entry": "src/index.js"
    },
    "routing": {
      "knownPaths": [
        "/login",
        "/register",
        "/dashboard",
        "/settings"
      ],
      "strategy": "pushState"
    },
    "stateManagement": "localState",
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

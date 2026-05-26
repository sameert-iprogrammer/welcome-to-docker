# Context Pack: final_review

Read this pack first. Open full artifacts only when a necessary detail is missing.

## Story
- Key: DS-01
- Title: Profile page
- Description: When user logs in, then in the navbar, show a profile icon and on click of it, open a profile page with mock data. page should show information only. Forms are not required. also no backend. Only mock data.
- Additional context: Show profile details as per standard fields

## Handoffs
### ai_reviewer
{
  "missing": true
}
### auto_fixer
{
  "missing": true
}
### code_implementer
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
    "docs/ai/stories/DS-01/implementation-plan.md",
    "docs/ai/stories/DS-01/spec.md"
  ],
  "fullArtifacts": [
    "docs/ai/stories/DS-01/implementation-plan.md"
  ],
  "keyOutputs": [
    "opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/execution.json",
    "opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/logs.ndjson",
    "src/App.css",
    "src/App.js",
    "src/Dashboard.js",
    "opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/context-packs/"
  ],
  "nextAgentHints": [
    "Read the handoff first. Open the full artifact only when needed for details.",
    "Validate changes against the implementation plan before review."
  ],
  "primaryArtifact": "docs/ai/stories/DS-01/implementation-plan.md",
  "risks": [],
  "schemaVersion": 1,
  "status": "completed",
  "stepKey": "code_implementer",
  "summary": "Code implementation finished with 11 changed file(s).",
  "targetFiles": [
    "opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/execution.json",
    "opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/logs.ndjson",
    "src/App.css",
[truncated]

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

## Target Files
- navigateTo("/profile")
- src/App.js
- src/Dashboard.js
- src/Profile.js
- src/mockProfile.js
- src/App.css
- docs/ai/stories/DS-01/*
- navigateTo("/dashboard")
- if (pathname === "/profile") return <Profile navigateTo={navigateTo} />
- onClick={() => navigateTo("/profile")}
- docs/ai/context-map.json
- docs/ai/stories/DS-01/spec.md
- src/Settings.js
- opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/execution.json
- opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/logs.ndjson
- opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/context-packs/
- opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/cursor-streams/
- opencode/executions/exec-e22ee9fd-f9b1-4f41-ac28-67aecb11c14c/handoffs/

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

# Codebase Analyzer Agent Rulebook

This document defines the strict role, instructions, execution protocols, and output formats for the **Codebase Analyzer Agent** operating within the `welcome-to-docker` repository.

Follow all instructions in this document exactly to ensure safe, highly consistent, and token-efficient codebase indexing.

---

## 1. Agent Role & Responsibility

The **Codebase Analyzer Agent** is a specialized, read-only inspection agent. Its sole purpose is to inspect the codebase structure, stack, conventions, and configurations of this specific repository, and generate or update **exactly two** output artifacts under the `docs/ai/` directory:
1. `docs/ai/project-context.md` (Compact, human-readable markdown index of architectural conventions and rules)
2. `docs/ai/context-map.json` (Compact, machine-readable JSON structure mapping key assets)

### 1.1 Strict Scope & Safety Boundaries
*   **Write Restriction**: The agent MUST ONLY create or update files at `docs/ai/project-context.md` and `docs/ai/context-map.json`.
*   **No Application Code Changes**: The agent MUST NOT modify, append, or delete any application source files, styles, public assets, or build setups.
*   **No Unrelated Artifacts**: The agent MUST NOT create any temporary, log, or scratch files outside the designated output paths.
*   **Governance Protection**: The agent MUST NOT modify or overwrite `.opencode/agents/governance-agent.md` or `.opencode/agents/_sdlc-rules.md`. Reference them rather than repeating or altering their contents.

---

## 2. Codebase Inspection Protocol

To build a high-signal index without generating verbose text or full-file directories, the agent must analyze the codebase systematically using the high-signal sources below.

### 2.1 High-Signal Areas to Inspect
*   **Core Settings**:
    *   `package.json` / `package-lock.json`: To identify React versions, scripts, and runtime dependencies (specifically particles libraries).
    *   `Dockerfile`: To identify the Node base image (`node:22-alpine`), installation flow, container configurations (`serve -s build`), and exposed port (`3000`).
    *   `.github/workflows/merge-main-into-small-image.yml`: To understand the branch synchronization pipeline (`main` to `small-image`).
*   **Application Source & Entrypoints**:
    *   `src/index.js` & `src/App.js`: Entry point and UI structure.
    *   `src/Confetti.js`: Particle animation behavior and configurations.
*   **Styling System**:
    *   `src/App.css` & `src/index.css`: To identify styling rules (Vanilla CSS, Class-based architecture).
*   **Constraints**:
    *   `.opencode/agents/_sdlc-rules.md` & `.opencode/agents/governance-agent.md`: The definitive project rulebooks.

### 2.2 Architecture & Pattern Detection
*   **Project Type**: A lightweight React 18 Single Page Application served via `react-scripts`.
*   **State Management**: No complex global states. Uses React Hooks exclusively (`useCallback` / `useState` if any).
*   **Routing**: None.
*   **API/Service Layer**: None.
*   **Styling Approach**: Vanilla CSS only; utility CSS libraries (like TailwindCSS) or CSS-in-JS are strictly forbidden.
*   **Security Validation**: Standard verification that external anchor tags targeting `_blank` use `rel="noopener noreferrer"`.
*   **Testing Setup**: Jest tests run via `react-scripts test`.

---

## 3. Output Format: `docs/ai/project-context.md`

When generating this file, the agent must adhere to the following specifications:
*   **Word Budget**: Target under 2,000 words; absolute hard maximum of 5,000 words. (Prefer under ~15,000 characters).
*   **Style**: Bulleted, concise, high-signal statements. No verbose narratives. No full file directories or inventory listings. Do not copy package configuration file contents.
*   **References**: Never repeat governance rules. Refer to `.opencode/agents/governance-agent.md` directly.
*   **Required Headings**: The document must use the following exact headings:

```markdown
# Project Context

## Stack
- [List primary stack components, versions, and roles concisely]

## Commands
- [List critical developer commands: start, build, test, and Docker build/run actions]

## Folder Map
- [High-signal, repo-relative map of directories with concise single-line explanations]

## Architecture Rules
- [Key structural constraints: SPA React, no routing, no external state, serve static build]

## Testing Rules
- [Local testing with Jest and manual Docker-based container verification expectations]

## Styling and Component Rules
- [Vanilla CSS styling rules, component modularity, no inline style rules, class-based conventions]

## Common Paths
- [List repo-relative paths to high-signal files]

## Deeper Docs
- [Links to deeper documentation if present in the repo, otherwise "None found"]

## Agent Notes
- [Short do's and don'ts for future SDLC agents; reference governance instead of repeating it]
```

---

## 4. Output Format: `docs/ai/context-map.json`

When generating this file, the agent must adhere to the following specifications:
*   **No Comments/Formatting**: The file must be a single, valid JSON object with NO comments and NO markdown block wrappers *inside* the file.
*   **Compact Shape**: Only capture essential, high-level JSON mapping fields. No long text or prose fields.
*   **Schema Constraints**: Use schemaVersion 1 and the exact structural keys below. Use empty strings or empty arrays if any value is unknown.

### Schema Template
```json
{
  "schemaVersion": 1,
  "projectName": "welcome-to-docker",
  "projectType": "single-page-react",
  "agentEntryPoints": {
    "governance": ".opencode/agents/governance-agent.md",
    "projectContext": "docs/ai/project-context.md",
    "contextMap": "docs/ai/context-map.json"
  },
  "criticalFiles": [
    "package.json",
    "Dockerfile",
    "src/App.js",
    "src/Confetti.js",
    "src/App.css",
    ".github/workflows/merge-main-into-small-image.yml"
  ],
  "styleConvention": {
    "framework": "vanilla-css",
    "primaryFiles": [
      "src/App.css",
      "src/index.css"
    ]
  },
  "verification": {
    "build": "npm run build",
    "test": "npm test",
    "dockerBuild": "docker build -t welcome-to-docker .",
    "dockerRun": "docker run -d -p 8088:3000 --name welcome-to-docker welcome-to-docker"
  }
}
```

---

## 5. Pre-Generation Checklist

Before writing to the `docs/ai/` paths, the agent must verify:
- [ ] **No App Modifications**: Application code files, assets, and root configurations remain completely untouched.
- [ ] **Word Count Compliance**: Output for `project-context.md` is within the strict limits (< 2,000 words).
- [ ] **JSON Syntax**: The generated `context-map.json` has absolutely no comments or extra styling properties.
- [ ] **Alignment**: The generated documentation aligns with the rules defined in `.opencode/agents/governance-agent.md` without duplicating them.

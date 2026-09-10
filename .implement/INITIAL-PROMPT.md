# INITIAL-PROMPT.md

# Task

Read the inputs below, then generate three per-feature artifacts in the target repo.

## Inputs to read (in order)

1. `.implement/CLAUDE-baseline.md` — canonical project rules; basis for the generated `CLAUDE.md`.
2. `.implement/project-functional-spec.md` (if present) — project-wide business requirements.
3. `.implement/project-technical-spec.md` (if present) — project architecture, tech stack, repo layout.
4. `.implement/functional-spec.md` — this feature's business requirements.
5. `.implement/technical-spec.md` — this feature's technical details.
6. `.implement/work-breakdown.json` — story list and the top-level `uuid` (the feature id).
7. Any `.claude/skills/<name>/SKILL.md` files present — skills provisioned for this build.

If files 4–6 are missing, stop and report which are missing. Do not generate partial outputs.

## Outputs to write

| Path | Source of truth | Schema |
|------|-----------------|--------|
| `CLAUDE.md` (repo root) | `.implement/CLAUDE-baseline.md` | Copy baseline verbatim, then append a feature-specific addendum: feature name, feature id, mandatory skills, story list summary |
| `.implement/FEATURE-BRIEF.md` | `# FEATURE-BRIEF.md Schema` section in this prompt | Use the exact schema; populate from inputs |
| `.implement/ORCHESTRATOR-PROMPT.md` | `# Orchestrator Contract` section in this prompt | Use the exact required structure (invocation order, repair budget, failure-cascade rules, final response shape); reference durable agents at `.claude/agents/` |

Write each file directly. Do not ask for confirmation. Overwrite if present.

## Derivations

- **Feature id**: top-level `uuid` field of `.implement/work-breakdown.json`. Label it as "feature id" — never "uuid".
- **Feature name**: top-level `name` (or `title`) field of `.implement/work-breakdown.json`.
- **Kebab-case slug**: derived from feature name (lowercase, spaces → `-`, strip non-alphanumeric).
- **Mandatory skills**: two paths:
  - **Self-declared**: every `.claude/skills/<name>/SKILL.md` whose frontmatter or first paragraph declares it MANDATORY or required.
  - **Context-triggered**: every `.claude/skills/<name>/SKILL.md` whose frontmatter contains `applies_when: frontend_work` AND at least one UI signal (see below) is detected in the current feature inputs.

### UI signal evaluation

Evaluate the following signals in order. Any single match is sufficient to set `frontend_work = true`.

**Signal A — Repository structure** (check first; broadest):
- `pnpm-workspace.yaml` or root `package.json` `workspaces` lists a package whose directory name is `frontend`, `web`, `app`, `client`, or `ui`
- OR any `package.json` in the repo declares a dependency on: `react`, `react-dom`, `next`, `vue`, `svelte`, `solid-js`, `@angular/core`, `astro`, or `vite` (when also present alongside a UI framework)

**Signal B — Spec keywords**:
Scan `.implement/technical-spec.md`, `.implement/functional-spec.md`, `.implement/project-technical-spec.md`, `.implement/project-functional-spec.md` (any that exist) for any of the following terms (case-insensitive):
`UI`, `frontend`, `front-end`, `page`, `component`, `screen`, `view`, `dashboard`, `login`, `logout`, `signin`, `signup`, `register`, `form`, `modal`, `layout`, `navigation`, `nav`, `button`, `input`, `design`, `interface`, `user interface`, `user-facing`, `browser`, `client-side`, `landing`, `onboarding`, `wizard`

**Signal C — Work-breakdown story content**:
Scan all story `title`, `description`, and `acceptance_criteria` values in `.implement/work-breakdown.json` for the same keyword list as Signal B.

If `frontend_work = true`, include the skill in `mandatory_skills` in the generated `FEATURE-BRIEF.md`. If the SKILL.md is not present at `.claude/skills/<name>/SKILL.md` or `skills/<name>/SKILL.md`, skip it silently and log a warning in the completion report.
- **Default branch**: `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|.*/||'`; fall back to `dev` if unavailable.

## Completion report

After writing all three files, print to stdout exactly:

```
[GENERATED] CLAUDE.md (<bytes> bytes)
[GENERATED] .implement/FEATURE-BRIEF.md (<bytes> bytes)
[GENERATED] .implement/ORCHESTRATOR-PROMPT.md (<bytes> bytes)
[FEATURE] <feature name> (<feature id>)
[SKILLS] <comma-separated mandatory skill names, or "none">
[DONE]
```

Do not print anything else after `[DONE]`. The remainder of this prompt is reference material that informs *how* the outputs are generated.

---

# Agent-Oriented Output Contract

The architecture generates:

- `CLAUDE.md`
- `.implement/FEATURE-BRIEF.md`
- `.implement/ORCHESTRATOR-PROMPT.md`

Durable agents are checked into the repository and are not regenerated per feature:

- `.claude/agents/agiloop-build-agent.md`
- `.claude/agents/agiloop-security-agent.md`
- `.claude/agents/agiloop-verify-agent.md`

---

# Architecture Constraints

Main Invocation
    ↓
Orchestrator Prompt
    ↓
Build Agent
    ↓
Security Agent
    ↓
Verify Agent
    ↓
Final Validation Result

Agents are durable platform roles.

Feature-specific instructions belong in:
- FEATURE-BRIEF.md
- work-breakdown.json
- technical specs

---

# Generator Input Contract

Claude derives the following values from the inputs listed in the Task section. Each row names where the value comes from:

| Value | Source |
|-------|--------|
| Feature name | Top-level `name` or `title` field of `.implement/work-breakdown.json` |
| Feature id | Top-level `uuid` field of `.implement/work-breakdown.json`; always label as "feature id" |
| Kebab-case slug | Derived from feature name (lowercase, spaces → `-`, strip non-alphanumeric) |
| Spec files | `.implement/functional-spec.md`, `.implement/technical-spec.md`, `.implement/work-breakdown.json`, and project-level equivalents |
| Mandatory skills | Self-declared (frontmatter/first paragraph says MANDATORY/required) OR context-triggered (`applies_when: frontend_work` + any UI signal detected in repo structure or specs) |
| Deploy requirements | Services mentioned in `.implement/technical-spec.md` or `.implement/project-technical-spec.md` |
| Default branch | `git symbolic-ref refs/remotes/origin/HEAD`; fall back to `dev` |

These values are embedded into the generated `FEATURE-BRIEF.md` and `ORCHESTRATOR-PROMPT.md`. Agents read from those files — they do not receive inputs directly.

---

# Required Mapping

Every original rule that says the generated `PROMPT.md` must include or enforce something must still be enforced, but distributed as follows.

## Put in `.implement/FEATURE-BRIEF.md`

Feature-specific items:

- feature name
- feature id from `.implement/work-breakdown.json` top-level `uuid`
- kebab-case feature name
- mandatory skills list
- story list
- acceptance criteria
- artifact contracts
- feature-specific telemetry call-site requirements
- integration/env requirements
- deploy requirements touched by this feature
- per-story self-review requirements

## Put in `.implement/ORCHESTRATOR-PROMPT.md`

Workflow and coordination items:

- invoke `agiloop-build-agent`
- invoke `agiloop-security-agent`
- invoke `agiloop-verify-agent`
- maximum orchestration repair loops
- no success unless verifier returns `status: pass`
- final output shape

## Put in `agiloop-build-agent.md`

Implementation-process items:

- pre-codegen checks
- spec read order
- repo-root checks
- ghost directory checks
- pnpm workspace checks
- story-by-story implementation
- skill artifact verification
- per-story self-review lines
- git commits
- README update
- `/tmp/codegen-handoff.md`

## Put in `agiloop-security-agent.md`

Security-process items:

- input validation analysis
- auth/authz validation
- secret leak analysis
- telemetry privacy checks
- dependency security checks
- injection analysis
- env exposure analysis
- CORS/session security analysis
- safe security repair loops
- `/tmp/security-results.json`

## Put in `agiloop-verify-agent.md`

Post-build validation items:

- tests
- dev smoke test
- production build
- production runtime smoke
- telemetry verification
- deploy manifest validation
- deploy build/start parity
- CORS verification
- repair and rerun behavior
- final JSON report

---

# FEATURE-BRIEF.md Schema

The generated `.implement/FEATURE-BRIEF.md` must be machine-parseable. Use this structure:

```markdown
# Feature Brief: <Feature Name>

## feature_id
<uuid from work-breakdown.json top-level field — label as "feature id">

## feature_slug
<kebab-case slug>

## mandatory_skills
- <skill-name>: <path to SKILL.md>

## stories
| id | title | acceptance_criteria |
|----|-------|---------------------|
| <uuid-prefix> | <title> | <comma-sep criteria> |

## acceptance_criteria
- <criterion>

## artifact_contracts
| skill | artifact | path | required |
|-------|----------|------|---------|
| <skill-name> | <artifact description> | <file path> | true |

## env_requirements
| var | scope | required | description |
|-----|-------|----------|-------------|
| <VAR_NAME> | server|client | true|false | <description> |

## deploy_requirements
| service | change | notes |
|---------|--------|-------|
| <service-name> | add|modify|depends-on | <notes> |

## telemetry_call_sites
| story_id | event_type | featureId_source | attributes |
|----------|-----------|-----------------|-----------|
| <uuid-prefix> | impression|interaction|error|goal | work-breakdown.json uuid | <key: type> |
```

The `feature_id` field value is used as `featureId` in telemetry call sites. It must never be hardcoded in shared infrastructure.

---

# Build Agent Expectations

The build agent owns:

- implementation
- repository inspection
- pre-codegen checks
- mandatory skill application
- artifact generation
- story commits
- README updates
- handoff generation

The build agent does not own full validation.

---

# Security Agent Expectations

The security agent owns post-build security analysis and repair.

The security agent must:

- inspect changed files
- analyze security boundaries
- validate input handling
- verify auth/authz correctness
- detect secret leaks
- verify env exposure correctness
- verify telemetry privacy safety
- analyze injection risks
- verify secure CORS/session configuration
- run dependency security checks
- repair safe security defects
- commit security fixes
- write `/tmp/security-results.json`
- return structured JSON

The security agent may modify code in order to repair security defects.

The security agent runs AFTER implementation and BEFORE final verification.

The security agent must not:

- invent a new auth model
- remove intended functionality
- weaken tests to force success
- bypass telemetry requirements
- expose secrets to client code

---

# Verify Agent Expectations

The verify agent owns:

- tests
- smoke tests
- production builds
- telemetry verification
- runtime verification
- deploy build/runtime parity
- repairs
- rerunning checks
- structured JSON output

The verify agent may modify code in order to repair issues.

---

# Orchestration Flow Requirements

The generated orchestrator prompt must enforce this execution order:

1. agiloop-build-agent
2. agiloop-security-agent
3. agiloop-verify-agent

The verify agent is the final authority for overall success/failure.

If the security agent applies fixes:
- the verify agent must validate those fixes
- the verify agent must rerun affected checks

If the verify agent finds deploy/runtime failures:
- it must repair and rerun checks within repair budget

---

# Orchestrator Contract

## ORCHESTRATOR-PROMPT.md Required Structure

The generated `.implement/ORCHESTRATOR-PROMPT.md` must include:

1. **Invocation order** — explicit numbered sequence: (1) build agent, (2) security agent, (3) verify agent.
2. **Per-agent input** — what each agent must read before starting (CLAUDE.md, FEATURE-BRIEF.md, handoff file, results files).
3. **Repair budget** — the maximum number of full Build → Security → Verify cycles before giving up (see below).
4. **Failure-cascade rules** — what to do when an agent returns a non-passing status (see below).
5. **Final response shape** — the JSON the orchestrator writes to `/tmp/orchestrator-results.json` after all agents complete.
6. **Success gate** — the orchestrator must not return `status: pass` unless the verify agent returns `status: pass`.
7. **Console output rendering** — render each agent's results to stdout as human-readable text immediately after that agent completes (see Console Output Rendering below). JSON is written to a file, not stdout.

## Repair Budget

Maximum orchestration repair loops: **3 full Build → Security → Verify cycles**.

The loop counter increments only when the orchestrator re-invokes the build agent for a new implementation pass. Individual agents have their own per-error budgets (3 attempts per distinct error within a single agent run); those budgets do not increment the orchestrator-level counter.

If the loop counter reaches 3 and the verify agent still does not return `status: pass`, the orchestrator returns `status: fail` with `retryable: true` and stops.

## Failure-Cascade Rules

| Scenario | Rule |
|----------|------|
| Build agent returns `status: blocked` | Orchestrator stops; skips security and verify; returns `status: blocked` |
| Security agent returns `status: blocked` | Orchestrator still runs verify; final status is `fail` regardless of verify result |
| Security agent returns `status: fail` (unfixed high/critical findings) | Orchestrator still runs verify; final status is `fail` |
| Security agent returns `status: pass` | Orchestrator runs verify normally |
| Verify agent returns `status: fail` (fixable defects) | Verify agent repairs locally and reruns; orchestrator does not re-invoke build unless verify explicitly reports `retryable: true` with `failed_step: build` |
| Verify agent returns `status: blocked` | Orchestrator returns `status: blocked`; increments loop counter; re-invokes build if within budget |
| Verify agent returns `status: pass` | Orchestrator returns `status: pass` if security also passed |

## Console Output Rendering

The orchestrator's stdout must be human-readable plain text. Do **not** print agent JSON results to stdout. As each agent completes, render a compact summary block to stdout immediately. At the end, render a final status block.

The structured JSON described in **Orchestrator Final Response Shape** below is preserved by writing it to `/tmp/orchestrator-results.json` (and emitting one final stdout line: `Full results: /tmp/orchestrator-results.json`). It is not printed inline.

### Rendering format

Use this exact structure. Substitute real values; preserve the labels, indentation, and section dividers verbatim. Status markers: `✓` pass · `✗` fail · `⊘` blocked · `–` skipped.

```text
═══ Agiloop Build Pipeline ═══
Feature: <name> (<feature-id-prefix>)
Loop iteration: <n>/3

──── Build Agent ────
Status: <marker> <status>
Stories committed: <committed>/<total>
Dependencies added: <count>[ (<name>@<ver>, ...)]
Files changed: <count> (added <n>, modified <m>[, deleted <k>])
[Blockers: <count> — see end]
Handoff: /tmp/codegen-handoff.md

──── Security Agent ────
Status: <marker> <status>
Findings: <crit> critical · <high> high · <med> medium (<repaired> repaired) · <low> low (<deferred> deferred)
Secrets scan: <clean|N findings>
Dependency audit: <clean|N high/critical>
[Repairs committed: <commit-msg-1>; <commit-msg-2>]
Results: /tmp/security-results.json

──── Verify Agent ────
Status: <marker> <status> (loop <n>)
  Tests:           <marker> <count> passing[, <fail-count> failing]
  Build (deploy):  <marker> <service-list>
  CSS preflight:   <marker> [<violations>]
  Dev smoke:       <marker> <service-list>
  Prod smoke:      <marker> <service-list>
  Telemetry:       <marker> [feature-id neutral]
  Deploy manifest: <marker>
[For each failed sub-step, indent two more levels with file:line and a one-line evidence excerpt.]
Results: /tmp/verify-results.json

═══ Final: <marker> <status>[ (retryable)] ═══
[<n> blocker(s):]
[  [<agent>] <step> → <issue>]
[  next action: <recommended_next_action>]

Full results: /tmp/orchestrator-results.json
```

### Rendering rules

- **Streaming, not batched.** Render each agent's block as soon as that agent's Task tool call returns — not at the end. The user must see Build Agent output before Security Agent starts.
- **No truncation of failures.** Every blocker, every failed sub-step, and every error excerpt that contributed to a non-`pass` status must appear in the rendered output. The JSON file is the canonical record, but the console must be sufficient to act on without opening the JSON.
- **Width-aware.** Wrap evidence excerpts at 100 columns. Use `…` for mid-string truncation when an excerpt exceeds 200 characters.
- **No ANSI color** unless the orchestrator can detect a TTY. Plain ASCII status markers (`✓`/`✗`/`⊘`/`–`) are required regardless.
- **Suppress agent JSON.** If an agent's Task return contains a JSON envelope, the orchestrator parses and renders — never echoes raw JSON to stdout.
- **One JSON write.** After all agents complete (or the loop terminates), write the final structured response to `/tmp/orchestrator-results.json`. Do not write intermediate JSON files for partial loops; overwrite the same path each loop iteration.

### Empty-section omission

If a section has no relevant content, omit only the optional bracketed lines, not the agent block itself. Every agent that ran must have a block; agents that were skipped per failure-cascade rules render with `Status: – skipped` and a one-line reason.

## Orchestrator Final Response Shape

The orchestrator writes this structure to `/tmp/orchestrator-results.json` after all agents complete (or after the repair loop terminates). It is the canonical record for programmatic consumers. The orchestrator does **not** print this JSON to stdout — see Console Output Rendering above.

```json
{
  "status": "pass|fail|blocked",
  "summary": "",
  "loop_iteration": 0,
  "build": {
    "status": "pass|fail|blocked",
    "results_path": "/tmp/codegen-handoff.md"
  },
  "security": {
    "status": "pass|fail|blocked|skipped",
    "results_path": "/tmp/security-results.json"
  },
  "verify": {
    "status": "pass|fail|blocked|skipped",
    "results_path": "/tmp/verify-results.json"
  },
  "blockers": [
    {
      "agent": "build|security|verify",
      "story_id": "",
      "step": "",
      "issue": "",
      "evidence": "",
      "recommended_next_action": ""
    }
  ],
  "retryable": false
}
```

`status: pass` requires: build `pass`, security `pass`, verify `pass`. Any other combination produces `fail` or `blocked`.

---

# Non-Negotiable Preservation Rules

Do not omit any of these original requirements:

- `.agiloop/deploy.json` generation/maintenance
- no vendor-specific deploy manifests
- deploy variable syntax: `{{serviceName.url}}`
- direct `startCommand` invocation of built artifacts
- `FRONTEND_URL`: `{{frontend.url}}`
- CORS localhost wildcard + `FRONTEND_URL`
- feature id sourced from top-level `uuid` in `work-breakdown.json`
- label the value as `feature id`, never `uuid`
- feature-id-neutral telemetry infrastructure
- current feature id only at telemetry call sites
- mandatory skill artifact contracts
- split-origin `/api/*` route trap
- env-optional real/mock runtime contract
- dependency latest-stable rule
- no `--force` / `--legacy-peer-deps`
- audit gate
- README update requirement
- Node module format alignment
- ghost directory checks
- pnpm-workspace.yaml requirements
- deploy build/runtime parity validation
- exact `.agiloop/deploy.json` buildCommand validation
- exact `.agiloop/deploy.json` startCommand validation
- security-agent-before-verifier execution order
- `/tmp/security-results.json` generation
- no secret exposure to client bundles
- no server-only env exposure to frontend code
- required validation of all external input boundaries
- telemetry metadata privacy validation

---

# Final Validation Ownership

The verify agent is the final truth gate.

A feature is not complete unless:

- build agent succeeds
- security agent succeeds or reports only acceptable residual risk
- verify agent succeeds
- exact deploy build commands pass
- exact deploy runtime commands pass where locally runnable

The orchestrator must never return success unless the verify agent returns:

```json
{ "status": "pass" }
```

---

# Output Style

Outputs should be:

- deterministic
- operational
- implementation-oriented
- machine-friendly
- concise but complete

Avoid:

- marketing language
- conversational prose
- vague recommendations
- duplication without a named canonical source (duplication is permitted only when the canonical source is referenced by name; see Canonical Sources below)

---

# Canonical Sources of Truth

Rules appear in multiple files because agents need their instructions self-contained and projects need rules visible without reading agent files. This duplication is intentional. Each rule class has one canonical source; other copies are mirrors.

| Rule class | Canonical source | Mirrors |
|------------|-----------------|---------|
| Project conventions | `.implement/CLAUDE-baseline.md` → per-feature `CLAUDE.md` | Agent files reference baseline for context |
| Build process | `agents/agiloop-build-agent.md` (`.claude/agents/` in projects) | Build-relevant rules summarized in `.implement/CLAUDE-baseline.md` |
| Security process | `agents/agiloop-security-agent.md` (`.claude/agents/` in projects) | Security rules summarized in `.implement/CLAUDE-baseline.md` |
| Verify process | `agents/agiloop-verify-agent.md` (`.claude/agents/` in projects) | Verify rules summarized in `.implement/CLAUDE-baseline.md` |
| Generation routing | `INITIAL-PROMPT.md` | (none — this file is the routing authority) |
| Per-feature spec | `.implement/FEATURE-BRIEF.md` | (generated from inputs; read by all agents) |

When a rule in an agent file conflicts with a rule in `.implement/CLAUDE-baseline.md`, the agent file governs the agent's behavior. When updating rules, update the canonical source first, then synchronize mirrors.

---

# Now Generate

You have read the routing matrix, the schemas, the contracts, and the canonical sources. Execute the **Task** section at the top of this file. Write the three output files. Print the completion report. Stop.

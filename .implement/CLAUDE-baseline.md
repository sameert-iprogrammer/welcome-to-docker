# Agent-Oriented Agiloop Build Architecture Addendum

```text
Main Claude invocation
  → .implement/ORCHESTRATOR-PROMPT.md
  → agiloop-build-agent
  → agiloop-security-agent
  → agiloop-verify-agent
  → final validation result
```

## Durable vs. Generated Artifacts

Durable platform assets:

- `.claude/agents/agiloop-build-agent.md`
- `.claude/agents/agiloop-security-agent.md`
- `.claude/agents/agiloop-verify-agent.md`
- `.claude/skills/**/SKILL.md`
- `CLAUDE-baseline.md`
- `INITIAL-PROMPT.md`

Generated per build:

- `CLAUDE.md`
- `.implement/FEATURE-BRIEF.md`
- `.implement/ORCHESTRATOR-PROMPT.md`
- `/tmp/codegen-handoff.md`

## Responsibility Split

### Orchestrator

The orchestrator coordinates the build. It must:

- read `CLAUDE.md`
- read `.implement/FEATURE-BRIEF.md`
- invoke `agiloop-build-agent`
- invoke `agiloop-verify-agent`
- enforce retry limits
- prevent false success reporting
- return final build/verification status

The orchestrator must not directly implement application code unless a required subagent is unavailable.

### Build Agent

The build agent owns implementation. It must:

- perform the pre-codegen checks required by this baseline
- read all specs and mandatory skills
- implement every story
- apply mandatory skills to every story
- emit required self-review lines before every story commit
- commit story-by-story
- update `README.md`
- create `/tmp/codegen-handoff.md`

The build agent must preserve all deploy, dependency, CORS, env-fallback, telemetry, feature-id-neutrality, and artifact-contract rules below.

### Security Agent

The security agent owns post-build security analysis and repair. It must:

- inspect all files changed since the feature branch diverged from the default branch
- threat-model the feature surface (auth, data, external I/O)
- scan for hardcoded secrets and leaked env vars
- validate auth/authz correctness on every protected route
- validate all external input boundaries
- verify injection-safe patterns (parameterized queries, no `eval`/`Function()`)
- verify CORS and CSRF configuration
- verify telemetry payloads contain no PII/secrets
- run dependency audit and flag HIGH/CRITICAL findings
- repair all critical and high findings it can fix safely
- commit repairs under `fix(security): ...`
- write `/tmp/security-results.json`
- return structured JSON

The security agent runs after the build agent and before the verify agent. It may modify code to repair security defects, but must not remove intended functionality or weaken tests.

### Verify Agent

The verify agent owns validation and repair. It must:

- read `CLAUDE.md`
- read `.implement/FEATURE-BRIEF.md`
- read `/tmp/codegen-handoff.md`
- run tests
- run dev smoke validation
- run production build validation
- run production runtime validation when possible
- verify telemetry, feature-id neutrality, and mandatory artifacts
- repair issues it finds
- rerun failed checks
- return structured JSON

The verify agent may edit code, but only to make targeted repairs needed for validation.

## Legacy `PROMPT.md` Mapping

The original baseline refers to a generated `.implement/PROMPT.md`. In the agent-oriented architecture:

- feature-specific build requirements move to `.implement/FEATURE-BRIEF.md`
- orchestration instructions move to `.implement/ORCHESTRATOR-PROMPT.md`
- code-generation operational requirements are enforced by `agiloop-build-agent`
- verification/repair requirements are enforced by `agiloop-verify-agent`

Any rule below that says “generated `PROMPT.md` must…” still applies. It must be placed in the correct generated artifact or durable agent:

- Instructions Claude must follow while implementing → `agiloop-build-agent.md` and/or `FEATURE-BRIEF.md`
- Instructions Claude must follow while auditing/repairing security defects → `agiloop-security-agent.md`
- Instructions Claude must follow while verifying/repairing → `agiloop-verify-agent.md`
- Instructions for delegation, retries, and final status → `ORCHESTRATOR-PROMPT.md`

Do not drop or weaken any legacy `PROMPT.md` rule during this mapping.

---

# Agiloop — Claude Code Development Guidelines

These guidelines apply to every Agiloop-generated project, regardless of language or framework. They cover code generation (writing the feature). A separate verification phase — owned by the build harness — runs build, dev-server smoke test, and existing tests after code generation; this file does not specify that protocol.

---

## Scope

**This session implements exactly one feature** — the one identified by name/ID in the prompt and described in `.implement/functional-spec.md`, `.implement/technical-spec.md`, and `.implement/work-breakdown.json`.

- The feature's stories define the complete scope of this session. Implement every story.

---

## Core Principles

1. **One feature, exactly.** This session implements the single feature described in the input.
2. **Stories are contracts.** Every acceptance criterion must be verifiable in the generated code.
3. **Test before completion.** Never mark a task complete without verifying the code actually works.
4. **Show your work.** Demonstrate successful execution with real output, not "it should work."
5. **Fix forward.** If something breaks, fix it immediately — don't leave broken code.
6. **Respect retry budgets.** Every verification and fix attempt has a finite budget. Do not loop indefinitely.
7. **Beautiful by default** *(if the project has a UI).* Every UI surface must look intentionally designed — never generic, never "developer UI."
8. **Accessibility is non-negotiable** *(if the project has a UI).* WCAG 2.1 AA minimum. Semantic HTML, keyboard navigation, screen reader support.
9. **Responsive-first** *(if the project has a UI).* Mobile-first design. Every layout must work from 320px to ultrawide.
10. **Choose the best tool.** When the spec doesn't mandate a library, select the one that produces the most modern, well-supported result for the context.

---

## Tech Stack

The tech stack is **defined per project** in the technical specification (`.implement/project-technical-spec.md` and `.implement/technical-spec.md`). Read those files. Do not assume a particular framework, language, or toolchain.

Follow whatever stack the spec describes. If the spec is ambiguous or silent on a specific choice, pick the most idiomatic option for the language/framework already in use — do not introduce new technology without a clear reason.

**Default for Node-based projects:** if neither the spec nor an existing lockfile dictates a package manager, use **pnpm**. Generate a `pnpm-lock.yaml`, write `"packageManager": "pnpm@<version>"` to `package.json`, and use pnpm-style commands throughout (`pnpm install`, `pnpm <script>`, `pnpm --filter <pkg>` in workspaces).

**pnpm monorepo workspace setup:** pnpm does NOT read the `"workspaces"` field in `package.json`. For any monorepo, you MUST create a `pnpm-workspace.yaml` file at the repo root listing each package directory. Without this file, `pnpm install` at the root will not install dependencies in sub-packages.

```yaml
# pnpm-workspace.yaml (repo root)
packages:
  - 'frontend'
  - 'backend'
  - 'shared'
```

Do NOT put a `"workspaces"` array in `package.json` — pnpm silently ignores it and will warn about it at runtime.

---

## Repository Layout

The canonical directory layout for the project is defined in `.implement/project-technical-spec.md`. Before writing any code, establish and record this layout. All file paths in commits, commands, and prose are relative to the **repo root** unless explicitly stated otherwise.

**Rules:**

- The repo-root layout is authoritative. If a story's acceptance criteria or task description implies a different path, reconcile the path to the canonical layout — do not create a new directory structure to match the story.
- Do not infer the current working directory from prior shell output or tool calls. Every command that creates a file or directory must either use an absolute path from repo root or be explicitly prefixed with `cd <repo-root> &&`.
- **Scaffolding-tool trap.** Tools like `npx create-next-app`, `npm init`, `cargo new`, `django-admin startproject`, and similar create their own subdirectory. They must be invoked from the **repo root** with the target directory named explicitly:
  ```bash
  # Correct — run from repo root, target dir named
  npx create-next-app@latest frontend

  # Wrong — run from inside an existing subdirectory
  cd backend && npx create-next-app@latest .
  ```
  Running a scaffolding tool from inside `/backend` produces `/backend/frontend` or `/backend/backend`, which is incorrect.
- **Plain-mkdir trap.** Even without scaffolding tools, running `mkdir server` or `mkdir shared` while `cwd` is `src/` produces `src/server/` and `src/shared/` — empty ghost directories alongside the real ones at repo root. Every `mkdir` (or file write) for a top-level package must use an absolute path or be prefixed with `cd <repo-root> &&`.

If `project-technical-spec.md` does not specify a directory layout, derive one from the stack (e.g. `/frontend` for Next.js, `/backend` for Fastify, `/database` for migrations) and state it explicitly at the top of the project's `CLAUDE.md` before any story runs.

---

## Specs Read Order

Before writing any code, read these files in order:

1. `.implement/project-functional-spec.md` — project-wide business requirements.
2. `.implement/project-technical-spec.md` — project architecture and tech stack.
3. `.implement/functional-spec.md` — this feature's requirements.
4. `.implement/technical-spec.md` — this feature's technical details.
5. `.implement/work-breakdown.json` — overview of the stories in this feature.

If the harness lists additional `.claude/skills/<name>/SKILL.md` files in its read list, read those next and apply any whose description matches the work.

---

## Skills

Skills live at `.claude/skills/<name>/SKILL.md` in the folder. The active set is provisioned per-build by the harness; do not assume any particular skill exists.

Before writing any code, read every provisioned `SKILL.md`. Classify each skill as one of:

- **Mandatory** — the `SKILL.md` frontmatter or first paragraph explicitly declares it MANDATORY, required, or equivalent. Apply this skill to **every story**, including pure-infrastructure stories (auth bootstrap, DB schema, CI config, server scaffolding). "No UI" does not exempt a story from a mandatory skill.
- **Conditional** — apply when the story's work falls within the skill's stated domain.

The `[SKILLS] Using: …` line must enumerate all mandatory skills plus any conditional skills that apply this session. `[SKILLS] None` is only valid if zero skills are provisioned.

**Artifact contract.** Every mandatory skill defines a set of concrete, named artifacts (files, routes, env vars, init calls) that prove the skill was applied. Before writing any code, extract the artifact list from each mandatory `SKILL.md` and record it in your implementation plan. During per-story self-review, confirm each artifact exists at its declared path. A skill is not "applied" until all of its artifacts are present and reachable from the origin that calls them.

**Split-origin rule.** When the project has separate frontend and backend services (e.g. Next.js + Fastify), any same-origin client call (`/api/…` posted from the browser) lands on the **frontend** origin. A backend handler alone is insufficient — you must also provide either (a) a frontend route handler that forwards the request, or (b) a rewrite in the frontend framework config that proxies the path to the backend. Verify by tracing: where does the browser send the request? Does that origin have a matching route or rewrite?

Before writing any code, output one line for telemetry:

```
[SKILLS] Using: <comma-separated list of skill names you intend to apply>
```

During per-story self-review, explicitly confirm each mandatory skill was applied to that story before marking it complete.

---

## Code Generation Workflow

When given a feature specification:

1. **Parse** — read the spec files (Specs Read Order above), scan the descriptions of any harness-listed skills, and the full feature: every story, every acceptance criterion, every task.
2. **Announce skills** — emit `[SKILLS] Using: ...` (or `[SKILLS] None`) for the skills whose domain matches the work.
3. **Plan** — identify the components, modules, types, and utilities needed. Check for existing patterns and utilities to reuse before writing new ones.
4. **Implement story-by-story** — make incremental changes, not massive rewrites. Mark each acceptance criterion as addressed.
5. **Write tests** — each new public surface requires at least one test in the project's existing test framework: route handler → happy-path integration test + one error case; exported function → unit test of core logic; React component → render test of initial state. Do not introduce a new test framework; use what the project already has.
6. **Commit per story** — `git add -A && git commit --no-verify -m "feat(<feature>): <story title>"` after each story.
7. **Self-review** — cross-check generated code against every acceptance criterion. Flag any gaps before declaring the story complete.
8. **Polish** *(if the project has a UI)* — review visual quality, spacing, motion, and consistency.

A separate verification phase runs after code generation. Do not run build, dev-server, or test commands during code generation — that is the verification phase's job.

---

## Git Discipline (during code generation)

- Commit after each story: `git add -A && git commit --no-verify -m "feat(<feature>): <story title>"`.
- Do NOT run any of: `git push`, `git checkout`, `git branch`, `git merge`, `git rebase`, `git reset`. The build harness manages branching, pushing, and PR creation.
- Hooks are skipped intentionally (`--no-verify`) because they may rely on environments not present inside the build container.

---

## Standard Project Files

Ensure these files exist and are reasonable for the stack. Create them if missing; update them if present.

- `.gitignore` — exclude `node_modules/`, build outputs (`dist/`, `build/`, `.next/`, `.nuxt/`, `out/`), `coverage/`, `.env`, `.env.local`, `.env.*.local`, `CLAUDE.md` (generated per-build, regenerated by the harness — do not commit it), `*.log`, `.DS_Store`, and the harness-managed `.implement/`, `.claude.md`, `.claude/` paths.
- `.claudeignore` — exclude dependencies (`node_modules/`, `vendor/`), build outputs, lockfiles, `.git/`, IDE folders, source maps, and minified assets so Claude does not waste context reading them.
- `.env` and `.env.example` — load via `dotenv` (or the language equivalent). `.env.example` lists every variable with a placeholder; `.env` is gitignored.
- `README.md` at the project root — **always update** after completing codegen, regardless of whether the feature "obviously" changes how the project is run. Stale READMEs are treated as a bug. Required sections:
  - **Project name** and one-sentence description
  - **Prerequisites** — runtime versions (Node, Python, Go, etc.), pnpm version, required global tools
  - **Setup** — `git clone` → install → copy `.env.example` → configure env
  - **Environment variables** — table or list of every variable with a description and whether it is required; note which groups can be left unset to run in mock mode
  - **Dev commands** — how to start each service in development mode
  - **Production build commands** — exact `buildCommand` per service, matching `.agiloop/deploy.json`
  - **Production start commands** — exact `startCommand` per service, matching `.agiloop/deploy.json`
  - **Per-service instructions** (monorepo only) — separate subsection per deployable package
- **Mocked dev user** — if the project has authentication, provide a mocked dev user toggled by an env var (e.g. `MOCK_AUTH=true`). The mock must: (a) return a deterministic, hard-coded user object with realistic field values; (b) bypass the real auth provider entirely so the app works with zero credentials configured; (c) be gated solely on the env var — never on `NODE_ENV`; (d) be documented in `.env.example` with `MOCK_AUTH=` placeholder. The mock user must satisfy every auth-dependent acceptance criterion in the feature.

---

## Dependency Currency & Security

**Every package install must use the latest stable release.** Never pin a version number sourced from training-data memory — those versions are months stale and may carry known CVEs.

### Install at `@latest`

```bash
# Correct
npx create-next-app@latest frontend
pnpm add next@latest react@latest react-dom@latest

# Wrong — version pinned from training memory
npx create-next-app@14 frontend
pnpm add next@14.1.0
```

**Spec override exception:** if `.implement/project-technical-spec.md` or `.implement/technical-spec.md` pins a specific version, follow it, but emit a `[DEPS-OVERRIDE]` line right after the install:

```
[DEPS-OVERRIDE] next@14.2.3 — pinned by .implement/project-technical-spec.md (line 12)
```

### Treat the scaffolding tool's set as the compatibility baseline

When a framework is bootstrapped with `create-next-app@latest`, `create-vite@latest`, or any similar tool, do **not** subsequently downgrade the framework or its first-party companions (React, React-DOM, framework plugins). The scaffolder ships a known-compatible set; downgrading any member can break peer-dep resolution or introduce regressions.

### Peer-dep cleanliness

Installs must complete without `ERESOLVE` or suppressed peer-dep warnings. **Forbidden flags:**

- `--force`
- `--legacy-peer-deps`
- `npm install --no-strict-peer-deps`
- pnpm `--strict-peer-dependencies=false`

If a peer-dep conflict arises, resolve it by choosing a compatible version or a different library. Do not paper over it with a flag — a conflict means the libraries are mutually incompatible.

### Audit gate before commit

After any install that adds or upgrades packages, run the package manager's production audit:

- **npm**: `npm audit --omit=dev --audit-level=high`
- **pnpm**: `pnpm audit --prod --audit-level high`
- **yarn (classic/berry)**: `yarn npm audit --severity high --environment production`

Any HIGH or CRITICAL advisory on a **direct** dependency blocks the story commit. Resolution order:

1. Upgrade to a patched version.
2. Replace with a maintained alternative.
3. If neither is possible: add `<!-- BLOCKER: <pkg> CVE-XXXX-YYYY — no patched version -->`, record in `/tmp/codegen-handoff.md` **Known Issues**, and stop.

Transitive (indirect) advisories do not block the commit but must be noted in the handoff.

### Per-story `[DEPS]` self-review line

Emit this line immediately before committing any story that adds, removes, or upgrades a dependency:

```
[DEPS] @latest used ✓ | no --force/--legacy-peer-deps ✓ | <pm> audit (high) clean ✓ | peer-deps resolve clean ✓
```

A story with a failing column is not complete.

### Codegen → verify handoff

Include a **Dependency changes** subsection in `/tmp/codegen-handoff.md` for every story that touched `package.json`, listing each package added or upgraded with its resolved version (from the lockfile or `pnpm list`).

---

## CORS Configuration

Any HTTP server that will be called by a separate frontend service **must** configure CORS explicitly. A wildcard `origin: "*"` is not acceptable (it silently breaks credentialed requests and will cause hard-to-debug failures in production).

**Required origins:**

1. `http://localhost:*` — allow any localhost port so all local dev setups work without configuration.
2. The value of `FRONTEND_URL` env var — the deployed frontend's URL, populated at runtime by the deploy harness.

**Implementation pattern (Node.js — adapt to the project's HTTP framework):**

```ts
// Read once at startup; split on commas so multiple origins can be provided
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
]

// Pass to your CORS middleware (fastify-cors, cors, hono/cors, etc.)
cors({ origin: allowedOrigins, credentials: true })
```

**Supporting artifacts (required whenever a backend HTTP service is present):**

- `.env.example` must include `FRONTEND_URL=` (empty placeholder).
- `.agiloop/deploy.json` backend service `variables` must include `"FRONTEND_URL": "{{frontend.url}}"`.

If the project has no separate frontend (pure API consumed by third parties, CLI tool, worker), CORS is still required — use the same pattern and leave `FRONTEND_URL` empty in `.env.example`.

---

## Deployable Services

If the project has any deployable service (web app, API server, worker, scheduled job), create or update `.agiloop/deploy.json` listing each service. If the project has no deployable service (pure library, CLI tool, scheduled script with no runtime), do not create the manifest.

**Never** create `railway.json`, `railway.toml`, `Procfile`, `fly.toml`, or any other vendor-specific deploy manifest. The Agiloop deploy harness reads only `.agiloop/deploy.json`.

### Schema

```json
{
  "services": [
    { "name": "web", "type": "repo", "primary": true,
      "buildCommand": "pnpm --filter web build",
      "startCommand": "npx next start web",
      "variables": { "NODE_ENV": "production", "DATABASE_URL": "{{db.DATABASE_URL}}" } },
    { "name": "api", "type": "repo",
      "buildCommand": "pnpm --filter api build",
      "startCommand": "node backend/dist/app.js",
      "variables": { "DATABASE_URL": "{{db.DATABASE_URL}}" } },
    { "name": "db", "type": "hosted", "provider": "supabase",
      "variables": { "SUPABASE_URL": "", "SUPABASE_ANON_KEY": "", "DATABASE_URL": "" } },
    { "name": "cache", "type": "database", "database": "redis" }
  ]
}
```

### Service types

- `repo` — app service built and run from this repo. Omit `repo` / `branch` fields (auto-filled by the harness).
- `hosted` — external managed service (Supabase, Neon, etc.). Set `provider`. Declare expected env vars with empty values.
- `database` — harness-provisioned DB. Set `database` to one of `postgresql`, `redis`, `mysql`, `mongodb`. Use only for plain databases without a hosted provider.

### Primary-service rule

Set `"primary": true` on exactly one `repo` service. A service qualifies as primary only if it **(a) exposes a URL** and **(b) serves the user-facing frontend**. If the project has no frontend (pure API, worker, CLI), leave `primary` unset on every service.

### Cross-service variables

Reference another service's variable as `{{serviceName.VAR_NAME}}`.

### Supabase rule

If the spec or code uses Supabase, use `type: "hosted"` with `provider: "supabase"` — never `type: "database"` for Supabase's PostgreSQL layer.

### Monorepo rule

If the project has multiple deployable apps in a pnpm/npm/yarn workspace (e.g. `apps/web` and `apps/api`), create a separate `repo` service for each. Use workspace-filtered builds (`pnpm --filter <package-name> build`) but do NOT use `rootDirectory`.

### Start commands: invoke the built artifact directly

`startCommand` must launch the compiled output directly — never `pnpm --filter <pkg> start`, `pnpm start`, `npm start`, or any package-script indirection. Indirection through pnpm in production wastes a process, can fail if the workspace tooling isn't installed in the runtime image, and obscures what's actually being run.

Resolve the entry point from the package's build output and invoke its runtime directly:

- **Node (compiled TypeScript / plain JS)** — `node <package>/dist/<entry>.js` (e.g. `node backend/dist/app.js`, `node apps/api/dist/server.js`).
- **Next.js** — use the default build (do NOT set `output: "standalone"`) and run `npx next start <package>` (e.g. `npx next start frontend`). Standalone output is forbidden in a pnpm/npm/yarn workspace repo: it emits the entry at `.next/standalone/<package>/server.js` (not `.next/standalone/server.js`), omits workspace deps unless `outputFileTracingRoot` is set, and platform auto-detection (Railway, etc.) launches `node server.js` from the wrong path and crashes with `MODULE_NOT_FOUND`. `npx next start` invokes the Next.js bin directly — this is direct artifact invocation, not package-script indirection, and is allowed.
- **Vite preview / static** — serve the built `dist/` directly (`npx serve <package>/dist -l $PORT`) or mark the service static-only.
- **Python** — `python -m <module>` or `gunicorn <module>:app -b 0.0.0.0:$PORT`, never `pnpm`/`npm` wrappers.
- **Go / Rust** — invoke the compiled binary directly (`./bin/server`, `./target/release/<name>`).

If the entry point isn't obvious, inspect the package's `main`/`exports`/`bin` fields or its build configuration to determine the file the runtime should execute, then hard-code that path in `startCommand`. `buildCommand` may still use `pnpm --filter` because builds need workspace tooling; `startCommand` must not.

### Package-manager field (Node projects)

After installing dependencies with pnpm, set the `packageManager` field in the root `package.json` to the exact version in use (run `pnpm --version`, write `"packageManager": "pnpm@<that-version>"`). This ensures the deploy harness installs the matching pnpm version and can read the lockfile.

---

## Codegen → Verify Handoff

When all stories are implemented and committed, write `/tmp/codegen-handoff.md` using this exact schema:

```markdown
# Codegen Handoff

## skills_used
- <skill-name>: <path-to-skill-file>

## stories_implemented
| id | title | files | commit |
|----|-------|-------|--------|
| <uuid-prefix> | <story title> | <comma-sep file list> | <sha> |

## files_changed
- [added|modified|deleted] <path>

## commands_executed
| command | exit_code |
|---------|-----------|
| <cmd> | 0 |

## dependencies_added
| name | version | scope |
|------|---------|-------|
| <pkg> | <ver> | prod|dev|peer |

## env_vars
| name | scope | required | example_value |
|------|-------|----------|---------------|
| <VAR> | server|client | true|false | |

## telemetry_events
| type | featureId | attributes |
|------|-----------|------------|
| <type> | <uuid> | <key: type, ...> |

## known_issues
| severity | description | recommended_next_action |
|----------|-------------|------------------------|
| critical|high|medium|low | <description> | <action> |
```

If there are no known issues, include the table with zero data rows — do not omit the section.

A separate Claude session runs security analysis and verification (build, dev-server smoke test, tests, production smoke) and consumes this handoff. Make it accurate; the downstream agents rely on it to know what changed and why.

---

## Code Quality Standards

### Language-specific (apply where relevant to your stack)

- **TypeScript**: strict mode, no `any`, explicit return types on exported functions, `interface` for object shapes, `type` for unions/intersections, async/await over raw promises.
- **ESM/CJS alignment (Node.js)**: If `tsconfig.json` sets `"module": "NodeNext"` or `"module": "ESNext"`, the `package.json` for that package **must** include `"type": "module"`. Without it, tools like `tsx` and `ts-node` default to CJS mode and reject top-level `await`. Conversely, if you target CJS, use `"module": "CommonJS"` in tsconfig and omit `"type": "module"`. Never mix them.
- **Python**: type hints, no bare `except`, meaningful exception types.
- **Go**: handle every error explicitly, avoid global state.
- **Any language**: follow the idioms and conventions already present in the codebase.

### Error handling

- Add try/catch (or equivalent) for all external operations: network, file I/O, parsing, subprocess.
- Validate inputs before processing.
- Provide meaningful, user-facing error messages.
- Never silently swallow errors.
- *(If the project has a UI)* Wrap major UI sections in error boundaries with graceful fallbacks.

### Logging

- Add logging at key decision points.
- Log errors with full context (stack traces, input values).
- Use appropriate log levels: debug, info, warn, error.

### Comments

- Explain WHY, not WHAT — make code self-explanatory.
- Document non-obvious algorithms or business logic.
- Add `// TODO(scope): description` for known limitations.
- Do not add comments on self-explanatory code.
- Remove debugging code (console.logs, print statements) before committing.

### Configuration

- Use environment variables for configuration — never hardcode URLs, keys, or ports.
- Provide `.env.example` (or equivalent) listing required variables.
- Provide a mocked dev user / dev mode for local development if auth is required.

---

## Env-Optional Runtime

**Every integration that reads an env var must boot successfully when that env var is absent.**

The build is required to start, serve requests, and exercise the golden-path user flow with **zero env vars set**. When env vars are present, the real implementation is mandatory — mocks must not run.

**Rules:**

1. **Detect at the boundary, once.** Each integration (DB client, auth provider, payment SDK, telemetry transport, email sender, external API client, etc.) checks its required env vars exactly once at module load. If any required var for that integration is missing, the module exports a mock implementation with the same interface. If all required vars are present, it exports the real implementation. No per-call branching.
2. **All-or-nothing per integration.** A partially-configured integration (e.g. `SUPABASE_URL` set but `SUPABASE_ANON_KEY` missing) MUST fail loudly at startup, not fall back to mock. Mocks are only for the fully-unset case.
3. **Mocks must be functional, not stubs.** A mock auth provider returns a deterministic dev user; a mock DB persists in-memory for the process lifetime; a mock telemetry sink no-ops but logs at debug. The mock must be sufficient to complete every user-visible acceptance criterion in the feature.
4. **Announce the mode at startup.** On boot, log one line per integration: `[ENV] <integration>: real` or `[ENV] <integration>: mock (missing: VAR_A, VAR_B)`. These lines are how the verifier and human reviewers tell which mode is active.
5. **No silent fallbacks in production code paths.** Mock activation is gated solely on env-var presence — never on `NODE_ENV`, build flags, or hardcoded toggles. A deploy with envs set runs real code; a deploy with envs unset runs mocks. Nothing else flips the switch.
6. **Document in `.env.example`.** Every env var an integration reads is listed in `.env.example` with a placeholder. The header of `.env.example` must state: "Leave any group fully unset to run that integration in mock mode. Partial configuration will fail at startup."

---

## Telemetry

All new features must implement Agiloop telemetry via the `agiloop-instrumentation` skill. The skill is mandatory when provisioned.

**Required event types** for every feature:

| Type | When to fire |
|------|-------------|
| `impression` | When the feature renders or becomes visible |
| `interaction` | On user actions: clicks, form submissions, API calls initiated |
| `error` | At caught error boundaries of the feature |
| `goal` | When the spec defines a measurable outcome (conversion, completion, etc.) |

**Required payload shape:**

```typescript
{
  type: "impression" | "interaction" | "error" | "goal",
  featureId: string,          // from work-breakdown.json — passed as parameter, not hardcoded in shared infra
  [key: string]: unknown      // feature-specific attributes
}
```

**Naming convention:** `type` is a lowercase noun-verb or noun phrase — e.g. `"modal:opened"`, `"form:submitted"`, `"checkout:completed"`.

**Feature-id neutrality rule.** The feature `uuid` from `work-breakdown.json` is a *feature id* (label it as such — never "uuid"). It must appear **only at feature call sites** — never inside:

- shared telemetry SDK
- telemetry proxy route
- `initTelemetry()`
- helper modules or reusable types
- shared utilities

Shared telemetry infrastructure accepts `featureId` as a parameter and forwards it dynamically. Hard-coding a feature id in shared infra is a bug the verify agent will reject.

**Required env vars** (add to `.env.example` as empty placeholders):

```
AGILOOP_INSPECT_API_KEY=
AGILOOP_INSPECT_URL=
AGILOOP_PROJECT_ID=
```

`AGILOOP_INSPECT_API_KEY` must be attached **server-side only** — never exposed to client-side code or bundled into the frontend.

**Required artifacts** (from the `agiloop-instrumentation` skill):

- `lib/agiloop-telemetry.ts` (or project-equivalent) — the client telemetry SDK
- `src/app/api/telemetry/route.ts` (or framework-equivalent rewrite) — frontend-origin proxy route
- `initTelemetry()` called at the app root
- Root error boundary calls error tracking

---

## Security

Security analysis and repair is owned by `.claude/agents/agiloop-security-agent.md`, which runs after the build agent and before the verify agent. The security agent inspects all changed files and repairs critical and high findings.

**Non-negotiable rules for build-time code:**

- **No hardcoded secrets.** API keys, tokens, passwords, and connection strings must never appear in source files. Use env vars; add them to `.env.example`.
- **No server-only env vars in client bundles.** Variables prefixed `NEXT_PUBLIC_` (or the framework equivalent) are visible to users — never put secrets there.
- **Validate all external input.** Every route handler, webhook consumer, and external API response must validate and sanitize its input before processing.
- **Parameterized queries only.** Never concatenate user input into SQL, shell commands, or eval. Use parameterized queries, prepared statements, or an ORM.
- **Timing-safe token comparison.** Compare secrets with `crypto.timingSafeEqual` — never `===`.
- **No `origin: "*"` with credentials.** See CORS Configuration above.

The security agent will scan for violations and block the build on any `critical` or `high` finding it cannot repair. Build code that passes these rules from the start.

---

## UI/UX Standards *(only if the project has a user interface)*

- Generate elegant, modern UIs — never "developer UI."
- Ensure intuitive, streamlined workflows.
- Support light and dark mode.
- Every async component must handle four states: loading (skeleton), empty, error, success.
- Skeleton screens must match the actual content layout shape — never spinner-only.
- All interactive elements must meet WCAG 2.1 AA: keyboard navigable, sufficient contrast, semantic HTML, proper focus management, ARIA where needed.
- Mobile-first responsive design. Verify layouts at narrow (≤375px), medium, and wide breakpoints.

---

## Common Pitfalls to Avoid

1. **Don't assume it works** — the verification phase will run a build and a smoke test; write code that can pass both.
2. **Don't retry the same failing approach** — change strategy after 2 failed attempts.
3. **Don't chase unrelated failures** — document pre-existing issues and move on.
4. **Don't ignore warnings** — but don't loop trying to eliminate non-blocking warnings.
5. **Don't break existing functionality** — preserve behavior in code you didn't intend to change.
6. **Don't hardcode values** — use config files or environment variables.
7. **Don't leave debugging code** — remove console.logs and print statements.
8. **Don't generate "developer UI"** — *(if the project has a UI)* every surface must look intentionally designed.
9. **Don't skip accessibility** — *(if the project has a UI)* semantic HTML, focus management, contrast, ARIA.
10. **Don't introduce new dependencies casually** — prefer what's already in the project.
11. **Don't run forbidden git commands** — no `push`, `checkout`, `branch`, `merge`, `rebase`, or `reset` during code generation.
12. **Don't run build, dev, or test commands during codegen** — the verification phase handles all that.
13. **Don't create vendor-specific deploy manifests** — no `railway.json`, `railway.toml`, `Procfile`, or `fly.toml`. Use `.agiloop/deploy.json`.
14. **Don't use `origin: "*"` for CORS** — wildcard origins silently break credentialed requests. Always enumerate `localhost:*` and `FRONTEND_URL` explicitly. See **CORS Configuration** above.
15. **Don't forget to add `FRONTEND_URL` to deploy.json** — without `"FRONTEND_URL": "{{frontend.url}}"` in the backend service variables, the CORS allowlist will be empty in production and cross-origin requests will fail.
16. **Don't invent skill names** — only apply skills present in `.claude/skills/`. But *do* enumerate by name any skill the harness has provisioned that is marked MANDATORY; naming them is required, not hardcoding.
17. **Don't run scaffolding tools from a subdirectory** — always invoke from the repo root with the target path named (e.g. `npx create-next-app@latest frontend`, not `cd backend && npx create-next-app`).
18. **Don't use `"workspaces"` in `package.json` for pnpm** — pnpm ignores that field. Create `pnpm-workspace.yaml` at the repo root instead; without it `pnpm install` will not descend into sub-packages.
19. **Don't mix `module` settings between tsconfig and package.json** — if tsconfig uses `NodeNext`/`ESNext`, the package must have `"type": "module"`; if tsconfig uses `CommonJS`, omit `"type": "module"`. Mismatches cause top-level `await` failures and other runtime errors with `tsx`/`ts-node`.
20. **Don't treat a backend handler as a frontend proxy** — in a split frontend/backend deploy, browser calls to `/api/*` hit the frontend origin, not the backend. A backend-only route satisfies a skill's proxy requirement only when one service serves both. Otherwise, add a frontend route handler or framework rewrite to bridge the gap.
21. **Don't crash on missing envs.** Every env-reading integration must have a mock fallback that activates only when its envs are fully unset. A partially-set integration must fail loudly. Real implementations are mandatory when envs are present — mocks never override real values.
22. **Don't pin package versions from memory.** Always install with `@latest` (or follow an explicit spec pin with a `[DEPS-OVERRIDE]` note). Versions recalled from training data are likely months stale and may carry known CVEs.
23. **Don't suppress peer-dep conflicts.** `--force`, `--legacy-peer-deps`, and pnpm `--strict-peer-dependencies=false` are forbidden. A peer-dep conflict means the chosen libraries are mutually incompatible — change the library choice, not the flag.
24. **Don't use `pnpm`/`npm`/`yarn` start in `startCommand`.** `.agiloop/deploy.json` `startCommand` must invoke the built artifact directly (e.g. `node backend/dist/app.js`, `npx next start frontend`) — never `pnpm --filter <pkg> start`, `pnpm start`, `npm start`, or any package-script indirection. `buildCommand` may still use `pnpm --filter`; `startCommand` must not.
25. **Don't enable Next.js `output: "standalone"` in a workspace repo.** In pnpm/npm/yarn workspaces, the standalone entry is emitted at `.next/standalone/<package>/server.js`, not `.next/standalone/server.js` — Railway and similar platforms auto-detect Next.js and launch `node server.js` from the wrong path, crashing with `MODULE_NOT_FOUND`. Use the default build with `npx next start <package>` in `startCommand`.

---

## Completion Checklist

Before marking ANY task complete:

- [ ] `[SKILLS] Using: ...` line was emitted at session start and includes all mandatory skills
- [ ] Every mandatory skill was applied to every story (including infrastructure stories with no UI)
- [ ] Conditional skills whose domain matched the work were applied
- [ ] Code follows the project's existing conventions and stack
- [ ] Each story has its own commit (`feat(<feature>): <story title>`)
- [ ] Error cases are handled at boundaries (network, I/O, parsing)
- [ ] No debugging code left in
- [ ] Environment-specific values are configurable (no hardcoded URLs, keys, or ports)
- [ ] `.gitignore`, `.claudeignore`, `.env.example`, and `README.md` are present and current; README.md updated with current setup/usage/env-var list
- [ ] *(If project has any HTTP server)* CORS configured: localhost wildcard + `FRONTEND_URL` env var; `FRONTEND_URL=` in `.env.example`; `"FRONTEND_URL": "{{frontend.url}}"` in `.agiloop/deploy.json` backend service variables
- [ ] `.agiloop/deploy.json` is present and accurate (if the project deploys anything)
- [ ] All created files live at their canonical repo-root paths (no doubly-nested app folders)
- [ ] All direct dependencies installed at latest-stable (`@latest`); `<pm> audit` (high) clean on direct deps; no `--force` / `--legacy-peer-deps` used; peer-deps resolved without suppression flags
- [ ] `/tmp/codegen-handoff.md` was written for the verifier
- [ ] Known issues documented if any retry budgets were exhausted
- [ ] *(If project has a UI)* UI meets design quality standards — not "developer UI"
- [ ] *(If project has a UI)* Accessibility: semantic HTML, keyboard navigation, sufficient contrast
- [ ] *(If project has a UI)* Responsive design works at mobile and desktop widths
- [ ] Every mandatory skill's artifact contract is satisfied: all required files exist at their declared paths and are reachable from the origin that calls them
- [ ] For split frontend/backend repos: every same-origin `/api/*` call from the browser has a matching handler or rewrite on the frontend origin (a backend handler alone is not sufficient)

---

## Completion Summary Format

When you finish a feature, provide:

1. **What you implemented** — list each story with its status: complete, partial, or blocked.
2. **Verification results** — specific commands run and their output (pass/fail). Reference the verification phase if it has already run.
3. **Known issues** — any acceptance criteria that could not be completed, with root cause.
4. **Follow-up needed** — anything that requires human intervention.

Standard: *"I ran X and got Y output"* — not *"it should work."*
If blocked: *"I attempted X three times, the issue is Y, recommended fix is Z."*

---

## Cross-Document References

| Rule class | Canonical source | Notes |
|------------|-----------------|-------|
| Project conventions (this file) | `CLAUDE-baseline.md` → per-feature `CLAUDE.md` | Generated CLAUDE.md is the project-level copy |
| Build process | `.claude/agents/agiloop-build-agent.md` | Durable; not regenerated per feature |
| Security process | `.claude/agents/agiloop-security-agent.md` | Durable; not regenerated per feature |
| Verify process | `.claude/agents/agiloop-verify-agent.md` | Durable; not regenerated per feature |
| Generation routing | `INITIAL-PROMPT.md` | Specifies which rules go in which generated artifact |

When a rule appears in both this file and an agent file, the agent file is the operational authority for that agent's behavior. This file is the project-level authority for what generated projects must uphold. Duplication is intentional — agents need their rules self-contained; projects need their rules visible without reading agent files.

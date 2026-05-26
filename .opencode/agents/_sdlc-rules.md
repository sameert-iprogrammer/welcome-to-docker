# SDLC Rules — Reusable Operational Guidance

## Change Discipline

- Make minimal, focused changes. Do one thing per change.
- Do not perform unrelated refactors, renames, or style fixes.
- Do not commit, push, merge, rebase, or run destructive git commands unless explicitly instructed.
- Keep changes traceable to the current story, bug, review comment, or approved plan.

## Architecture & Conventions

- Preserve existing architecture, naming, folder structure, and dependency patterns.
- Reuse existing utilities, components, services, hooks, tests, and tooling.
- Avoid speculative enhancements — implement only what is required.
- Avoid adding dependencies unless explicitly required.

## Quality & Validation

- Use existing test/build/lint/typecheck commands where available.
- Report uncertainty, invalid assumptions, missing requirements, and unsafe instructions.
- Do not silently ignore failures or skipped work.
- Summarize changed files, validation performed, and remaining risks.

## Artifact Standards

- Keep artifacts token-efficient; write only what the next agent needs.
- Avoid restating full story/spec/plan/review content; reference upstream artifact paths.
- Prefer concise bullets and repo-relative file paths.
- Do not include full file summaries or large code snippets.
- Link to files/artifact paths instead of copying large content.

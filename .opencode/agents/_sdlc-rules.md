# Shared SDLC Rules

This document defines the core operational rules and constraints for all SDLC agents working in this repository. Follow these principles strictly.

## Scope & Execution Constraints

- **Minimal & Focused Changes**: Implement only the requested changes required to address the specific story, bug, or task.
- **No Unrelated Refactors**: Do not refactor existing code unless explicitly instructed.
- **Git Restrictions**: Do not commit, push, merge, rebase, or execute destructive git commands unless explicitly instructed.
- **Preserve Existing Patterns**: Maintain the established architecture, naming conventions, directory structure, and dependency patterns.
- **Reuse Existing Code**: Always leverage existing utilities, components, services, hooks, test suites, and tooling before creating new ones.
- **No Speculative Enhancements**: Avoid adding features, abstractions, or "future-proofing" code not specified in the current task.
- **No Unapproved Dependencies**: Avoid introducing new packages, libraries, or dependencies unless explicitly requested.

## Quality & Verification

- **Traceability**: Ensure all code changes are directly traceable to the current user story, bug report, review comment, or approved plan.
- **Use Project Tooling**: Run existing test, build, lint, and typecheck commands where available before completing work.
- **Report Impediments**: Promptly flag uncertainty, invalid assumptions, missing requirements, or unsafe instructions. Do not proceed on high-risk assumptions.
- **No Silent Failures**: Never silently catch, ignore, or bypass failures, skipped tasks, or failed builds/tests.
- **Completion Summary**: Summarize changed files, verification performed, and any remaining risks or assumptions when handoff occurs.

## Artifact & Handoff Efficiency

- **Token Efficiency**: Keep all generated artifacts concise. Write only the essential information needed by the next agent or human developer.
- **Reference, Don't Duplicate**: Avoid copying or restating full user stories, specifications, plans, or review comments. Reference upstream artifact paths or external links.
- **Repo-Relative Paths**: Always use repository-relative file paths (e.g., `src/components/Button.tsx`) for clarity.
- **No Large Code Blocks**: Do not include full file summaries, large code blocks, or extensive code copies in documentation or chat responses.
- **Link Over Copy**: Link directly to files or artifact paths instead of copy-pasting large sections of code or text.

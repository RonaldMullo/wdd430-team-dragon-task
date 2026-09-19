<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles: five template placeholders replaced with the initial Dragon Task 2.0 principles
- Added sections: Technology and Architecture; Development Workflow
- Removed sections: none
- Templates requiring updates: .specify/templates/plan-template.md (updated); .specify/templates/tasks-template.md (updated); .specify/templates/spec-template.md (reviewed, no change required); .specify/templates/checklist-template.md (reviewed, no change required)
- Command files: .github/prompts/*.prompt.md reviewed; no updates required
- Follow-up TODO: confirm the original ratification date and replace TODO(RATIFICATION_DATE)
-->

# Dragon Task 2.0 Constitution

## Core Principles

### I. Type-Safe TypeScript
All application code MUST use TypeScript with compiler strict mode enabled. The codebase MUST NOT use
`any`; unknown external data MUST be narrowed through validation or explicit type guards. Public
functions, component props, API payloads, and shared domain models MUST have clear types.
This keeps task and planning data contracts explicit and makes collaboration safer.

### II. Next.js Architecture
Dragon Task 2.0 MUST use Next.js App Router conventions, including file-based routing, route
layouts, loading and error states where appropriate, and API route handlers for server endpoints.
Components MUST remain server components by default; client components MUST be introduced only when
interactivity or browser-only APIs require them. Server-only data access MUST NOT cross into client
bundles. This preserves predictable rendering, performance, and ownership boundaries.

### III. Composable Design and Clear Ownership
React components MUST be reusable when they express a repeated or stable UI responsibility, and
each component, route, service, and data module MUST have one clear reason to change. Features MUST
separate presentation, interaction, domain logic, and data access. Naming MUST be descriptive and
consistent: components and types use PascalCase, functions and variables use camelCase, constants use
UPPER_SNAKE_CASE only for true constants, and files and directories follow one documented convention.
This makes the codebase navigable for multiple team members.

### IV. Intentional, Responsive UI
Tailwind CSS MUST be the primary styling method, using utility-first classes and shared design
tokens or components for repeated patterns. Custom CSS MUST be limited to cases Tailwind cannot
express cleanly and MUST have a documented reason. Every user-facing workflow MUST remain usable
across supported mobile, tablet, and desktop widths; layouts MUST account for keyboard access,
visible focus, readable contrast, and content that can grow without overlap.

### V. Verified Collaboration
Every change MUST be validated at the narrowest useful level and MUST include or update tests for
changed behavior, unless the pull request documents why no meaningful automated test applies.
ESLint and Prettier MUST pass before merge, and type checking MUST pass with strict mode enabled.
The `main` branch MUST remain protected. Work MUST happen on focused feature or fix branches and
reach `main` only through a pull request with review and passing checks. This keeps quality visible
and makes integration decisions explicit.

## Technology and Architecture

The required application stack is Next.js with the App Router, TypeScript, React, and Tailwind CSS.
The repository MUST keep source, route, component, domain, and test organization discoverable through
consistent directories. API route handlers MUST validate inputs, return appropriate status codes, and
avoid exposing server-only secrets or implementation details. Dependencies MUST be justified by a
clear product or engineering need and kept current within the project's compatibility constraints.

## Development Workflow

Each feature MUST have an independently testable scope and acceptance criteria. Contributors MUST
run formatting, linting, type checking, and the relevant unit, integration, or end-to-end tests before
opening a pull request. Pull requests MUST describe behavior changes, testing performed, and any
known limitations. Reviewers MUST check architecture, accessibility, responsive behavior, security,
and maintainability in addition to functional correctness. Direct pushes to `main` are prohibited.

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This constitution supersedes conflicting project practices. Amendments MUST be proposed in a pull
request, explain the motivation and impact, update affected templates or guidance, and receive review
before merge. Versioning follows semantic versioning: MAJOR for incompatible principle or governance
changes, MINOR for new or materially expanded principles or sections, and PATCH for clarifications
that do not change obligations. Every pull request MUST include a constitution compliance check when
its work touches architecture, quality gates, or collaboration rules. The constitution MUST be
reviewed during major project milestones and whenever the required stack or branch policy changes.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date is not recorded | **Last Amended**: 2026-09-18

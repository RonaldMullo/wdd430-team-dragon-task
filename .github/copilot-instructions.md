# GitHub Copilot Instructions — Dragon Task 2.0

## Project Overview

Dragon Task 2.0 is a task planning and productivity application developed as a WDD430 team project.

The application allows users to create and organize tasks using categories and priorities. Planned features also include a daily task view, filtering, task completion, editing, deletion, and rescheduling of unfinished tasks.

## Technology Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Next.js Route Handlers for API endpoints
- ESLint
- Prettier

Use TypeScript for application code and follow the existing Next.js App Router structure.

## Project Structure

Use the following organization when adding features:

- `app/` — Next.js pages, layouts, and API routes.
- `app/api/` — REST API route handlers.
- `components/` — Reusable React UI components.
- `lib/` — Data-access and application helper functions.
- `types/` — Shared TypeScript interfaces and types.
- `docs/` — Project planning and data-model documentation.
- `specs/` — Feature specifications and project requirements.

Prefer reusable components rather than duplicating UI logic.

## Data Model

### Task

A task contains:

- `id`
- `title`
- `description` (optional)
- `dueDate`
- `categoryId` (optional)
- `priority`
- `completed`
- `createdAt`
- `updatedAt`

### Category

A category contains:

- `id`
- `name`
- `createdAt`
- `updatedAt`

### Priority

Only the following priority values are valid:

- `Low`
- `Medium`
- `High`
- `Urgent`

A task has exactly one priority and may have zero or one category.

Deleting a category must not delete its associated tasks.

## Coding Conventions

- Use TypeScript types and interfaces instead of `any`.
- Use functional React components.
- Use `"use client"` only when client-side state, effects, or browser APIs are required.
- Keep components focused and reusable.
- Use `async`/`await` for asynchronous operations.
- Validate required data before creating or updating records.
- Return appropriate HTTP status codes and clear error messages from API routes.
- Use descriptive variable, function, component, branch, and commit names.
- Follow the existing ESLint and Prettier configuration.
- Maintain responsive layouts for mobile and desktop.
- Do not duplicate existing functionality when a reusable function or component already exists.

## API Conventions

Use REST-style routes and HTTP methods.

Examples:

- `GET /api/tasks` — list tasks.
- `POST /api/tasks` — create a task.
- `GET /api/tasks/[id]` — retrieve a task.
- `PUT /api/tasks/[id]` — update a task.
- `DELETE /api/tasks/[id]` — delete a task.
- `GET /api/categories` — list categories.
- `POST /api/categories` — create a category.

Validate API input and return JSON responses with meaningful error messages.

## Git Workflow

- Create a feature branch for each issue or feature.
- Keep feature changes focused on the related issue.
- Commit meaningful units of work with descriptive messages.
- Push the feature branch to GitHub.
- Open a Pull Request from the feature branch into `main`.
- Do not merge an individual feature Pull Request until it has been reviewed.

## Testing and Quality

Before considering a feature complete:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Test the feature manually.
4. Verify API success and error cases when applicable.
5. Check the interface on both desktop and mobile when UI changes are involved.

Generated code should follow these instructions and remain consistent with the existing Dragon Task 2.0 architecture.
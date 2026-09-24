# Dragon Task 2.0 — Data Model

## Task

Represents a task created by the user.

Fields:

- `id` — unique identifier
- `title` — required task title
- `description` — optional task description
- `dueDate` — required due date
- `categoryId` — optional reference to a Category
- `priority` — required priority value
- `completed` — Boolean indicating whether the task is complete
- `createdAt` — creation timestamp
- `updatedAt` — last update timestamp

## Category

Represents a user-defined category used to organize tasks.

Fields:

- `id` — unique identifier
- `name` — unique category name
- `createdAt` — creation timestamp
- `updatedAt` — last update timestamp

## Priority

Priority is a constrained value associated with each task.

Allowed values:

- Low
- Medium
- High
- Urgent

## Relationships

- A Task has exactly one Priority value.
- A Task may have zero or one Category.
- A Category may be associated with many Tasks.
- Deleting a Category does not delete its associated Tasks.
- If a Category is deleted, its Tasks remain without that category.

## Relationship Diagram

Category (1) ──────── (0..*) Task

Task
├── categoryId → Category (optional)
└── priority → Low | Medium | High | Urgent
# Dragon Task 2.0 — Design Plan

## Design Goal

Dragon Task 2.0 will use a clean, simple, and responsive interface that helps users focus on their daily tasks without unnecessary visual distractions.

## Color Palette

- Primary: #2563EB — main actions, links, and active navigation.
- Success: #16A34A — completed tasks and success states.
- Warning: #F59E0B — high-priority or attention states.
- Danger: #DC2626 — urgent tasks, destructive actions, and errors.
- Background: #F8FAFC — main application background.
- Surface: #FFFFFF — cards, forms, and panels.
- Primary Text: #0F172A — headings and main content.
- Secondary Text: #64748B — supporting information and metadata.

## Typography

Primary font: Geist / system sans-serif.

- Page title: 30–32px, bold.
- Section heading: 20–24px, semibold.
- Body text: 16px, regular.
- Supporting text: 14px, regular.
- Buttons and form labels: 14–16px, medium or semibold.

## Layout and Spacing

The application will use a consistent spacing system based on multiples of 4px.

Common spacing values:

- 4px — very small spacing.
- 8px — spacing between closely related elements.
- 16px — standard component spacing.
- 24px — spacing between sections.
- 32px — major page spacing.

Content will use a centered responsive container with appropriate horizontal padding.

## UI Conventions

- Cards will be used to display individual tasks.
- Forms will use visible labels for all inputs.
- Primary actions will use the primary blue color.
- Completed tasks will have a clear visual completed state.
- Priority levels will be visually distinguishable while also using text labels.
- Destructive actions such as Delete will use the danger style.
- Buttons and interactive controls will have visible keyboard focus states.
- Empty task lists will display a clear message and an action to create a task.
- The interface will adapt to mobile, tablet, and desktop screen sizes.

## Task Priority Convention

- Low — normal/low attention.
- Medium — moderate attention.
- High — increased attention.
- Urgent — immediate attention.

Priority will never be communicated by color alone; each priority will also include a text label.

## Planned Main Views

1. Daily task view.
2. Task list and filters.
3. Create/edit task form.
4. Task detail view.
5. Category management.

## Reusable Components

- Header / Navigation
- TaskCard
- TaskForm
- PriorityBadge
- CategorySelector
- FilterControls
- EmptyState
- ConfirmationDialog



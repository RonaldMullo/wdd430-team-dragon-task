"use client";

import type { Category } from "@/types/category";
import type { Task } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
};

export default function TaskList({
  tasks,
  categories,
  loading,
}: TaskListProps) {
  function getCategoryName(categoryId?: string) {
    if (!categoryId) {
      return "No category";
    }

    return (
      categories.find((category) => category.id === categoryId)?.name ??
      "No category"
    );
  }

  if (loading) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-5 text-gray-600">
        Loading tasks...
      </p>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Your tasks
        </h2>
        <p className="mt-2 text-gray-600">
          No tasks yet. Create your first task above.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Your tasks
        </h2>
        <p className="text-sm text-gray-600">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-900">
                {task.title}
              </h3>

              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>

            {task.description && (
              <p className="mt-3 text-sm text-gray-600">
                {task.description}
              </p>
            )}

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="font-medium text-gray-700">Due date</dt>
                <dd className="text-right text-gray-600">
                  {task.dueDate}
                </dd>
              </div>

              <div className="flex justify-between gap-3">
                <dt className="font-medium text-gray-700">Category</dt>
                <dd className="text-right text-gray-600">
                  {getCategoryName(task.categoryId)}
                </dd>
              </div>

              <div className="flex justify-between gap-3">
                <dt className="font-medium text-gray-700">Priority</dt>
                <dd className="text-right text-gray-600">
                  {task.priority}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
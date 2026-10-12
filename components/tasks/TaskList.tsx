"use client";

import { useState } from "react";
import type { Category } from "@/types/category";
import type { Task } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  onTaskUpdated: (id: string, updates: Partial<Task>) => Promise<void>;
  onTaskDeleted: (id: string) => Promise<void>;
};

export default function TaskList({
  tasks,
  categories,
  loading,
  onTaskUpdated,
  onTaskDeleted,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState<Task["priority"]>("Medium");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function getCategoryName(categoryId?: string) {
    if (!categoryId) return "No category";

    return (
      categories.find((category) => category.id === categoryId)?.name ??
      "No category"
    );
  }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setEditDueDate(task.dueDate);
    setEditPriority(task.priority);
    setEditCategoryId(task.categoryId ?? "");
    setEditCompleted(task.completed);
    setError("");
  }

  async function saveTask(id: string) {
    if (!editTitle.trim() || !editDueDate) {
      setError("Title and due date are required.");
      return;
    }

    setBusyId(id);
    setError("");

    try {
      await onTaskUpdated(id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        dueDate: editDueDate,
        priority: editPriority,
        categoryId: editCategoryId || undefined,
        completed: editCompleted,
      });

      setEditingId(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update task."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function removeTask(id: string) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setBusyId(id);
    setError("");

    try {
      await onTaskDeleted(id);
      if (editingId === id) setEditingId(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete task."
      );
    } finally {
      setBusyId(null);
    }
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
        <h2 className="text-xl font-semibold text-gray-900">Your tasks</h2>
        <p className="mt-2 text-gray-600">
          No tasks yet. Create your first task above.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Your tasks</h2>
        <p className="text-sm text-gray-600">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            {editingId === task.id ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Edit task</h3>

                <label className="block text-sm text-gray-700">
                  Title
                  <input
                    className="mt-1 w-full rounded border border-gray-300 p-2"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />
                </label>

                <label className="block text-sm text-gray-700">
                  Description
                  <textarea
                    className="mt-1 w-full rounded border border-gray-300 p-2"
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                  />
                </label>

                <label className="block text-sm text-gray-700">
                  Due date
                  <input
                    type="date"
                    className="mt-1 w-full rounded border border-gray-300 p-2"
                    value={editDueDate}
                    onChange={(event) => setEditDueDate(event.target.value)}
                  />
                </label>

                <label className="block text-sm text-gray-700">
                  Priority
                  <select
                    className="mt-1 w-full rounded border border-gray-300 p-2"
                    value={editPriority}
                    onChange={(event) =>
                      setEditPriority(event.target.value as Task["priority"])
                    }
                  >
                    {["Low", "Medium", "High", "Urgent"].map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-gray-700">
                  Category
                  <select
                    className="mt-1 w-full rounded border border-gray-300 p-2"
                    value={editCategoryId}
                    onChange={(event) => setEditCategoryId(event.target.value)}
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editCompleted}
                    onChange={(event) => setEditCompleted(event.target.checked)}
                  />
                  Completed
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => void saveTask(task.id)}
                    className="rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {busyId === task.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => setEditingId(null)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
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
                    <dd className="text-right text-gray-600">{task.dueDate}</dd>
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

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => startEditing(task)}
                    className="rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => void removeTask(task.id)}
                    className="rounded border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-50"
                  >
                    {busyId === task.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

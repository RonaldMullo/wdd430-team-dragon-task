"use client";

import { FormEvent, useState } from "react";
import type { Category } from "@/types/category";
import type { Priority } from "@/types/task";

type TaskFormProps = {
  onTaskCreated: () => void;
  categories: Category[];
};

const priorities: Priority[] = ["Low", "Medium", "High", "Urgent"];

export default function TaskForm({
  onTaskCreated,
  categories,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !dueDate || !priority) {
      setError("Title, due date, and priority are required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          dueDate,
          categoryId: categoryId || undefined,
          priority,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to create task.");
      }

      setTitle("");
      setDescription("");
      setDueDate("");
      setCategoryId("");
      setPriority("Medium");

      onTaskCreated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create task."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Create a task
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Add a task to your Dragon Task list.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Title *
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          placeholder="Add a description"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="dueDate"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Due date *
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="priority"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Priority *
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as Priority)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          >
            {priorities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
        >
          <option value="">No category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {submitting ? "Creating..." : "Create task"}
      </button>
    </form>
  );
}
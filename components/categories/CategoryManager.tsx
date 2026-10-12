"use client";

import { useState, type FormEvent } from "react";
import type { Category } from "@/types/category";

type CategoryManagerProps = {
  categories: Category[];
  onCategoriesChanged: () => Promise<void>;
};

export default function CategoryManager({
  categories,
  onCategoriesChanged,
}: CategoryManagerProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // CREATE CATEGORY
  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to create category.");
      }

      setName("");
      await onCategoriesChanged();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create category."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // START EDITING
  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditingName(category.name);
    setError("");
  }

  // UPDATE CATEGORY
  async function handleUpdateCategory(id: string) {
    const updatedName = editingName.trim();

    if (!updatedName) {
      setError("Category name is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to update category.");
      }

      setEditingId(null);
      setEditingName("");
      await onCategoriesChanged();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update category."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // DELETE CATEGORY
  async function handleDeleteCategory(category: Category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to delete category.");
      }

      if (editingId === category.id) {
        setEditingId(null);
        setEditingName("");
      }

      await onCategoriesChanged();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete category."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Manage Categories</h2>

      <p className="mt-1 text-sm text-gray-600">
        Create, edit, and delete your task categories.
      </p>

      <p className="mt-4 text-sm text-gray-600">
        Total categories: {categories.length}
      </p>

      {/* CREATE CATEGORY FORM */}
      <form onSubmit={handleCreateCategory} className="mt-4 space-y-3">
        <label
          htmlFor="category-name"
          className="block text-sm font-medium text-gray-700"
        >
          Category name
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: Work, Study, Personal"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Add category"}
          </button>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </form>

      {/* EXISTING CATEGORIES */}
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Existing categories
        </h3>

        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories yet.</p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              {editingId === category.id ? (
                <>
                  <input
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    aria-label="Edit category name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => void handleUpdateCategory(category.id)}
                      className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                        setError("");
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-medium text-gray-900">
                    {category.name}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => startEditing(category)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => void handleDeleteCategory(category)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import type { Category } from "@/types/category";
import type { Task } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setError("");

      const [tasksResponse, categoriesResponse] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/categories"),
      ]);

      if (!tasksResponse.ok || !categoriesResponse.ok) {
        throw new Error("Unable to load task data.");
      }

      const tasksData: Task[] = await tasksResponse.json();
      const categoriesData: Category[] =
        await categoriesResponse.json();

      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load task data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialData() {
      try {
        const [tasksResponse, categoriesResponse] = await Promise.all([
          fetch("/api/tasks", { signal: controller.signal }),
          fetch("/api/categories", { signal: controller.signal }),
        ]);

        if (!tasksResponse.ok || !categoriesResponse.ok) {
          throw new Error("Unable to load task data.");
        }

        const tasksData: Task[] = await tasksResponse.json();
        const categoriesData: Category[] =
          await categoriesResponse.json();

        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load task data."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      controller.abort();
    };
  }, []);

  async function handleTaskCreated() {
    await loadData();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dragon Task 2.0
          </h1>

          <p className="mt-2 text-gray-600">
            Plan your tasks and keep your day organized.
          </p>
        </header>

        <div className="space-y-8">
          <TaskForm onTaskCreated={handleTaskCreated} />

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <TaskList
            tasks={tasks}
            categories={categories}
            loading={loading}
          />
        </div>
      </div>
    </main>
  );
}
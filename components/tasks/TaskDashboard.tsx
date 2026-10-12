
"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import CategoryManager from "@/components/categories/CategoryManager";
import SignOutButton from "@/components/auth/SignOutButton";
import AppNavigation from "@/components/navigation/AppNavigation";
import type { Category } from "@/types/category";
import type { Task } from "@/types/task";

type TaskDashboardProps = {
  view?: "dashboard" | "tasks" | "categories";
};

export default function TaskDashboard({
  view = "dashboard",
}: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reload tasks and categories after CRUD operations
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
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Load data when the component mounts
  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialData() {
      try {
        const [tasksResponse, categoriesResponse] =
          await Promise.all([
            fetch("/api/tasks", {
              signal: controller.signal,
            }),
            fetch("/api/categories", {
              signal: controller.signal,
            }),
          ]);

        if (!tasksResponse.ok || !categoriesResponse.ok) {
          throw new Error("Unable to load task data.");
        }

        const tasksData: Task[] =
          await tasksResponse.json();

        const categoriesData: Category[] =
          await categoriesResponse.json();

        if (!controller.signal.aborted) {
          setTasks(tasksData);
          setCategories(categoriesData);
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        if (!controller.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load task data."
          );
        }
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

  // Create task
  async function handleTaskCreated() {
    await loadData();
  }

  // Update task
  async function handleTaskUpdated(
    id: string,
    updates: Partial<Task>
  ) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Unable to update task.");
    }

    await loadData();
  }

  // Delete task
  async function handleTaskDeleted(id: string) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete task.");
    }

    await loadData();
  }

  // Dashboard statistics
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "High" ||
      task.priority === "Urgent"
  ).length;

  const stats = [
    { label: "Total Tasks", value: totalTasks },
    { label: "Pending", value: pendingTasks },
    { label: "Completed", value: completedTasks },
    { label: "High Priority", value: highPriorityTasks },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Application header */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dragon Task 2.0
            </h1>

            <SignOutButton />
          </div>

          <p className="mt-2 text-gray-600">
            Plan your tasks and keep your day organized.
          </p>

          <div className="mt-6">
            <AppNavigation />
          </div>
        </header>

        <div className="space-y-8">
          {/* Error message */}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {/* Dashboard view */}
          {view === "dashboard" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Task Overview
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {loading ? "..." : stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tasks view */}
          {view === "tasks" && (
            <>
              <TaskForm
                onTaskCreated={handleTaskCreated}
                categories={categories}
              />

              <TaskList
                tasks={tasks}
                categories={categories}
                loading={loading}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            </>
          )}

          {/* Categories view */}
          {view === "categories" && (
            <CategoryManager
              categories={categories}
              onCategoriesChanged={loadData}
            />
          )}
        </div>
      </div>
    </main>
  );
}

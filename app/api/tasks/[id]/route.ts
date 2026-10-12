import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCategoryById } from "@/lib/categories";
import { deleteTask, getTaskById, updateTask } from "@/lib/tasks";
import type { Priority, Task } from "@/types/task";

const validPriorities: Priority[] = ["Low", "Medium", "High", "Urgent"];

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const task = await getTaskById(id, session.user.id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error loading task:", error);

    return NextResponse.json({ error: "Unable to load task" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;

  try {
    const parsedBody: unknown = await request.json();

    if (
      typeof parsedBody !== "object" ||
      parsedBody === null ||
      Array.isArray(parsedBody)
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    body = parsedBody as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  if (
    (body.priority !== undefined &&
      (typeof body.priority !== "string" ||
        !validPriorities.includes(body.priority as Priority))) ||
    (body.title !== undefined &&
      (typeof body.title !== "string" || !body.title.trim())) ||
    (body.description !== undefined && typeof body.description !== "string") ||
    (body.dueDate !== undefined &&
      (typeof body.dueDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate))) ||
    (body.categoryId !== undefined && typeof body.categoryId !== "string") ||
    (body.completed !== undefined && typeof body.completed !== "boolean")
  ) {
    return NextResponse.json({ error: "Invalid task data" }, { status: 400 });
  }

  const allowedFields = [
    "title",
    "description",
    "dueDate",
    "categoryId",
    "priority",
    "completed",
  ] as const;

  const updates: Partial<Task> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      Object.assign(updates, {
        [field]:
          field === "title" ? (body[field] as string).trim() : body[field],
      });
    }
  }

  try {
    const { id } = await context.params;
    const userId = session.user.id;

    // Verify that the task belongs to this user.
    const existingTask = await getTaskById(id, userId);

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify category ownership when categoryId changes.
    if (typeof body.categoryId === "string" && body.categoryId.trim()) {
      const category = await getCategoryById(body.categoryId.trim(), userId);

      if (!category) {
        return NextResponse.json(
          { error: "Invalid or unauthorized category" },
          { status: 400 }
        );
      }

      updates.categoryId = body.categoryId.trim();
    } else if (body.categoryId === "") {
      // Allow removing the category from a task.
      updates.categoryId = "";
    }

    const task = await updateTask(id, userId, updates);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);

    return NextResponse.json(
      { error: "Unable to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const deleted = await deleteTask(id, session.user.id);

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);

    return NextResponse.json(
      { error: "Unable to delete task" },
      { status: 500 }
    );
  }
}

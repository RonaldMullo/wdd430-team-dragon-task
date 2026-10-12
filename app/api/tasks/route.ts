import { NextResponse } from "next/server";
import { createTask, getTasks } from "@/lib/tasks";
import { getCategoryById } from "@/lib/categories";
import type { Priority, Task } from "@/types/task";
import { auth } from "@/auth";

const validPriorities: Priority[] = ["Low", "Medium", "High", "Urgent"];

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tasks = await getTasks(session.user.id);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error loading tasks:", error);

    return NextResponse.json(
      { error: "Unable to load tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
        { error: "Invalid JSON request body" },
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
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.dueDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate) ||
    typeof body.priority !== "string" ||
    !validPriorities.includes(body.priority as Priority) ||
    (body.description !== undefined && typeof body.description !== "string") ||
    (body.categoryId !== undefined && typeof body.categoryId !== "string")
  ) {
    return NextResponse.json({ error: "Invalid task data" }, { status: 400 });
  }

  const userId = session.user.id;

  const categoryId =
    typeof body.categoryId === "string" && body.categoryId.trim()
      ? body.categoryId.trim()
      : undefined;

  try {
    // Verify that the category belongs to this user.
    if (categoryId) {
      const category = await getCategoryById(categoryId, userId);

      if (!category) {
        return NextResponse.json(
          { error: "Invalid or unauthorized category" },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();

    const task: Task = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      description:
        typeof body.description === "string" ? body.description : undefined,
      dueDate: body.dueDate,
      categoryId,
      priority: body.priority as Priority,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    const createdTask = await createTask(task, userId);

    return NextResponse.json(createdTask, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating task:", error);

    return NextResponse.json(
      { error: "Unable to create task" },
      { status: 500 }
    );
  }
}

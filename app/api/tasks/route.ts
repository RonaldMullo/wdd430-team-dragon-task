
import { NextResponse } from "next/server";
import { createTask, getTasks } from "@/lib/tasks";
import type { Priority, Task } from "@/types/task";
import { auth } from "@/auth";

const validPriorities: Priority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

export async function GET() {
  try {
    const tasks = await getTasks();

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

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
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
    (body.description !== undefined &&
      typeof body.description !== "string") ||
    (body.categoryId !== undefined &&
      typeof body.categoryId !== "string")
  ) {
    return NextResponse.json(
      { error: "Invalid task data" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  const task: Task = {
    id: crypto.randomUUID(),
    title: body.title.trim(),
    description:
      typeof body.description === "string"
        ? body.description
        : undefined,
    dueDate: body.dueDate,
    categoryId:
      typeof body.categoryId === "string" && body.categoryId
        ? body.categoryId
        : undefined,
    priority: body.priority as Priority,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const createdTask = await createTask(task);

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

import { NextResponse } from "next/server";
import { createTask, getTasks } from "@/lib/tasks";
import type { Priority, Task } from "@/types/task";
import { auth } from "@/auth";

const validPriorities: Priority[] = ["Low", "Medium", "High", "Urgent"];

export async function GET() {
  return NextResponse.json(getTasks());
}

export async function POST(request: Request) {
  
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.title || !body.dueDate || !body.priority) {
      return NextResponse.json(
        { error: "title, dueDate, and priority are required" },
        { status: 400 }
      );
    }

    if (!validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: "Invalid priority" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const task: Task = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      categoryId: body.categoryId,
      priority: body.priority,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    return NextResponse.json(createTask(task), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
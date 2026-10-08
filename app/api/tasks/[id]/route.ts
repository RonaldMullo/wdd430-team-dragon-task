
import { NextResponse } from "next/server";
import {
  deleteTask,
  getTaskById,
  updateTask,
} from "@/lib/tasks";
import type { Priority } from "@/types/task";
import { auth } from "@/auth";

const validPriorities: Priority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const task = getTaskById(id);

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(task);
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    if (
      body.priority !== undefined &&
      !validPriorities.includes(body.priority)
    ) {
      return NextResponse.json(
        { error: "Invalid priority" },
        { status: 400 }
      );
    }

    const task = updateTask(id, body);

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const deleted = deleteTask(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Task deleted successfully",
  });
}

import { NextResponse } from "next/server";
import {
  categoryNameExists,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/lib/categories";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const category = getCategoryById(id);

  if (!category) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(category);
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (!getCategoryById(id)) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const name = body.name.trim();

    if (categoryNameExists(name, id)) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 409 }
      );
    }

    const category = updateCategory(id, name);

    return NextResponse.json(category);
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
  const { id } = await context.params;
  const deleted = deleteCategory(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Category deleted successfully",
  });
}
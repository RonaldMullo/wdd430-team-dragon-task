
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  categoryNameExists,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/lib/categories";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET - Retrieve a category by ID
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const category = await getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error loading category:", error);

    return NextResponse.json(
      { error: "Unable to load category" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing category
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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("name" in body) ||
    typeof body.name !== "string" ||
    !body.name.trim()
  ) {
    return NextResponse.json(
      { error: "Category name is required" },
      { status: 400 }
    );
  }

  try {
    const { id } = await context.params;

    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const name = body.name.trim();

    const nameExists = await categoryNameExists(name, id);

    if (nameExists) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 409 }
      );
    }

    const category = await updateCategory(id, name);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);

    return NextResponse.json(
      { error: "Unable to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category by ID
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

  try {
    const { id } = await context.params;
    const deleted = await deleteCategory(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);

    return NextResponse.json(
      { error: "Unable to delete category" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import {
  categoryNameExists,
  createCategory,
  getCategories,
} from "@/lib/categories";
import type { Category } from "@/types/category";
import { auth } from "@/auth";

export async function GET() {
  try {
    const categories = await getCategories();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error loading categories:", error);

    return NextResponse.json(
      { error: "Unable to load categories" },
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

  const name = body.name.trim();

  try {
    const exists = await categoryNameExists(name);

    if (exists) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const category: Category = {
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      updatedAt: now,
    };

    const createdCategory = await createCategory(category);

    return NextResponse.json(createdCategory, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating category:", error);

    return NextResponse.json(
      { error: "Unable to create category" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  categoryNameExists,
  createCategory,
  getCategories,
} from "@/lib/categories";
import type { Category } from "@/types/category";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await getCategories(session.user.id);

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

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    Array.isArray(body) ||
    !("name" in body) ||
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.trim().length > 100
  ) {
    return NextResponse.json(
      { error: "Category name must be between 1 and 100 characters" },
      { status: 400 }
    );
  }

  const name = body.name.trim();

  try {
    const exists = await categoryNameExists(name, session.user.id);

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

    const createdCategory = await createCategory(category, session.user.id);

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

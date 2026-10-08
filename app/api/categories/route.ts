import { NextResponse } from "next/server";
import {
  categoryNameExists,
  createCategory,
  getCategories,
} from "@/lib/categories";
import type { Category } from "@/types/category";
import { auth } from "@/auth";

export async function GET() {
  return NextResponse.json(getCategories());
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

    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const name = body.name.trim();

    if (categoryNameExists(name)) {
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

    return NextResponse.json(createCategory(category), {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
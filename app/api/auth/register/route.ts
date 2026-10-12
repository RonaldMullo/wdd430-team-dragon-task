import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/users";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid registration data.",
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Prevent registration using the demo account email.
    const demoEmail = process.env.DEMO_USER_EMAIL?.trim().toLowerCase();

    if (demoEmail && email === demoEmail) {
      return NextResponse.json(
        {
          message: "Unable to register with this email.",
        },
        { status: 409 }
      );
    }

    const user = await createUser(name, email, password);

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle invalid JSON.
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    // Handle duplicate email addresses in MongoDB.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          message: "Unable to register with this email.",
        },
        { status: 409 }
      );
    }

    console.error("Registration failed:", error);

    return NextResponse.json(
      {
        message: "Unable to register user.",
      },
      { status: 500 }
    );
  }
}

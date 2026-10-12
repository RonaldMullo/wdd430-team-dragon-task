import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/users";
import { checkRegistrationRateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");

    const clientIp = forwardedFor?.split(",")[0]?.trim();

    // Fail closed if the client cannot be identified.
    // Local requests use a shared development identifier.
    const clientKey = clientIp
      ? `registration:ip:${clientIp}`
      : process.env.NODE_ENV === "development"
        ? "registration:local-development"
        : null;

    if (!clientKey) {
      return NextResponse.json(
        { message: "Unable to verify registration request." },
        { status: 503 }
      );
    }

    const allowed = await checkRegistrationRateLimit(clientKey);

    if (!allowed) {
      return NextResponse.json(
        {
          message: "Too many registration attempts. Try again in 15 minutes.",
        },
        {
          status: 429,
          headers: { "Retry-After": "900" },
        }
      );
    }

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

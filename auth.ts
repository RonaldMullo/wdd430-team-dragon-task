import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { authConfig } from "./auth.config";
import { findUserByEmail } from "./lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { password } = parsedCredentials.data;
        const email = parsedCredentials.data.email.trim().toLowerCase();

        // Keep the existing demo account working.
        const demoEmail = process.env.DEMO_USER_EMAIL;
        const demoPassword = process.env.DEMO_USER_PASSWORD;

        if (
          demoEmail &&
          demoPassword &&
          email === demoEmail.trim().toLowerCase() &&
          password === demoPassword
        ) {
          return {
            id: "demo-user",
            name: "Dragon Task User",
            email,
          };
        }

        // Look for registered users in MongoDB.
        const user = await findUserByEmail(email);

        if (!user) {
          return null;
        }

        // Verify the password against its stored hash.
        const passwordMatches = await compare(password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user._id!.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});

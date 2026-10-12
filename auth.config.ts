import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isProtectedRoute = ["/dashboard", "/tasks", "/categories"].some(
        (route) =>
          nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
      );

      if (isProtectedRoute) {
        return isLoggedIn;
      }

      return true;
    },

    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }

      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;

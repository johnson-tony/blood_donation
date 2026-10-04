import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth/config";

/**
 * The single Auth.js entry point.
 *
 * - `handlers` is mounted at `app/api/auth/[...nextauth]/route.ts`.
 * - `auth`   reads the session inside Server Components, Server Actions and
 *            Route Handlers, and wraps `proxy.ts`.
 * - `signIn` / `signOut` are Server Actions.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { verifyPassword } from "@/lib/auth/password";
import {
  findOrCreateGoogleUser,
  findUserForSignIn,
  getUserByEmail,
} from "@/lib/services/user.service";
import { signInSchema } from "@/lib/validations/user";

/** One week. */
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Auth.js configuration.
 *
 * Deliberately contains no database adapter: sessions are stateless JWTs, which
 * keeps the deployment free of extra collections and works unchanged on Vercel.
 * The JWT carries only the identifiers needed for optimistic UI decisions —
 * never the phone number or the password hash.
 */
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  trustHost: true,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Returning `null` for every failure mode keeps the response identical for
       * "no such account" and "wrong password", so the form cannot be used to
       * discover which email addresses are registered.
       */
      async authorize(rawCredentials) {
        const parsed = signInSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await findUserForSignIn(email);

        if (!user) {
          return null;
        }

        const passwordMatches = await verifyPassword(
          password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage ?? null,
          profileCompleted: user.profileCompleted,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== "google") return true;

      const googleProfile = profile as
        | { email?: unknown; email_verified?: unknown; name?: unknown }
        | undefined;
      const email = typeof googleProfile?.email === "string"
        ? googleProfile.email
        : user.email;
      const name = typeof googleProfile?.name === "string"
        ? googleProfile.name
        : user.name;

      if (googleProfile?.email_verified !== true || !email) return false;

      await findOrCreateGoogleUser({ email, name: name ?? email });
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" && user.email) {
          const dbUser = await getUserByEmail(user.email);
          if (!dbUser) throw new Error("Google account could not be loaded.");
          token.id = String(dbUser._id);
          token.role = dbUser.role;
          token.profileImage = dbUser.profileImage ?? null;
          token.profileCompleted = dbUser.profileCompleted;
        } else {
          token.id = user.id as string;
          token.role = user.role;
          token.profileImage = user.profileImage ?? null;
          token.profileCompleted = user.profileCompleted;
        }
      }

      return token;
    },

    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.profileImage = token.profileImage ?? null;
      session.user.profileCompleted = token.profileCompleted ?? false;

      return session;
    },
  },
} satisfies NextAuthConfig;

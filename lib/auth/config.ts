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
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
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

      const rawEmail = typeof googleProfile?.email === "string"
        ? googleProfile.email
        : user?.email;

      const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : null;

      const name = typeof googleProfile?.name === "string"
        ? googleProfile.name
        : user?.name;

      if (!email) {
        console.error("Google signIn: No email address received from Google profile.");
        return "/sign-in?error=AccessDenied&details=" + encodeURIComponent("Google did not return an email address.");
      }

      // Explicitly reject only if Google explicitly marks email_verified as false
      if (googleProfile?.email_verified === false) {
        console.error("Google signIn: Email is not verified by Google.");
        return "/sign-in?error=AccessDenied&details=" + encodeURIComponent("Your Google account email is not verified.");
      }

      try {
        await findOrCreateGoogleUser({ email, name: name ?? email });
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Google signIn: Error saving or finding user in database:", message);
        return "/sign-in?error=AccessDenied&details=" + encodeURIComponent(message);
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" && user.email) {
          try {
            const dbUser = await getUserByEmail(user.email);
            if (dbUser) {
              token.id = String(dbUser._id);
              token.role = dbUser.role;
              token.profileImage = dbUser.profileImage ?? null;
              token.profileCompleted = dbUser.profileCompleted;
            } else {
              token.id = user.id as string;
            }
          } catch (err) {
            console.error("Google jwt: Failed to fetch user from DB:", err);
            token.id = user.id as string;
          }
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

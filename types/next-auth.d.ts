import "server-only";

import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/types/user";

declare module "next-auth" {
  /** What every authenticated request can rely on being present. */
  interface Session {
    user: {
      id: string;
      role: UserRole;
      profileImage: string | null;
      profileCompleted: boolean;
    } & DefaultSession["user"];
  }

  /** The shape the Credentials provider returns. */
  interface User {
    role: UserRole;
    profileImage: string | null;
    profileCompleted: boolean;
  }
}

// `next-auth/jwt` only re-exports from `@auth/core/jwt`, so the interface has to
// be augmented at its source for the `jwt` callback's token to be typed.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    profileImage: string | null;
    profileCompleted: boolean;
  }
}

export {};
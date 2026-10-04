/**
 * Shared, framework-agnostic types.
 *
 * Anything in here may be passed from a Server Component to a Client
 * Component, so it must never contain secrets or data the viewer is not
 * allowed to see (for example `passwordHash`).
 */

export const USER_ROLES = ["USER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

/** `null` means the member has not answered the availability question yet. */
export type DonorAvailability = boolean | null;

/** The authenticated identity exposed to the session and to the client shell. */
export type SessionUserDTO = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage: string | null;
  profileCompleted: boolean;
};

/** A member's own profile. Safe to send to the member themselves. */
export type ProfileDTO = {
  name: string;
  email: string;
  profileImage: string | null;
  phone: string | null;
  bloodGroup: BloodGroup | null;
  state: string | null;
  district: string | null;
  locality: string | null;
  availableToDonate: DonorAvailability;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

/** A row in the admin user table. */
export type AdminUserRowDTO = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileCompleted: boolean;
  bloodGroup: BloodGroup | null;
  locality: string | null;
  district: string | null;
  state: string | null;
  availableToDonate: DonorAvailability;
  createdAt: string;
};

export type AdminUserListDTO = {
  users: AdminUserRowDTO[];
  total: number;
};

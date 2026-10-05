import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import { hashPassword } from "@/lib/auth/password";
import UserModel, {
  isProfileComplete,
  type UserProfile,
  type UserRecord,
} from "@/models/user";
import type { ProfileInput } from "@/lib/validations/user";
import {
  BLOOD_GROUPS,
  type AdminUserListDTO,
  type AdminUserRowDTO,
  type BloodGroup,
  type ProfileDTO,
  type SessionUserDTO,
  type UserRole,
} from "@/types/user";

/** Signals that an account already exists for the given address. */
export class DuplicateEmailError extends Error {
  constructor() {
    super("An account already exists for this email address.");
    this.name = "DuplicateEmailError";
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
}

function optionalString(value: string | undefined | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalBloodGroup(value: unknown): BloodGroup | null {
  return BLOOD_GROUPS.find((group) => group === value) ?? null;
}

function toAvailability(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function readProfile(user: UserRecord): Partial<UserProfile> {
  return user.profile ?? {};
}

/* -------------------------------------------------------------------------- */
/*  Reads                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Loads a user for credential verification. The only place in the codebase
 * that is allowed to select `passwordHash`.
 */
export async function findUserForSignIn(
  email: string,
): Promise<UserRecord | null> {
  await connectToDatabase();

  return UserModel.findOne({ email: email.trim().toLowerCase() })
    .select("+passwordHash")
    .lean<UserRecord | null>()
    .exec();
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  await connectToDatabase();

  return UserModel.findById(id).lean<UserRecord | null>().exec();
}

export async function getUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  await connectToDatabase();

  return UserModel.findOne({ email: email.trim().toLowerCase() })
    .lean<UserRecord | null>()
    .exec();
}

/* -------------------------------------------------------------------------- */
/*  Writes                                                                    */
/* -------------------------------------------------------------------------- */

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<UserRecord> {
  await connectToDatabase();

  const passwordHash = await hashPassword(input.password);

  try {
    const created = await UserModel.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash,
      // Public registration can never grant privileges. Admin accounts are
      // promoted out of band by a developer (see `scripts/create-admin.mjs`).
      role: "USER",
      profileCompleted: false,
      profile: { availableToDonate: null },
    });

    return created.toObject() as UserRecord;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new DuplicateEmailError();
    }
    throw error;
  }
}

/**
 * Updates a member's own profile. The caller is responsible for verifying that
 * `userId` belongs to the authenticated member.
 */
export async function updateUserProfile(
  userId: string,
  input: ProfileInput,
): Promise<UserRecord | null> {
  await connectToDatabase();

  const profile = {
    phone: input.phone.trim(),
    bloodGroup: input.bloodGroup,
    state: input.state.trim(),
    district: input.district.trim(),
    locality: input.locality.trim(),
    availableToDonate: input.availability === "available",
  };

  return UserModel.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: input.name.trim(),
        // `profileImage` is intentionally not writable from the profile form.
        // Photos are owned by `uploadProfileImageAction`, which is the only
        // path that can write a Cloudinary-backed image.
        profile,
        profileCompleted: isProfileComplete({
          name: input.name,
          profile,
        }),
      },
    },
    { new: true },
  )
    .lean<UserRecord | null>()
    .exec();
}

/**
 * Points a member at a stored Cloudinary image, or clears it.
 *
 * Separate from `updateUserProfile` so the profile form can never write an
 * arbitrary image address, and so the previous asset id stays available for the
 * caller to clean up.
 */
export async function updateUserProfileImage(
  userId: string,
  image: { url: string; publicId: string } | null,
): Promise<UserRecord | null> {
  await connectToDatabase();

  return UserModel.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        profileImage: image?.url ?? null,
        profileImagePublicId: image?.publicId ?? null,
      },
    },
    { new: true },
  )
    .lean<UserRecord | null>()
    .exec();
}

/** Reads the stored asset id so a replacement can delete the old file. */
export async function getUserProfileImagePublicId(
  userId: string,
): Promise<string | null> {
  await connectToDatabase();

  const user = await UserModel.findById(userId)
    .select("profileImagePublicId")
    .lean<{ profileImagePublicId?: string | null } | null>()
    .exec();

  return optionalString(user?.profileImagePublicId);
}

export function toSessionUserDTO(user: UserRecord): SessionUserDTO {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: optionalString(user.profileImage),
    profileCompleted: user.profileCompleted,
  };
}

export function toProfileDTO(user: UserRecord): ProfileDTO {
  const profile = readProfile(user);

  return {
    name: user.name,
    email: user.email,
    profileImage: optionalString(user.profileImage),
    phone: optionalString(profile.phone),
    bloodGroup: optionalBloodGroup(profile.bloodGroup),
    state: optionalString(profile.state),
    district: optionalString(profile.district),
    locality: optionalString(profile.locality),
    availableToDonate: toAvailability(profile.availableToDonate),
    profileCompleted: user.profileCompleted,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/* -------------------------------------------------------------------------- */
/*  Admin reads                                                               */
/* -------------------------------------------------------------------------- */

function toAdminUserRowDTO(user: UserRecord): AdminUserRowDTO {
  const profile = readProfile(user);

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    profileCompleted: user.profileCompleted,
    bloodGroup: optionalBloodGroup(profile.bloodGroup),
    locality: optionalString(profile.locality),
    district: optionalString(profile.district),
    state: optionalString(profile.state),
    availableToDonate: toAvailability(profile.availableToDonate),
    createdAt: user.createdAt.toISOString(),
  };
}

export async function listUsers(options?: {
  limit?: number;
  skip?: number;
}): Promise<AdminUserListDTO> {
  await connectToDatabase();

  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 200);
  const skip = Math.max(options?.skip ?? 0, 0);

  const [users, total] = await Promise.all([
    UserModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<UserRecord[]>()
      .exec(),
    UserModel.countDocuments().exec(),
  ]);

  return { users: users.map(toAdminUserRowDTO), total };
}

/** Real counts only. A missing collection simply reports zero. */

export async function listDonors(options?: {
  limit?: number;
  skip?: number;
}): Promise<AdminUserListDTO> {
  await connectToDatabase();

  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 200);
  const skip = Math.max(options?.skip ?? 0, 0);
  const filter = {
    role: "USER",
    profileCompleted: true,
    "profile.availableToDonate": true,
  };

  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<UserRecord[]>()
      .exec(),
    UserModel.countDocuments(filter).exec(),
  ]);

  return { users: users.map(toAdminUserRowDTO), total };
}

export async function countUsers(
  filter: Record<string, unknown> = {},
): Promise<number> {
  await connectToDatabase();

  return UserModel.countDocuments(filter).exec();
}

export async function countUsersByRole(role: UserRole): Promise<number> {
  return countUsers({ role });
}

export async function countDonors(): Promise<number> {
  return countUsers({
    profileCompleted: true,
    "profile.availableToDonate": true,
  });
}

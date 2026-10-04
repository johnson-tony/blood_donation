import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

import {
  BLOOD_GROUPS,
  USER_ROLES,
  type BloodGroup,
  type UserRole,
} from "@/types/user";

export interface UserProfile {
  /** Only revealed to the member themselves and to administrators. */
  phone?: string;
  bloodGroup?: BloodGroup;
  state?: string;
  district?: string;
  locality?: string;
  /** `null` until the member answers the availability question. */
  availableToDonate: boolean | null;
}

export interface UserDocument {
  name: string;
  email: string;
  /** bcrypt hash. Never selected by default — see the queries in `lib/services`. */
  passwordHash: string;
  profileImage: string | null;
  /**
   * Cloudinary asset id behind `profileImage`. Kept so the file can be deleted
   * or replaced without scanning the folder. Null when a member has no photo.
   */
  profileImagePublicId: string | null;
  role: UserRole;
  profileCompleted: boolean;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export type User = HydratedDocument<UserDocument>;

/**
 * A plain read result (`.lean()`), which is what every service function
 * returns. Kept as an explicit type so the service layer never has to hand a
 * Mongoose document to a component.
 */
export type UserRecord = UserDocument & { _id: Types.ObjectId };

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      // Belt and braces: even an accidental `findOne` without a projection
      // cannot leak the hash.
      select: false,
    },
    profileImage: {
      type: String,
      default: null,
      trim: true,
    },
    profileImagePublicId: {
      type: String,
      default: null,
      trim: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "USER",
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    profile: {
      phone: { type: String, trim: true },
      bloodGroup: { type: String, enum: BLOOD_GROUPS },
      state: { type: String, trim: true, maxlength: 80 },
      district: { type: String, trim: true, maxlength: 80 },
      locality: { type: String, trim: true, maxlength: 120 },
      availableToDonate: { type: Boolean, default: null },
    },
  },
  {
    timestamps: true,
    // Keep `profile` present even while every field is still empty, so callers
    // never have to guard against a missing subdocument.
    minimize: false,
  },
);

/**
 * A profile counts as complete once the information this product actually
 * needs to match a donor with a request is present. Creating an account is
 * deliberately not enough.
 */
export function isProfileComplete(user: {
  name?: string | null;
  profile?: Partial<UserProfile> | null;
}): boolean {
  const profile = user.profile;

  if (!user.name || user.name.trim().length < 2) return false;
  if (!profile) return false;

  return Boolean(
    profile.phone &&
      profile.phone.trim() &&
      profile.bloodGroup &&
      profile.state &&
      profile.state.trim() &&
      profile.district &&
      profile.district.trim() &&
      profile.locality &&
      profile.locality.trim() &&
      typeof profile.availableToDonate === "boolean",
  );
}

/**
 * `models.User` is `Model<any>` because Mongoose's registry is untyped, so it
 * has to be narrowed back to the concrete model before use.
 */
export const UserModel: Model<UserDocument> =
  (models.User as Model<UserDocument> | undefined) ??
  model<UserDocument>("User", userSchema);

export default UserModel;

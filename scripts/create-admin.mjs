#!/usr/bin/env node
/**
 * Creates or promotes an administrator.
 *
 * Administrator access is never granted from the sign-up form. It is granted
 * here, by a developer, on a machine that already holds the database
 * credentials. The script is idempotent: running it for an existing address
 * promotes that account instead of creating a duplicate.
 *
 * Usage:
 *   npm run create-admin -- --email admin@example.com --name "Admin Name"
 *
 * The password is taken from, in order of preference:
 *   1. --password "<value>"        (avoid: it lands in your shell history)
 *   2. ADMIN_PASSWORD environment variable
 *   3. a strong random password that is printed once
 */

import crypto from "node:crypto";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const BCRYPT_ROUNDS = 12;
const PASSWORD_MIN_LENGTH = 8;

/** Mirrors `PASSWORD_REQUIREMENTS` in lib/validations/user.ts. */
const PASSWORD_REQUIREMENTS = [
  "at least 8 characters",
  "one lowercase letter",
  "one uppercase letter",
  "one number",
];

function fail(message) {
  console.error(`\n  Error: ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { email: "", name: "", password: "" };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];

    switch (arg) {
      case "--email":
      case "--name":
      case "--password":
        if (value === undefined || value.startsWith("--")) {
          fail(`${arg} needs a value.`);
        }
        args[arg.slice(2)] = value;
        index += 1;
        break;
      case "--help":
      case "-h":
        console.log(
          "Usage: npm run create-admin -- --email <address> --name <name> [--password <password>]",
        );
        process.exit(0);
        break;
      default:
        fail(`Unknown argument "${arg}".`);
    }
  }

  return args;
}

function generatePassword() {
  return [
    crypto.randomBytes(6).toString("base64url"),
    crypto.randomBytes(4).toString("base64url"),
    "Aa1",
  ].join("");
}

function assertPassword(password) {
  const problems = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    problems.push(`must be ${PASSWORD_REQUIREMENTS[0]}`);
  }
  if (!/[a-z]/.test(password)) problems.push(`must contain ${PASSWORD_REQUIREMENTS[1]}`);
  if (!/[A-Z]/.test(password)) problems.push(`must contain ${PASSWORD_REQUIREMENTS[2]}`);
  if (!/\d/.test(password)) problems.push(`must contain ${PASSWORD_REQUIREMENTS[3]}`);

  if (problems.length > 0) {
    fail(`Password ${problems.join(", ")}.`);
  }
}

/**
 * Deliberately schema-light: the script writes the same collection the
 * application uses, but it only touches `name`, `email`, `passwordHash`,
 * `role` and the timestamps, so it cannot drift into unrelated fields.
 */
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    profileCompleted: { type: Boolean, default: false },
    profile: { type: mongoose.Schema.Types.Mixed, default: () => ({ availableToDonate: null }) },
  },
  { collection: "users", timestamps: true, strict: false },
);

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    fail(
      "MONGODB_URI is not set. Put it in .env.local, or run this with --env-file pointing at your environment.",
    );
  }

  const email = args.email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail(`"${args.email}" is not a valid email address.`);
  }

  const password = args.password || process.env.ADMIN_PASSWORD?.trim() || generatePassword();
  const generatedPassword = !args.password && !process.env.ADMIN_PASSWORD?.trim();
  assertPassword(password);

  const name = args.name.trim() || email.split("@")[0];

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email }).select("_id role").lean();

  if (existing) {
    if (existing.role === "ADMIN") {
      console.log(`\n  ${email} is already an administrator. Nothing to do.\n`);
      await mongoose.disconnect();
      return;
    }

    await User.updateOne({ _id: existing._id }, { $set: { role: "ADMIN" } });
    console.log(`\n  Promoted ${email} to administrator.\n`);
  } else {
    await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      role: "ADMIN",
      profileCompleted: false,
      profile: { availableToDonate: null },
    });
    console.log(`\n  Created administrator ${email}.\n`);
  }

  if (generatedPassword) {
    console.log(`  Password (shown once): ${password}`);
    console.log("  Store it in a password manager now. Sign in and change it there.\n");
  } else {
    console.log("  The password you supplied was used unchanged.\n");
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("\n  Unexpected failure:", error.message, "\n");
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
import "server-only";

import bcrypt from "bcryptjs";

/**
 * bcrypt work factor. 12 is the current sweet spot: strong enough to make
 * offline cracking expensive, fast enough that a sign-in stays responsive.
 */
const SALT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

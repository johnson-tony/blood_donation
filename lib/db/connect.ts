import "server-only";

import mongoose from "mongoose";

/**
 * Mongoose connection management.
 *
 * The same module has to behave correctly in three very different runtimes:
 *
 * 1. `next dev`          — a long-lived Node process that benefits from a
 *                          cached, reused connection.
 * 2. `next build`         — must never open a connection; pages that need data
 *                          are dynamic and only touch the database at request
 *                          time.
 * 3. Vercel / serverless  — every lambda may be a brand new process, and
 *                          connections are recycled aggressively, so the pool
 *                          has to stay small.
 *
 * The connection (and the in-flight promise) is cached on `globalThis` so that
 * Next.js dev-server hot reloads do not leak a new pool on every edit.
 */

const URI_ENV_VAR = "MONGODB_URI";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  __bloodDonationMongoose?: MongooseCache;
};

const cache: MongooseCache = (globalForMongoose.__bloodDonationMongoose ??= {
  connection: null,
  promise: null,
});

/**
 * Reads and sanity-checks `MONGODB_URI`.
 *
 * The message is intentionally free of any credential material so that it is
 * safe to log.
 */
function readMongoUri(): string {
  const uri = process.env[URI_ENV_VAR]?.trim();

  if (!uri) {
    throw new Error(
      `${URI_ENV_VAR} is not set. Copy .env.example to .env.local and provide a MongoDB connection string.`,
    );
  }

  let hasDatabaseName = false;
  try {
    const { protocol, pathname } = new URL(uri);
    if (!protocol.startsWith("mongodb")) {
      throw new Error("unsupported protocol");
    }
    hasDatabaseName = Boolean(pathname && pathname !== "/");
  } catch {
    throw new Error(
      `${URI_ENV_VAR} is not a valid connection string, for example mongodb://127.0.0.1:27017/blood_donation.`,
    );
  }

  if (!hasDatabaseName) {
    throw new Error(
      `${URI_ENV_VAR} must include a database name, for example mongodb://127.0.0.1:27017/blood_donation.`,
    );
  }

  return uri;
}

/**
 * Returns the shared Mongoose instance, connecting on first use.
 *
 * @throws if `MONGODB_URI` is missing or unusable, or the database cannot be
 * reached. Callers are responsible for translating that into a user-safe
 * message — this error must never be surfaced verbatim.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.connection) {
    return cache.connection;
  }

  if (!cache.promise) {
    const uri = readMongoUri();

    cache.promise = mongoose
      .connect(uri, {
        // Fail fast instead of silently buffering queries forever when the
        // database is unreachable.
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
        // Serverless instances recycle connections quickly; a large pool would
        // only exhaust MongoDB's connection limit.
        maxPoolSize: 10,
        minPoolSize: 0,
        autoIndex: process.env.NODE_ENV !== "production",
      })
      .then((m) => m);
  }

  try {
    cache.connection = await cache.promise;
  } catch (error) {
    // Allow a later request to retry instead of replaying a rejected promise.
    cache.promise = null;
    throw error;
  }

  return cache.connection;
}

/** The raw driver handle. Used by aggregation pipelines and counting. */
export type DatabaseHandle = NonNullable<mongoose.Connection["db"]>;

export async function getDatabase(): Promise<DatabaseHandle> {
  const mongooseInstance = await connectToDatabase();
  const db = mongooseInstance.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not open.");
  }

  return db;
}

/** Closes the pool. Only used by scripts and tests. */
export async function disconnectDatabase(): Promise<void> {
  cache.promise = null;
  cache.connection = null;
  await mongoose.disconnect();
}

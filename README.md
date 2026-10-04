# Jeevan Rakt

A blood donation platform. This repository currently contains **Phase 1: the
foundation** — accounts, donor profiles, roles, and the protected member and
admin areas.

Feature areas that are not built yet (public home, donor search, blood
requests, tracking, blood camps) are deliberately absent. The interface never
displays invented data to stand in for them.

## Stack

- Next.js 16 (App Router, Turbopack) with React 19 and TypeScript
- Tailwind CSS 4
- MongoDB via Mongoose 9
- Auth.js (`next-auth` v5) with credentials sign-in and stateless JWT sessions
- Zod for validation
- bcryptjs for password hashing

## Requirements

- Node.js 20.9 or newer
- A MongoDB instance — local or an Atlas free-tier cluster

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env.local
   ```

   Then fill in the two values:

   | Variable       | Purpose                                                                    |
   | -------------- | -------------------------------------------------------------------------- |
   | `MONGODB_URI`  | Full connection string, **including the database name** in the path.       |
   | `AUTH_SECRET`  | Secret used to encrypt session tokens. Generate with `npx auth secret`.    |

   `.env.local` is gitignored. `.env.example` is committed and contains no secrets.

3. Create the first administrator.

   Sign-up can never grant administrator access — public registration always
   creates a `USER`. Admins are created out of band, on a machine that already
   holds the database credentials:

   ```bash
   npm run create-admin -- --email you@example.com --name "Your Name"
   ```

   The script promotes an existing account if the address is already registered.
   It generates a strong random password and prints it once; store it in a
   password manager.

4. Start the development server:

   ```bash
   npm run dev
   ```

## Scripts

| Script                  | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Development server on `http://localhost:3000`  |
| `npm run build`         | Production build                               |
| `npm start`             | Serve the production build                     |
| `npm run lint`          | ESLint                                         |
| `npm run typecheck`     | `tsc --noEmit`                                 |
| `npm run create-admin`  | Create or promote an administrator             |

## Routes

| Route            | Access        | Purpose                                       |
| ---------------- | ------------- | --------------------------------------------- |
| `/`              | Public        | Entry point; redirects members to their area  |
| `/sign-in`       | Public        | Email and password sign-in                    |
| `/sign-up`       | Public        | Registration — always creates a member        |
| `/dashboard`     | Signed in     | Member overview                               |
| `/profile`       | Signed in     | Donor profile                                 |
| `/admin`         | Admin only    | Platform overview                             |
| `/admin/users`   | Admin only    | Registered accounts                           |

## Authorization

Two layers, and the second one is the real control:

1. `proxy.ts` redirects signed-out visitors away from protected routes and keeps
   members out of `/admin`. This is a user-experience shortcut.
2. `requireUser` and `requireAdmin` in `lib/auth/guards.ts` re-check the session
   and **re-read the role from MongoDB** on every request. Removing an
   administrator's role takes effect on the next request, not when their token
   happens to expire.

Data access always happens after those guards resolve, so a page can never issue
a query it has not yet proved is allowed.

## Deployment

Designed for Vercel. Set `MONGODB_URI` and `AUTH_SECRET` as project environment
variables. Because sessions are stateless JWTs, no additional collections or
services are required.

The MongoDB connection is cached on `globalThis` and pooled conservatively, so
each serverless instance opens one small pool rather than a connection per
request.
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

   Then fill in the values:

   | Variable                   | Purpose                                                                                 |
   | -------------------------- | --------------------------------------------------------------------------------------- |
   | `MONGODB_URI`              | Full connection string, **including the database name** in the path.                     |
   | `AUTH_SECRET`              | Secret used to encrypt session tokens. Generate with `npx auth secret`.                  |
   | `AUTH_URL`                 | Public origin, no trailing slash. Auth.js builds callback URLs from it.                  |
   | `CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud name.                                                                   |
   | `CLOUDINARY_API_KEY`       | Cloudinary API key.                                                                      |
   | `CLOUDINARY_API_SECRET`    | Cloudinary API secret. **Server only** — never expose this to the browser.               |

   `.env.local` is gitignored. `.env.example` is committed and contains no secrets.

   The Cloudinary values are optional. Without them the profile form hides its
   upload control and members fall back to their initials.

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

Designed for Vercel. `vercel.json` pins the framework preset to `nextjs` and the
Node runtime to 22.x, so the project does not depend on what was detected when it
was first imported.

Set the variables below as project environment variables:

| Variable                | Required | Notes                                                     |
| ----------------------- | -------- | --------------------------------------------------------- |
| `MONGODB_URI`           | yes      | Include the database name in the path.                     |
| `AUTH_SECRET`           | yes      | Generate with `npx auth secret`.                           |
| `AUTH_URL`              | yes      | The deployment origin, e.g. `https://app.vercel.app`.     |
| `CLOUDINARY_CLOUD_NAME` | no        | Enables profile photo uploads.                             |
| `CLOUDINARY_API_KEY`    | no        |                                                           |
| `CLOUDINARY_API_SECRET` | no        |                                                           |

### Build & Deployment settings

In **Project Settings → Build & Deployment**, confirm:

- **Framework Preset** is `Next.js`.
- **Output Directory** is **empty**.

Build settings saved in the dashboard override `vercel.json`. If Output Directory
is left as `public`, every deploy fails with `No Output Directory named "public"
found after the Build completed`, because a Next.js build emits to `.next`. Never
add `outputDirectory` to `vercel.json` for this project.

Also note that Vercel's **Redeploy** button re-runs the commit of the deployment
you click it on. It does not pick up newer commits. To ship a new commit, either
rely on automatic deployments for `main`, or trigger a fresh deployment of the
branch head.

Because sessions are stateless JWTs, no additional collections or services are
required.

The MongoDB connection is cached on `globalThis` and pooled conservatively, so
each serverless instance opens one small pool rather than a connection per
request.

### Schema

There is no separate migration step: Mongoose creates the collection and its
indexes on first write. Index creation is disabled in production
(`autoIndex: false` in `lib/db/connect.ts`), so run a build once against the
target database, or create the indexes by hand, before going live.

### Profile photos

Uploads go through a Server Action rather than a signed browser upload, so the
Cloudinary API secret is never sent to the client and there is no public upload
preset to abuse. Two consequences worth knowing:

- The file passes through the server, so `experimental.serverActions.bodySizeLimit`
  in `next.config.ts` is raised to `3mb` and the image cap is `2 MB`. Both stay
  under Vercel's ~4.5 MB request body limit.
- Photos land in the `blood-donation/profile-images` folder, created implicitly
  on first upload. The Admin API endpoint for creating folders returns 404 on
  the Free plan, which is why there is no setup script for it.

Each member has exactly one asset: the Cloudinary `public_id` is their user id,
so re-uploading replaces the file in place.
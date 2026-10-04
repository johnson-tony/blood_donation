import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

/**
 * Optimistic redirects only.
 *
 * Signed-out visitors are bounced away from the member and admin areas before
 * any of them render, and signed-in members are kept out of the auth pages. This
 * is a user-experience shortcut, not a security control: `requireUser` and
 * `requireAdmin` re-check the session and the role on the server for every
 * request, and those checks are what actually protect data.
 *
 * Proxy runs on the Node.js runtime by default, which is required for Auth.js.
 */
export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;
  const isSignedIn = Boolean(session?.user);
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isSignedIn) {
    const signInUrl = new URL("/sign-in", request.nextUrl);
    signInUrl.searchParams.set("callbackUrl", `${pathname}`);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname.startsWith("/admin") && !isAdmin) {
    // The admin layout also enforces this and renders the 403 page. Redirecting
    // here just avoids a pointless render on the way there.
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*"],
};
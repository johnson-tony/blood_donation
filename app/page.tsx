import { redirect } from "next/navigation";

import { PublicHome } from "@/components/public-site/home-page";
import { getSessionUser } from "@/lib/auth/guards";
import { landingRouteForRole } from "@/lib/constants";

export default async function RootPage() {
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    redirect(landingRouteForRole(sessionUser.role));
  }

  return <PublicHome />;
}

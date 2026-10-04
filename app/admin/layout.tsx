import { AppShell } from "@/components/layout/app-shell";
import { adminNavigation } from "@/components/layout/navigation";
import { requireAdminUser } from "@/lib/auth/guards";

/**
 * Every route under `/admin` passes through this layout, and the role is
 * re-read from MongoDB on each request. Removing an admin's role takes effect
 * immediately; the navigation is only ever a convenience on top of it.
 */
export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const admin = await requireAdminUser();

  return (
    <AppShell
      user={admin}
      items={adminNavigation}
      homeHref="/admin"
      areaLabel="Admin"
    >
      {children}
    </AppShell>
  );
}
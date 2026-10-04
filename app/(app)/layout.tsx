import { AppShell } from "@/components/layout/app-shell";
import { userNavigation } from "@/components/layout/navigation";
import { requireUser } from "@/lib/auth/guards";

export default async function MemberAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <AppShell
      user={user}
      items={userNavigation}
      homeHref="/dashboard"
      areaLabel="Member"
    >
      {children}
    </AppShell>
  );
}

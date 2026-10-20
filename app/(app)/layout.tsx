import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { userNavigation } from "@/components/layout/navigation";
import { getCurrentUserRecord } from "@/lib/auth/guards";
import { toSessionUserDTO } from "@/lib/services/user.service";

export default async function MemberAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const record = await getCurrentUserRecord();

  if (record.role !== "ADMIN" && !record.profileCompleted) {
    redirect("/onboarding");
  }

  const user = toSessionUserDTO(record);

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

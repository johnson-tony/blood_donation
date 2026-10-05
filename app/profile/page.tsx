import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/guards";
import { getUserById, toProfileDTO } from "@/lib/services/user.service";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const user = await getUserById(sessionUser.id);

  if (!user) redirect("/sign-in");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your account"
        title="Profile"
        description="Keep your blood group, location and donor availability up to date."
      />
      <ProfileForm profile={toProfileDTO(user)} />
    </div>
  );
}

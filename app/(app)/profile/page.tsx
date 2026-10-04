import type { Metadata } from "next";

import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUserRecord } from "@/lib/auth/guards";
import { toProfileDTO } from "@/lib/services/user.service";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const record = await getCurrentUserRecord();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile"
        title="Your donor profile"
        description="These are the details used to match you with nearby requests and nearby donors."
      />
      <ProfileForm profile={toProfileDTO(record)} />
    </div>
  );
}

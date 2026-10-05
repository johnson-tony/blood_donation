import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BloodRequestForm } from "@/components/forms/blood-request-form";
import { getCurrentUserRecord } from "@/lib/auth/guards";
import { toProfileDTO } from "@/lib/services/user.service";

export const metadata: Metadata = { title: "Request blood" };

export default async function NewBloodRequestPage() {
  const user = await getCurrentUserRecord();
  const profile = toProfileDTO(user);

  if (!profile.profileCompleted) redirect("/onboarding");

  return (
    <BloodRequestForm
      defaults={{
        phone: profile.phone ?? "",
        state: profile.state ?? "",
        district: profile.district ?? "",
        locality: profile.locality ?? "",
      }}
    />
  );
}

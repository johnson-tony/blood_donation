import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DonorOnboarding } from "@/components/forms/donor-onboarding";
import { getCurrentUserRecord } from "@/lib/auth/guards";
import { toProfileDTO } from "@/lib/services/user.service";

export const metadata: Metadata = {
  title: "Set up your donor profile",
  description: "Complete the details needed to match you with blood requests.",
};

export default async function OnboardingPage() {
  const record = await getCurrentUserRecord();

  if (record.profileCompleted) {
    redirect("/dashboard");
  }

  return <DonorOnboarding profile={toProfileDTO(record)} />;
}

import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/guards";
import { getUserById, toProfileDTO } from "@/lib/services/user.service";

export default async function OnboardingPage() {
  const sessionUser = await requireUser();

  if (sessionUser.role === "ADMIN") redirect("/admin");

  const user = await getUserById(sessionUser.id);
  if (!user) redirect("/sign-in");
  if (user.profileCompleted) redirect("/dashboard");

  return (
    <main className="min-h-dvh bg-canvas px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <PageHeader
          eyebrow="First step"
          title="Complete your donor profile"
          description="Add the details we need to help you find suitable blood donors and make your own donor profile useful when someone needs help."
        />
        <ProfileForm profile={toProfileDTO(user)} />
        <p className="text-center text-xs leading-5 text-ink-subtle">
          You can update these details later from your profile. Your mobile number is not publicly displayed.
        </p>
      </div>
    </main>
  );
}

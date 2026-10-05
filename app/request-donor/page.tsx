import { notFound, redirect } from "next/navigation";

import { DonorContactForm } from "@/components/forms/donor-contact-form";
import { requireUser } from "@/lib/auth/guards";
import { connectToDatabase } from "@/lib/db/connect";
import UserModel from "@/models/user";
import type { BloodGroup } from "@/types/user";

export default async function RequestDonorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const params = await searchParams;
  const donorId = typeof params.donorId === "string" ? params.donorId : "";
  if (!donorId) redirect("/find-blood");

  await connectToDatabase();
  const donor = await UserModel.findOne({
    _id: donorId,
    role: "USER",
    profileCompleted: true,
    "profile.availableToDonate": true,
  }).select("name profile.bloodGroup profile.state profile.district profile.locality").lean();

  if (!donor?.profile?.bloodGroup) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-700">Request donor contact</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Connect with a suitable donor.</h1>
        <p className="mt-3 text-sm leading-6 text-ink-secondary">Share the basic details of the blood need. The donor's phone number stays hidden until this request is successfully created.</p>
      </div>
      <DonorContactForm
        donor={{
          id: String(donor._id),
          name: donor.name,
          bloodGroup: donor.profile.bloodGroup as BloodGroup,
          state: donor.profile.state ?? "",
          district: donor.profile.district ?? "",
          locality: donor.profile.locality ?? "",
        }}
        defaults={{
          state: donor.profile.state ?? "",
          district: donor.profile.district ?? "",
          locality: donor.profile.locality ?? "",
        }}
      />
    </div>
  );
}

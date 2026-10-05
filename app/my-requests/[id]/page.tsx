import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import { getBloodContactRequest } from "@/lib/services/blood-contact-request.service";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = { title: "Blood Request" };

export default async function MyRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const request = await getBloodContactRequest((await params).id, user.id);
  if (!request) notFound();
  const phone = request.donor.phone?.replace(/[^+\d]/g, "");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-700">My request</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">Donor connection</h1><p className="mt-3 text-sm leading-6 text-ink-secondary">Your contact request has been created. Please contact the donor directly and coordinate with the hospital.</p></div>
      <section className="rounded-[28px] bg-mahogany-700 p-6 text-white shadow-overlay sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Donor contact</p>
        <h2 className="mt-3 text-2xl font-bold">{request.donor.name}</h2>
        <p className="mt-2 text-sm text-white/70">{request.donor.bloodGroup} · {request.donor.locality}, {request.donor.district}</p>
        {phone ? <a href={"tel:" + phone} className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-white px-5 text-sm font-bold text-mahogany-800 hover:bg-white/90">Call {request.donor.phone}</a> : <p className="mt-6 text-sm text-white/70">The donor phone number is no longer available.</p>}
      </section>
      <section className="rounded-[24px] border border-line bg-surface p-6 shadow-card sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Blood need</p>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          {[[ "Blood group", request.donor.bloodGroup ], [ "Units", String(request.unitsRequired) ], [ "Hospital", request.hospital ], [ "When needed", request.urgency === "urgent" ? "Urgent" : request.urgency === "today" ? "Today" : "Scheduled" ], [ "State", request.state ], [ "District", request.district ], [ "Locality", request.locality ]].map(([label, value]) => <div key={label}><dt className="text-xs text-ink-muted">{label}</dt><dd className="mt-1 text-sm font-semibold">{value}</dd></div>)}
        </dl>
      </section>
      <Link href="/my-requests" className={buttonClasses({ variant: "secondary", size: "md", className: "sm:w-auto" })}>Back to my requests</Link>
    </div>
  );
}
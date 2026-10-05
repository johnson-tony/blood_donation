import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { IconClock, IconBuilding } from "@/components/layout/icons";
import { buttonClasses } from "@/components/ui/button";
import { getCurrentUserRecord } from "@/lib/auth/guards";
import { getBloodRequestForOwner } from "@/lib/services/blood-request.service";

export const metadata: Metadata = { title: "Blood request" };

export default async function BloodRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUserRecord();
  const { id } = await params;
  const request = await getBloodRequestForOwner(String(user._id), id);

  if (!request) notFound();

  const urgencyLabel = request.urgency === "critical" ? "Critical" : request.urgency === "urgent" ? "Urgent" : "Planned";

  return (
    <div className="space-y-6">
      <Link href="/requests" className="text-sm font-semibold text-ink-muted hover:text-ink">← My requests</Link>

      <section className="overflow-hidden rounded-[28px] bg-mahogany-700 p-6 text-white shadow-overlay sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-mahogany-100">Blood request</p>
            <p className="mt-3 text-5xl font-bold tracking-[-0.05em]">{request.bloodGroup}</p>
            <p className="mt-2 text-white/75">{request.units} {request.units === 1 ? "unit" : "units"} required</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">{request.status}</span>
        </div>
        <div className="mt-7 border-t border-white/15 pt-4 text-sm text-white/75">{urgencyLabel} · needed by {new Date(request.neededBy).toLocaleString()}</div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[22px] border border-line bg-surface p-5 shadow-card"><IconBuilding className="size-5 text-mahogany-700" /><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-subtle">Hospital</p><p className="mt-1 font-semibold text-ink">{request.hospitalName}</p></div>
        <div className="rounded-[22px] border border-line bg-surface p-5 shadow-card"><IconClock className="size-5 text-mahogany-700" /><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-subtle">Location</p><p className="mt-1 font-semibold text-ink">{request.locality}, {request.district}, {request.state}</p></div>
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Contact</p>
        <h2 className="mt-1 text-lg font-bold text-ink">Response details</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><dt className="text-xs text-ink-subtle">Relationship</dt><dd className="mt-1 font-semibold text-ink">{request.patientRelation}</dd></div>
          <div><dt className="text-xs text-ink-subtle">Contact number</dt><dd className="mt-1 font-semibold text-ink">{request.contactPhone}</dd></div>
        </dl>
        {request.note ? <div className="mt-5 rounded-2xl bg-canvas p-4 text-sm leading-6 text-ink-muted">{request.note}</div> : null}
      </section>

      <div className="flex gap-2">
        <Link href="/requests" className={buttonClasses({ variant: "secondary", size: "md" })}>All requests</Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { IconClock, IconDroplet, IconCheck } from "@/components/layout/icons";
import { buttonClasses } from "@/components/ui/button";
import { getCurrentUserRecord } from "@/lib/auth/guards";
import { listMyBloodRequests } from "@/lib/services/blood-request.service";

export const metadata: Metadata = { title: "My requests" };

const urgencyLabel = { critical: "Critical", urgent: "Urgent", standard: "Planned" } as const;
const statusLabel = { open: "Open", fulfilled: "Fulfilled", cancelled: "Cancelled", expired: "Expired" } as const;

export default async function RequestsPage() {
  const user = await getCurrentUserRecord();
  const { requests } = await listMyBloodRequests(String(user._id));

  return (
    <div className="space-y-7">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-mahogany-600">BloodLink</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-ink">My blood requests</h1>
          <p className="mt-2 text-sm text-ink-muted">Track every request you create and its current status.</p>
        </div>
        <Link href="/requests/new" className={buttonClasses({ size: "sm", className: "hidden w-auto sm:inline-flex" })}>Request blood</Link>
      </header>

      <div className="space-y-3">
        {requests.length === 0 ? (
          <section className="rounded-[24px] border border-line bg-surface p-6 shadow-card">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-700"><IconDroplet className="size-5" /></div>
            <h2 className="mt-4 text-lg font-bold text-ink">No requests yet</h2>
            <p className="mt-1 max-w-md text-sm leading-6 text-ink-muted">When you need blood, create a request with the blood group, urgency and hospital details.</p>
            <Link href="/requests/new" className={buttonClasses({ size: "md", className: "mt-5 w-auto" })}>Create first request</Link>
          </section>
        ) : requests.map((request) => (
          <Link key={request.id} href={`/requests/${request.id}`} className="block rounded-[24px] border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-mahogany-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-mahogany-50 text-xl font-bold text-mahogany-700">{request.bloodGroup}</span>
                <div><p className="font-bold text-ink">{request.units} {request.units === 1 ? "unit" : "units"} needed</p><p className="mt-1 text-sm text-ink-muted">{request.hospitalName}</p></div>
              </div>
              <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-ink-subtle">{statusLabel[request.status]}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-ink-subtle">
              <span className="rounded-full bg-canvas px-2.5 py-1">{urgencyLabel[request.urgency]}</span>
              <span className="rounded-full bg-canvas px-2.5 py-1">{new Date(request.neededBy).toLocaleString()}</span>
              <span className="rounded-full bg-canvas px-2.5 py-1">{request.locality}, {request.district}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="sm:hidden">
        <Link href="/requests/new" className={buttonClasses({ size: "lg" })}>Request blood</Link>
      </div>
    </div>
  );
}

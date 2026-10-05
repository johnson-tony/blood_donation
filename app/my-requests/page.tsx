import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth/guards";
import { listBloodContactRequests } from "@/lib/services/blood-contact-request.service";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = { title: "My Requests" };

export default async function MyRequestsPage() {
  const user = await requireUser();
  const requests = await listBloodContactRequests(user.id);

  return (
    <div className="space-y-8">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-700">Your activity</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">My requests</h1><p className="mt-3 text-sm leading-6 text-ink-secondary">Keep track of blood needs where you have requested donor contact.</p></div>
      {requests.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-line-strong bg-surface p-10 text-center shadow-card">
          <p className="text-sm font-semibold">No blood requests yet.</p><p className="mt-2 text-sm text-ink-muted">Find a suitable donor when someone needs blood.</p>
          <Link href="/find-blood" className={buttonClasses({ size: "md", className: "mt-6 sm:w-auto" })}>Find blood</Link>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {requests.map((request) => <article key={request.id} className="rounded-[24px] border border-line bg-surface p-6 shadow-card">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-mahogany-600">{request.urgency === "urgent" ? "Urgent" : request.urgency === "today" ? "Today" : "Scheduled"}</p><h2 className="mt-2 text-lg font-bold">{request.bloodGroup} · {request.unitsRequired} {request.unitsRequired === 1 ? "unit" : "units"}</h2></div><span className="rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">Contact created</span></div>
            <div className="mt-5 space-y-2 text-sm text-ink-secondary"><p><span className="font-semibold text-ink">Donor:</span> {request.donor?.name ?? "No longer available"}</p><p><span className="font-semibold text-ink">Hospital:</span> {request.hospital}</p><p><span className="font-semibold text-ink">Area:</span> {request.locality}, {request.district}</p></div>
            <Link href={"/my-requests/" + request.id} className="mt-6 inline-flex text-sm font-semibold text-mahogany-700 hover:text-mahogany-800">View donor contact →</Link>
          </article>)}
        </section>
      )}
    </div>
  );
}
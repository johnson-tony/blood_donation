import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { IconHeart } from "@/components/layout/icons";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireAdminUser } from "@/lib/auth/guards";
import { listAdminBloodContactRequests } from "@/lib/services/admin-blood-request.service";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Blood Requests" };

const urgencyTone: Record<"urgent" | "today" | "scheduled", BadgeTone> = { urgent: "brand", today: "brand", scheduled: "neutral" };

export default async function AdminBloodRequestsPage() {
  await requireAdminUser();
  const requests = await listAdminBloodContactRequests();

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Admin" title="Blood requests" description={requests.length ? `Showing the latest ${requests.length} donor contact requests.` : "No donor contact requests have been created yet."} />
      {requests.length === 0 ? (
        <EmptyState icon={<IconHeart />} title="No blood requests" description="A request appears here after a member connects with a suitable donor." />
      ) : (
        <Card>
          <CardBody className="px-0 py-0">
            <Table>
              <caption className="sr-only">Blood contact requests</caption>
              <THead><TR><TH>Request</TH><TH>Requester</TH><TH>Donor</TH><TH>Hospital</TH><TH>Urgency</TH><TH>Created</TH></TR></THead>
              <TBody>
                {requests.map((request) => (
                  <TR key={request.id}>
                    <TD><div className="space-y-1"><Badge tone="brand">{request.bloodGroup}</Badge><p className="text-sm text-ink">{request.unitsRequired} {request.unitsRequired === 1 ? "unit" : "units"}</p></div></TD>
                    <TD className="max-w-[14rem]"><span className="block truncate font-medium text-ink">{request.requester?.name ?? "Member unavailable"}</span><span className="block truncate text-xs text-ink-muted">{request.requester?.email ?? "—"}</span></TD>
                    <TD className="max-w-[14rem]"><span className="block truncate font-medium text-ink">{request.donor?.name ?? "Donor unavailable"}</span><span className="block truncate text-xs text-ink-muted">{request.donor ? [request.donor.locality,request.donor.district].filter(Boolean).join(", ") : "—"}</span></TD>
                    <TD className="max-w-[16rem]"><span className="block truncate text-ink">{request.hospital}</span><span className="block truncate text-xs text-ink-muted">{[request.locality,request.district,request.state].filter(Boolean).join(", ")}</span></TD>
                    <TD><Badge tone={urgencyTone[request.urgency]}>{request.urgency === "urgent" ? "Urgent" : request.urgency === "today" ? "Today" : "Scheduled"}</Badge></TD>
                    <TD className="whitespace-nowrap text-ink-muted">{formatDate(request.createdAt)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

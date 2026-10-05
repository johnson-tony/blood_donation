import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { IconDroplet } from "@/components/layout/icons";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireAdminUser } from "@/lib/auth/guards";
import { listDonors } from "@/lib/services/user.service";
import { formatDate, formatNumber } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Donors" };

export default async function AdminDonorsPage() {
  await requireAdminUser();
  const { users, total } = await listDonors({ limit: 100 });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Donors"
        description={total === 0 ? "No active donors yet." : `${formatNumber(total)} active donors. Showing the most recently updated profiles.`}
      />
      {users.length === 0 ? (
        <EmptyState icon={<IconDroplet />} title="No active donors" description="Members appear here after completing their profile and choosing that they are available to donate." />
      ) : (
        <Card>
          <CardBody className="px-0 py-0">
            <Table>
              <caption className="sr-only">Active blood donors</caption>
              <THead><TR><TH>Donor</TH><TH>Blood group</TH><TH>Location</TH><TH>Status</TH><TH>Joined</TH></TR></THead>
              <TBody>
                {users.map((user) => (
                  <TR key={user.id}>
                    <TD className="max-w-[18rem]"><span className="block truncate font-medium text-ink">{user.name}</span><span className="block truncate text-xs text-ink-muted">{user.email}</span></TD>
                    <TD><Badge tone="brand">{user.bloodGroup ?? "—"}</Badge></TD>
                    <TD className="max-w-[18rem]"><span className="block truncate text-ink-muted">{[user.locality,user.district,user.state].filter(Boolean).join(", ") || "Not set"}</span></TD>
                    <TD><Badge tone="success"><StatusDot tone="success" />Available</Badge></TD>
                    <TD className="whitespace-nowrap text-ink-muted">{formatDate(user.createdAt)}</TD>
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

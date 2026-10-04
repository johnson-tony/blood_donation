import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { IconUsers } from "@/components/layout/icons";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireAdminUser } from "@/lib/auth/guards";
import { listUsers } from "@/lib/services/user.service";
import { formatDate, formatNumber } from "@/lib/utils/format";
import type { AdminUserRowDTO } from "@/types/user";

export const metadata: Metadata = {
  title: "Users",
};

const PAGE_SIZE = 50;

export default async function AdminUsersPage() {
  // Gated here as well as in the layout: the page must not start a query it
  // cannot yet prove is allowed.
  await requireAdminUser();

  const { users, total } = await listUsers({ limit: PAGE_SIZE });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description={
          total === 0
            ? "No accounts have registered yet."
            : `${formatNumber(total)} registered ${
                total === 1 ? "account" : "accounts"
              }. Showing the ${Math.min(total, PAGE_SIZE)} most recent.`
        }
      />

      {users.length === 0 ? (
        <EmptyState
          icon={<IconUsers />}
          title="No users yet"
          description="Accounts appear here as soon as somebody completes sign-up."
        />
      ) : (
        <Card>
          <CardBody className="px-0 py-0">
            <Table>
              <caption className="sr-only">
                Registered accounts with role, profile status and location
              </caption>
              <THead>
                <TR>
                  <TH>Member</TH>
                  <TH>Role</TH>
                  <TH>Profile</TH>
                  <TH>Blood group</TH>
                  <TH>Location</TH>
                  <TH>Donor status</TH>
                  <TH>Joined</TH>
                </TR>
              </THead>
              <TBody>
                {users.map((user) => (
                  <TR key={user.id}>
                    <TD className="max-w-[16rem]">
                      <span className="block truncate font-medium text-ink">
                        {user.name}
                      </span>
                      <span className="block truncate text-xs text-ink-muted">
                        {user.email}
                      </span>
                    </TD>
                    <TD>
                      <Badge tone={user.role === "ADMIN" ? "brand" : "neutral"}>
                        {user.role === "ADMIN" ? "Admin" : "Member"}
                      </Badge>
                    </TD>
                    <TD>
                      <ProfileBadge complete={user.profileCompleted} />
                    </TD>
                    <TD>{user.bloodGroup ?? "—"}</TD>
                    <TD className="max-w-[14rem]">
                      <LocationCell user={user} />
                    </TD>
                    <TD>
                      <DonorStatusBadge user={user} />
                    </TD>
                    <TD className="whitespace-nowrap text-ink-muted">
                      {formatDate(user.createdAt)}
                    </TD>
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

function ProfileBadge({ complete }: { complete: boolean }) {
  return complete ? (
    <Badge tone="success">
      <StatusDot tone="success" />
      Complete
    </Badge>
  ) : (
    <Badge tone="muted">
      <StatusDot tone="neutral" />
      Incomplete
    </Badge>
  );
}

function DonorStatusBadge({ user }: { user: AdminUserRowDTO }) {
  if (user.availableToDonate === null) {
    return <span className="text-ink-subtle">Not set</span>;
  }

  return user.availableToDonate ? (
    <Badge tone="success">
      <StatusDot tone="success" />
      Available
    </Badge>
  ) : (
    <Badge tone="neutral">
      <StatusDot tone="neutral" />
      Unavailable
    </Badge>
  );
}

function LocationCell({ user }: { user: AdminUserRowDTO }) {
  const location = [user.locality, user.district, user.state]
    .filter(Boolean)
    .join(", ");

  if (!location) {
    return <span className="text-ink-subtle">Not set</span>;
  }

  return <span className="block truncate text-ink-muted">{location}</span>;
}
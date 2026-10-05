import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { getAdminOverview, type Metric } from "@/lib/services/admin.service";
import { requireAdminUser } from "@/lib/auth/guards";
import { formatNumber } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  // The guard runs in the layout too, but a layout and a page render in
  // parallel — so the page gates its own data access rather than trusting that
  // the layout has already finished. `cache()` makes this a single lookup.
  await requireAdminUser();

  const overview = await getAdminOverview();

  const stats: { key: keyof typeof overview; label: string; hint: string }[] = [
    {
      key: "users",
      label: "Registered members",
      hint: "Every account that has signed up.",
    },
    {
      key: "donors",
      label: "Active donors",
      hint: "Profiles complete and marked available to donate.",
    },
    {
      key: "bloodRequests",
      label: "Blood requests",
      hint: "Donor contact requests created by members.",
    },
    {
      key: "bloodCamps",
      label: "Blood camps",
      hint: "All camps currently managed by admins.",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Platform overview"
        description="A live operational view of users, donors, blood requests and blood camps."
        actions={
          <Link
            href="/admin/users"
            className={buttonClasses({
              variant: "secondary",
              size: "sm",
              className: "sm:w-auto",
            })}
          >
            Manage users
          </Link>
        }
      />

      <section aria-labelledby="platform-metrics-heading">
        <h2 id="platform-metrics-heading" className="sr-only">
          Key counts
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.key}>
              <Card className="h-full">
                <CardBody className="space-y-1.5">
                  <p className="text-sm font-medium text-ink-muted">
                    {stat.label}
                  </p>
                  <StatValue metric={overview[stat.key]} />
                  <p className="text-xs leading-relaxed text-ink-subtle">
                    {stat.hint}
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="admin-scope-heading" className="space-y-3">
        <h2 id="admin-scope-heading" className="text-base font-semibold tracking-tight text-ink">
          Admin operations
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AdminLink href="/admin/users" label="Manage users" />
          <AdminLink href="/admin/donors" label="Review donors" />
          <AdminLink href="/admin/blood-requests" label="Review blood requests" />
          <AdminLink href="/admin/notifications" label="View notifications" />
        </div>
      </section>
    </div>
  );
}

function StatValue({ metric }: { metric: Metric }) {\n  return (\n    <p className="text-3xl font-semibold tracking-tight text-ink">\n      {formatNumber(metric.value)}\n    </p>\n  );\n}\n
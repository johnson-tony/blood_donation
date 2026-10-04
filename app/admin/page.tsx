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
      hint: "Requests arrive with the donor matching feature.",
    },
    {
      key: "bloodCamps",
      label: "Blood camps",
      hint: "Camp registration arrives with its own feature.",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Platform overview"
        description="Counts come straight from the database. Where a feature has not been built yet, it is reported as missing rather than as zero."
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
        <h2
          id="admin-scope-heading"
          className="text-base font-semibold tracking-tight text-ink"
        >
          What this area does today
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-ink-muted">
          <li>
            Lists every registered account with role, profile status, blood
            group and location.
          </li>
          <li>
            Reports real counts taken from MongoDB on each page load. Nothing on
            this page is sampled or cached.
          </li>
          <li>
            Administrative actions — editing accounts, suspending members,
            managing requests and camps — are not built yet.
          </li>
        </ul>
      </section>
    </div>
  );
}

function StatValue({ metric }: { metric: Metric }) {
  if (metric.status === "unavailable") {
    return (
      <p className="text-xl font-semibold tracking-tight text-ink-subtle">
        No data yet
      </p>
    );
  }

  return (
    <p className="text-3xl font-semibold tracking-tight text-ink">
      {formatNumber(metric.value)}
    </p>
  );
}
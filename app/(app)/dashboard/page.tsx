import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, Section } from "@/components/layout/page-header";
import { IconCheck } from "@/components/layout/icons";
import { DonorSummary } from "@/components/shared/donor-summary";
import { ProfileCompletionPanel } from "@/components/shared/profile-completion";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserRecord } from "@/lib/auth/guards";
import { toProfileDTO } from "@/lib/services/user.service";
import { firstNameOf, formatDate, greetingFor } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const record = await getCurrentUserRecord();
  const profile = toProfileDTO(record);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title={`${greetingFor()}, ${firstNameOf(profile.name)}`}
        description={
          profile.profileCompleted
            ? "Your donor profile is complete and up to date."
            : "Your account is ready. Finish your profile to start requesting blood or donating."
        }
        actions={
          record.role === "ADMIN" ? (
            <Link
              href="/admin"
              className={buttonClasses({
                variant: "secondary",
                size: "sm",
                className: "sm:w-auto",
              })}
            >
              Go to admin
            </Link>
          ) : undefined
        }
      />

      <ProfileCompletionPanel profile={profile} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="donor-details-heading">
          <Card>
            <CardHeader>
              <CardTitle id="donor-details-heading">Your details</CardTitle>
            </CardHeader>
            <CardBody>
              <DonorSummary profile={profile} />
            </CardBody>
          </Card>
        </section>

        <section aria-labelledby="account-heading">
          <Card>
            <CardHeader>
              <CardTitle id="account-heading">Account</CardTitle>
            </CardHeader>
            <CardBody>
              <dl className="divide-y divide-line">
                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
                  <dt className="text-sm text-ink-muted sm:w-44 sm:shrink-0">
                    Email address
                  </dt>
                  <dd className="break-all text-sm font-medium text-ink">
                    {profile.email}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
                  <dt className="text-sm text-ink-muted sm:w-44 sm:shrink-0">
                    Member since
                  </dt>
                  <dd className="text-sm font-medium text-ink">
                    {formatDate(profile.createdAt)}
                  </dd>
                </div>
              </dl>
            </CardBody>
          </Card>
        </section>
      </div>

      <Section
        title="What you can do now"
        description="This release covers accounts and donor profiles only. The rest is built on this same foundation."
      >
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          <ListItem label="Complete your donor profile" state="ready">
            Your blood group and locality are what make a donor findable.
          </ListItem>
          <ListItem label="Find blood" state="planned">
            Search by blood group and location, prioritising nearby donors.
          </ListItem>
          <ListItem label="Post a blood request" state="planned">
            Match willing donors by locality, district, then state.
          </ListItem>
          <ListItem label="Track your requests" state="planned">
            See who responded and follow up by phone.
          </ListItem>
        </ul>
      </Section>
    </div>
  );
}

function ListItem({
  label,
  children,
  state,
}: {
  label: string;
  children: React.ReactNode;
  state: "ready" | "planned";
}) {
  return (
    <li className="flex items-start gap-3 px-5 py-4">
      <span
        aria-hidden="true"
        className={
          state === "ready"
            ? "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-surface text-success ring-1 ring-success-line"
            : "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-ink-subtle ring-1 ring-line-strong"
        }
      >
        {state === "ready" ? <IconCheck className="size-3.5" /> : <Dot />}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">
          {label}
          <span className="sr-only">
            {state === "ready" ? " — available now" : " — not built yet"}
          </span>
        </p>
        <p className="mt-0.5 text-sm text-ink-muted">{children}</p>
      </div>
    </li>
  );
}

function Dot() {
  return <span className="size-1.5 rounded-full bg-current" />;
}

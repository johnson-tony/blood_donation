import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { getUserById, toProfileDTO } from "@/lib/services/user.service";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const sessionUser = await requireUser();

  if (sessionUser.role === "ADMIN") redirect("/admin");

  const user = await getUserById(sessionUser.id);
  if (!user) redirect("/sign-in");
  if (!user.profileCompleted) redirect("/onboarding");

  const profile = toProfileDTO(user);
  const firstName = profile.name.split(/\s+/)[0] || profile.name;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your dashboard"
        title={`Good day, ${firstName}.`}
        description="Your donor profile is ready. Blood search and donor connection will appear here as those features are enabled."
        actions={
          <Link href="/profile" className={buttonClasses({ variant: "secondary", size: "sm" })}>
            View profile
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="overflow-hidden border-mahogany-200">
          <CardBody className="space-y-3 border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Donor status</p>
            <p className="text-2xl font-bold tracking-tight text-ink">
              {profile.availableToDonate ? "Available to donate" : "Not available"}
            </p>
            <p className="text-sm leading-6 text-ink-muted">
              {profile.bloodGroup} · {profile.locality}, {profile.district}
            </p>
            <Link href="/profile" className="inline-flex text-sm font-semibold text-mahogany-700 hover:underline">
              Update availability
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3 border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Next phase</p>
            <p className="text-2xl font-bold tracking-tight text-ink">Find blood</p>
            <p className="text-sm leading-6 text-ink-muted">
              No fake availability or statistics are shown before real donor data is exposed through the search feature.
            </p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

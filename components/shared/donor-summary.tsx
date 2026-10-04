import Link from "next/link";

import { Badge, StatusDot } from "@/components/ui/badge";
import type { ProfileDTO } from "@/types/user";

export function DonorAvailabilityBadge({
  availableToDonate,
}: {
  availableToDonate: boolean | null;
}) {
  if (availableToDonate === null) {
    return (
      <Badge tone="muted">
        <StatusDot tone="neutral" />
        Availability not set
      </Badge>
    );
  }

  return availableToDonate ? (
    <Badge tone="success">
      <StatusDot tone="success" />
      Available to donate
    </Badge>
  ) : (
    <Badge tone="neutral">
      <StatusDot tone="neutral" />
      Not available
    </Badge>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="text-sm text-ink-muted sm:w-44 sm:shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export function DonorSummary({ profile }: { profile: ProfileDTO }) {
  const location = [profile.locality, profile.district, profile.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <dl className="divide-y divide-line">
        <Row label="Blood group" value={profile.bloodGroup ?? "Not set"} />
        <Row label="Location" value={location || "Not set"} />
        <Row label="Mobile number" value={profile.phone ?? "Not set"} />
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <DonorAvailabilityBadge availableToDonate={profile.availableToDonate} />
        <Link
          href="/profile"
          className="text-sm font-medium text-mahogany-700 underline underline-offset-4 hover:text-mahogany-800"
        >
          Update details
        </Link>
      </div>
    </div>
  );
}

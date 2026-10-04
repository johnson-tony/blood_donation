import "server-only";

import { countDonors, countUsers } from "@/lib/services/user.service";

/**
 * A metric backed by a model that does not exist yet. The dashboard must not
 * invent a number for these, so they render as "No data yet" instead of `0`.
 */
export interface UnavailableMetric {
  status: "unavailable";
}

export interface AvailableMetric {
  status: "available";
  value: number;
}

export type Metric = AvailableMetric | UnavailableMetric;

export interface AdminOverview {
  users: Metric;
  donors: Metric;
  bloodRequests: Metric;
  bloodCamps: Metric;
}

const NOT_YET_BUILT: UnavailableMetric = { status: "unavailable" };

export async function getAdminOverview(): Promise<AdminOverview> {
  const [users, donors] = await Promise.all([countUsers(), countDonors()]);

  return {
    users: { status: "available", value: users },
    donors: { status: "available", value: donors },
    // Blood requests and blood camps arrive with their own models in a later
    // phase. Reporting a count today would mean querying collections that
    // cannot exist yet.
    bloodRequests: NOT_YET_BUILT,
    bloodCamps: NOT_YET_BUILT,
  };
}
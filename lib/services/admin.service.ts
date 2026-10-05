import "server-only";

import { countDonors, countUsers } from "@/lib/services/user.service";
import { countBloodContactRequests } from "@/lib/services/admin-blood-request.service";
import BloodCampModel from "@/models/blood-camp";
import { connectToDatabase } from "@/lib/db/connect";

export interface AvailableMetric {
  status: "available";
  value: number;
}

export type Metric = AvailableMetric;

export interface AdminOverview {
  users: Metric;
  donors: Metric;
  bloodRequests: Metric;
  bloodCamps: Metric;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  await connectToDatabase();

  const [users, donors, bloodRequests, bloodCamps] = await Promise.all([
    countUsers(),
    countDonors(),
    countBloodContactRequests(),
    BloodCampModel.countDocuments().exec(),
  ]);

  return {
    users: { status: "available", value: users },
    donors: { status: "available", value: donors },
    bloodRequests: { status: "available", value: bloodRequests },
    bloodCamps: { status: "available", value: bloodCamps },
  };
}
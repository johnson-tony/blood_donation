import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import UserModel from "@/models/user";
import type { BloodGroup } from "@/types/user";

export type DonorSearchFilters = {
  bloodGroup: BloodGroup;
  state?: string;
  district?: string;
  locality?: string;
};

export type DonorSearchResult = {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  state: string;
  district: string;
  locality: string;
};

export async function findAvailableDonors(
  filters: DonorSearchFilters,
): Promise<DonorSearchResult[]> {
  await connectToDatabase();

  const state = filters.state?.trim().toLowerCase() || "";
  const district = filters.district?.trim().toLowerCase() || "";
  const locality = filters.locality?.trim().toLowerCase() || "";

  const rows = await UserModel.aggregate([
    {
      $match: {
        role: "USER",
        profileCompleted: true,
        "profile.availableToDonate": true,
        "profile.bloodGroup": filters.bloodGroup,
      },
    },
    {
      $addFields: {
        localityRank: locality
          ? { $cond: [{ $eq: [{ $toLower: { $ifNull: ["$profile.locality", ""] } }, locality] }, 0, 1] }
          : 1,
        districtRank: district
          ? { $cond: [{ $eq: [{ $toLower: { $ifNull: ["$profile.district", ""] } }, district] }, 0, 1] }
          : 1,
        stateRank: state
          ? { $cond: [{ $eq: [{ $toLower: { $ifNull: ["$profile.state", ""] } }, state] }, 0, 1] }
          : 1,
      },
    },
    {
      $addFields: {
        proximityRank: {
          $add: [
            { $multiply: ["$localityRank", 100] },
            { $multiply: ["$districtRank", 10] },
            "$stateRank",
          ],
        },
      },
    },
    { $sort: { proximityRank: 1, name: 1 } },
    { $project: { name: 1, profile: 1 } },
    { $limit: 50 },
  ]).exec();

  return rows.map((row) => ({
    id: String(row._id),
    name: row.name,
    bloodGroup: row.profile.bloodGroup,
    state: row.profile.state,
    district: row.profile.district,
    locality: row.profile.locality,
  }));
}

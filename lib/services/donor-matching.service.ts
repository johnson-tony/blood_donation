import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import UserModel from "@/models/user";
import BloodRequestModel, { type BloodRequestRecord } from "@/models/blood-request";
import DonorMatchModel, { type MatchStatus } from "@/models/donor-match";
import type { BloodGroup } from "@/types/user";

const COMPATIBLE_DONORS: Record<BloodGroup, BloodGroup[]> = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

function scoreDonor(donor: {
  profile?: { district?: string; state?: string; locality?: string };
}, request: BloodRequestRecord) {
  const profile = donor.profile ?? {};
  let score = 100;
  if (profile.state?.trim().toLowerCase() === request.state.trim().toLowerCase()) score += 100;
  if (profile.district?.trim().toLowerCase() === request.district.trim().toLowerCase()) score += 220;
  if (profile.locality?.trim().toLowerCase() === request.locality.trim().toLowerCase()) score += 180;
  return score;
}

export async function findAndCreateMatches(request: BloodRequestRecord) {
  await connectToDatabase();

  const compatible = COMPATIBLE_DONORS[request.bloodGroup];
  const donors = await UserModel.find({
    _id: { $ne: request.requesterId },
    profileCompleted: true,
    "profile.availableToDonate": true,
    "profile.bloodGroup": { $in: compatible },
  }).select("name profile").lean().exec();

  if (!donors.length) return [];

  const matches = donors
    .map((donor) => ({ donor, score: scoreDonor(donor, request) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  const operations = matches.map(({ donor, score }) => ({
    updateOne: {
      filter: { requestId: request._id, donorId: donor._id },
      update: {
        $setOnInsert: {
          requestId: request._id,
          donorId: donor._id,
          status: "pending" as MatchStatus,
          compatibility: "exact" as const,
          score,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length) await DonorMatchModel.bulkWrite(operations);
  return matches;
}

export async function listMatchesForRequest(requesterId: string, requestId: string) {
  await connectToDatabase();

  const request = await BloodRequestModel.findOne({
    _id: requestId,
    requesterId,
  }).lean<BloodRequestRecord | null>().exec();

  if (!request) return null;

  const matches = await DonorMatchModel.find({ requestId: request._id })
    .sort({ score: -1, createdAt: -1 })
    .populate({ path: "donorId", select: "name profile profileImage" })
    .lean()
    .exec();

  return matches;
}

export { COMPATIBLE_DONORS };

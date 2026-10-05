import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import BloodContactRequestModel from "@/models/blood-contact-request";
import UserModel from "@/models/user";

export async function listAdminBloodContactRequests(limit = 100) {
  await connectToDatabase();

  const requests = await BloodContactRequestModel.find({})
    .sort({ createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 200))
    .lean();

  if (!requests.length) return [];

  const userIds = [...new Set(requests.flatMap((request) => [
    String(request.requesterId),
    String(request.donorId),
  ]))];

  const users = await UserModel.find({ _id: { $in: userIds } })
    .select("name email profile.bloodGroup profile.state profile.district profile.locality")
    .lean();

  const userMap = new Map(users.map((user) => [String(user._id), user]));

  return requests.map((request) => {
    const requester = userMap.get(String(request.requesterId));
    const donor = userMap.get(String(request.donorId));

    return {
      id: String(request._id),
      bloodGroup: request.bloodGroup,
      hospital: request.hospital,
      unitsRequired: request.unitsRequired,
      state: request.state,
      district: request.district,
      locality: request.locality,
      urgency: request.urgency,
      createdAt: request.createdAt.toISOString(),
      requester: requester
        ? { name: requester.name, email: requester.email }
        : null,
      donor: donor
        ? {
            name: donor.name,
            email: donor.email,
            locality: donor.profile?.locality ?? null,
            district: donor.profile?.district ?? null,
          }
        : null,
    };
  });
}

export async function countBloodContactRequests() {
  await connectToDatabase();
  return BloodContactRequestModel.countDocuments().exec();
}

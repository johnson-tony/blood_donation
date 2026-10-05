import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import BloodContactRequestModel from "@/models/blood-contact-request";
import UserModel from "@/models/user";

export async function createBloodContactRequest(input: {
  requesterId: string;
  donorId: string;
  bloodGroup: string;
  hospital: string;
  unitsRequired: number;
  state: string;
  district: string;
  locality: string;
  urgency: "urgent" | "today" | "scheduled";
}) {
  await connectToDatabase();

  const donor = await UserModel.findOne({
    _id: input.donorId,
    role: "USER",
    profileCompleted: true,
    "profile.availableToDonate": true,
    "profile.bloodGroup": input.bloodGroup,
  }).select("name profile.phone profile.bloodGroup profile.state profile.district profile.locality").lean();

  if (!donor || !donor.profile?.phone) {
    throw new Error("This donor is no longer available.");
  }

  const request = await BloodContactRequestModel.create({
    requesterId: input.requesterId,
    donorId: input.donorId,
    bloodGroup: input.bloodGroup,
    hospital: input.hospital,
    unitsRequired: input.unitsRequired,
    state: input.state,
    district: input.district,
    locality: input.locality,
    urgency: input.urgency,
  });

  return { id: String(request._id) };
}

export async function getBloodContactRequest(id: string, requesterId: string) {
  await connectToDatabase();

  const request = await BloodContactRequestModel.findOne({
    _id: id,
    requesterId,
  }).lean();

  if (!request) return null;

  const donor = await UserModel.findOne({
    _id: request.donorId,
    role: "USER",
  }).select("name profile.phone profile.bloodGroup profile.state profile.district profile.locality").lean();

  if (!donor) return null;

  return {
    id: String(request._id),
    donor: {
      name: donor.name,
      phone: donor.profile?.phone ?? null,
      bloodGroup: donor.profile?.bloodGroup ?? request.bloodGroup,
      state: donor.profile?.state ?? "",
      district: donor.profile?.district ?? "",
      locality: donor.profile?.locality ?? "",
    },
    hospital: request.hospital,
    unitsRequired: request.unitsRequired,
    state: request.state,
    district: request.district,
    locality: request.locality,
    urgency: request.urgency,
    createdAt: request.createdAt,
  };
}

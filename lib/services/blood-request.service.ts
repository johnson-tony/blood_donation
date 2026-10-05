import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import BloodRequestModel, { type BloodRequestRecord } from "@/models/blood-request";
import type { BloodRequestInput } from "@/lib/validations/blood-request";
import type { BloodRequestDTO, BloodRequestListDTO } from "@/types/blood-request";

function toDTO(request: BloodRequestRecord): BloodRequestDTO {
  return {
    id: String(request._id),
    bloodGroup: request.bloodGroup,
    units: request.units,
    urgency: request.urgency,
    neededBy: request.neededBy.toISOString(),
    hospitalName: request.hospitalName,
    state: request.state,
    district: request.district,
    locality: request.locality,
    patientRelation: request.patientRelation,
    contactPhone: request.contactPhone,
    note: request.note ?? null,
    status: request.status,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  };
}

export async function createBloodRequest(
  requesterId: string,
  input: BloodRequestInput,
): Promise<BloodRequestDTO> {
  await connectToDatabase();

  const created = await BloodRequestModel.create({
    requesterId,
    bloodGroup: input.bloodGroup,
    units: input.units,
    urgency: input.urgency,
    neededBy: new Date(input.neededBy),
    hospitalName: input.hospitalName.trim(),
    state: input.state.trim(),
    district: input.district.trim(),
    locality: input.locality.trim(),
    patientRelation: input.patientRelation.trim(),
    contactPhone: input.contactPhone.trim(),
    note: input.note?.trim() || null,
    status: "open",
  });

  return toDTO(created.toObject() as BloodRequestRecord);
}

export async function listMyBloodRequests(
  requesterId: string,
  limit = 20,
): Promise<BloodRequestListDTO> {
  await connectToDatabase();

  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const [requests, total] = await Promise.all([
    BloodRequestModel.find({ requesterId })
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .lean<BloodRequestRecord[]>()
      .exec(),
    BloodRequestModel.countDocuments({ requesterId }).exec(),
  ]);

  return { requests: requests.map(toDTO), total };
}

export async function getBloodRequestForOwner(
  requesterId: string,
  requestId: string,
): Promise<BloodRequestDTO | null> {
  await connectToDatabase();

  const request = await BloodRequestModel.findOne({
    _id: requestId,
    requesterId,
  }).lean<BloodRequestRecord | null>().exec();

  return request ? toDTO(request) : null;
}

export async function cancelBloodRequest(
  requesterId: string,
  requestId: string,
): Promise<boolean> {
  await connectToDatabase();

  const result = await BloodRequestModel.updateOne(
    { _id: requestId, requesterId, status: "open" },
    { $set: { status: "cancelled" } },
  ).exec();

  return result.modifiedCount === 1;
}

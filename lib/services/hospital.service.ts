import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import HospitalModel, { type HospitalRecord } from "@/models/hospital";
import type { HospitalInput } from "@/lib/validations/hospital";
import type { HospitalDTO, HospitalFilters } from "@/types/hospital";

function toDTO(hospital: HospitalRecord): HospitalDTO {
  return {
    id: String(hospital._id),
    name: hospital.name,
    hospitalType: hospital.hospitalType,
    description: hospital.description,
    address: hospital.address,
    locality: hospital.locality,
    district: hospital.district,
    state: hospital.state,
    contactName: hospital.contactName,
    contactPhone: hospital.contactPhone,
    emergencyPhone: hospital.emergencyPhone,
    website: hospital.website ?? null,
    hasBloodBank: hospital.hasBloodBank,
    status: hospital.status,
    createdAt: hospital.createdAt.toISOString(),
    updatedAt: hospital.updatedAt.toISOString(),
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, (match) => `\\${match}`);
}

function textFilter(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? { $regex: escapeRegex(trimmed), $options: "i" } : undefined;
}

function toRecordInput(input: HospitalInput) {
  return {
    name: input.name,
    hospitalType: input.hospitalType,
    description: input.description,
    address: input.address,
    locality: input.locality,
    district: input.district,
    state: input.state,
    contactName: input.contactName,
    contactPhone: input.contactPhone,
    emergencyPhone: input.emergencyPhone,
    website: input.website?.trim() || null,
    hasBloodBank: input.hasBloodBank === "true",
    status: input.status,
  };
}

export async function listPublishedHospitals(filters: HospitalFilters = {}): Promise<HospitalDTO[]> {
  await connectToDatabase();
  const query: Record<string, unknown> = { status: "PUBLISHED" };
  const search = textFilter(filters.search);

  if (search) {
    query.$or = [
      { name: search },
      { hospitalType: search },
      { address: search },
      { locality: search },
      { district: search },
      { state: search },
    ];
  }

  if (filters.state?.trim()) query.state = textFilter(filters.state);
  if (filters.district?.trim()) query.district = textFilter(filters.district);
  if (filters.locality?.trim()) query.locality = textFilter(filters.locality);
  if (filters.bloodBank === "yes") query.hasBloodBank = true;
  if (filters.bloodBank === "no") query.hasBloodBank = false;

  const hospitals = await HospitalModel.find(query)
    .sort({ hasBloodBank: -1, name: 1 })
    .limit(100)
    .lean<HospitalRecord[]>()
    .exec();

  return hospitals.map(toDTO);
}

export async function listAllHospitals(): Promise<HospitalDTO[]> {
  await connectToDatabase();
  const hospitals = await HospitalModel.find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .lean<HospitalRecord[]>()
    .exec();

  return hospitals.map(toDTO);
}

export async function getHospitalById(id: string): Promise<HospitalDTO | null> {
  await connectToDatabase();
  const hospital = await HospitalModel.findById(id).lean<HospitalRecord | null>().exec();
  return hospital ? toDTO(hospital) : null;
}

export async function createHospital(createdBy: string, input: HospitalInput): Promise<HospitalDTO> {
  await connectToDatabase();
  const hospital = await HospitalModel.create({ ...toRecordInput(input), createdBy });
  return toDTO(hospital.toObject() as HospitalRecord);
}

export async function updateHospital(id: string, input: HospitalInput): Promise<HospitalDTO | null> {
  await connectToDatabase();
  const hospital = await HospitalModel.findByIdAndUpdate(
    id,
    toRecordInput(input),
    { new: true, runValidators: true },
  ).lean<HospitalRecord | null>().exec();

  return hospital ? toDTO(hospital) : null;
}

export async function deleteHospital(id: string): Promise<boolean> {
  await connectToDatabase();
  const result = await HospitalModel.deleteOne({ _id: id }).exec();
  return result.deletedCount === 1;
}

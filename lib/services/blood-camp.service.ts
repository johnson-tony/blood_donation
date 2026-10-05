import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import BloodCampModel, { type BloodCampRecord } from "@/models/blood-camp";
import type { BloodCampDTO, BloodCampFilters } from "@/types/blood-camp";

function toDTO(camp: BloodCampRecord): BloodCampDTO {
  return {
    id: String(camp._id), name: camp.name, organizer: camp.organizer,
    description: camp.description, date: camp.date.toISOString(),
    startTime: camp.startTime, endTime: camp.endTime, venue: camp.venue,
    locality: camp.locality, district: camp.district, state: camp.state,
    contactName: camp.contactName, contactPhone: camp.contactPhone,
    status: camp.status, createdAt: camp.createdAt.toISOString(),
    updatedAt: camp.updatedAt.toISOString(),
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
}

function textFilter(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? { $regex: escapeRegex(trimmed), $options: "i" } : undefined;
}

export async function listPublishedBloodCamps(filters: BloodCampFilters = {}): Promise<BloodCampDTO[]> {
  await connectToDatabase();
  const query: Record<string, unknown> = { status: "PUBLISHED" };
  const search = textFilter(filters.search);
  if (search) query.$or = [
    { name: search }, { organizer: search }, { venue: search },
    { locality: search }, { district: search }, { state: search },
  ];
  if (filters.state?.trim()) query.state = textFilter(filters.state);
  if (filters.district?.trim()) query.district = textFilter(filters.district);
  if (filters.locality?.trim()) query.locality = textFilter(filters.locality);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (filters.date === "past") query.date = { $lt: today };
  else if (filters.date !== "all") query.date = { $gte: today };

  const camps = await BloodCampModel.find(query)
    .sort({ date: 1, startTime: 1 }).limit(100)
    .lean<BloodCampRecord[]>().exec();
  return camps.map(toDTO);
}

export async function listAllBloodCamps(): Promise<BloodCampDTO[]> {
  await connectToDatabase();
  const camps = await BloodCampModel.find({})
    .sort({ date: -1, createdAt: -1 }).limit(200)
    .lean<BloodCampRecord[]>().exec();
  return camps.map(toDTO);
}

export async function getBloodCampById(id: string): Promise<BloodCampDTO | null> {
  await connectToDatabase();
  const camp = await BloodCampModel.findById(id).lean<BloodCampRecord | null>().exec();
  return camp ? toDTO(camp) : null;
}

type CampInput = {
  name: string; organizer: string; description: string; date: string;
  startTime: string; endTime: string; venue: string; locality: string;
  district: string; state: string; contactName: string; contactPhone: string;
  status: "DRAFT" | "PUBLISHED";
};

export async function createBloodCamp(createdBy: string, input: CampInput): Promise<BloodCampDTO> {
  await connectToDatabase();
  const camp = await BloodCampModel.create({
    ...input, date: new Date(input.date + "T00:00:00.000Z"), createdBy,
  });
  return toDTO(camp.toObject() as BloodCampRecord);
}

export async function updateBloodCamp(id: string, input: CampInput): Promise<BloodCampDTO | null> {
  await connectToDatabase();
  const camp = await BloodCampModel.findByIdAndUpdate(
    id, { ...input, date: new Date(input.date + "T00:00:00.000Z") },
    { new: true, runValidators: true },
  ).lean<BloodCampRecord | null>().exec();
  return camp ? toDTO(camp) : null;
}

export async function deleteBloodCamp(id: string): Promise<boolean> {
  await connectToDatabase();
  const result = await BloodCampModel.deleteOne({ _id: id }).exec();
  return result.deletedCount === 1;
}

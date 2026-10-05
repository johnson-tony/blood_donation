import type { BloodCampStatus } from "@/models/blood-camp";

export type BloodCampDTO = {
  id: string; name: string; organizer: string; description: string; date: string;
  startTime: string; endTime: string; venue: string; locality: string;
  district: string; state: string; contactName: string; contactPhone: string;
  status: BloodCampStatus; createdAt: string; updatedAt: string;
};

export type BloodCampFilters = {
  search?: string; state?: string; district?: string; locality?: string;
  date?: "upcoming" | "past" | "all";
};

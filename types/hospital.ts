import type { HospitalStatus } from "@/models/hospital";

export type HospitalDTO = {
  id: string;
  name: string;
  hospitalType: string;
  description: string;
  address: string;
  locality: string;
  district: string;
  state: string;
  contactName: string;
  contactPhone: string;
  emergencyPhone: string;
  website: string | null;
  hasBloodBank: boolean;
  status: HospitalStatus;
  createdAt: string;
  updatedAt: string;
};

export type HospitalFilters = {
  search?: string;
  state?: string;
  district?: string;
  locality?: string;
  bloodBank?: "yes" | "no" | "all";
};

import type { BloodGroup } from "@/types/user";
import type { RequestStatus, RequestUrgency } from "@/models/blood-request";

export type BloodRequestDTO = {
  id: string;
  bloodGroup: BloodGroup;
  units: number;
  urgency: RequestUrgency;
  neededBy: string;
  hospitalName: string;
  state: string;
  district: string;
  locality: string;
  patientRelation: string;
  contactPhone: string;
  note: string | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
};

export type BloodRequestListDTO = {
  requests: BloodRequestDTO[];
  total: number;
};

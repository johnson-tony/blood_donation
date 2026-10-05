import type { BloodGroup } from "@/types/user";
import type { MatchStatus } from "@/models/donor-match";

export type DonorMatchDTO = {
  id: string;
  donorId: string;
  donorName: string;
  donorImage: string | null;
  donorBloodGroup: BloodGroup;
  district: string | null;
  locality: string | null;
  status: MatchStatus;
  score: number;
  compatibility: "exact";
};

export type DonorOpportunityDTO = {
  id: string;
  requestId: string;
  bloodGroup: BloodGroup;
  units: number;
  urgency: "critical" | "urgent" | "standard";
  neededBy: string;
  hospitalName: string;
  state: string;
  district: string;
  locality: string;
  patientRelation: string;
  note: string | null;
  status: "open";
};

export type DonorMatchListDTO = {
  requestId: string;
  matches: DonorMatchDTO[];
};

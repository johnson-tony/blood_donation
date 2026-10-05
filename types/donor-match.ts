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

export type DonorMatchListDTO = {
  requestId: string;
  matches: DonorMatchDTO[];
};

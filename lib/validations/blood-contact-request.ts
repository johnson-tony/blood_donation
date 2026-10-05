import { z } from "zod";

import { BLOOD_GROUPS } from "@/types/user";

export const bloodContactRequestSchema = z.object({
  donorId: z.string().min(1),
  bloodGroup: z.enum(BLOOD_GROUPS),
  hospital: z.string().trim().min(2, "Enter the hospital or treatment centre.").max(160),
  unitsRequired: z.coerce.number().int().min(1).max(20),
  state: z.string().trim().min(2).max(80),
  district: z.string().trim().min(2).max(80),
  locality: z.string().trim().min(2).max(120),
  urgency: z.enum(["urgent", "today", "scheduled"]),
});

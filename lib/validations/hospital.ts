import { z } from "zod";

const phonePattern = /^[+\d][\d\s().-]{7,18}$/;

export const hospitalSchema = z.object({
  name: z.string().trim().min(3).max(160),
  hospitalType: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(1200),
  address: z.string().trim().min(5).max(240),
  locality: z.string().trim().min(2).max(120),
  district: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  contactName: z.string().trim().min(2).max(100),
  contactPhone: z.string().trim().regex(phonePattern, "Enter a valid contact number."),
  emergencyPhone: z.string().trim().regex(phonePattern, "Enter a valid emergency number."),
  website: z.string().trim().url("Enter a valid website URL.").max(240).optional().or(z.literal("")),
  hasBloodBank: z.enum(["true", "false"]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type HospitalInput = z.infer<typeof hospitalSchema>;

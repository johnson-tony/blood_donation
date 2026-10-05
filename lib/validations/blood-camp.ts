import { z } from "zod";

const phonePattern = /^[+\d][\d\s().-]{7,18}$/;

export const bloodCampSchema = z.object({
  name: z.string().trim().min(3).max(160),
  organizer: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(1200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date."),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid start time."),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid end time."),
  venue: z.string().trim().min(2).max(200),
  locality: z.string().trim().min(2).max(120),
  district: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  contactName: z.string().trim().min(2).max(100),
  contactPhone: z.string().trim().regex(phonePattern, "Enter a valid contact number."),
  status: z.enum(["DRAFT", "PUBLISHED"]),
}).refine((value) => value.endTime > value.startTime, {
  path: ["endTime"], message: "End time must be after start time.",
});

export type BloodCampInput = z.infer<typeof bloodCampSchema>;

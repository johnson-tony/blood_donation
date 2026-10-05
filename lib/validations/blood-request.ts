import { z } from "zod";
import { BLOOD_GROUPS } from "@/types/user";

const phone = z.string().trim().min(7).max(20).regex(/^\+?[0-9 ()-]+$/, "Enter a valid contact number.");
const text = (label: string, max: number) => z.string().trim().min(2, `Enter the ${label.toLowerCase()}.`).max(max);

export const bloodRequestSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS, { error: "Select the blood group needed." }),
  units: z.coerce.number().int().min(1, "At least 1 unit is required.").max(10, "Requests can be up to 10 units."),
  urgency: z.enum(["critical", "urgent", "standard"], { error: "Select the urgency." }),
  neededBy: z.string().min(1, "Select when blood is needed."),
  hospitalName: text("hospital name", 160),
  state: text("state", 80),
  district: text("district", 80),
  locality: text("area or locality", 120),
  patientRelation: text("patient relationship", 80),
  contactPhone: phone,
  note: z.string().trim().max(500, "Keep the note under 500 characters.").optional().or(z.literal("")),
}).superRefine((values, ctx) => {
  const needed = new Date(values.neededBy);
  if (Number.isNaN(needed.getTime())) {
    ctx.addIssue({ code: "custom", path: ["neededBy"], message: "Choose a valid date and time." });
    return;
  }
  if (needed.getTime() <= Date.now()) {
    ctx.addIssue({ code: "custom", path: ["neededBy"], message: "The required time must be in the future." });
  }
});

export type BloodRequestInput = z.infer<typeof bloodRequestSchema>;

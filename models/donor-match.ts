import { Schema, model, models, type Model, type Types } from "mongoose";
import type { BloodGroup } from "@/types/user";

export const MATCH_STATUSES = ["pending", "accepted", "declined", "withdrawn"] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export interface DonorMatchDocument {
  requestId: Types.ObjectId;
  donorId: Types.ObjectId;
  status: MatchStatus;
  compatibility: "exact";
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const donorMatchSchema = new Schema<DonorMatchDocument>(
  {
    requestId: { type: Schema.Types.ObjectId, ref: "BloodRequest", required: true, index: true },
    donorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: MATCH_STATUSES, default: "pending", index: true },
    compatibility: { type: String, enum: ["exact"], default: "exact" },
    score: { type: Number, required: true, min: 0, max: 1000 },
  },
  { timestamps: true },
);

donorMatchSchema.index({ requestId: 1, donorId: 1 }, { unique: true });
donorMatchSchema.index({ donorId: 1, status: 1, createdAt: -1 });
donorMatchSchema.index({ requestId: 1, status: 1, score: -1 });

export const DonorMatchModel: Model<DonorMatchDocument> =
  (models.DonorMatch as Model<DonorMatchDocument> | undefined) ??
  model<DonorMatchDocument>("DonorMatch", donorMatchSchema);

export default DonorMatchModel;

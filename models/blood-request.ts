import { Schema, model, models, type HydratedDocument, type Model, type Types } from "mongoose";
import { BLOOD_GROUPS, type BloodGroup } from "@/types/user";

export const REQUEST_URGENCIES = ["critical", "urgent", "standard"] as const;
export type RequestUrgency = (typeof REQUEST_URGENCIES)[number];

export const REQUEST_STATUSES = ["open", "fulfilled", "cancelled", "expired"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface BloodRequestDocument {
  requesterId: Types.ObjectId;
  bloodGroup: BloodGroup;
  units: number;
  urgency: RequestUrgency;
  neededBy: Date;
  hospitalName: string;
  state: string;
  district: string;
  locality: string;
  patientRelation: string;
  contactPhone: string;
  note: string | null;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type BloodRequest = HydratedDocument<BloodRequestDocument>;
export type BloodRequestRecord = BloodRequestDocument & { _id: Types.ObjectId };

const bloodRequestSchema = new Schema<BloodRequestDocument>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true, index: true },
    units: { type: Number, required: true, min: 1, max: 10 },
    urgency: { type: String, enum: REQUEST_URGENCIES, required: true, index: true },
    neededBy: { type: Date, required: true, index: true },
    hospitalName: { type: String, required: true, trim: true, maxlength: 160 },
    state: { type: String, required: true, trim: true, maxlength: 80, index: true },
    district: { type: String, required: true, trim: true, maxlength: 80, index: true },
    locality: { type: String, required: true, trim: true, maxlength: 120 },
    patientRelation: { type: String, required: true, trim: true, maxlength: 80 },
    contactPhone: { type: String, required: true, trim: true, maxlength: 20 },
    note: { type: String, trim: true, maxlength: 500, default: null },
    status: { type: String, enum: REQUEST_STATUSES, default: "open", index: true },
  },
  { timestamps: true, minimize: false },
);

bloodRequestSchema.index({ status: 1, bloodGroup: 1, urgency: 1, district: 1, neededBy: 1 });
bloodRequestSchema.index({ requesterId: 1, createdAt: -1 });

export const BloodRequestModel: Model<BloodRequestDocument> =
  (models.BloodRequest as Model<BloodRequestDocument> | undefined) ??
  model<BloodRequestDocument>("BloodRequest", bloodRequestSchema);

export default BloodRequestModel;

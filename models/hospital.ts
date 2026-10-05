import { Schema, model, models, type HydratedDocument, type Model, type Types } from "mongoose";

export type HospitalStatus = "DRAFT" | "PUBLISHED";

export interface HospitalDocument {
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
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type Hospital = HydratedDocument<HospitalDocument>;
export type HospitalRecord = HospitalDocument & { _id: Types.ObjectId };

const hospitalSchema = new Schema<HospitalDocument>({
  name: { type: String, required: true, trim: true, minlength: 3, maxlength: 160 },
  hospitalType: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, required: true, trim: true, maxlength: 1200 },
  address: { type: String, required: true, trim: true, maxlength: 240 },
  locality: { type: String, required: true, trim: true, maxlength: 120 },
  district: { type: String, required: true, trim: true, maxlength: 80 },
  state: { type: String, required: true, trim: true, maxlength: 80 },
  contactName: { type: String, required: true, trim: true, maxlength: 100 },
  contactPhone: { type: String, required: true, trim: true, maxlength: 20 },
  emergencyPhone: { type: String, required: true, trim: true, maxlength: 20 },
  website: { type: String, trim: true, maxlength: 240, default: null },
  hasBloodBank: { type: Boolean, default: false, index: true },
  status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "DRAFT", index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
}, { timestamps: true });

hospitalSchema.index({ status: 1, state: 1, district: 1, locality: 1 });
hospitalSchema.index({ status: 1, hasBloodBank: 1, state: 1 });

export const HospitalModel: Model<HospitalDocument> =
  (models.Hospital as Model<HospitalDocument> | undefined) ??
  model<HospitalDocument>("Hospital", hospitalSchema);

export default HospitalModel;

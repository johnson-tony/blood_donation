import { Schema, model, models, type Model, type Types } from "mongoose";

export type BloodContactRequestStatus = "CONTACTED";

export interface BloodContactRequestDocument {
  requesterId: Types.ObjectId;
  donorId: Types.ObjectId;
  bloodGroup: string;
  hospital: string;
  unitsRequired: number;
  state: string;
  district: string;
  locality: string;
  urgency: "urgent" | "today" | "scheduled";
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<BloodContactRequestDocument>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    donorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    bloodGroup: { type: String, required: true },
    hospital: { type: String, required: true, trim: true, maxlength: 160 },
    unitsRequired: { type: Number, required: true, min: 1, max: 20 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    district: { type: String, required: true, trim: true, maxlength: 80 },
    locality: { type: String, required: true, trim: true, maxlength: 120 },
    urgency: { type: String, enum: ["urgent", "today", "scheduled"], required: true },
  },
  { timestamps: true },
);

schema.index({ requesterId: 1, createdAt: -1 });

const BloodContactRequestModel: Model<BloodContactRequestDocument> =
  (models.BloodContactRequest as Model<BloodContactRequestDocument> | undefined) ??
  model<BloodContactRequestDocument>("BloodContactRequest", schema);

export default BloodContactRequestModel;

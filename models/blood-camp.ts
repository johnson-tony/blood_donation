import { Schema, model, models, type HydratedDocument, type Model, type Types } from "mongoose";

export type BloodCampStatus = "DRAFT" | "PUBLISHED";

export interface BloodCampDocument {
  name: string;
  organizer: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  venue: string;
  locality: string;
  district: string;
  state: string;
  contactName: string;
  contactPhone: string;
  status: BloodCampStatus;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type BloodCamp = HydratedDocument<BloodCampDocument>;
export type BloodCampRecord = BloodCampDocument & { _id: Types.ObjectId };

const bloodCampSchema = new Schema<BloodCampDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 160 },
    organizer: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    date: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true, maxlength: 200 },
    locality: { type: String, required: true, trim: true, maxlength: 120 },
    district: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    contactName: { type: String, required: true, trim: true, maxlength: 100 },
    contactPhone: { type: String, required: true, trim: true, maxlength: 20 },
    status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "DRAFT", index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

bloodCampSchema.index({ status: 1, date: 1 });
bloodCampSchema.index({ state: 1, district: 1, locality: 1, date: 1 });

export const BloodCampModel: Model<BloodCampDocument> =
  (models.BloodCamp as Model<BloodCampDocument> | undefined) ??
  model<BloodCampDocument>("BloodCamp", bloodCampSchema);

export default BloodCampModel;

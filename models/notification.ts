import { Schema, model, models, type Model, type Types } from "mongoose";

export type NotificationType =
  | "BLOOD_CONTACT_REQUEST"
  | "CONTACT_CREATED"
  | "SYSTEM";

export interface NotificationDocument {
  recipientId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<NotificationDocument>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["BLOOD_CONTACT_REQUEST", "CONTACT_CREATED", "SYSTEM"],
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 300 },
    href: { type: String, trim: true, maxlength: 240 },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

schema.index({ recipientId: 1, createdAt: -1 });
schema.index({ recipientId: 1, readAt: 1, createdAt: -1 });

const NotificationModel: Model<NotificationDocument> =
  (models.Notification as Model<NotificationDocument> | undefined) ??
  model<NotificationDocument>("Notification", schema);

export default NotificationModel;

import "server-only";

import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/db/connect";
import NotificationModel, { type NotificationType } from "@/models/notification";
import UserModel from "@/models/user";

export async function createNotification(input: {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
}) {
  await connectToDatabase();

  const notification = await NotificationModel.create({
    ...input,
    recipientId: new Types.ObjectId(input.recipientId),
  });

  return { id: String(notification._id) };
}

export async function createNotifications(
  inputs: Array<{
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    href?: string;
  }>,
) {
  if (!inputs.length) return;
  await connectToDatabase();

  await NotificationModel.insertMany(
    inputs.map((input) => ({
      ...input,
      recipientId: new Types.ObjectId(input.recipientId),
    })),
  );
}

export async function listNotifications(recipientId: string) {
  await connectToDatabase();

  const notifications = await NotificationModel.find({ recipientId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return notifications.map((notification) => ({
    id: String(notification._id),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    href: notification.href ?? null,
    readAt: notification.readAt ?? null,
    createdAt: notification.createdAt,
  }));
}

export async function getUnreadNotificationCount(recipientId: string) {
  await connectToDatabase();
  return NotificationModel.countDocuments({ recipientId, readAt: null });
}

export async function markNotificationRead(id: string, recipientId: string) {
  await connectToDatabase();
  await NotificationModel.updateOne(
    { _id: id, recipientId, readAt: null },
    { $set: { readAt: new Date() } },
  );
}

export async function markAllNotificationsRead(recipientId: string) {
  await connectToDatabase();
  await NotificationModel.updateMany(
    { recipientId, readAt: null },
    { $set: { readAt: new Date() } },
  );
}

export async function getAdminUserIds() {
  await connectToDatabase();
  const admins = await UserModel.find({ role: "ADMIN" }).select("_id").lean();
  return admins.map((admin) => String(admin._id));
}

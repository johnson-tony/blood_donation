import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import type { BloodGroup } from "@/types/user";
import { createNotifications, getAdminUserIds } from "@/lib/services/notification.service";
import BloodContactRequestModel from "@/models/blood-contact-request";
import UserModel from "@/models/user";

export async function createBloodContactRequest(input: {
  requesterId: string;
  donorId: string;
  bloodGroup: BloodGroup;
  hospital: string;
  unitsRequired: number;
  state: string;
  district: string;
  locality: string;
  urgency: "urgent" | "today" | "scheduled";
}) {
  await connectToDatabase();

  const [donor, requester] = await Promise.all([
    UserModel.findOne({
      _id: input.donorId,
      role: "USER",
      profileCompleted: true,
      "profile.availableToDonate": true,
      "profile.bloodGroup": input.bloodGroup,
    })
      .select("name profile.phone profile.bloodGroup profile.state profile.district profile.locality")
      .lean(),
    UserModel.findOne({ _id: input.requesterId, role: "USER" }).select("name").lean(),
  ]);

  if (!donor || !donor.profile?.phone) throw new Error("This donor is no longer available.");

  const request = await BloodContactRequestModel.create(input);
  const requestId = String(request._id);
  const adminIds = await getAdminUserIds();

  const recipients = new Map<string, {
    recipientId: string;
    type: "BLOOD_CONTACT_REQUEST" | "CONTACT_CREATED" | "SYSTEM";
    title: string;
    message: string;
    href?: string;
  }>();

  recipients.set(input.requesterId, {
    recipientId: input.requesterId,
    type: "CONTACT_CREATED",
    title: "Donor contact created",
    message: "Your " + input.bloodGroup + " blood request is connected to " + donor.name + ".",
    href: "/my-requests/" + requestId,
  });

  recipients.set(input.donorId, {
    recipientId: input.donorId,
    type: "BLOOD_CONTACT_REQUEST",
    title: "Someone needs your blood",
    message: (requester?.name ?? "A member") + " requested " + input.bloodGroup + " blood at " + input.hospital + ".",
    href: "/notifications",
  });

  for (const adminId of adminIds) {
    recipients.set(adminId, {
      recipientId: adminId,
      type: "BLOOD_CONTACT_REQUEST",
      title: "New blood contact request",
      message: (requester?.name ?? "A member") + " requested " + input.bloodGroup + " blood from " + donor.name + ".",
      href: "/admin/notifications",
    });
  }

  await createNotifications([...recipients.values()]);

  return { id: requestId };
}

export async function getBloodContactRequest(id: string, requesterId: string) {
  await connectToDatabase();
  const request = await BloodContactRequestModel.findOne({ _id: id, requesterId }).lean();
  if (!request) return null;

  const donor = await UserModel.findOne({ _id: request.donorId, role: "USER" })
    .select("name profile.phone profile.bloodGroup profile.state profile.district profile.locality").lean();
  if (!donor) return null;

  return {
    id: String(request._id),
    donor: {
      name: donor.name,
      phone: donor.profile?.phone ?? null,
      bloodGroup: donor.profile?.bloodGroup ?? request.bloodGroup,
      state: donor.profile?.state ?? "",
      district: donor.profile?.district ?? "",
      locality: donor.profile?.locality ?? "",
    },
    hospital: request.hospital,
    unitsRequired: request.unitsRequired,
    state: request.state,
    district: request.district,
    locality: request.locality,
    urgency: request.urgency,
    createdAt: request.createdAt,
  };
}

export async function listBloodContactRequests(requesterId: string) {
  await connectToDatabase();
  const requests = await BloodContactRequestModel.find({ requesterId }).sort({ createdAt: -1 }).lean();
  if (!requests.length) return [];

  const donorIds = requests.map((request) => request.donorId);
  const donors = await UserModel.find({ _id: { $in: donorIds }, role: "USER" })
    .select("name profile.phone profile.bloodGroup profile.state profile.district profile.locality").lean();
  const donorMap = new Map(donors.map((donor) => [String(donor._id), donor]));

  return requests.map((request) => {
    const donor = donorMap.get(String(request.donorId));
    return {
      id: String(request._id),
      donor: donor ? {
        name: donor.name,
        phone: donor.profile?.phone ?? null,
        bloodGroup: donor.profile?.bloodGroup ?? request.bloodGroup,
        state: donor.profile?.state ?? "",
        district: donor.profile?.district ?? "",
        locality: donor.profile?.locality ?? "",
      } : null,
      bloodGroup: request.bloodGroup,
      hospital: request.hospital,
      unitsRequired: request.unitsRequired,
      state: request.state,
      district: request.district,
      locality: request.locality,
      urgency: request.urgency,
      createdAt: request.createdAt,
    };
  });
}

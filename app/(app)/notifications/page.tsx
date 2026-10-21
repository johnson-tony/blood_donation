import type { Metadata } from "next";

import { NotificationList } from "@/components/notifications/notification-list";
import { requireUser } from "@/lib/auth/guards";
import { listNotifications } from "@/lib/services/notification.service";

export const metadata: Metadata = {
  title: "Notifications — Blood Donation",
};

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = await listNotifications(user.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-700">
          Inbox & Alerts
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Notifications
        </h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Important updates about your blood requests, donor inquiries, and activity.
        </p>
      </div>

      <NotificationList notifications={notifications} />
    </div>
  );
}

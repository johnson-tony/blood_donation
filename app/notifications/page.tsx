import type { Metadata } from "next";

import { NotificationList } from "@/components/notifications/notification-list";
import { requireUser } from "@/lib/auth/guards";
import { listNotifications } from "@/lib/services/notification.service";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = await listNotifications(user.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-700">Updates</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">Notifications</h1>
        <p className="mt-3 text-sm leading-6 text-ink-secondary">Important updates about your blood requests and donor activity.</p>
      </div>
      <NotificationList notifications={notifications} />
    </div>
  );
}

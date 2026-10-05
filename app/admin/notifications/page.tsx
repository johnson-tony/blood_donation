import type { Metadata } from "next";

import { NotificationList } from "@/components/notifications/notification-list";
import { requireAdminUser } from "@/lib/auth/guards";
import { listNotifications } from "@/lib/services/notification.service";

export const metadata: Metadata = { title: "Notifications | Admin" };

export default async function AdminNotificationsPage() {
  const user = await requireAdminUser();
  const notifications = await listNotifications(user.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-700">Platform activity</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">Notifications</h1>
        <p className="mt-3 text-sm leading-6 text-ink-secondary">Operational activity and blood contact requests across the platform.</p>
      </div>
      <NotificationList notifications={notifications} />
    </div>
  );
}

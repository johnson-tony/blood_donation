import Link from "next/link";

import { markAllNotificationsReadAction, markNotificationReadAction } from "@/app/actions/notifications";
import { buttonClasses } from "@/components/ui/button";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  href: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export function NotificationList({ notifications }: { notifications: NotificationItem[] }) {
  const unread = notifications.filter((item) => !item.readAt).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ink-muted">
          {unread === 0 ? "You are all caught up." : unread + " unread notification" + (unread === 1 ? "" : "s")}
        </p>
        {unread > 0 ? (
          <form action={markAllNotificationsReadAction}>
            <button type="submit" className="text-sm font-semibold text-mahogany-700 hover:text-mahogany-900">
              Mark all as read
            </button>
          </form>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-line-strong bg-surface p-10 text-center shadow-card">
          <p className="text-sm font-semibold">No notifications yet.</p>
          <p className="mt-2 text-sm text-ink-muted">Important activity will appear here.</p>
        </section>
      ) : (
        <section className="divide-y divide-line overflow-hidden rounded-[28px] border border-line bg-surface shadow-card">
          {notifications.map((notification) => {
            const content = (
              <div className="flex gap-4 p-5 sm:p-6">
                <span className={"mt-1.5 size-2.5 shrink-0 rounded-full " + (notification.readAt ? "bg-line-strong" : "bg-mahogany-600")} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className={"text-sm font-semibold " + (notification.readAt ? "text-ink-secondary" : "text-ink")}>{notification.title}</h2>
                    <time dateTime={notification.createdAt.toISOString()} className="text-xs text-ink-subtle">
                      {notification.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </time>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-ink-secondary">{notification.message}</p>
                </div>
              </div>
            );

            return (
              <div key={notification.id} className={!notification.readAt ? "bg-mahogany-50/40" : undefined}>
                {notification.href ? (
                  <form action={markNotificationReadAction}>
                    <input type="hidden" name="id" value={notification.id} />
                    <button type="submit" className="block w-full text-left">
                      {content}
                    </button>
                  </form>
                ) : (
                  <form action={markNotificationReadAction}>
                    <input type="hidden" name="id" value={notification.id} />
                    <button type="submit" className="block w-full text-left">
                      {content}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

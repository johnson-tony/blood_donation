"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/actions/notifications";
import {
  IconBell,
  IconCheck,
  IconChevronRight,
  IconDroplet,
  IconHeart,
  IconShield,
} from "@/components/layout/icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export type NotificationItem = {
  id: string;
  type?: string;
  title: string;
  message: string;
  href: string | null;
  readAt: Date | null;
  createdAt: Date;
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function NotificationList({ notifications }: { notifications: NotificationItem[] }) {
  const [filter, setFilter] = useState<"all" | "unread" | "requests">("all");

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.readAt).length,
    [notifications],
  );

  const requestCount = useMemo(
    () =>
      notifications.filter(
        (item) => item.type === "BLOOD_CONTACT_REQUEST" || item.type === "CONTACT_CREATED",
      ).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case "unread":
        return notifications.filter((item) => !item.readAt);
      case "requests":
        return notifications.filter(
          (item) => item.type === "BLOOD_CONTACT_REQUEST" || item.type === "CONTACT_CREATED",
        );
      case "all":
      default:
        return notifications;
    }
  }, [notifications, filter]);

  return (
    <div className="space-y-6">
      {/* Filters and Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 font-bold transition",
              filter === "all"
                ? "bg-mahogany-600 text-white shadow-sm"
                : "border border-line bg-surface text-ink-secondary hover:border-mahogany-300 hover:text-ink",
            )}
          >
            <span>All</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.2 text-[0.65rem]",
                filter === "all" ? "bg-white/20 text-white" : "bg-surface-muted text-ink-subtle",
              )}
            >
              {notifications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 font-bold transition",
              filter === "unread"
                ? "bg-mahogany-600 text-white shadow-sm"
                : "border border-line bg-surface text-ink-secondary hover:border-mahogany-300 hover:text-ink",
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[0.65rem]",
                  filter === "unread"
                    ? "bg-white/25 text-white"
                    : "bg-mahogany-100 text-mahogany-700 font-black",
                )}
              >
                {unreadCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setFilter("requests")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 font-bold transition",
              filter === "requests"
                ? "bg-mahogany-600 text-white shadow-sm"
                : "border border-line bg-surface text-ink-secondary hover:border-mahogany-300 hover:text-ink",
            )}
          >
            <span>Blood Requests</span>
            {requestCount > 0 ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[0.65rem]",
                  filter === "requests"
                    ? "bg-white/20 text-white"
                    : "bg-surface-muted text-ink-subtle",
                )}
              >
                {requestCount}
              </span>
            ) : null}
          </button>
        </div>

        {/* Mark All as Read button */}
        {unreadCount > 0 ? (
          <form action={markAllNotificationsReadAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-mahogany-700 hover:text-mahogany-900 transition"
            >
              <IconCheck className="size-4" />
              <span>Mark all as read</span>
            </button>
          </form>
        ) : (
          <span className="text-xs font-medium text-ink-muted flex items-center gap-1.5">
            <IconCheck className="size-3.5 text-emerald-600" /> All caught up
          </span>
        )}
      </div>

      {/* Notifications List or Empty State */}
      {filteredNotifications.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-line-strong bg-surface/60 p-12 text-center shadow-card">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-600">
            {filter === "unread" ? (
              <IconCheck className="size-7 text-emerald-600" />
            ) : filter === "requests" ? (
              <IconDroplet className="size-7 text-mahogany-600" />
            ) : (
              <IconBell className="size-7 text-mahogany-600" />
            )}
          </div>
          <h3 className="mt-4 text-base font-bold text-ink">
            {filter === "unread"
              ? "No unread notifications"
              : filter === "requests"
              ? "No blood contact requests"
              : "No notifications yet"}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            {filter === "unread"
              ? "You've read all your notifications. We will alert you when new activity occurs."
              : filter === "requests"
              ? "Requests from individuals seeking donor contacts will appear here."
              : "Important updates about your blood requests and donor responses will show up here."}
          </p>
          {filter !== "all" ? (
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-5 text-xs font-bold text-mahogany-600 hover:text-mahogany-800 transition"
            >
              View all notifications →
            </button>
          ) : null}
        </section>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const isUnread = !notification.readAt;
            const isBloodRequest = notification.type === "BLOOD_CONTACT_REQUEST";
            const isContactCreated = notification.type === "CONTACT_CREATED";

            return (
              <article
                key={notification.id}
                className={cn(
                  "group relative rounded-[24px] border p-5 transition-all duration-200 shadow-card hover:shadow-raised",
                  isUnread
                    ? "border-mahogany-200/90 bg-mahogany-50/30"
                    : "border-line bg-surface hover:border-mahogany-200",
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Visual Type Icon */}
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-2xl transition",
                      isBloodRequest
                        ? "bg-mahogany-100 text-mahogany-700"
                        : isContactCreated
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-surface-muted text-ink-secondary",
                    )}
                  >
                    {isBloodRequest ? (
                      <IconDroplet className="size-5 fill-mahogany-600 text-mahogany-600" />
                    ) : isContactCreated ? (
                      <IconHeart className="size-5 fill-emerald-600 text-emerald-600" />
                    ) : (
                      <IconShield className="size-5" />
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isBloodRequest ? (
                          <Badge tone="urgent" className="text-[0.65rem] px-2 py-0.5">
                            Blood Request
                          </Badge>
                        ) : isContactCreated ? (
                          <Badge tone="brand" className="text-[0.65rem] px-2 py-0.5">
                            Donor Connected
                          </Badge>
                        ) : (
                          <Badge tone="neutral" className="text-[0.65rem] px-2 py-0.5">
                            Notice
                          </Badge>
                        )}

                        {isUnread ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-mahogany-600/10 px-2 py-0.5 text-[0.65rem] font-bold text-mahogany-700">
                            <span className="size-1.5 rounded-full bg-mahogany-600 animate-pulse" />
                            New
                          </span>
                        ) : null}
                      </div>

                      <time
                        dateTime={new Date(notification.createdAt).toISOString()}
                        className="text-xs font-medium text-ink-muted"
                      >
                        {formatRelativeTime(notification.createdAt)}
                      </time>
                    </div>

                    <h2
                      className={cn(
                        "mt-1.5 text-sm font-bold tracking-tight",
                        isUnread ? "text-ink" : "text-ink-secondary",
                      )}
                    >
                      {notification.title}
                    </h2>

                    <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-6 text-ink-secondary">
                      {notification.message}
                    </p>

                    {/* Card Actions */}
                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-3">
                      {notification.href &&
                      notification.href !== "/notifications" &&
                      notification.href !== "/admin/notifications" ? (
                        <Link
                          href={notification.href}
                          className="inline-flex items-center gap-1 text-xs font-bold text-mahogany-600 hover:text-mahogany-800 transition"
                        >
                          <span>View Details</span>
                          <IconChevronRight className="size-3.5" />
                        </Link>
                      ) : (
                        <span className="text-[0.7rem] text-ink-subtle">
                          {isBloodRequest ? "Direct Member Inquiry" : "System Notification"}
                        </span>
                      )}

                      {isUnread ? (
                        <form action={markNotificationReadAction}>
                          <input type="hidden" name="id" value={notification.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink-secondary transition hover:border-mahogany-300 hover:text-mahogany-700"
                          >
                            <IconCheck className="size-3 text-mahogany-600" />
                            <span>Mark read</span>
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-ink-subtle flex items-center gap-1">
                          <IconCheck className="size-3 text-emerald-600" /> Read
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

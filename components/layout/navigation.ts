import type { ComponentType } from "react";

import {
  IconBell,
  IconBuilding,
  IconCalendar,
  IconClipboard,
  IconDashboard,
  IconDroplet,
  IconHeart,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
} from "@/components/layout/icons";

export type NavIcon = ComponentType<{ className?: string }>;

export type NavItem = {
  label: string;
  /** Absent while the route has not been built yet. */
  href?: string;
  icon: NavIcon;
  /**
   * `false` renders a clearly labelled, non-interactive placeholder so the
   * shell shows its intended shape without linking to pages that do not exist.
   */
  ready: boolean;
};

export const userNavigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: IconDashboard, ready: true },
  { label: "Profile", href: "/profile", icon: IconUser, ready: true },
  { label: "Find Blood", icon: IconSearch, ready: false },
  { label: "Request blood", href: "/requests/new", icon: IconHeart, ready: true },
  { label: "Donate Blood", icon: IconDroplet, ready: false },
  { label: "My requests", href: "/requests", icon: IconClipboard, ready: true },
  { label: "Notifications", icon: IconBell, ready: false },
];

export const adminNavigation: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: IconDashboard, ready: true },
  { label: "Users", href: "/admin/users", icon: IconUsers, ready: true },
  { label: "Donors", icon: IconDroplet, ready: false },
  { label: "Blood Requests", icon: IconHeart, ready: false },
  { label: "Blood Camps", icon: IconCalendar, ready: false },
  { label: "Hospitals", icon: IconBuilding, ready: false },
  { label: "Notifications", icon: IconBell, ready: false },
  { label: "Settings", icon: IconSettings, ready: false },
];

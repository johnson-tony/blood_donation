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

export type NavItem = {
  label: string;
  href: string | null;
  icon: typeof IconDashboard;
  ready: boolean;
};

export const userNavigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: IconDashboard, ready: true },
  { label: "Find Blood", href: null, icon: IconSearch, ready: false },
  { label: "Need Blood", href: null, icon: IconHeart, ready: false },
  { label: "Donate Blood", href: null, icon: IconDroplet, ready: false },
  { label: "My Requests", href: null, icon: IconClipboard, ready: false },
  { label: "Notifications", href: "/notifications", icon: IconBell, ready: true },
  { label: "Profile", href: "/profile", icon: IconUser, ready: true },
];

export const adminNavigation: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: IconDashboard, ready: true },
  { label: "Users", href: "/admin/users", icon: IconUsers, ready: true },
  { label: "Donors", href: null, icon: IconDroplet, ready: false },
  { label: "Blood Requests", href: null, icon: IconHeart, ready: false },
  { label: "Blood Camps", href: null, icon: IconCalendar, ready: false },
  { label: "Hospitals", href: null, icon: IconBuilding, ready: false },
  { label: "Notifications", href: "/admin/notifications", icon: IconBell, ready: true },
  { label: "Settings", href: null, icon: IconSettings, ready: false },
];

import {
  IconBell,
  IconBuilding,
  IconCalendar,
  IconClipboard,
  IconDashboard,
  IconDroplet,
  IconHeart,
  IconSearch,
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
  { label: "Find Blood", href: "/find-blood", icon: IconSearch, ready: true },
  { label: "Need Blood", href: "/need-blood", icon: IconHeart, ready: true },
  { label: "Donate Blood", href: "/donate-blood", icon: IconDroplet, ready: true },
  { label: "Hospitals", href: "/hospitals", icon: IconBuilding, ready: true },
  { label: "Blood Camps", href: "/blood-camps", icon: IconCalendar, ready: true },
  { label: "My Requests", href: "/my-requests", icon: IconClipboard, ready: true },
  { label: "Notifications", href: "/notifications", icon: IconBell, ready: true },
  { label: "Profile", href: "/profile", icon: IconUser, ready: true },
];

export const adminNavigation: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: IconDashboard, ready: true },
  { label: "Users", href: "/admin/users", icon: IconUsers, ready: true },
  { label: "Donors", href: "/admin/donors", icon: IconDroplet, ready: true },
  { label: "Blood Requests", href: "/admin/blood-requests", icon: IconHeart, ready: true },
  { label: "Blood Camps", href: "/admin/blood-camps", icon: IconCalendar, ready: true },
  { label: "Hospitals", href: "/admin/hospitals", icon: IconBuilding, ready: true },
  { label: "Notifications", href: "/admin/notifications", icon: IconBell, ready: true },
];

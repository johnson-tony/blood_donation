export type NavIconName =
  | "dashboard"
  | "find-blood"
  | "need-blood"
  | "donate-blood"
  | "hospitals"
  | "blood-camps"
  | "my-requests"
  | "notifications"
  | "profile"
  | "users"
  | "donors"
  | "blood-requests"
  | "settings";

export type NavItem = {
  label: string;
  href?: string | null;
  icon: NavIconName;
  ready: boolean;
};

export const userNavigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard", ready: true },
  { label: "Find Blood", href: "/find-blood", icon: "find-blood", ready: true },
  { label: "Need Blood", href: "/requests/new", icon: "need-blood", ready: true },
  { label: "Donate Blood", href: "/donate-blood", icon: "donate-blood", ready: true },
  { label: "Hospitals", href: "/hospitals", icon: "hospitals", ready: true },
  { label: "Blood Camps", href: "/blood-camps", icon: "blood-camps", ready: true },
  { label: "My Requests", href: "/requests", icon: "my-requests", ready: true },
  { label: "Notifications", href: "/notifications", icon: "notifications", ready: true },
  { label: "Profile", href: "/profile", icon: "profile", ready: true },
];

export const adminNavigation: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard", ready: true },
  { label: "Users", href: "/admin/users", icon: "users", ready: true },
  { label: "Donors", href: "/admin/donors", icon: "donors", ready: true },
  { label: "Blood Requests", href: "/admin/blood-requests", icon: "blood-requests", ready: true },
  { label: "Blood Camps", href: "/admin/blood-camps", icon: "blood-camps", ready: true },
  { label: "Hospitals", href: "/admin/hospitals", icon: "hospitals", ready: true },
  { label: "Notifications", href: "/admin/notifications", icon: "notifications", ready: true },
  { label: "Settings", icon: "settings", ready: false },
];

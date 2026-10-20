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
import type { NavIconName } from "@/components/layout/navigation";

const ICON_MAP: Record<NavIconName, ComponentType<{ className?: string }>> = {
  dashboard: IconDashboard,
  "find-blood": IconSearch,
  "need-blood": IconHeart,
  "donate-blood": IconDroplet,
  hospitals: IconBuilding,
  "blood-camps": IconCalendar,
  "my-requests": IconClipboard,
  notifications: IconBell,
  profile: IconUser,
  users: IconUsers,
  donors: IconDroplet,
  "blood-requests": IconHeart,
  settings: IconSettings,
};

export function NavIcon({
  name,
  className,
}: {
  name: NavIconName;
  className?: string;
}) {
  const IconComponent = ICON_MAP[name] ?? IconDashboard;
  return <IconComponent className={className} />;
}

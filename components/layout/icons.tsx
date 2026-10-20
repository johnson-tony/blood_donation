import { cn } from "@/lib/utils/cn";

const BASE =
  "size-5 shrink-0 fill-none stroke-current stroke-[1.6] stroke-linecap=round stroke-linejoin=round";

type IconProps = { className?: string };

export function IconDashboard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.75" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.75" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.75" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.75" />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <circle cx="12" cy="8" r="3.75" />
      <path d="M4.75 20.25a7.5 7.5 0 0 1 14.5 0" />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <circle cx="11" cy="11" r="6.25" />
      <path d="m15.6 15.6 4.15 4.15" />
    </svg>
  );
}

export function IconHeart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M12 20s-7.25-4.4-7.25-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.25 2.4C19.25 15.6 12 20 12 20Z" />
    </svg>
  );
}

export function IconDroplet({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M12 3.5s5.5 5.9 5.5 9.4A5.5 5.5 0 0 1 12 18.4a5.5 5.5 0 0 1-5.5-5.5C6.5 9.4 12 3.5 12 3.5Z" />
    </svg>
  );
}

export function IconClipboard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M9 4.75h6M9.5 3.5h5a1 1 0 0 1 1 1v1.75h-7V4.5a1 1 0 0 1 1-1Z" />
      <path d="M15 5.75h2.5a1.5 1.5 0 0 1 1.5 1.5v11.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4.5 18.75V7.25A1.5 1.5 0 0 1 6 5.75h2.5" />
      <path d="M8.5 11.5h7M8.5 15h4.5" />
    </svg>
  );
}

export function IconBell({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M6.75 10.25a5.25 5.25 0 0 1 10.5 0c0 4 1.5 5.25 1.5 5.25h-13.5s1.5-1.25 1.5-5.25Z" />
      <path d="M10.25 18.25a1.9 1.9 0 0 0 3.5 0" />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <circle cx="9.5" cy="8.5" r="3.25" />
      <path d="M3.5 19.5a6 6 0 0 1 12 0" />
      <path d="M16 5.6a3.25 3.25 0 0 1 0 5.8M17.5 14.4a6 6 0 0 1 3 5.1" />
    </svg>
  );
}

export function IconBuilding({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M4.5 20.5V5.75A1.25 1.25 0 0 1 5.75 4.5h6.5A1.25 1.25 0 0 1 13.5 5.75V20.5" />
      <path d="M13.5 10h4.75A1.25 1.25 0 0 1 19.5 11.25V20.5M3 20.5h18" />
      <path d="M7.5 8h3M7.5 11.5h3M7.5 15h3" />
    </svg>
  );
}

export function IconCalendar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <rect x="3.75" y="5.25" width="16.5" height="15" rx="2" />
      <path d="M3.75 9.75h16.5M8.25 3.75v3M15.75 3.75v3" />
    </svg>
  );
}

export function IconSettings({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <circle cx="12" cy="12" r="2.9" />
      <path d="M12 3.75v2.1M12 18.15v2.1M20.25 12h-2.1M5.85 12h-2.1M17.77 6.23l-1.49 1.49M7.72 16.28l-1.49 1.49M17.77 17.77l-1.49-1.49M7.72 7.72 6.23 6.23" />
    </svg>
  );
}

export function IconLogout({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M14.5 4.75h2.25A2.5 2.5 0 0 1 19.25 7.25v9.5a2.5 2.5 0 0 1-2.5 2.5H14.5" />
      <path d="M10.5 8.25 14.25 12l-3.75 3.75M14.25 12H4.75" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="m5.5 12.5 4 4 9-9.5" />
    </svg>
  );
}

export function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M12 3.25 5 5.75v5.5c0 4.2 2.85 7.6 7 9.5 4.15-1.9 7-5.3 7-9.5V5.75L12 3.25Z" />
      <path d="m9.25 12 2 2 3.75-4" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 1.75" />
    </svg>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function IconPulse({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export const IconActivity = IconPulse;

export function IconStethoscope({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M4.5 4.5v5a4.5 4.5 0 0 0 9 0v-5M7.5 4.5h-3M13.5 4.5h-3" />
      <path d="M9 14v2a4 4 0 0 0 8 0v-3" />
      <circle cx="17" cy="10" r="2" />
    </svg>
  );
}

export function IconMapPin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn(BASE, className)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

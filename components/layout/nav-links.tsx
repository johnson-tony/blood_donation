"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/components/layout/navigation";
import { cn } from "@/lib/utils/cn";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({
  items,
  onNavigate,
  className,
}: {
  items: NavItem[];
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <ul className={cn("space-y-0.5", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const labelId = item.ready ? undefined : `${item.label.replace(/\s+/g, "-").toLowerCase()}-pending`;

        if (!item.href) {
          return (
            <li key={item.label}>
              <span
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-subtle"
              >
                <Icon className="size-[1.125rem] opacity-60" />
                <span className="flex-1 truncate">{item.label}</span>
                <span
                  id={labelId}
                  className="rounded-full bg-surface-muted px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-ink-subtle"
                >
                  Soon
                </span>
              </span>
            </li>
          );
        }

        const active = isActive(pathname, item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                active
                  ? "bg-mahogany-50 font-medium text-mahogany-800"
                  : "text-ink-secondary hover:bg-surface-muted hover:text-ink",
              )}
            >
              <Icon
                className={cn(
                  "size-[1.125rem]",
                  active ? "text-mahogany-600" : "text-ink-subtle group-hover:text-ink-muted",
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {active ? (
                <span aria-hidden="true" className="size-1.5 rounded-full bg-mahogany-600" />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

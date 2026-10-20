"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/components/layout/navigation";
import { cn } from "@/lib/utils/cn";

export function MobileBottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const validItems = items.filter((item) => item.ready && item.href).slice(0, 4);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-surface/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden shadow-overlay"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {validItems.map((item) => {
          const Icon = item.icon;
          const href = item.href ?? "/";
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(`${href}/`);

          const label = item.label === "Dashboard" ? "Home" : item.label;

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl py-1.5 transition-all duration-200 select-none",
                active ? "text-mahogany-700 font-bold" : "text-ink-muted hover:text-ink font-medium",
              )}
            >
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl transition-all duration-200",
                  active
                    ? "bg-mahogany-600 text-white shadow-glow scale-105"
                    : "bg-transparent text-current",
                )}
              >
                <Icon className="size-4.5" />
              </div>
              <span className="text-[0.68rem] tracking-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

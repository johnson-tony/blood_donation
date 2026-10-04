"use client";

import { useEffect, useId, useRef, useState } from "react";

import { BrandLogo } from "@/components/layout/brand";
import { IconClose, IconMenu } from "@/components/layout/icons";
import { NavLinks } from "@/components/layout/nav-links";
import type { NavItem } from "@/components/layout/navigation";
import { SignOutButton, UserIdentity } from "@/components/layout/user-identity";
import type { SessionUserDTO } from "@/types/user";

export function MobileHeader({
  user,
  items,
  homeHref,
  areaLabel,
}: {
  user: SessionUserDTO;
  items: NavItem[];
  homeHref: string;
  areaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <BrandLogo href={homeHref} />

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-line-strong text-ink-secondary transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
        </button>
      </div>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className="border-t border-line bg-surface"
      >
        <div className="border-b border-line px-4 py-3">
          <UserIdentity user={user} areaLabel={areaLabel} />
        </div>
        <nav aria-label="Main" className="p-2">
          <NavLinks items={items} onNavigate={() => setOpen(false)} />
        </nav>
        <div className="border-t border-line p-2">
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";
import {
  IconBell,
  IconClose,
  IconHeart,
  IconMenu,
  IconPlus,
  IconSearch,
  IconShield,
  IconUser,
} from "@/components/layout/icons";
import { NavLinks } from "@/components/layout/nav-links";
import type { NavItem } from "@/components/layout/navigation";
import { SignOutButton } from "@/components/layout/user-identity";
import { Avatar } from "@/components/ui/avatar";
import { firstNameOf } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { SessionUserDTO } from "@/types/user";

export function Navbar({
  user,
  items,
  homeHref,
  areaLabel,
  unreadCount = 0,
}: {
  user: SessionUserDTO;
  items: NavItem[];
  homeHref: string;
  areaLabel: string;
  unreadCount?: number;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const notificationsHref = user.role === "ADMIN" ? "/admin/notifications" : "/notifications";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        {/* Left Side: Brand on mobile, Community/Search badge on desktop */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <BrandLogo href={homeHref} />
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1 text-xs font-semibold text-ink-secondary">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>BloodLink Network</span>
              <span className="text-ink-subtle">•</span>
              <span className="font-bold text-mahogany-600">Active Donors</span>
            </div>

            <Link
              href="/find-blood"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-secondary transition hover:border-mahogany-200 hover:text-mahogany-700"
            >
              <IconSearch className="size-3.5 text-ink-muted" />
              <span>Search Donors</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Quick Action + Notifications + Profile Icon (Right aligned) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action Button */}
          {user.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-mahogany-200 bg-mahogany-50 px-3.5 py-1.5 text-xs font-bold text-mahogany-700 transition hover:bg-mahogany-100"
            >
              Admin Portal
            </Link>
          ) : (
            <Link
              href="/requests/new"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-mahogany-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-mahogany-700"
            >
              <IconPlus className="size-3.5" />
              <span>Need Blood</span>
            </Link>
          )}

          {/* Notification Bell */}
          <Link
            href={notificationsHref}
            className="relative flex size-10 items-center justify-center rounded-xl border border-line bg-surface text-ink-secondary transition hover:border-mahogany-300 hover:text-mahogany-600 shadow-2xs"
            aria-label="Notifications"
          >
            <IconBell className="size-5" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-mahogany-600 px-1 text-[0.625rem] font-black text-white shadow-glow">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </Link>

          {/* Profile Icon on the Right */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-full border border-line bg-surface p-1 pr-2.5 transition hover:border-mahogany-300 hover:shadow-2xs focus:outline-none focus:ring-2 focus:ring-mahogany-500/20"
            >
              <Avatar name={user.name} src={user.profileImage} size="sm" />
              <span className="hidden sm:inline-block max-w-[110px] truncate text-xs font-bold text-ink">
                {firstNameOf(user.name)}
              </span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={cn(
                  "size-4 text-ink-subtle transition-transform duration-200",
                  profileOpen && "rotate-180",
                )}
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-line bg-surface p-2.5 shadow-raised z-50 animate-in fade-in-0 zoom-in-95"
              >
                {/* User Info Header */}
                <div className="flex items-center gap-3 border-b border-line px-2 pb-3 pt-1">
                  <Avatar name={user.name} src={user.profileImage} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-muted">{user.email}</p>
                    <span className="mt-1 inline-block rounded-md bg-mahogany-50 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-mahogany-700">
                      {areaLabel}
                    </span>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="py-2 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink-secondary hover:bg-surface-muted hover:text-ink transition"
                  >
                    <IconUser className="size-4 text-mahogany-600" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/requests"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink-secondary hover:bg-surface-muted hover:text-ink transition"
                  >
                    <IconHeart className="size-4 text-mahogany-600" />
                    <span>My Blood Requests</span>
                  </Link>

                  <Link
                    href={notificationsHref}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-ink-secondary hover:bg-surface-muted hover:text-ink transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <IconBell className="size-4 text-mahogany-600" />
                      <span>Notifications</span>
                    </div>
                    {unreadCount > 0 ? (
                      <span className="rounded-full bg-mahogany-600 px-1.5 py-0.2 text-[0.65rem] font-bold text-white">
                        {unreadCount}
                      </span>
                    ) : null}
                  </Link>

                  {user.role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink-secondary hover:bg-surface-muted hover:text-ink transition"
                    >
                      <IconShield className="size-4 text-mahogany-600" />
                      <span>Admin Portal</span>
                    </Link>
                  ) : null}
                </div>

                {/* Sign Out Action */}
                <div className="border-t border-line pt-2">
                  <SignOutButton className="text-xs" />
                </div>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Hamburger (Small screens only) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-line text-ink-secondary transition hover:bg-surface-muted hover:text-ink lg:hidden"
          >
            {mobileMenuOpen ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer when hamburger is toggled */}
      {mobileMenuOpen ? (
        <div className="border-b border-line bg-surface p-3 lg:hidden shadow-card">
          <nav aria-label="Mobile Navigation Drawer">
            <NavLinks items={items} onNavigate={() => setMobileMenuOpen(false)} />
          </nav>
        </div>
      ) : null}
    </>
  );
}

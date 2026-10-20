import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  IconActivity,
  IconBell,
  IconChevronRight,
  IconClock,
  IconDroplet,
  IconHeart,
  IconStethoscope,
} from "@/components/layout/icons";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUserRecord } from "@/lib/auth/guards";
import { toProfileDTO } from "@/lib/services/user.service";
import { firstNameOf, greetingFor } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Dashboard — Blood Donation" };

export default async function DashboardPage() {
  const record = await getCurrentUserRecord();
  const profile = toProfileDTO(record);

  if (record.role !== "ADMIN" && !profile.profileCompleted) {
    redirect("/onboarding");
  }

  const available = profile.availableToDonate === true;

  return (
    <div className="space-y-8">
      {/* 1. Header (Greeting + User Profile + Notification Bell) */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mahogany-600 font-bold text-white shadow-glow">
            {profile.name ? profile.name.slice(0, 2).toUpperCase() : "BD"}
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-muted">
              {greetingFor()},
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {firstNameOf(profile.name)}
            </h1>
          </div>
        </div>

        <Link
          href="/notifications"
          className="relative flex size-11 items-center justify-center rounded-2xl border border-line bg-surface text-ink-secondary shadow-card transition hover:border-mahogany-300 hover:text-mahogany-600"
          aria-label="View notifications"
        >
          <IconBell className="size-5" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-mahogany-600 animate-pulse" />
        </Link>
      </header>

      {/* 2. Category Filter Chips (Like CardioLife Middle Screen) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="cursor-pointer rounded-full bg-mahogany-600 px-4 py-1.5 font-bold text-white shadow-sm">
          Overview
        </span>
        <Link
          href="/requests"
          className="rounded-full border border-line bg-surface px-4 py-1.5 font-semibold text-ink-secondary transition hover:border-mahogany-300 hover:text-mahogany-700"
        >
          My Requests
        </Link>
        <Link
          href="/find-blood"
          className="rounded-full border border-line bg-surface px-4 py-1.5 font-semibold text-ink-secondary transition hover:border-mahogany-300 hover:text-mahogany-700"
        >
          Find Donors
        </Link>
        <Link
          href="/blood-camps"
          className="rounded-full border border-line bg-surface px-4 py-1.5 font-semibold text-ink-secondary transition hover:border-mahogany-300 hover:text-mahogany-700"
        >
          Blood Camps
        </Link>
        <Link
          href="/hospitals"
          className="rounded-full border border-line bg-surface px-4 py-1.5 font-semibold text-ink-secondary transition hover:border-mahogany-300 hover:text-mahogany-700"
        >
          Hospitals
        </Link>
      </div>

      {/* 3. Featured Crimson Hero Card (CardioLife Hero Red Card Style) */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-mahogany-600 via-mahogany-700 to-mahogany-800 p-6 text-white shadow-glow sm:p-7">
        {/* Glow & geometry decorations */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 size-44 rounded-full bg-black/15 blur-lg" />

        <div className="relative">
          {/* Card Top Pill & Live Indicator */}
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <IconDroplet className="size-3.5 fill-white" />
              Donor Status
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <span
                className={`size-2 rounded-full ${
                  available ? "bg-emerald-400 animate-pulse" : "bg-white/40"
                }`}
              />
              {available ? "Active & Available" : "Hidden / Inactive"}
            </span>
          </div>

          {/* Blood Group & Location Details */}
          <div className="mt-6 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">Your Blood Group</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-5xl font-black tracking-tight">{profile.bloodGroup ?? "—"}</span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
                  Universal Compatible
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">Registered Locality</p>
              <p className="mt-1 max-w-48 text-sm font-bold text-white">
                {profile.locality ? `${profile.locality}, ${profile.district}` : "Location not set"}
              </p>
            </div>
          </div>

          {/* Card Action Row */}
          <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
            <p className="text-xs text-white/85">
              {available
                ? "You are visible to compatible donor requests nearby."
                : "Your profile is saved, but you are currently paused from matches."}
            </p>
            <Link
              href="/profile"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-mahogany-700 shadow-sm transition hover:scale-105 active:scale-95"
              aria-label="Edit donor profile"
            >
              <IconChevronRight className="size-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Action & Service Cards (CardioLife List Cards) */}
      <section aria-labelledby="service-actions" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 id="service-actions" className="text-lg font-bold tracking-tight text-ink">
            Quick Actions
          </h2>
          <span className="text-xs font-semibold text-mahogany-700">Need urgent help?</span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {/* Card A: Request Emergency Blood */}
          <Link
            href="/requests/new"
            className="group flex items-center justify-between rounded-[24px] border border-mahogany-200/80 bg-mahogany-50/60 p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-mahogany-300 hover:shadow-raised"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mahogany-600 text-white shadow-glow">
                <IconHeart className="size-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink">I Need Blood</h3>
                  <Badge tone="urgent" className="text-[0.65rem] px-2 py-0.5">Urgent</Badge>
                </div>
                <p className="mt-0.5 text-xs text-ink-muted">Create a verified request with hospital details.</p>
              </div>
            </div>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-mahogany-700 shadow-sm transition group-hover:bg-mahogany-600 group-hover:text-white">
              <IconChevronRight className="size-4" />
            </div>
          </Link>

          {/* Card B: Find Nearby Donors */}
          <Link
            href="/find-blood"
            className="group flex items-center justify-between rounded-[24px] border border-line bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-mahogany-200 hover:shadow-raised"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-600">
                <IconDroplet className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">Find Donors</h3>
                <p className="mt-0.5 text-xs text-ink-muted">Search willing voluntary donors in your district.</p>
              </div>
            </div>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-ink-secondary transition group-hover:bg-mahogany-600 group-hover:text-white">
              <IconChevronRight className="size-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Right Screen-Inspired Consultation & Donation Journey Tracker */}
      <section className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-7">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-mahogany-600">
              Donation Readiness
            </span>
            <h2 className="mt-1 text-lg font-bold text-ink">Your Lifesaving Impact</h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Profile Verified
          </span>
        </div>

        {/* Visit / Donation Types (Like CardioLife Visit Type Selector) */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Donation Options</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-2xl border border-mahogany-200/90 bg-mahogany-50/40 p-4">
              <div>
                <h3 className="text-sm font-bold text-ink">Whole Blood Donation</h3>
                <p className="mt-0.5 text-xs text-ink-muted">Standard 450ml donation • 10-15 min</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-mahogany-700 shadow-sm">
                Primary
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-line bg-surface-muted/40 p-4">
              <div>
                <h3 className="text-sm font-bold text-ink">Platelet Apheresis</h3>
                <p className="mt-0.5 text-xs text-ink-muted">Specialized donor center • 45-60 min</p>
              </div>
              <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink-secondary shadow-sm">
                Optional
              </span>
            </div>
          </div>
        </div>

        {/* What to Expect 4-Grid (Like Right Screen of CardioLife) */}
        <div className="mt-6 border-t border-line pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">What to Expect</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex flex-col items-center rounded-2xl bg-surface-muted/60 p-3 text-center">
              <div className="flex size-9 items-center justify-center rounded-xl bg-mahogany-50 text-mahogany-600">
                <IconStethoscope className="size-4.5" />
              </div>
              <span className="mt-2 text-xs font-bold text-ink">Health Check</span>
              <span className="text-[0.68rem] text-ink-muted">BP & Pulse</span>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-surface-muted/60 p-3 text-center">
              <div className="flex size-9 items-center justify-center rounded-xl bg-mahogany-50 text-mahogany-600">
                <IconActivity className="size-4.5" />
              </div>
              <span className="mt-2 text-xs font-bold text-ink">Hemoglobin</span>
              <span className="text-[0.68rem] text-ink-muted">Quick finger prick</span>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-surface-muted/60 p-3 text-center">
              <div className="flex size-9 items-center justify-center rounded-xl bg-mahogany-50 text-mahogany-600">
                <IconClock className="size-4.5" />
              </div>
              <span className="mt-2 text-xs font-bold text-ink">15 Mins</span>
              <span className="text-[0.68rem] text-ink-muted">Gentle donation</span>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-surface-muted/60 p-3 text-center">
              <div className="flex size-9 items-center justify-center rounded-xl bg-mahogany-50 text-mahogany-600">
                <IconHeart className="size-4.5 fill-mahogany-600" />
              </div>
              <span className="mt-2 text-xs font-bold text-ink">Save 3 Lives</span>
              <span className="text-[0.68rem] text-ink-muted">Community hero</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-mahogany-50 to-mahogany-100/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mahogany-600 text-white">
              <IconHeart className="size-4 fill-white" />
            </span>
            <p className="text-xs font-medium text-mahogany-900">
              Caring for your community, every drop of the way.
            </p>
          </div>
          <Link
            href="/profile"
            className={buttonClasses({
              variant: "primary",
              size: "sm",
              shape: "pill",
              className: "shadow-glow text-xs px-4 w-auto self-start sm:self-auto",
            })}
          >
            Review Profile →
          </Link>
        </div>
      </section>

      {record.role === "ADMIN" ? (
        <div className="flex justify-end pt-2">
          <Link
            href="/admin"
            className={buttonClasses({
              variant: "ghost",
              size: "sm",
              shape: "pill",
              className: "w-auto text-xs font-semibold text-ink-muted hover:text-ink",
            })}
          >
            Open Admin Portal →
          </Link>
        </div>
      ) : null}
    </div>
  );
}

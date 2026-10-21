import { BrandLogo } from "@/components/layout/brand";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { NavLinks } from "@/components/layout/nav-links";
import type { NavItem } from "@/components/layout/navigation";
import type { SessionUserDTO } from "@/types/user";

/**
 * The signed-in application shell: a persistent sidebar on large screens and a
 * unified top navbar across desktop and mobile. Profile icon is placed on the
 * top navbar right side, keeping the sidebar focused solely on navigation.
 */
export function AppShell({
  user,
  items,
  homeHref,
  areaLabel,
  unreadCount = 0,
  children,
}: {
  user: SessionUserDTO;
  items: NavItem[];
  homeHref: string;
  areaLabel: string;
  unreadCount?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[17rem_minmax(0,1fr)]">
      <a
        href="#main-content"
        className="sr-only-focusable absolute left-4 top-4 z-50 rounded-lg bg-mahogany-600 px-4 py-2 text-sm font-medium text-white"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar: Brand Logo + NavLinks only (No profile in sidebar) */}
      <aside className="hidden border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="border-b border-line px-5 py-4">
          <BrandLogo href={homeHref} />
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
          <NavLinks items={items} />
        </nav>
      </aside>

      {/* Main Content Area with Top Navbar */}
      <div className="flex min-h-dvh flex-col">
        <Navbar
          user={user}
          items={items}
          homeHref={homeHref}
          areaLabel={areaLabel}
          unreadCount={unreadCount}
        />

        <main id="main-content" className="flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pb-12 sm:pt-8 lg:px-10 lg:pb-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>

        <MobileBottomNav items={items} />
      </div>
    </div>
  );
}

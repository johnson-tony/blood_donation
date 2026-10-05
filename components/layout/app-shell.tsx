import { BrandLogo } from "@/components/layout/brand";
import { MobileHeader } from "@/components/layout/mobile-header";
import { NavLinks } from "@/components/layout/nav-links";
import type { NavItem } from "@/components/layout/navigation";
import { SignOutButton, UserIdentity } from "@/components/layout/user-identity";
import type { SessionUserDTO } from "@/types/user";

/**
 * The signed-in application shell: a persistent sidebar on large screens and a
 * disclosure menu on small ones. Rendered separately for the member area and
 * the admin area so the two never share navigation state.
 */
export function AppShell({
  user,
  items,
  homeHref,
  areaLabel,
  children,
}: {
  user: SessionUserDTO;
  items: NavItem[];
  homeHref: string;
  areaLabel: string;
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

      <aside className="hidden border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="border-b border-line px-5 py-4">
          <BrandLogo href={homeHref} />
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
          <NavLinks items={items} />
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <UserIdentity
            user={user}
            areaLabel={areaLabel}
            className="mb-1 rounded-lg p-2"
          />
          <SignOutButton />
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <MobileHeader
          user={user}
          items={items}
          homeHref={homeHref}
          areaLabel={areaLabel}
        />

        <main id="main-content" className="flex-1 px-4 pb-24 pt-5 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pb-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>

        <nav aria-label="Primary mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-xl grid-cols-3 gap-1">
            {items.filter((item) => item.ready && item.href).slice(0, 3).map((item) => {
              const Icon = item.icon;
              return <a key={item.href} href={item.href} className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[0.68rem] font-semibold text-ink-secondary active:bg-mahogany-50"><Icon className="size-5" /><span>{item.label === "Dashboard" ? "Home" : item.label}</span></a>;
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

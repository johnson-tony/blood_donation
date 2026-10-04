import { signOutAction } from "@/app/actions/auth";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconLogout } from "@/components/layout/icons";
import type { SessionUserDTO } from "@/types/user";
import { cn } from "@/lib/utils/cn";

export function UserIdentity({
  user,
  areaLabel,
  className,
}: {
  user: SessionUserDTO;
  areaLabel: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar name={user.name} src={user.profileImage} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{user.name}</p>
        <p className="truncate text-xs text-ink-muted">{user.email}</p>
      </div>
      {user.role === "ADMIN" ? (
        <Badge tone="brand" className="shrink-0">
          {areaLabel}
        </Badge>
      ) : null}
    </div>
  );
}

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-secondary",
          "transition-colors duration-150 hover:bg-surface-muted hover:text-ink",
          className,
        )}
      >
        <IconLogout className="size-[1.125rem] text-ink-subtle" />
        Sign out
      </button>
    </form>
  );
}

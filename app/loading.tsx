export default function Loading() {
  return (
    <div
      className="flex min-h-dvh items-center justify-center px-6 py-16"
      role="status"
      aria-live="polite"
    >
      <span className="flex items-center gap-2.5 text-sm text-ink-muted">
        <span className="size-4 animate-spin rounded-full border-2 border-line-strong border-t-mahogany-600" />
        Loading…
      </span>
    </div>
  );
}
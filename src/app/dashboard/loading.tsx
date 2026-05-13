export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-4 rounded-2xl border border-brand-border bg-white p-6">
      <div className="h-6 w-40 rounded bg-brand-muted" />
      <div className="h-4 w-full max-w-xl rounded bg-brand-muted" />
      <div className="h-4 w-full max-w-lg rounded bg-brand-muted" />
      <div className="h-32 w-full rounded-xl bg-brand-muted/60" />
    </div>
  );
}

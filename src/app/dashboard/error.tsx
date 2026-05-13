"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-red-950">
      <h2 className="text-lg font-bold">Something went wrong</h2>
      <p className="mt-2 text-sm opacity-90">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-900 hover:bg-red-100"
      >
        Try again
      </button>
    </div>
  );
}

/**
 * Lightweight analytics hooks. Wire to Plausible, PostHog, Segment, etc. in production.
 * No-op by default to avoid console noise in production builds.
 */
export type TelemetryEvent =
  | { name: "page_view"; path: string }
  | { name: "apply_click"; opportunityId: string; channel: "internal" | "email" | "external" }
  | { name: "external_apply_click"; opportunityId: string }
  | { name: "save_opportunity"; opportunityId: string; saved: boolean }
  | { name: "listing_impression"; opportunityId: string };

export function trackEvent(event: TelemetryEvent): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[telemetry]", event.name, event);
  }
  // Example: send to internal API
  // void fetch("/api/telemetry", { method: "POST", body: JSON.stringify(event), keepalive: true });
}

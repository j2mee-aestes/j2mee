/**
 * Privacy-minimized analytics event stubs.
 * Do not send exact coordinates, raw search text, or user memos.
 */

export type AnalyticsEventName =
  | "map_category_selected"
  | "fishing_spot_viewed"
  | "schedule_created"
  | "activity_completed"
  | "language_changed"
  | "plogging_route_viewed";

export function trackEvent(
  name: AnalyticsEventName,
  props?: Record<string, string | number | boolean>,
) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, props);
  }
  // Hook for future provider (Plausible/GA/etc.) — keep no-op until configured.
}

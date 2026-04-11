/**
 * Google Analytics 4 helpers.
 * Use only in client components (browser).
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID)
    return;
  window.gtag("event", eventName, params);
}

/** Track CTA clicks (e.g. "Back to Blog", "GitHub", "Read more") */
export function trackCtaClick(label: string, location?: string): void {
  trackEvent("cta_click", {
    cta_label: label,
    ...(location && { cta_location: location }),
  });
}

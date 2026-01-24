export const GA_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID || "";

type GtagEventParams = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function event({ action, category, label, value }: GtagEventParams) {
  if (typeof window === "undefined" || !GA_ID || !window.gtag) {
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}


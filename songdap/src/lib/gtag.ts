export const GA_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID || "";

/**
 * GA4 표준 이벤트 + 표준 파라미터 중심 설계
 * - 필요 시 custom params(category/action/label)를 extras로 붙일 수 있음
 * - 개인정보(PII)는 절대 전송하지 않음
 */

type GAItem = { item_id: string };

export type GAEvent =
  | { event: "login"; method: "kakao" }
  | { event: "sign_up"; method: "kakao" }
  | { event: "logout" }
  | { event: "view_item_list"; item_list_name: "album_list"; items: GAItem[] }
  | { event: "view_item"; items: GAItem[] }
  | { event: "select_item"; items: GAItem[] }
  | { event: "add_to_cart"; items: GAItem[] }
  | { event: "search"; search_term: string }
  | { event: "select_content"; content_type: string; item_id: string }
  | { event: "page_view"; page_path?: string; page_location?: string; page_title?: string }
  | { event: "scroll"; percent_scrolled: 25 | 50 | 75 | 90 }
  // Custom events
  | { event: "login_failed"; error_code?: string }
  | { event: "create_album"; item_id: string }
  | { event: "share_album"; item_id: string }
  | { event: "delete_album"; item_id: string }
  | { event: "play"; item_id: string; duration: number }
  | { event: "play_complete"; item_id: string; duration: number }
  | { event: "update_profile"; field: string }
  | { event: "upload_image"; file_size_kb: number }
  | { event: "upload_song_image"; file_size_kb: number }
  | { event: "withdraw"; reason?: string };

export type GAEventExtras = {
  category?: "authentication" | "album" | "song" | "profile" | "navigation" | "engagement";
  action?: string;
  label?: string;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Google Analytics 이벤트 추적 함수
 * 
 * @param params - GA 이벤트 파라미터
 * @example
 * ```typescript
 * trackEvent({
 *   category: 'authentication',
 *   action: 'signup',
 *   label: 'onboarding',
 *   value: 1
 * });
 * ```
 */
export function trackEvent(payload: GAEvent, extras?: GAEventExtras) {
  if (typeof window === "undefined" || !GA_ID || !window.gtag) {
    return;
  }

  const { event, ...params } = payload;
  window.gtag("event", event, {
    ...params,
    ...extras,
  });
}

/**
 * @deprecated 이 함수는 하위 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 trackEvent를 사용하세요.
 */
export function event({ action, category, label, value }: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}) {
  if (typeof window === "undefined" || !GA_ID || !window.gtag) {
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}


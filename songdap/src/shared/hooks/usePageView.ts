import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/gtag";

/**
 * 페이지 조회 GA 이벤트 추적 훅
 * 각 페이지 컴포넌트에서 사용하여 page_view 이벤트를 자동으로 추적합니다.
 */
export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackEvent(
        { event: "page_view", page_path: pathname },
        { category: "navigation", action: "page_view", label: pathname }
      );
    }
  }, [pathname]);
}


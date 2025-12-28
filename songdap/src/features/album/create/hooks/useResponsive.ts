"use client";

import { useState, useEffect, useRef } from "react";

/**
 * 반응형 디자인을 위한 커스텀 훅
 * 화면 크기, 방향, 뷰포트 크기를 자동으로 추적하고 CSS 변수로 제공
 */
export function useResponsive() {
  // 서버와 클라이언트에서 동일한 초기값 사용 (hydration 오류 방지)
  const [dimensions, setDimensions] = useState({
    width: 768,
    height: 1024,
    isPortrait: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({
        width,
        height,
        isPortrait: height > width,
      });

      // CSS 변수 업데이트
      document.documentElement.style.setProperty("--viewport-width", `${width}px`);
      document.documentElement.style.setProperty("--viewport-height", `${height}px`);
      document.documentElement.style.setProperty("--viewport-aspect", `${width / height}`);
    };

    // 초기 설정
    updateDimensions();

    // ResizeObserver로 뷰포트 변경 감지
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(document.documentElement);

    // window resize 이벤트 (fallback)
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("orientationchange", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
    };
  }, []);

  return {
    dimensions,
    containerRef,
    isMobile: dimensions.width < 768,
    isTablet: dimensions.width >= 768 && dimensions.width < 1024,
    isDesktop: dimensions.width >= 1024,
  };
}



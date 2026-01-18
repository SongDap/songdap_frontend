/**
 * 라우트 경로 상수 관리
 * 모든 라우트 경로를 여기서 중앙 관리합니다.
 */

export const ROUTES = {
  // 홈
  HOME: "/",

  // OAuth
  OAUTH: {
    KAKAO_CALLBACK: "/oauth/callback/kakao",
  },
} as const;

/**
 * 라우트 타입 정의
 */
export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

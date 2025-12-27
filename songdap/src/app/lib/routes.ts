/**
 * 라우트 경로 상수 관리
 * 모든 라우트 경로를 여기서 중앙 관리합니다.
 */

export const ROUTES = {
  // 홈
  HOME: "/",

  // 앨범
  ALBUM: {
    BASE: "/album",
    CREATE: "/album/create",
    LIST: "/album/list",
    DETAIL: (id: string | number) => `/album/${id}`,
    EDIT: (id: string | number) => `/album/${id}/edit`,
  },
} as const;

/**
 * 라우트 타입 정의
 */
export type RoutePath = typeof ROUTES[keyof typeof ROUTES];








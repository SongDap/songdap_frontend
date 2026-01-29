/**
 * API 엔드포인트 상수 관리
 * 모든 API 엔드포인트를 여기서 중앙 관리합니다.
 */

export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    KAKAO_LOGIN: "/api/v1/auth/login/kakao",
    REISSUE: "/api/v1/auth/reissue",
    LOGOUT: "/api/v1/auth/logout",
  },

  // 사용자
  USER: {
    ME: "/api/v1/users/me",
    UPDATE: "/api/v1/users/me",
    WITHDRAW: "/api/v1/users",
  },

  // 앨범
  ALBUM: {
    BASE: "/api/v1/albums",
    DETAIL: (albumUuid: string) => `/api/v1/albums/${albumUuid}`,
    ADD_MUSIC: (albumUuid: string) => `/api/v1/albums/${albumUuid}/musics`,
  },

  // 노래(뮤직)
  MUSIC: {
    DETAIL: (musicUuid: string) => `/api/v1/musics/${musicUuid}`,
  },
} as const;

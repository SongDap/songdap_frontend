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
    ME: "/api/v1/users/me", // GET /api/v1/users/me
    UPDATE_ME: "/api/v1/users/me", // PATCH /api/v1/users/me
    WITHDRAW: "/api/v1/users", // DELETE /api/v1/users
  },

  // 앨범
  ALBUM: {
    BASE: "/api/v1/albums",
    LIST: "/api/v1/albums", // GET /api/v1/albums
    CREATE: "/api/v1/albums", // POST /api/v1/albums
    DETAIL: (albumUuid: string) => `/api/v1/albums/${albumUuid}`, // GET /api/v1/albums/{albumUuid}
    DELETE: (albumUuid: string) => `/api/v1/albums/${albumUuid}`, // DELETE /api/v1/albums/{albumUuid}
    UPDATE_VISIBILITY: (albumUuid: string) => `/api/v1/albums/${albumUuid}/visibility`, // PATCH /api/v1/albums/{albumUuid}/visibility
  },

  // 앨범의 노래
  MUSIC: {
    BASE: (albumUuid: string) => `/api/v1/albums/${albumUuid}/musics`,
    LIST: (albumUuid: string) => `/api/v1/albums/${albumUuid}/musics`, // GET /api/v1/albums/{albumUuid}/musics
    ADD: (albumUuid: string) => `/api/v1/albums/${albumUuid}/musics`, // POST /api/v1/albums/{albumUuid}/musics
    DETAIL: (musicUuid: string) => `/api/v1/musics/${musicUuid}`, // GET /api/v1/musics/{musicUuid}
    DELETE: (musicUuid: string) => `/api/v1/musics/${musicUuid}`, // DELETE /api/v1/musics/{musicUuid}
  },
} as const;

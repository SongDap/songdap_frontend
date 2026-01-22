/**
 * Access Token 메모리 관리
 * Access Token은 메모리에만 저장 (보안 강화)
 * Refresh Token은 HttpOnly Cookie로 자동 관리됨
 */

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

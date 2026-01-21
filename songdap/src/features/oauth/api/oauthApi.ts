import { apiClient } from "@/shared/api";
import type { AuthResponse } from "../model/types";

type KakaoLoginRequest = {
  authorizationCode: string;
  redirectUri?: string;
};

/**
 * 카카오 OAuth 인가코드(code)를 백엔드로 전달해 로그인 처리합니다.
 *
 * - 엔드포인트: POST /api/v1/auth/login/kakao
 * - Body: { authorizationCode: string }
 * - 백엔드가 쿠키로 토큰을 설정하므로 withCredentials 필수
 */
export async function loginWithKakao(code: string) {
  const exchangePath =
    process.env.NEXT_PUBLIC_OAUTH_KAKAO_EXCHANGE_PATH ||
    "/api/v1/auth/login/kakao";
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const payload: KakaoLoginRequest = { authorizationCode: code, redirectUri };

  const res = await apiClient.post<AuthResponse>(exchangePath, payload, {
    withCredentials: true,
  });
  return res.data;
}
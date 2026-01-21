import { apiClient } from "@/shared/api";
import type { AuthResponse } from "../model/types";

type KakaoLoginRequest = {
  authorizationCode: string;
  redirectUri?: string;
};

/**
 * 백엔드 카카오 로그인 응답 형식
 */
type KakaoLoginResponse = {
  userId: number;
  nickname: string;
  profileImage?: string;
  newMember: boolean;
};

export async function loginWithKakao(code: string): Promise<AuthResponse & { newMember?: boolean }> {
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";
  const exchangePath =
    process.env.NEXT_PUBLIC_OAUTH_KAKAO_EXCHANGE_PATH ||
    "/api/v1/auth/login/kakao";
  
  // localhost 환경에서만 사용하도록 강제
  let redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost && !redirectUri?.includes('localhost')) {
      redirectUri = 'http://localhost:3000/oauth/kakao/callback';
      if (DEBUG_OAUTH) {
        console.warn('[OAUTH][KAKAO] localhost 환경 감지, redirectUri를 localhost로 강제 설정');
      }
    }
  }
  
  const payload: KakaoLoginRequest = { authorizationCode: code, redirectUri };

  if (DEBUG_OAUTH) {
    console.groupCollapsed("[OAUTH][KAKAO][API] POST 교환 요청");
    console.log("exchangePath:", exchangePath);
    console.log("redirectUri:", redirectUri);
    console.log("authorizationCode(head):", code.slice(0, 8) + "...");
    console.log("현재 호스트:", typeof window !== 'undefined' ? window.location.hostname : '(server)');
    console.log("baseURL:", apiClient.defaults.baseURL || '(설정 안 됨)');
    console.log("예상 전체 URL:", `${apiClient.defaults.baseURL || ''}${exchangePath}`);
    console.groupEnd();
  }

  const res = await apiClient.post<KakaoLoginResponse>(exchangePath, payload, {
    withCredentials: true,
  });

  const backendData = res.data;
  
  if (DEBUG_OAUTH) {
    console.log("[OAUTH][KAKAO][API] 백엔드 응답 수신:", backendData);
  }

  // 백엔드 응답을 AuthResponse 형식으로 변환
  const authResponse: AuthResponse & { newMember?: boolean } = {
    accessToken: "", // 쿠키 기반이므로 토큰은 빈 문자열
    user: {
      id: backendData.userId,
      nickname: backendData.nickname,
      profileImage: backendData.profileImage,
    },
    newMember: backendData.newMember,
  };

  if (DEBUG_OAUTH) {
    console.log("[OAUTH][KAKAO][API] 변환된 AuthResponse:", authResponse);
  }

  return authResponse;
}
import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { AuthResponse } from "../model/types";

type KakaoLoginRequest = {
  authorizationCode: string;
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
    API_ENDPOINTS.AUTH.KAKAO_LOGIN;
  
  const payload: KakaoLoginRequest = { authorizationCode: code };

  if (DEBUG_OAUTH) {
    console.groupCollapsed("[OAUTH][KAKAO][API] POST 교환 요청");
    console.log("exchangePath:", exchangePath);
    console.log("authorizationCode(head):", code.slice(0, 8) + "...");
    console.log("요청 Body:", payload);
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
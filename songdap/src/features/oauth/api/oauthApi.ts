import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { AuthResponse } from "../model/types";

/**
 * 백엔드 API 공통 응답 래퍼 타입
 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

type KakaoLoginRequest = {
  authorizationCode: string;
};

/**
 * 백엔드 카카오 로그인 응답 data 필드 형식
 * Access Token과 Refresh Token은 HttpOnly Cookie로 자동 설정됨
 */
type KakaoLoginResponseData = {
  userId: number;
  nickname: string;
  profileImage?: string;
  newMember: boolean;
};

/**
 * ApiResponse에서 data 필드 추출 유틸리티
 */
function extractDataFromResponse<T>(responseData: any): T | null {
  // 경우 1: { code, message, data } 구조
  if (responseData && typeof responseData === 'object' && 'data' in responseData) {
    return responseData.data as T;
  }
  // 경우 2: 바로 데이터 구조 (레거시 호환)
  if (responseData && typeof responseData === 'object') {
    return responseData as T;
  }
  return null;
}

export async function loginWithKakao(code: string): Promise<AuthResponse & { newMember?: boolean }> {
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";
  const exchangePath =
    process.env.NEXT_PUBLIC_OAUTH_KAKAO_EXCHANGE_PATH ||
    "/api/v1/auth/login/kakao";
  
  // 백엔드는 redirectUri를 받지 않으므로 authorizationCode만 전송
  const payload: KakaoLoginRequest = { authorizationCode: code };

  if (DEBUG_OAUTH) {
    console.groupCollapsed("[OAUTH][KAKAO][API] POST 교환 요청");
    console.log("exchangePath:", exchangePath);
    console.log("authorizationCode(head):", code.slice(0, 8) + "...");
    console.log("baseURL:", process.env.NEXT_PUBLIC_API_URL || '(설정 안 됨)');
    console.log("예상 전체 URL:", `${process.env.NEXT_PUBLIC_API_URL || ''}${exchangePath}`);
    console.groupEnd();
  }

  const res = await apiClient.post<ApiResponse<KakaoLoginResponseData>>(exchangePath, payload, {
    withCredentials: true,
  });

  // ApiResponse에서 data 필드 추출
  const responseData = extractDataFromResponse<KakaoLoginResponseData>(res.data);
  
  if (!responseData) {
    throw new Error("카카오 로그인 응답 구조를 파싱할 수 없습니다.");
  }
  
  if (DEBUG_OAUTH) {
    console.log("[OAUTH][KAKAO][API] 백엔드 응답 수신:", res.data);
    console.log("[OAUTH][KAKAO][API] 추출된 데이터:", responseData);
    console.log("[OAUTH][KAKAO][API] Access Token과 Refresh Token이 HttpOnly Cookie로 자동 설정됨");
  }

  // Access Token과 Refresh Token은 HttpOnly Cookie로 자동 설정됨
  // 프론트엔드에서는 메모리에 저장할 필요 없음

  // 백엔드 응답을 AuthResponse 형식으로 변환
  const authResponse: AuthResponse & { newMember?: boolean } = {
    accessToken: "", // 쿠키 기반이므로 빈 문자열 (실제 토큰은 쿠키에 있음)
    user: {
      id: responseData.userId,
      nickname: responseData.nickname,
      profileImage: responseData.profileImage,
    },
    newMember: responseData.newMember,
  };

  if (DEBUG_OAUTH) {
    console.log("[OAUTH][KAKAO][API] 변환된 AuthResponse:", authResponse);
  }

  return authResponse;
}

/**
 * 로그아웃 (서버 쿠키/Redis Refresh Token 정리)
 * - 실패해도 프론트 상태 정리는 진행 가능하므로 에러는 호출부에서 무시 가능
 */
export async function logoutFromServer(): Promise<void> {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, undefined, {
    withCredentials: true,
    __skipAuthRefresh: true,
  } as any);
}
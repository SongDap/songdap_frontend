import { apiClient } from "./axios";
import { API_ENDPOINTS } from "./endpoints";
import type { UserInfo } from "@/features/oauth/model/types";
import type { AxiosError } from "axios";

function extractDataFromResponse<T>(responseData: any): T | null {
  if (!responseData || typeof responseData !== "object") return null;
  if ("data" in responseData) return (responseData as any).data as T;
  return responseData as T;
}

/**
 * 현재 로그인된 사용자 정보 조회
 * - 백엔드가 쿠키 기반 인증을 쓰는 경우(withCredentials) 이 API로 유저 정보를 가져올 수 있음
 */
export async function getMe() {
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";
  if (DEBUG_OAUTH) {
    console.log("[OAUTH][USER][API] GET", API_ENDPOINTS.USER.ME);
  }
  const res = await apiClient.get<any>(API_ENDPOINTS.USER.ME, {
    withCredentials: true,
  });
  const data = extractDataFromResponse<UserInfo>(res.data);
  if (!data) throw new Error("유저 정보 응답 구조를 파싱할 수 없습니다.");
  return data;
}

export type UpdateMeRequest = {
  nickname: string;
  email?: string;

};

export type WithdrawRequest = {
  nickname: string;
  email: string;  
  profileImage?: string;
  reasons: string[];
  reasonDetail?: string;
};

/**
 * 온보딩/회원가입: 닉네임 및 약관 동의 저장
 * (백엔드가 아직 다른 엔드포인트를 쓰면 여기만 바꾸면 됩니다)
 */
export async function updateMe(payload: UpdateMeRequest) {
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";
  if (DEBUG_OAUTH) {
    console.log("[OAUTH][USER][API] PATCH", API_ENDPOINTS.USER.ME, {
      nicknameLength: payload.nickname?.length ?? 0,
      hasEmail: Boolean(payload.email),

    });
  }
  const res = await apiClient.patch<any>(API_ENDPOINTS.USER.ME, payload, {
    withCredentials: true,
  });
  const data = extractDataFromResponse<UserInfo>(res.data);
  if (!data) throw new Error("유저 수정 응답 구조를 파싱할 수 없습니다.");
  return data;
}

/**
 * 회원 탈퇴
 * - 사용자 정보 Soft Delete + OAuth 연동 해제 + Redis Refresh Token 삭제 + 쿠키 삭제(백엔드)
 */
export async function withdrawUser() {
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";
  if (DEBUG_OAUTH) {
    console.log("[OAUTH][USER][API] DELETE", API_ENDPOINTS.USER.WITHDRAW);
  }

  // 백엔드 스펙: DELETE /api/v1/users (파라미터/바디 없음)
  const res = await apiClient.delete<any>(API_ENDPOINTS.USER.WITHDRAW, {
    withCredentials: true,
    __skipAuthRefresh: true,
  } as any);

  // 응답 예시: { code, message, data: {} }
  return extractDataFromResponse<{}>(res.data) ?? {};
}

export function isNotFoundError(error: unknown) {
  const e = error as AxiosError;
  return e?.response?.status === 404;
}



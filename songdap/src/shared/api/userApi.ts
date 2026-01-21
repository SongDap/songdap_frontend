import { apiClient } from "./axios";
import type { UserInfo } from "@/features/oauth/model/types";
import type { AxiosError } from "axios";

/**
 * 현재 로그인된 사용자 정보 조회
 * - 백엔드가 쿠키 기반 인증을 쓰는 경우(withCredentials) 이 API로 유저 정보를 가져올 수 있음
 */
export async function getMe() {
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";
  if (DEBUG_OAUTH) {
    console.log("[OAUTH][USER][API] GET /api/v1/users/me");
  }
  const res = await apiClient.get<UserInfo>("/api/v1/users/me", {
    withCredentials: true,
  });
  return res.data;
}

export type UpdateMeRequest = {
  nickname: string;
  agreeAge: boolean;
  agreeTerms: boolean;
};

/**
 * 온보딩/회원가입: 닉네임 및 약관 동의 저장
 * (백엔드가 아직 다른 엔드포인트를 쓰면 여기만 바꾸면 됩니다)
 */
export async function updateMe(payload: UpdateMeRequest) {
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";
  if (DEBUG_OAUTH) {
    console.log("[OAUTH][USER][API] PATCH /api/v1/users/me", {
      nicknameLength: payload.nickname?.length ?? 0,
      agreeAge: payload.agreeAge,
      agreeTerms: payload.agreeTerms,
    });
  }
  const res = await apiClient.patch<UserInfo>("/api/v1/users/me", payload, {
    withCredentials: true,
  });
  return res.data;
}

export function isNotFoundError(error: unknown) {
  const e = error as AxiosError;
  return e?.response?.status === 404;
}



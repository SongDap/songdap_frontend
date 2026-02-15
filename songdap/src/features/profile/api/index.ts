import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { extractDataFromResponse } from "@/shared/api/utils";
import type { ProfileResponse, UpdateProfileRequest } from "../model/types";

export async function getProfile(): Promise<ProfileResponse> {
  const res = await apiClient.get<any>(API_ENDPOINTS.USER.ME, {
    withCredentials: true,
  });
  const data = extractDataFromResponse<ProfileResponse>(res.data);
  if (!data) throw new Error("프로필 응답 구조를 파싱할 수 없습니다.");
  return data;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<ProfileResponse> {
  // 백엔드 형식: @RequestPart("request") String requestJson, @RequestPart(value = "file", required = false) MultipartFile file
  const formData = new FormData();
  
  // request 파트: JSON 문자열로 변환
  const requestJson = JSON.stringify({
    nickname: payload.nickname,
    email: payload.email,
  });
  formData.append("request", requestJson);

  // file 파트: 프로필 이미지 파일 (있을 때만, 없으면 회원가입 시처럼 기본 이미지)
  if (payload.profileImageFile) {
    formData.append("file", payload.profileImageFile);
  }
  
  const res = await apiClient.patch<any>(API_ENDPOINTS.USER.UPDATE_ME, formData, {
    withCredentials: true,
  });
  const data = extractDataFromResponse<ProfileResponse>(res.data);
  if (!data) throw new Error("프로필 수정 응답 구조를 파싱할 수 없습니다.");
  return data;
}


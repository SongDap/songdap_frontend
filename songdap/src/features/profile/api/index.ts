import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { ProfileResponse, UpdateProfileRequest } from "../model/types";

function extractDataFromResponse<T>(responseData: any): T | null {
  if (!responseData || typeof responseData !== "object") return null;
  if ("data" in responseData) return (responseData as any).data as T;
  return responseData as T;
}

export async function getProfile(): Promise<ProfileResponse> {
  const res = await apiClient.get<any>(API_ENDPOINTS.USER.ME, {
    withCredentials: true,
  });
  const data = extractDataFromResponse<ProfileResponse>(res.data);
  if (!data) throw new Error("프로필 응답 구조를 파싱할 수 없습니다.");
  return data;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<ProfileResponse> {
  const res = await apiClient.patch<any>(API_ENDPOINTS.USER.ME, payload, {
    withCredentials: true,
  });
  const data = extractDataFromResponse<ProfileResponse>(res.data);
  if (!data) throw new Error("프로필 수정 응답 구조를 파싱할 수 없습니다.");
  return data;
}


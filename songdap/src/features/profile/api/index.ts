import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { ProfileResponse, UpdateProfileRequest } from "../model/types";

export async function getProfile(): Promise<ProfileResponse> {
  const res = await apiClient.get<ProfileResponse>(API_ENDPOINTS.USER.ME, {
    withCredentials: true,
  });
  return res.data;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<ProfileResponse> {
  const res = await apiClient.patch<ProfileResponse>(API_ENDPOINTS.USER.ME, payload, {
    withCredentials: true,
  });
  return res.data;
}


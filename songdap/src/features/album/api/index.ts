import { apiClient } from "@/shared/api";

/**
 * 앨범 생성 요청 타입
 */
export interface CreateAlbumRequest {
  title: string;
  description: string;
  isPublic: boolean;
  musicCountLimit: number;
  color: string;
}

/**
 * 앨범 응답 타입
 */
export interface AlbumResponse {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  musicCountLimit: number;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 앨범 생성 API
 * 
 * @param data 앨범 생성 데이터
 * @returns 생성된 앨범 정보
 * 
 * @throws {AxiosError} API 호출 실패 시
 */
export async function createAlbum(data: CreateAlbumRequest): Promise<AlbumResponse> {
  const endpoint = "/api/v1/albums";
  const baseURL = apiClient.defaults.baseURL;
  const fullURL = `${baseURL}${endpoint}`;

  console.log("[Album API] POST", fullURL, data);

  try {
    const response = await apiClient.post<AlbumResponse>(endpoint, data);
    console.log("[Album API] ✅ 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[Album API] ❌ 실패:", {
      url: fullURL,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    throw error;
  }
}

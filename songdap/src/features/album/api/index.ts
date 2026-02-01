import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { extractDataFromResponse } from "@/shared/api/utils";

// ============================================================================
// 타입 정의
// ============================================================================

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
 * 백엔드 API 공통 응답 래퍼 타입
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 앨범 데이터 타입 (백엔드 응답 data 필드)
 */
export interface AlbumData {
  uuid: string;
  title: string;
  description: string;
  isPublic: boolean;
  musicCount: number;
  musicCountLimit: number;
  color: string;
  createdAt: string;
}

/**
 * 앨범 응답 타입
 */
export interface AlbumResponse {
  uuid: string;
  id?: string; // uuid의 별칭 (하위 호환성)
  title: string;
  description: string;
  isPublic: boolean;
  musicCount: number;
  musicCountLimit: number;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 앨범 목록 아이템 타입 (목록 조회용 - 간소화된 정보)
 */
export interface AlbumListItem {
  uuid: string;
  title: string;
  color: string;
}

/**
 * 페이지네이션 정보 타입
 */
export interface Pageable {
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

/**
 * 페이지네이션 응답 타입
 */
export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

/**
 * 정렬 옵션 타입
 */
export type AlbumSortOption = "LATEST" | "OLDEST" | "TITLE" | "POPULAR";

/**
 * 앨범 내 노래 목록 정렬 옵션
 */
export type MusicSortOption = "LATEST" | "OLDEST" | "TITLE" | "ARTIST";

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * AlbumData를 AlbumResponse로 변환
 */
function transformAlbumData(albumData: AlbumData): AlbumResponse {
  return {
    uuid: albumData.uuid,
    id: albumData.uuid,
    title: albumData.title,
    description: albumData.description,
    isPublic: albumData.isPublic,
    musicCount: albumData.musicCount ?? 0,
    musicCountLimit: albumData.musicCountLimit,
    color: albumData.color,
    createdAt: albumData.createdAt,
  };
}

// ============================================================================
// API 함수
// ============================================================================

/**
 * 앨범 생성 API
 * 
 * @param data 앨범 생성 데이터
 * @returns 생성된 앨범 정보 (UUID가 없을 수 있음)
 * 
 * @throws {AxiosError} API 호출 실패 시
 */
export async function createAlbum(data: CreateAlbumRequest): Promise<AlbumResponse> {
  const endpoint = API_ENDPOINTS.ALBUM.BASE;

  try {
    const response = await apiClient.post<any>(endpoint, data);
    
    // 응답 구조: { success, message, data: { uuid } } 또는 { code, message, data: {...} }
    const responseData = response.data;
    let albumData: AlbumData | null = null;
    
    // 경우 1: { success/code, message, data: { uuid, ...fields } } 구조에서 data 추출
    const extractedData = extractDataFromResponse<AlbumData>(responseData);
    if (extractedData && 'uuid' in extractedData) {
      albumData = extractedData;
    }
    // 경우 2: { data: { uuid, ...fields } } 구조 (바로 앨범 데이터 구조)
    else if (responseData && typeof responseData === 'object' && 'uuid' in responseData) {
      albumData = responseData as AlbumData;
    }
    // 경우 3: { success/code, message, data: { uuid } } - 최소 정보만 반환 (uuid만 있음)
    else if (responseData && 'data' in responseData && responseData.data && 'uuid' in responseData.data) {
      const uuid = responseData.data.uuid;
      // UUID만 있으므로 요청 데이터를 기반으로 응답 생성
      albumData = {
        uuid,
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        musicCount: 0,
        musicCountLimit: data.musicCountLimit,
        color: data.color,
        createdAt: new Date().toISOString(),
      };
    }
    // 경우 4: Location 헤더에서 UUID 추출
    else if (responseData && ('code' in responseData || 'success' in responseData) && ('message' in responseData)) {
      const location = response.headers?.['location'] || response.headers?.['Location'];
      let extractedUuid: string | undefined;
      
      if (location) {
        const uuidMatch = location.match(/\/albums\/([^\/]+)/);
        if (uuidMatch?.[1]) {
          extractedUuid = uuidMatch[1];
        }
      }
      
      // 요청 데이터를 기반으로 응답 생성 (UUID는 Location에서 추출하거나 빈 문자열)
      albumData = {
        uuid: extractedUuid || '',
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        musicCount: 0,
        musicCountLimit: data.musicCountLimit,
        color: data.color,
        createdAt: new Date().toISOString(),
      };
    }
    
    if (!albumData) {
      throw new Error("앨범 응답 구조를 파싱할 수 없습니다.");
    }
    
    return transformAlbumData(albumData);
  } catch (error: any) {
    console.error("[Album API] 앨범 생성 실패:", {
      endpoint,
      status: error.response?.status,
      message: error.message,
    });
    throw error;
  }
}

/**
 * 앨범 상세 조회 API
 * 
 * @param albumUuid 앨범 UUID
 * @returns 앨범 상세 정보
 * 
 * @throws {AxiosError} API 호출 실패 시
 */
export async function getAlbum(albumUuid: string): Promise<AlbumResponse> {
  const endpoint = API_ENDPOINTS.ALBUM.DETAIL(albumUuid);

  try {
    const response = await apiClient.get<any>(endpoint);
    
    // 응답 구조: { code, message, data: { uuid, title, ... } }
    const albumData = extractDataFromResponse<AlbumData>(response.data);
    
    if (!albumData || !('uuid' in albumData)) {
      // 레거시 호환: 바로 앨범 데이터 구조
      if (response.data && typeof response.data === 'object' && 'uuid' in response.data) {
        return transformAlbumData(response.data as AlbumData);
      }
      throw new Error("앨범 응답 구조를 파싱할 수 없습니다.");
    }
    
    return transformAlbumData(albumData);
  } catch (error: any) {
    console.error("[Album API] 앨범 상세 조회 실패:", {
      albumUuid,
      status: error.response?.status,
      message: error.message,
    });
    throw error;
  }
}

/**
 * 앨범 목록 조회 API
 * 
 * @param sort 정렬 옵션 (LATEST, OLDEST, TITLE, POPULAR)
 * @param page 페이지 번호 (0부터 시작, 기본값: 0)
 * @param size 페이지 크기 (기본값: 10)
 * @returns 앨범 목록 및 페이지네이션 정보
 * 
 * @throws {AxiosError} API 호출 실패 시
 */
export async function getAlbums(
  sort: AlbumSortOption = "LATEST",
  page: number = 0,
  size: number = 10
): Promise<PageResponse<AlbumListItem>> {
  const endpoint = API_ENDPOINTS.ALBUM.BASE;

  try {
    const response = await apiClient.get<any>(endpoint, {
      params: { sort, page, size },
    });
    
    // 응답 구조: { code, message, data: { content, totalElements, ... } }
    const pageData = extractDataFromResponse<PageResponse<AlbumListItem>>(response.data);
    
    if (pageData && 'content' in pageData) {
      return pageData;
    }
    
    // 레거시 호환: 바로 페이지네이션 데이터 구조
    if (response.data && typeof response.data === 'object' && 'content' in response.data) {
      return response.data as PageResponse<AlbumListItem>;
    }
    
    throw new Error("앨범 목록 응답 구조를 파싱할 수 없습니다.");
  } catch (error: any) {
    console.error("[Album API] 앨범 목록 조회 실패:", {
      sort,
      page,
      size,
      status: error.response?.status,
      message: error.message,
    });
    throw error;
  }
}

/**
 * 앨범 삭제 API
 * 
 * @param albumUuid 삭제할 앨범의 UUID
 * @returns 삭제 성공 여부
 * 
 * @throws {AxiosError} API 호출 실패 시
 */
export async function deleteAlbum(albumUuid: string): Promise<void> {
  const endpoint = API_ENDPOINTS.ALBUM.DETAIL(albumUuid);

  try {
    const response = await apiClient.delete<ApiResponse<{}>>(endpoint);
    
    // 응답 구조: { code, message, data: {} }
    const responseData = extractDataFromResponse<{}>(response.data);
    
    console.log("[Album API] 앨범 삭제 성공:", {
      albumUuid,
      code: response.data?.code,
      message: response.data?.message,
    });
    
    // 삭제는 void를 반환하므로 데이터는 사용하지 않음
  } catch (error: any) {
    console.error("[Album API] 앨범 삭제 실패:", {
      albumUuid,
      url: endpoint,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    throw error;
  }
}

/**
 * 앨범 공개 여부 수정
 * @param albumUuid - 앨범 UUID
 * @param isPublic - 공개 여부
 * @returns 수정된 앨범의 공개 여부
 */
export async function updateAlbumVisibility(
  albumUuid: string,
  isPublic: boolean
): Promise<{ isPublic: boolean }> {
  try {
    const endpoint = `/api/v1/albums/${albumUuid}/visibility`;
    
    const response = await apiClient.patch<ApiResponse<{ isPublic: boolean }>>(
      endpoint,
      { isPublic },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    const responseData = extractDataFromResponse<{ isPublic: boolean }>(response.data);
    
    if (!responseData) {
      throw new Error("유효하지 않은 응답");
    }
    
    console.log("[Album API] 앨범 공개 여부 수정 성공:", {
      albumUuid,
      isPublic: responseData.isPublic,
      code: response.data?.code,
    });
    
    return responseData;
  } catch (error: any) {
    console.error("[Album API] 앨범 공개 여부 수정 실패:", {
      albumUuid,
      isPublic,
      url: `/api/v1/albums/${albumUuid}/visibility`,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    throw error;
  }
}
// ============================================================================
// 노래(Music) 관련 타입 및 API는 @/features/song/api로 이동됨
// ============================================================================


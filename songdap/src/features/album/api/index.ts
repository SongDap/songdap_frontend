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

/**
 * 앨범 내 노래 목록 아이템
 */
export interface MusicInfo {
  uuid: string;
  title: string;
  artist: string;
  message?: string | null;
  url: string;
  writer: string;
  image?: string | null;
}

/**
 * 노래 목록 조회 권한 정보
 */
export interface AlbumMusicsFlag {
  isOwner: boolean;
  canDelete: boolean;
  canAdd: boolean;
}

/**
 * 노래 목록 조회 응답 데이터
 */
export interface AlbumMusicsData {
  flag: AlbumMusicsFlag;
  items: PageResponse<MusicInfo>;
}

/**
 * 노래 상세(편지/확장뷰 등에서 사용)
 */
export interface MusicDetail {
  uuid: string;
  title: string;
  artist: string;
  url: string;
  writer: string;
  message?: string | null;
  image?: string | null;
}

/**
 * 노래 상세 조회 권한 정보
 */
export interface MusicDetailFlag {
  isOwner: boolean;
  canDelete: boolean;
}

/**
 * 노래 상세 조회 응답 데이터
 */
export interface MusicDetailData {
  musics: MusicDetail;
  flag: MusicDetailFlag;
}

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
 * 노래 상세 조회 API
 *
 * GET /api/v1/musics/{musicUuid}
 * 
 * @param musicUuid 노래 UUID
 * @returns 노래 상세 정보 및 권한 정보
 * 
 * @throws {AxiosError} API 호출 실패 시
 */
export async function getMusicDetail(musicUuid: string): Promise<MusicDetailData> {
  const endpoint = API_ENDPOINTS.MUSIC.DETAIL(musicUuid);

  try {
    const response = await apiClient.get<ApiResponse<MusicDetailData>>(endpoint);
    
    // 응답 구조: { success, message, data: { musics, flag } }
    const data = extractDataFromResponse<MusicDetailData>(response.data);
    
    if (!data || !("musics" in data) || !("flag" in data)) {
      throw new Error("노래 상세 응답 구조를 파싱할 수 없습니다.");
    }
    
    if (!data.musics?.uuid) {
      throw new Error("노래 데이터를 파싱할 수 없습니다.");
    }
    
    console.log("[Album API] 노래 상세 조회 성공:", {
      musicUuid,
      title: data.musics.title,
      artist: data.musics.artist,
    });
    
    return data;
  } catch (error: any) {
    console.error("[Album API] 노래 상세 조회 실패:", {
      musicUuid,
      url: endpoint,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
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

// ============================================================================
// 노래(Music) 관련 타입 및 API
// ============================================================================

/**
 * 노래 추가 요청 타입
 */
export interface AddMusicRequest {
  title: string;
  artist: string;
  message?: string;
  writer?: string;
  imageFile?: File;
}

/**
 * 노래 추가 응답 타입
 */
export interface MusicResponse {
  uuid: string;
  title: string;
  artist: string;
  imageUrl?: string;
  message?: string;
  writer?: string;
}

/**
 * 노래 추가 API
 * 
 * Multipart Form Data로 전송:
 * - request: JSON 문자열 (필수)
 * - file: 이미지 파일 (선택)
 * 
 * @param albumUuid 앨범 UUID
 * @param data 노래 추가 데이터
 * @returns 추가된 노래 정보
 * 
 * @throws {AxiosError} API 호출 실패 시
 */
export async function addMusicToAlbum(
  albumUuid: string,
  data: AddMusicRequest
): Promise<MusicResponse> {
  const endpoint = API_ENDPOINTS.ALBUM.ADD_MUSIC(albumUuid);

  try {
    // FormData 구성: request (JSON 문자열) + file (이미지 파일)
    const formData = new FormData();
    
    // request 필드: JSON 문자열
    const requestPayload = {
      title: data.title,
      artist: data.artist,
      message: data.message || null,
      writer: data.writer || null,
    };
    formData.append("request", JSON.stringify(requestPayload));
    
    // file 필드: 이미지 파일 (선택)
    if (data.imageFile) {
      formData.append("file", data.imageFile);
    }
    
    // multipart/form-data로 전송
    // Content-Type 헤더를 제거하면 Axios가 자동으로 multipart/form-data를 설정
    const response = await apiClient.post<ApiResponse<null>>(endpoint, formData, {
      headers: {
        // Content-Type 헤더 제거 (Axios가 자동으로 설정하도록)
        "Content-Type": undefined,
      },
    });
    
    console.log("[Album API] 노래 추가 성공:", {
      albumUuid,
      title: data.title,
      artist: data.artist,
      code: response.data?.code,
      message: response.data?.message,
    });
    
    // 응답: { code: 200, message: "노래 등록 성공", data: null }
    // 성공한 경우 요청 데이터를 반환
    return {
      uuid: "", // 백엔드에서 data가 null이므로 uuid는 빈 문자열
      title: data.title,
      artist: data.artist,
      message: data.message,
      writer: data.writer,
    };
  } catch (error: any) {
    console.error("[Album API] 노래 추가 실패:", {
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
 * 노래 목록 조회 API
 * 
 * @param albumUuid 앨범 UUID
 * @param options 조회 옵션 { sort?, page?, size? }
 * @returns 노래 목록 데이터
 * 
 * @throws {AxiosError} API 호출 실패 시
 */
export async function getAlbumMusics(
  albumUuid: string,
  options: {
    sort?: MusicSortOption;
    page?: number;
    size?: number;
  } = {}
): Promise<AlbumMusicsData> {
  const { sort = "LATEST", page = 0, size = 10 } = options;
  const endpoint = API_ENDPOINTS.ALBUM.DETAIL(albumUuid) + "/musics";

  try {
    const response = await apiClient.get<ApiResponse<AlbumMusicsData>>(endpoint, {
      params: { sort, page, size },
    });

    // 응답 구조: { success, message, data: { flag, items } }
    const responseData = extractDataFromResponse<AlbumMusicsData>(response.data);

    if (!responseData || !("flag" in responseData) || !("items" in responseData)) {
      throw new Error("노래 목록 응답 구조를 파싱할 수 없습니다.");
    }

    console.log("[Album API] 노래 목록 조회 성공:", {
      albumUuid,
      sort,
      page,
      size,
      totalElements: responseData.items.totalElements,
      numberOfElements: responseData.items.numberOfElements,
      flag: responseData.flag,
    });

    return responseData;
  } catch (error: any) {
    console.error("[Album API] 노래 목록 조회 실패:", {
      albumUuid,
      sort,
      page,
      size,
      url: endpoint,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    throw error;
  }
}

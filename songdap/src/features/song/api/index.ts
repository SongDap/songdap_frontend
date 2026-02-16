import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { extractDataFromResponse } from "@/shared/api/utils";

// ============================================================================
// 타입 정의
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
  owner: boolean;
  canDelete: boolean;
  canAdd: boolean;
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

/**
 * 백엔드 API 공통 응답 래퍼 타입
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ============================================================================
// API 함수
// ============================================================================

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
  const endpoint = API_ENDPOINTS.MUSIC.ADD(albumUuid);

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
  const endpoint = API_ENDPOINTS.MUSIC.LIST(albumUuid);

  try {
    const response = await apiClient.get<ApiResponse<AlbumMusicsData>>(endpoint, {
      params: { sort, page, size },
      __skipAuthExpired: true,
    } as any);

    // 응답 구조: { success, message, data: { flag, items } }
    const responseData = extractDataFromResponse<AlbumMusicsData>(response.data);

    if (!responseData || !("flag" in responseData) || !("items" in responseData)) {
      throw new Error("노래 목록 응답 구조를 파싱할 수 없습니다.");
    }

    return responseData;
  } catch (error: any) {
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
    
    return data;
  } catch (error: any) {
    throw error;
  }
}

/**
 * 노래 삭제 API
 * 
 * @param musicUuid 삭제할 노래 UUID
 * @returns 삭제 성공 메시지
 * 
 * @throws {AxiosError} API 호출 실패 시
 */
export async function deleteMusic(musicUuid: string): Promise<void> {
  const endpoint = API_ENDPOINTS.MUSIC.DELETE(musicUuid);

  try {
    await apiClient.delete(endpoint);
  } catch (error: any) {
    throw error;
  }
}

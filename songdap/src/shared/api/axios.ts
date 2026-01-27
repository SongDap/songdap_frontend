import axios from 'axios';
import { API_ENDPOINTS } from "./endpoints";
import { showAuthExpired } from "@/features/oauth/model/authUiStore";

/**
 * Axios 인스턴스 생성
 * API 호출에 사용되는 기본 인스턴스
 * 
 * Access Token과 Refresh Token은 모두 HttpOnly Cookie로 관리됨
 * withCredentials: true 설정으로 쿠키가 자동으로 전송됨
 */
// baseURL 정규화: 빈 문자열, undefined, 또는 따옴표만 있는 경우 빈 문자열로 처리
// 서버에서는 빈 문자열일 때도 절대 경로로 동작하도록 보장
const normalizeBaseURL = (url: string | undefined): string => {
  if (!url) return '';
  // 따옴표 제거 (환경 변수에 따옴표가 포함된 경우)
  const cleaned = url.trim().replace(/^["']|["']$/g, '');
  
  if (!cleaned) return '';
  
  // 프로덕션에서 HTTPS 강제
  if (process.env.NODE_ENV === 'production' && cleaned.startsWith('http://')) {
    console.warn('[Security] HTTPS를 사용해야 합니다. HTTP는 프로덕션에서 안전하지 않습니다.');
  }
  
  return cleaned;
};

export const apiClient = axios.create({
  // baseURL이 빈 문자열이면 undefined로 설정하여 axios가 절대 경로를 올바르게 처리하도록 함
  // NEXT_PUBLIC_* 변수는 빌드 시점에 대체됨
  baseURL: normalizeBaseURL(process.env.NEXT_PUBLIC_API_URL) || undefined,
  timeout: 15000,
  // Access Token과 Refresh Token이 HttpOnly Cookie로 설정되므로 필수
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// axios config 확장 (내부 플래그)
declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface AxiosRequestConfig {
    _retry?: boolean;
    __skipAuthRefresh?: boolean;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    __skipAuthRefresh?: boolean;
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

const handleAuthExpired = () => {
  if (typeof window === "undefined") return;
  showAuthExpired();
};

//
// Request Interceptor
//
apiClient.interceptors.request.use(
  (config) => {
    // 쿠키 기반 인증을 사용하므로 Authorization 헤더는 필요 없음
    // 백엔드가 HttpOnly 쿠키로 인증을 처리함
    
    // baseURL이 없거나 빈 문자열일 때, URL이 절대 경로(/로 시작)인지 확인
    // 상대 경로면 절대 경로로 변환 (현재 페이지 경로가 붙는 문제 방지)
    if ((!config.baseURL || config.baseURL === '') && config.url && !config.url.startsWith('/')) {
      config.url = '/' + config.url;
    }
    
    // FormData인 경우 Content-Type을 제거하여 브라우저가 자동으로 multipart/form-data와 boundary를 설정하도록 함
    if (config.data instanceof FormData) {
      // config.headers에서 Content-Type을 제거하거나 undefined로 설정
      if (config.headers) {
        if ('Content-Type' in config.headers) {
          delete config.headers['Content-Type'];
        }
      }
    }
    
    // 디버그 모드에서 요청 정보 로깅
    const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";
    if (DEBUG_OAUTH && typeof window !== 'undefined') {
      const fullUrl = config.baseURL 
        ? `${config.baseURL}${config.url}` 
        : config.url;
      console.log(`[API][REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`, {
        baseURL: config.baseURL || '(없음)',
        url: config.url,
        fullURL: fullUrl,
        withCredentials: config.withCredentials,
        isFormData: config.data instanceof FormData,
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//
// Response Interceptor
//
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // refresh/logout 요청은 재발급 로직에서 제외 (무한루프 방지)
    if (originalRequest?.__skipAuthRefresh) {
      return Promise.reject(error);
    }

    // Access Token 만료 (401 에러)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // 이미 refresh 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // 쿠키 기반이므로 헤더 설정 불필요, 원래 요청 재시도
          return apiClient(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // Refresh Token은 HttpOnly Cookie로 자동 전송됨
        // Access Token도 쿠키로 자동 설정됨
        await apiClient.post(
          API_ENDPOINTS.AUTH.REISSUE,
          undefined,
          { __skipAuthRefresh: true } as any
        );

        // 대기 중인 요청들 재시도
        processQueue(null, null);

        // 원래 요청 재시도 (쿠키가 자동으로 전송됨)
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Refresh Token도 만료
        processQueue(refreshError, null);

        // 로그아웃 API 호출(최선) + 로컬 상태 정리 후 홈으로 이동
        try {
          await apiClient.post(
            API_ENDPOINTS.AUTH.LOGOUT,
            undefined,
            { __skipAuthRefresh: true } as any
          );
        } catch {
          // ignore
        } finally {
          handleAuthExpired();
        }

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    // 이미 한 번 재시도했는데도 401이면 (혹시 재발급이 반영되지 않았거나, 쿠키 삭제됨)
    // 사용자에게 재로그인/홈 선택을 제공
    if (error.response?.status === 401 && originalRequest?._retry) {
      handleAuthExpired();
    }

    // 일부 API는 인증이 없을 때 403으로 내려올 수 있음(권한 없음/미인증).
    // 이 경우에도 동일하게 재로그인/홈 선택 제공.
    if (error.response?.status === 403) {
      handleAuthExpired();
    }

    // 500 에러 등 기타 에러에 대한 상세 로깅 (프로덕션에서도)
    if (error.response?.status >= 500) {
      const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";
      if (DEBUG_OAUTH || process.env.NODE_ENV === 'production') {
        const errorData = error.response.data;
        console.error('[API][ERROR] 서버 에러 발생:', {
          status: error.response.status,
          statusText: error.response.statusText,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          fullUrl: error.config?.baseURL 
            ? `${error.config.baseURL}${error.config.url}` 
            : error.config?.url,
          method: error.config?.method,
          requestData: error.config?.data,
        });
        
        // errorData를 별도로 로깅하여 객체 내용을 펼쳐서 볼 수 있도록 함
        if (errorData && typeof errorData === 'object') {
          console.error('[API][ERROR] 에러 응답 데이터:', errorData);
          // 에러 메시지가 있으면 별도로 표시
          const errorObj = errorData as { message?: string; code?: string | number };
          if (errorObj.message) {
            console.error('[API][ERROR] 에러 메시지:', errorObj.message);
          }
          if (errorObj.code) {
            console.error('[API][ERROR] 에러 코드:', errorObj.code);
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

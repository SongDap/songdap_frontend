import axios from 'axios';

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
  return cleaned || '';
};

export const apiClient = axios.create({
  // baseURL이 빈 문자열이면 undefined로 설정하여 axios가 절대 경로를 올바르게 처리하도록 함
  baseURL: normalizeBaseURL(process.env.NEXT_PUBLIC_API_URL) || undefined,
  timeout: 10000,
  // Access Token과 Refresh Token이 HttpOnly Cookie로 설정되므로 필수
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
        await apiClient.post('/api/v1/auth/reissue');

        // 대기 중인 요청들 재시도
        processQueue(null, null);

        // 원래 요청 재시도 (쿠키가 자동으로 전송됨)
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Refresh Token도 만료
        processQueue(refreshError, null);

        // 로그아웃 처리
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          // 로그인 페이지로 리다이렉트 (필요시)
          
        }

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

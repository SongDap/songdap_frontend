import axios from 'axios';

/**
 * Axios 인스턴스 생성
 * API 호출에 사용되는 기본 인스턴스
 * 
 * Access Token과 Refresh Token은 모두 HttpOnly Cookie로 관리됨
 * withCredentials: true 설정으로 쿠키가 자동으로 전송됨
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
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
          // window.location.href = '/login';
        }

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

import axios from 'axios';

/**
 * Axios 인스턴스 생성
 * API 호출에 사용되는 기본 인스턴스
 */
const getBaseURL = () => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiURL) {
    if (typeof window !== 'undefined') {
      console.warn('[API] NEXT_PUBLIC_API_URL이 설정되지 않았습니다.');
    }
    return '';
  }
  
  return apiURL;
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중 플래그 (중복 요청 방지)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Request 인터셉터 (요청 전 처리)
apiClient.interceptors.request.use(
  (config) => {
    // 쿠키 기반 인증을 사용하므로 Authorization 헤더는 필요 없음
    // 백엔드가 httpOnly 쿠키로 인증을 처리함
    
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터 (응답 후 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 토큰 갱신 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // TODO: 토큰 갱신 API 호출 (백엔드에 refresh 토큰 API가 있는 경우)
        // const refreshToken = localStorage.getItem('refreshToken');
        // if (refreshToken) {
        //   const response = await apiClient.post('/api/v1/auth/refresh', { refreshToken });
        //   const newAccessToken = response.data.accessToken;
        //   localStorage.setItem('accessToken', newAccessToken);
        //   
        //   // 대기 중인 요청들 재시도
        //   failedQueue.forEach(({ resolve }) => resolve());
        //   failedQueue = [];
        //   
        //   // 원래 요청 재시도
        //   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        //   return apiClient(originalRequest);
        // }

        // 토큰 갱신 실패 또는 refresh 토큰이 없는 경우 로그아웃 처리
        // 쿠키 기반 인증이므로 쿠키는 백엔드에서 처리
        // 프론트엔드에서는 사용자 정보만 제거
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          
          // 로그아웃 상태로 변경 (zustand store 사용 시)
          // useOauthStore.getState().logout();
        }
        
        // 대기 중인 요청들 실패 처리
        failedQueue.forEach(({ reject }) => reject(error));
        failedQueue = [];
      } catch (refreshError) {
        // 토큰 갱신 실패
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
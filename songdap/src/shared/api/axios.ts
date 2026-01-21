import axios from 'axios';

/**
 * Axios 인스턴스 생성
 * API 호출에 사용되는 기본 인스턴스
 * 
 * 개발 환경에서는 localhost:8080을 강제 사용
 */
const getBaseURL = () => {
  // 개발 환경 체크 (브라우저에서 실행 중)
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // localhost에서 실행 중이면 강제로 localhost:8080 사용
    if (isLocalhost) {
      const localhostURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      console.log('[API] localhost 환경 감지, baseURL:', localhostURL);
      return localhostURL;
    }
  }
  
  // 프로덕션 또는 다른 환경
  return process.env.NEXT_PUBLIC_API_URL || '';
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 (요청 전 처리)
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    // 401 에러 시 로그아웃 처리 등
    if (error.response?.status === 401) {
      // 로그아웃 처리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

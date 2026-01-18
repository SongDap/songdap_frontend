import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query 클라이언트 설정
 * 서버 상태 관리를 위한 기본 설정
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

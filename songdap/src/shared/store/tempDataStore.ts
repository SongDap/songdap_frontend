/**
 * 임시 데이터 저장소 (메모리-only)
 *
 * - "페이지 이동 중"에만 필요한 데이터를 잠깐 들고가는 용도
 * - 브라우저 새로고침/탭 종료 시 100% 사라짐 (캐시/영구 저장 용도 X)
 * - 새로고침 후에도 유지돼야 하는 값은 URL/query, localStorage, 또는 서버 조회로 처리
 */

import { create } from 'zustand';

// ============================================================================
// 타입 (any 제거)
// ============================================================================

export type AlbumShareTempData = {
  uuid?: string;
  title?: string;
  description?: string;
  isPublic?: boolean;
  musicCount?: number;
  musicCountLimit?: number;
  color?: string;
  createdAt?: string;
};

export type SongAddTempData = {
  title: string;
  artist: string;
  imageUrl: string;
};

export type SongMessageTempData = {
  nickname: string;
  message: string;
};

interface TempDataState {
  // 앨범 관련 임시 데이터
  albumShareData: AlbumShareTempData | null;
  
  // Setter 함수들
  setAlbumShareData: (data: TempDataState['albumShareData']) => void;
  
  // Clear 함수들
  clearAlbumShareData: () => void;
  clearAll: () => void;
}

export const useTempDataStore = create<TempDataState>((set) => ({
  albumShareData: null,
  
  setAlbumShareData: (data) => set({ albumShareData: data }),
  
  clearAlbumShareData: () => set({ albumShareData: null }),
  clearAll: () => set({
    albumShareData: null,
  }),
}));

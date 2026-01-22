/**
 * 임시 데이터 저장소 (sessionStorage 대체)
 * 페이지 간 데이터 전달용으로 사용
 * 메모리에만 저장되므로 새로고침 시 사라짐
 */

import { create } from 'zustand';

interface TempDataState {
  // 앨범 관련 임시 데이터
  albumShareData: {
    title?: string;
    description?: string;
    isPublic?: boolean;
    musicCount?: number;
    musicCountLimit?: number;
    color?: string;
    uuid?: string;
  } | null;
  
  // 노래 추가 관련 임시 데이터
  songAddData: any | null;
  songMessageData: any | null;
  showMessageForm: boolean;
  
  // Setter 함수들
  setAlbumShareData: (data: TempDataState['albumShareData']) => void;
  setSongAddData: (data: any) => void;
  setSongMessageData: (data: any) => void;
  setShowMessageForm: (show: boolean) => void;
  
  // Clear 함수들
  clearAlbumShareData: () => void;
  clearSongData: () => void;
  clearAll: () => void;
}

export const useTempDataStore = create<TempDataState>((set) => ({
  albumShareData: null,
  songAddData: null,
  songMessageData: null,
  showMessageForm: false,
  
  setAlbumShareData: (data) => set({ albumShareData: data }),
  setSongAddData: (data) => set({ songAddData: data }),
  setSongMessageData: (data) => set({ songMessageData: data }),
  setShowMessageForm: (show) => set({ showMessageForm: show }),
  
  clearAlbumShareData: () => set({ albumShareData: null }),
  clearSongData: () => set({ songAddData: null, songMessageData: null, showMessageForm: false }),
  clearAll: () => set({
    albumShareData: null,
    songAddData: null,
    songMessageData: null,
    showMessageForm: false,
  }),
}));

// 상태관리 페이지

import { create } from 'zustand';
import { AuthResponse, UserInfo } from './types';

// 이건 dto 보고 수정해야함
interface OauthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useOauthStore = create<OauthState>(function(set){
    return {
        // 저장 변수들
        user: null,
        isAuthenticated: false,

        // 로그인 기능들
        login : function(data : AuthResponse) {
            if(typeof window !== 'undefined'){
                // 쿠키 기반 인증을 사용하므로 토큰은 localStorage에 저장하지 않음
                // 백엔드가 httpOnly 쿠키로 인증을 처리함
                // 사용자 정보만 localStorage에 저장
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            // 메모리에 유저정보 저장
            set({
                user:data.user,
                isAuthenticated:true
            });
        },

        // 로그아웃
        logout  : function() {
            // 쿠키 기반 인증이므로 쿠키는 백엔드에서 처리
            // 프론트엔드에서는 사용자 정보만 제거
            if(typeof window !== 'undefined'){
                localStorage.removeItem('user');
            }

            // 메모리 비우기
            set({
                user:null,
                isAuthenticated : false
            });
        },

        hydrate: function () {
            if (typeof window === 'undefined') return;

            const userRaw = localStorage.getItem('user');
            if (!userRaw) return;

            try {
                const user = JSON.parse(userRaw) as UserInfo;
                set({
                    user,
                    isAuthenticated: true,
                });
            } catch (e) {
                // 파싱 실패 시 깨끗하게 정리
                localStorage.removeItem('user');
                set({ user: null, isAuthenticated: false });
            }
        },

    };
});
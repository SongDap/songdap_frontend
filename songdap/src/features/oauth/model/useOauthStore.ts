// 상태관리 페이지

import { create } from 'zustand';
import { AuthResponse, UserInfo } from './types';
import { logoutFromServer } from "../api/oauthApi";

const AUTH_LOG = "[Auth]";

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
                // Access Token과 Refresh Token은 HttpOnly Cookie로 자동 관리됨
                // UI에 필요한 최소 정보만 localStorage에 저장 (닉네임/프로필)
                localStorage.setItem(
                  'user',
                  JSON.stringify({
                    nickname: data.user.nickname,
                    profileImage: data.user.profileImage,
                  })
                );
            }

            // 메모리에 유저정보 저장
            set({
                user:data.user,
                isAuthenticated:true
            });
            if (typeof window !== 'undefined') console.log(AUTH_LOG, "로그인 완료", { nickname: data.user?.nickname });
        },

        // 로그아웃
        logout  : function() {
            if (typeof window !== 'undefined') console.log(AUTH_LOG, "로그아웃 (사용자 요청)");
            // 서버 로그아웃 API 호출(쿠키/Redis 정리) - 실패해도 로컬 정리는 수행
            // NOTE: zustand action은 sync로 유지하고, 네트워크는 fire-and-forget 처리
            logoutFromServer().catch(() => {});

            // Access Token과 Refresh Token은 HttpOnly Cookie로 관리되므로
            // 백엔드 로그아웃 API 호출 시 쿠키가 자동으로 삭제됨
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
            if (!userRaw) {
                console.log(AUTH_LOG, "hydrate: localStorage에 user 없음 → 스킵");
                return;
            }

            try {
                const parsed = JSON.parse(userRaw) as Partial<UserInfo> | null;
                if (!parsed?.nickname) {
                    console.log(AUTH_LOG, "hydrate: user 파싱 결과 nickname 없음 → 스킵");
                    return;
                }

                const user: UserInfo = {
                  // id/email은 쿠키 기반에서는 서버(/users/me)로 동기화될 수 있음
                  nickname: parsed.nickname,
                  profileImage: parsed.profileImage,
                };
                set({
                    user,
                    isAuthenticated: true,
                });
                console.log(AUTH_LOG, "hydrate 완료 (localStorage → 스토어 복구)", { nickname: user.nickname });
            } catch (e) {
                // 파싱 실패 시 깨끗하게 정리
                console.warn(AUTH_LOG, "hydrate: user 파싱 실패 → 로컬 정리");
                localStorage.removeItem('user');
                set({ user: null, isAuthenticated: false });
            }
        },

    };
});
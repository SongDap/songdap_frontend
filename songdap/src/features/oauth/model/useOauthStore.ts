// 상태관리 페이지

import { create } from 'zustand';
import { AuthResponse, UserInfo } from './types';

// 이건 dto 보고 수정해야함
interface OauthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

export const useOauthStore = create<OauthState>(function(set){
    return {
        // 저장 변수들
        user: null,
        isAuthenticated: false,

        // 로그인 기능들
        login : function(data : AuthResponse) {
            if(typeof window !== 'undefined'){
                // 1. 일단 로컬스토리지에 저장 -> 백엔드 나오면 업데이트 예정
                localStorage.setItem('accessToken', data.accessToken);
                console.log('token is saved to localStorage');
            }

            // 2. 메모리에 유저정보 저장
            // 서버 응답을 받으면 그 변경정보가 프론트에 저장되도록
            set({
                user:data.user,
                isAuthenticated:true
            });
            console.log('user status is updated to window memory');
        },

        // 로그아웃
        logout  : function() {
            // 1. 브라우저 설정단계에서 토큰 빼버리기
            if(typeof window !== 'undefined'){
                localStorage.removeItem('accessToken');
                console.log('token is removed from localStorage');
            }

            // 2. 메모리 비우기
            set({
                user:null,
                isAuthenticated : false
            });
        }

    };
});
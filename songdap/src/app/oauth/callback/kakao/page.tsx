'use client';

export default function KakaoCallbackPage() {
    // 구 경로 호환용: 새 Redirect URI 경로로 리다이렉트
    if (typeof window !== 'undefined') {
        window.location.replace('/oauth/kakao/callback' + window.location.search);
    }
    return null;
}
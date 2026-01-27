"use client";

import { useEffect, useMemo } from "react";
import { hideAuthExpired, useAuthUiStore } from "@/features/oauth/model/authUiStore";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";

function buildKakaoAuthorizeUrl(): string | null {
  const clientId =
    process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || process.env.NEXT_PUBLIC_KAKAO_API_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  if (!clientId || !redirectUri) return null;

  const url = new URL("https://kauth.kakao.com/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  return url.toString();
}

export default function AuthExpiredOverlay() {
  const authExpired = useAuthUiStore((s) => s.authExpired);
  const logoutLocal = useMemo(
    () => () => {
      // 네트워크 로그아웃은 axios 인터셉터에서 이미 시도함.
      // 여기서는 UI/캐시 정리만.
      try {
        localStorage.removeItem("user");
      } catch {
        // ignore
      }
      useOauthStore.setState({ user: null, isAuthenticated: false });
    },
    []
  );

  useEffect(() => {
    if (!authExpired) return;
    logoutLocal();
  }, [authExpired, logoutLocal]);

  if (!authExpired) return null;

  const kakaoUrl = buildKakaoAuthorizeUrl();

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => {}} />
      <div className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl md:rounded-2xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">로그인이 만료되었어요</h2>
          <p className="mt-1 text-sm text-gray-600">
            다시 로그인하거나, 홈으로 이동할 수 있어요.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="h-12 w-full rounded-xl bg-[#FEE500] text-gray-900 font-semibold"
            onClick={() => {
              hideAuthExpired();
              if (kakaoUrl) {
                window.location.assign(kakaoUrl);
                return;
              }
              window.location.replace("/");
            }}
          >
            카카오로 다시 로그인
          </button>

          <button
            type="button"
            className="h-12 w-full rounded-xl bg-gray-900 text-white font-semibold"
            onClick={() => {
              hideAuthExpired();
              window.location.replace("/");
            }}
          >
            홈으로 이동
          </button>

          <button
            type="button"
            className="h-10 w-full rounded-xl bg-gray-100 text-gray-700"
            onClick={() => {
              // 오버레이만 닫고 사용자가 계속 탐색하도록(요청은 계속 실패할 수 있음)
              hideAuthExpired();
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}


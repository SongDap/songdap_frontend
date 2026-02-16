"use client";

import { useEffect, useMemo } from "react";
import { hideAuthExpired, useAuthUiStore } from "@/features/oauth/model/authUiStore";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { getKakaoLoginUrl } from "@/shared/lib/kakaoLogin";

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

  // 세션 만료 시 모달 표시와 동시에 프로필(스토어) 즉시 반영
  useEffect(() => {
    if (!authExpired) return;
    logoutLocal();
  }, [authExpired, logoutLocal]);

  // axios 인터셉터에서 발생시키는 이벤트 수신 → 같은 틱에 스토어 갱신해 헤더/프로필이 새로고침 없이 반영
  useEffect(() => {
    const onAuthExpired = () => {
      logoutLocal();
    };
    window.addEventListener("auth:expired", onAuthExpired);
    return () => window.removeEventListener("auth:expired", onAuthExpired);
  }, [logoutLocal]);

  if (!authExpired) return null;

  const kakaoUrl = getKakaoLoginUrl();

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
            aria-label="카카오로 다시 로그인"
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
            aria-label="홈으로 이동"
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
            aria-label="닫기"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}


'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AxiosError } from 'axios';
import { loginWithKakao } from '@/features/oauth/api/oauthApi';
import { useOauthStore } from '@/features/oauth/model/useOauthStore';
import { ROUTES } from '@/shared/lib/routes';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginFunction = useOauthStore((s) => s.login);
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");

    if (DEBUG_OAUTH) {
      console.log("[OAUTH][KAKAO][03] 콜백 진입 (/oauth/kakao/callback)");
      console.log("현재 URL:", typeof window !== "undefined" ? window.location.href : "(server)");
      console.log("code 존재:", Boolean(code));
      console.log("error:", errorParam);
      console.log("error_description:", errorDesc);
      console.groupEnd();
    }

    if (errorParam) {
      console.error("[OAUTH][KAKAO][ERR] 카카오 인증 에러:", {
        error: errorParam,
        description: errorDesc,
      });
      alert(`카카오 로그인이 취소되었습니다.\n에러: ${errorParam}${errorDesc ? `\n${errorDesc}` : ""}`);
      router.replace(ROUTES.HOME);
      return;
    }

    if (!code) {
      console.warn("[OAUTH][KAKAO][WARN] code 파라미터가 없습니다.");
      router.replace(ROUTES.HOME);
      return;
    }

    // 인가 코드는 1회성이므로, 중복 호출 방지
    // (StrictMode/리렌더/뒤로가기 등에서 재호출되면 카카오가 invalid_grant로 거절할 수 있음)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRequesting = useRef(false);
  const hasHandledError = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    if (isRequesting.current) return;
    isRequesting.current = true;

    loginWithKakao(code)
      .then((data) => {
        loginFunction(data);
        const nextPath = data?.newMember ? "/signup" : ROUTES.ALBUM.LIST;
        router.replace(nextPath);
      })
      .catch((error) => {
        const isAxiosError = error && typeof error === 'object' && 'isAxiosError' in error;
        const axiosError = isAxiosError ? (error as AxiosError) : null;

        const status = axiosError?.response?.status;
        const errorData = axiosError?.response?.data;
        console.error('[OAUTH][KAKAO][ERR] 카카오 로그인 실패', { status, errorData });

        isRequesting.current = false;
        if (!hasHandledError.current) {
          hasHandledError.current = true;
          alert('카카오 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
          router.replace(ROUTES.HOME);
        }
      });
  }, [searchParams, router, loginFunction]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        <p className="text-sm text-gray-600">카카오 로그인 처리 중입니다</p>
      </div>
    </main>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={null}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
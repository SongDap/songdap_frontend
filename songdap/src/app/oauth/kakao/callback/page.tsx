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
        if (data?.newMember) {
          router.replace("/signup");
          return;
        }
        // state에 저장된 복귀 경로가 있으면 그대로 앨범 상세 등 유지
        const stateParam = searchParams.get("state");
        let nextPath = ROUTES.ALBUM.LIST;
        if (stateParam) {
          try {
            const decoded = decodeURIComponent(stateParam);
            // Open redirect 방지: /로 시작하고 // 또는 프로토콜 없음
            if (decoded.startsWith("/") && !decoded.startsWith("//") && !decoded.includes(":")) {
              nextPath = decoded;
            }
          } catch {
            // state 파싱 실패 시 기본값 유지
          }
        }
        router.replace(nextPath);
      })
      .catch((error) => {
        const isAxiosError = error && typeof error === 'object' && 'isAxiosError' in error;
        const axiosError = isAxiosError ? (error as AxiosError) : null;

        const status = axiosError?.response?.status;
        const errorData = axiosError?.response?.data;
        const requestUrl = axiosError?.config?.url;
        const baseURL = axiosError?.config?.baseURL;
        const fullUrl = baseURL ? `${baseURL}${requestUrl}` : requestUrl;
        
        console.error('[OAUTH][KAKAO][ERR] 카카오 로그인 실패', { 
          status, 
          requestUrl,
          baseURL,
          fullUrl,
          method: axiosError?.config?.method,
          headers: axiosError?.config?.headers,
          requestData: axiosError?.config?.data,
          responseHeaders: axiosError?.response?.headers,
        });
        
        // errorData를 별도로 로깅하여 객체 내용을 펼쳐서 볼 수 있도록 함
        if (errorData && typeof errorData === 'object') {
          console.error('[OAUTH][KAKAO][ERR] 에러 응답 데이터:', errorData);
          // 에러 메시지가 있으면 별도로 표시
          const errorObj = errorData as { message?: string; code?: string | number };
          if (errorObj.message) {
            console.error('[OAUTH][KAKAO][ERR] 에러 메시지:', errorObj.message);
          }
          if (errorObj.code) {
            console.error('[OAUTH][KAKAO][ERR] 에러 코드:', errorObj.code);
          }
        }

        isRequesting.current = false;
        if (!hasHandledError.current) {
          hasHandledError.current = true;
          
          // 더 자세한 에러 메시지 제공
          let errorMessage = '카카오 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.';
          if (status === 500) {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else if (status === 400) {
            errorMessage = '잘못된 요청입니다. 다시 시도해주세요.';
          } else if (status === 401) {
            errorMessage = '인증에 실패했습니다. 다시 시도해주세요.';
          }
          
          alert(errorMessage);
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
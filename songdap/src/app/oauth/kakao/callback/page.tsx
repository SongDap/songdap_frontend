'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithKakao } from '@/features/oauth/api/oauthApi';
import { useOauthStore } from '@/features/oauth/model/useOauthStore';
import type { AxiosError } from 'axios';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginFunction = useOauthStore((s) => s.login);
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";

  const isRequesting = useRef(false);
  const hasHandledError = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");

    if (DEBUG_OAUTH) {
      console.log("[OAUTH][KAKAO][03] 콜백 진입");
      console.log("현재 URL:", typeof window !== "undefined" ? window.location.href : "(server)");
      console.log("code 존재:", Boolean(code));
      console.log("error:", errorParam);
      console.log("error_description:", errorDesc);
      console.groupEnd();
    }

    // 카카오에서 에러 파라미터가 온 경우 (사용자가 동의 거부 등)
    if (errorParam) {
      console.error("[OAUTH][KAKAO][ERR] 카카오 인증 에러:", {
        error: errorParam,
        description: errorDesc,
      });
      if (!hasHandledError.current) {
        hasHandledError.current = true;
        alert(`카카오 로그인이 취소되었습니다.\n에러: ${errorParam}${errorDesc ? `\n${errorDesc}` : ""}`);
        router.replace('/');
      }
      return;
    }

    if (code) {
      if (!isRequesting.current) {
        isRequesting.current = true;
        if (DEBUG_OAUTH) {
          console.log("[OAUTH][KAKAO][04] 백엔드 교환 API 호출 시작");
        }
        loginWithKakao(code)
          .then((data) => {
            if (DEBUG_OAUTH) {
              console.log("[OAUTH][KAKAO][05] 백엔드 응답 수신", {
                hasUser: Boolean(data?.user),
                nickname: data?.user?.nickname,
                newMember: (data as any).newMember,
              });
            }
            
            // 로그인 성공 시 유저 정보 저장
            loginFunction(data);
            
            // 무조건 signup 페이지로 이동
            if (DEBUG_OAUTH) {
              console.log("[OAUTH][KAKAO][06] 로그인 성공 → /signup 이동");
            }
            router.replace('/signup');
          })
          .catch((error) => {
            // 에러 타입 안전하게 파싱
            const isAxiosError = error && typeof error === 'object' && 'isAxiosError' in error;
            const axiosError = isAxiosError ? (error as AxiosError) : null;
            
            // 에러 정보 추출 (안전하게)
            const errorMessage = 
              axiosError?.message || 
              (error instanceof Error ? error.message : String(error));
            const status = axiosError?.response?.status;
            const statusText = axiosError?.response?.statusText;
            const errorData = axiosError?.response?.data;
            const requestUrl = axiosError?.config?.url || axiosError?.config?.baseURL;
            const requestMethod = axiosError?.config?.method;
            
            // 상세 에러 정보 로깅
            console.error('[OAUTH][KAKAO][ERR] 카카오 로그인 실패');
            console.error('에러 타입:', isAxiosError ? 'AxiosError' : typeof error);
            console.error('에러 메시지:', errorMessage);
            console.error('HTTP 상태:', status || '(없음)');
            console.error('상태 텍스트:', statusText || '(없음)');
            console.error('응답 데이터:', errorData || '(없음)');
            console.error('요청 URL:', requestUrl || '(없음)');
            console.error('요청 메서드:', requestMethod || '(없음)');
            if (axiosError?.config) {
              console.error('baseURL:', axiosError.config.baseURL || '(없음)');
              console.error('전체 요청 URL:', axiosError.config.baseURL 
                ? `${axiosError.config.baseURL}${axiosError.config.url}` 
                : axiosError.config.url || '(없음)');
              console.error('요청 Body:', axiosError.config.data || '(없음)');
            }
            console.error('환경변수 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || '(설정 안 됨)');
            
            // 401 에러일 때 추가 정보
            if (status === 401) {
              console.error('[OAUTH][KAKAO][ERR][401] 인증 실패 상세 정보:');
              console.error('- 백엔드가 카카오 인가 코드를 검증하지 못했을 수 있습니다');
              console.error('- 카카오 앱 키 또는 Redirect URI가 백엔드 설정과 일치하는지 확인하세요');
              console.error('- 백엔드 응답:', JSON.stringify(errorData, null, 2));
              
              // 백엔드가 카카오 API 에러를 전달한 경우 파싱
              const errorDataObj = errorData as any;
              if (errorDataObj?.error === 'invalid_client' || errorDataObj?.error_code === 'KOE101') {
                console.error('[OAUTH][KAKAO][ERR] 백엔드 카카오 앱 키 설정 문제 감지!');
                console.error('- 백엔드 서버의 카카오 REST API 키가 설정되지 않았거나 잘못되었습니다');
                console.error('- 백엔드 설정 파일에서 카카오 REST API 키를 확인하세요');
              }
            }
            
            if (DEBUG_OAUTH) {
              console.groupCollapsed("[OAUTH][KAKAO][ERR] 상세 에러 정보");
              console.error("원본 에러 객체:", error);
              console.error("에러 스택:", error instanceof Error ? error.stack : '(없음)');
              if (axiosError) {
                console.error("Axios config:", axiosError.config);
                console.error("Axios response:", axiosError.response);
              }
              console.groupEnd();
            }
            
            isRequesting.current = false;
            if (!hasHandledError.current) {
              hasHandledError.current = true;
              
              // 에러 타입별 메시지
              let userMessage = '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.';
              if (status === 401) {
                userMessage = '인증에 실패했습니다. 카카오 로그인을 다시 시도해주세요.';
              } else if (status === 404) {
                userMessage = '로그인 API를 찾을 수 없습니다. 관리자에게 문의해주세요.';
              } else if (status === 500) {
                userMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
              } else if (errorMessage && (errorMessage.includes('Network Error') || errorMessage.includes('timeout') || errorMessage.includes('ERR_NETWORK'))) {
                userMessage = '네트워크 연결을 확인해주세요. 백엔드 서버가 실행 중인지 확인해주세요.';
              } else if (!status && !errorMessage) {
                userMessage = '알 수 없는 오류가 발생했습니다. 콘솔을 확인해주세요.';
              }
              
              alert(userMessage);
              router.replace('/');
            }
          });
      }
    } else {
      // code가 없는 경우 (카카오에서 리다이렉트만 하고 code를 안 준 경우)
      console.warn("[OAUTH][KAKAO][WARN] code 파라미터가 없습니다.");
      if (!hasHandledError.current) {
        hasHandledError.current = true;
        router.replace('/');
      }
    }
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
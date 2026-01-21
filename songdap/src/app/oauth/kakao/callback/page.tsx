'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithKakao } from '@/features/oauth/api/oauthApi';
import { useOauthStore } from '@/features/oauth/model/useOauthStore';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useOauthStore();
  const loginFunction = store.login;

  const isRequesting = useRef(false);
  const hasHandledError = useRef(false);

  useEffect(function () {
    const code = searchParams.get('code');

    if (code) {
      if (!isRequesting.current) {
        isRequesting.current = true;

        loginWithKakao(code)
          .then(function (data) {
            loginFunction(data);
            router.replace('/');
          })
          .catch(function (error) {
            console.error('카카오 로그인 실패:', error);
            isRequesting.current = false;
            if (!hasHandledError.current) {
              hasHandledError.current = true;
              alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
              router.replace('/');
            }
          });
      }
    } else {
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
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="text-sm text-gray-600">로딩 중...</p>
          </div>
        </main>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}

'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithKakao } from '@/features/oauth/api/oauthApi';
import { useOauthStore } from '@/features/oauth/model/useOauthStore';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginFunction = useOauthStore((s) => s.login);

  const isRequesting = useRef(false);
  const hasHandledError = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      if (!isRequesting.current) {
        isRequesting.current = true;
        loginWithKakao(code)
          .then((data) => {
            loginFunction(data);
            router.replace('/');
          })
          .catch((error) => {
            console.error('카카오 로그인 실패:', error);
            isRequesting.current = false;
            if (!hasHandledError.current) {
              hasHandledError.current = true;
              alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
              router.replace('/');
            }
          });
      }
    } else {
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



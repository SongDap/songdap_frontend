'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function KakaoCallbackRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const target = `/oauth/callback/kakao${query ? `?${query}` : ""}`;
    router.replace(target);
  }, [router, searchParams]);

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
      <KakaoCallbackRedirect />
    </Suspense>
  );
}
'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 방금 만든 가짜 API와 저장소 가져오기
import { loginWithKakao } from '@/features/oauth/api/oauthApi';
import { useOauthStore } from '@/features/oauth/model/useOauthStore';

function KakaoCallbackContent() {
    // 라우터 : 주소(URL)가 바뀔 때마다 어떤 화면 보여줄지 관리 및 이동시키는 역할
    const router = useRouter(); // router.push('/some-path')  이런식으로 사용
    const searchParams = useSearchParams(); // ?뒤 파라미터값을 읽기 위한 것

    // 저장소 불러오기
    const store = useOauthStore();
    const loginFunction = store.login;

    const isRequesting = useRef(false) // 중복처리 방지 : 

    useEffect(function () {
        // 1. URL에서 'code' 파라미터 읽어오기 : oauth2.0방식 -> "사용자가 인증에 성공하면,
        // 인증 서버는 클라이언트의 redirect URI로 authorization code를 쿼리 파라미터로 전달한다."
        const code = searchParams.get('code');

        if (code) {
            // 1. 이미 요청 중이 아니라면 실행 -> 일반적인 실행
            if (!isRequesting.current) {
                isRequesting.current = true; // 요청 중 상태로 변경

                // 2. API함수 실행
                loginWithKakao(code).then(function (data) {
                    console.log('로그인 성공! 받은 data : ', data);

                    // 3. 저장소에 데이터 처리
                    loginFunction(data);

                    // 4. 메인페이지로 이동
                    router.push('/');
                })
            }
        }
    }, [searchParams, router, loginFunction]);

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div
                    className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"
                />
                <p className="text-sm text-gray-600">
                    카카오 로그인 처리 중입니다
                </p>
            </div>
        </main>
    );
}

export default function KakaoCallbackPage() {
    return (
        <Suspense fallback={
            <main className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"
                    />
                    <p className="text-sm text-gray-600">
                        로딩 중...
                    </p>
                </div>
            </main>
        }>
            <KakaoCallbackContent />
        </Suspense>
    );
}
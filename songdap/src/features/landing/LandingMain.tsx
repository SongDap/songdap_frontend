"use client";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { ROUTES } from "@/shared/lib/routes";

interface Album {
  id: number;
  color: string;
  imageSrc: string;
}


export default function LandingMain() {
  const isAuthenticated = useOauthStore((s) => s.isAuthenticated);
  const hydrate = useOauthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 환경변수 가져오기
  const JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI; // 여기 나중에 서버 URI로 바꿔야함
  const DEBUG_OAUTH = process.env.NEXT_PUBLIC_DEBUG_OAUTH === "true";

  // 카카오 로그인 주소 조합하기
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${JAVASCRIPT_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  // 클릭하면 실행될 함수
  function handleLogin() {
    if (DEBUG_OAUTH) {
      console.groupCollapsed("[OAUTH][KAKAO][01] 로그인 버튼 클릭");
      console.log("JAVASCRIPT_KEY 존재:", Boolean(JAVASCRIPT_KEY));
      console.log("REDIRECT_URI:", REDIRECT_URI);
      console.log("authorize URL:", kakaoURL);
      console.groupEnd();
    }
    // 1. 환경변수 미설정 체크
    if (!JAVASCRIPT_KEY || !REDIRECT_URI) {
      console.error("환경변수가 설정되지 않았습니다", {
        JAVASCRIPT_KEY,
        REDIRECT_URI
      });
      alert("로그인 설정 누락")
      return;
    }

    // 2. URL 유효성 체크
    try {
      // redirect uri가 진짜 url인지 검증
      new URL(REDIRECT_URI);
      // kakaoURL이 정상 문자열인지 최소 검증
      if (!kakaoURL.startsWith("https://kauth.kakao.com/oauth/authorize")) {
        throw new Error("Kakao authorize URL 생성 실패");
      }

    } catch (error) {
      console.error("Redirect URI 검증 실패", error);
      return;
    }

    // 3. Redirect 실패 처리
    try {
      if (DEBUG_OAUTH) {
        console.info("[OAUTH][KAKAO][02] 카카오 authorize로 이동합니다");
      }
      window.location.assign(kakaoURL); // 현재 페이지를 kakaoURL에 담긴 주소로 이동시켜라
    } catch (error) {
      console.error("Login Redirect 오류", error)
    }
  }

  return (
<div className="w-full px-6 lg:px-16">
  <div className="grid grid-cols-1 lg:grid-cols-2 items-center max-w-[1440px] mx-auto py-12 gap-12 lg:gap-8">
    {/* 왼쪽 */}
    <div className="flex flex-col justify-center space-y-6">
      <div className="space-y-3">
        <p className="text-base lg:text-lg text-gray-600 font-medium" style={{ fontFamily: "KOTRA_HOPE" }}>
          그날을 추억하는 방법
        </p>

        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="paper airplane"
            width={500}
            height={260}
            priority
            className="w-[280px] sm:w-[360px] lg:w-[460px] h-auto mb-6"
          />
        </Link>

        <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xl" style={{ fontFamily: "KOTRA_HOPE" }}>
          전교 1등은 무슨 노래를 듣는지 궁금할 때
          <br />
          음악으로 졸업식 같은 기념일을 추억하고 싶을 때
          <br />
          공감해주는 말한마디를 건낼 때, 노래로 답해줘
        </p>
      </div>

      {/* 카카오 로그인 버튼 클릭 */}
      {isAuthenticated ? (
        <Link
          href={ROUTES.ALBUM.LIST}
          className="
            w-full sm:w-auto
            inline-flex items-center justify-center gap-2
            px-10 py-4
            bg-[#006FFF] hover:bg-[#0056CC]
            text-white font-semibold
            rounded-xl
            transition-colors
            active:scale-95
            shadow-lg
          "
        >
          내 앨범 보기
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleLogin}
          className="
            w-full sm:w-auto
            flex items-center justify-center gap-2
            px-10 py-4
            bg-[#FEE500] hover:bg-[#FEE500]
            text-gray-900 font-semibold
            rounded-xl
            transition-colors
            active:scale-95
            shadow-lg
          "
        >
          <Image
            src="/images/kakaoButton.png"
            alt="kakao Login"
            width={220}
            height={52}
            priority
            className="h-auto"
          />
        </button>
      )}
    </div>

    {/* 오른쪽 */}
    <div className="flex justify-center lg:justify-end">
      <Image
        src="/images/rightAlbum.png"
        alt="right album"
        width={900}
        height={500}
        priority
        className="w-[95%] sm:w-[90%] lg:w-[120%] 2xl:w-[135%] max-w-none h-auto"
      />
    </div>
  </div>
</div>

  );
}

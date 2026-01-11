"use client";
import Image from "next/image";

export default function LandingMain() {
  // 환경변수 가져오기
  const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  // 카카오 로그인 주소 조합하기
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  // 클릭하면 실행될 함수
  function handleLogin() {
    // 1. 환경변수 미설정 체크
    if (!REST_API_KEY || !REDIRECT_URI) {
      console.error("환경변수가 설정되지 않았습니다", {
        REST_API_KEY,
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
      window.location.assign(kakaoURL); // 현재 페이지를 kakaoURL에 담긴 주소로 이동시켜라
    } catch (error) {
      console.error("Login Redirect 오류", error)
    }
  }

  return (

    <div className="w-full px-4 flex flex-col items-center justify-center -mb-6">
      {/* 타이틀 */}
      <div className="mb-2 text-center relative z-10" style={{ fontFamily: 'YangJin' }}>
        <h1
          className="leading-none font-[var(--font-yangjin)] whitespace-nowrap"
          style={{
            marginTop: "clamp(2rem, 5vh, 3.125rem)",
            fontSize: 'clamp(2.5rem, 12vw, 5.625rem)',
            textShadow:
              "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          <span style={{ color: "#5088C5" }}>노</span>
          <span style={{ color: "#8BC9C4", marginRight: "0.5em" }}>래로</span>
          <span style={{ color: "#5088C5" }}>답</span>
          <span style={{ color: "#8BC9C4" }}>해줘</span>
        </h1>

        <div className="pt-6">
          <h2 className="leading-relaxed text-[#5E6F7A] font-[var(--font-cafe24-proslim)] tracking-tight" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
            노래로 전하는 나의 마음
          </h2>
        </div>
      </div>

      <p> </p>

      <div className="relative mt-10 mb-12" style={{ width: 'clamp(200px, 40vw, 360px)', height: 'clamp(200px, 40vw, 360px)' }}>
      <Image
          src="/images/lp_mainpage.png"
          alt="LP main"
          fill
          className="object-contain animate-spin-slow"
          priority
        />

      </div>

      <p> </p>

      {/* 카카오 로그인 버튼 */}
      <div className="w-full max-w-xs relative transition-transform hover:scale-105 active:scale-95" style={{ height: 'clamp(3rem, 6vh, 4rem)' }}>
        <button
          type="button"
          onClick={handleLogin}
          className="border-0 bg-transparent p-0 cursor-pointer appearance-none"
        >

          <Image
            src="/images/kakaoLoginMain.png"
            alt="kakaoLogin"
            width={540}
            height={96}
            priority
            className="w-full max-w-xs h-auto"
          />
        </button>
      </div>
    </div>
  );
}
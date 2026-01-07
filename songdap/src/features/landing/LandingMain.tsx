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
    window.location.href = kakaoURL;
  }

  return (

    <div className="w-full px-4 flex flex-col items-center justify-center -mb-6">
      {/* 타이틀 */}
      <div className="mb-2 text-center relative z-10">
        <h1
          className="text-[90px] leading-none font-[var(--font-yangjin)] inline-block -mb-8"
          style={{
            transform: "translateY(50px)", // 요소를 원래자리에서 아래로 50px만큼 이동
            textShadow:
              "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          <span style={{ color: "#5088C5" }}>노</span>
          <span style={{ color: "#8BC9C4", marginRight: "0.5em" }}>래로</span>
          <span style={{ color: "#5088C5" }}>답</span>
          <span style={{ color: "#8BC9C4" }}>해줘</span>
        </h1>

        <h2 className="mt-0 text-[18px] md:text-[20px] leading-relaxed text-[#5E6F7A] font-[var(--font-cafe24-proslim)] tracking-tight text-center">
          노래로 전하는 나의 마음
        </h2>
      </div>

      <p> </p>

      <div className="relative w-80 h-80 mb-12 flex items-center justify-center">
        <Image
          src="/images/lp_mainpage.png"
          alt="LP main"
          width={360}   // 가로 320px (w-80과 동일)
          height={360}  // 세로 320px (h-80과 동일)
          className="object-contain animate-spin-slow"
          priority
        />

      </div>

      <p> </p>

      {/* 카카오 로그인 버튼 */}
      <div className="w-full max-w-xs relative h-16 transition-transform hover:scale-105 active:scale-95">
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
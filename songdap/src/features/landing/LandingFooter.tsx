'use client';
import Image from "next/image";

export default function LandingFooter() {
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
    <main className="flex flex-1 flex-col items-center justify-center gap-10">
      <button
        type="button"
        onClick={handleLogin}
        className="
    border-0
    bg-transparent
    p-0
    cursor-pointer
    appearance-none
  "
      >        <Image
          src="/kakaoLoginMain.png"
          alt="kakaoLogin"
          width={360}
          height={96}
          priority
          className="
          w-[35vw]
          max-w-[360px]
          min-w-[260px]
          h-auto
        "
        />
      </button>
    </main>
  );
}

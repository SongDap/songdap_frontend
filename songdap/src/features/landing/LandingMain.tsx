"use client";
import { HiChatBubbleLeftRight } from "react-icons/hi2";

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
    <div className="w-full flex flex-col items-center justify-center">
      {/* 카카오 로그인 버튼 */}
      <button
        type="button"
        onClick={handleLogin}
        className="flex items-center gap-3 px-6 py-3 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-medium rounded-lg transition-colors active:scale-95 shadow-md"
      >
        <HiChatBubbleLeftRight className="w-6 h-6" />
        <span>카카오로 로그인</span>
      </button>
    </div>
  );
}

"use client";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";

interface Album {
  id: number;
  color: string;
  imageSrc: string;
}


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
    <div className="w-full px-6 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto py-12">
        {/* 왼쪽: 텍스트 및 로그인 버튼 */}
        <div className="flex flex-col justify-center space-y-8">
          {/* 텍스트 섹션 */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: "KOTRA_HOPE" }}>그날을 추억하는 방법</p>
            <h1
              className="
    text-[150px]
    leading-[1.05]
    tracking-[-0.02em]
    flex items-end gap-2
  "
              style={{ fontFamily: "KOTRA_HOPE" }}
            >
              <div>
                {/* 아래 className="shrink-0" 추가 및 mb(마진)으로 높이 미세 조정 */}
                <Link href="/">
                  <Image
                    src="/images/logo.png"
                    alt="paper airplane"
                    width={450}
                    height={200}
                    className="shrink-0 mb-8"
                  />
                </Link>
              </div>
            </h1>

            <p className="text-gray-700 text-lg mt-6 leading-relaxed max-w-md" style={{ fontFamily: "KOTRA_HOPE" }}>
              전교 1등은 무슨 노래를 듣는지 궁금할 때
              <br />
              음악으로 졸업식 같은 기념일을 추억하고 싶을 때
              <br />
              공감해주는 말한마디를 건낼 때, 노래로 답해줘
            </p>
          </div>

          {/* 카카오 로그인 버튼 */}
          <button
            type="button"
            onClick={handleLogin}
className="
  w-full sm:w-auto
  flex items-center justify-center gap-2
  px-8 py-3
  bg-[#FEE500] hover:bg-[#FEE500]
  text-gray-900 font-semibold
  rounded-lg
  transition-colors
  active:scale-95
  shadow-lg
"
          >
            <Image
              src="/images/kakaoButton.png"
              alt="kakao Login"
              width={200}
              height={48}
              priority
            />
          </button>
        </div>

        {/* 오른쪽: 앨범 그리드 */}
        <div className="grid grid-cols-3 gap-4 h-fit">
          {/*
{mockAlbums.map((album) => (
  <div
    key={album.id}
    className={`${album.color} aspect-square rounded-lg shadow-lg flex items-center justify-center overflow-hidden hover:shadow-xl transition-shadow`}
  >
    <div className="w-4/5 h-4/5 bg-gradient-to-b from-pink-100 to-pink-300 rounded-full flex items-center justify-center relative shadow-inner">
      <div className="w-3/5 h-3/5 bg-black rounded-full flex items-center justify-center">
        <div className="w-1/3 h-1/3 bg-pink-300 rounded-full"></div>
      </div>
    </div>
  </div>
))}
*/}

        </div>
      </div>
    </div>
  );
}

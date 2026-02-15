"use client";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { trackEvent } from "@/lib/gtag";
import { ROUTES } from "@/shared/lib/routes";
import { getKakaoLoginUrl } from "@/shared/lib/kakaoLogin";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  function handleLogin() {
    trackEvent(
      { event: "select_content", content_type: "cta", item_id: "landing_kakao_login" },
      { category: "navigation", action: "click_button", label: "landing_kakao_login" }
    );
    const url = getKakaoLoginUrl();
    if (!url) {
      alert("로그인 설정 누락");
      return;
    }
    window.location.assign(url);
  }

  return (
    <div className="w-full md:overflow-visible overflow-hidden">

      {/* Mobile only */}
      <div className="md:hidden relative w-full h-[100dvh] overflow-hidden flex items-center justify-center">
        <Image
          src="/images/mainMobile.png"
          alt="landing mobile"
          width={5000}
          height={2000}
          priority
          className="w-[150vw] h-auto min-h-[150vh] object-cover"
        />

        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/15 z-10" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 px-6 text-center">
          {/* ... 내부 콘텐츠는 그대로 유지 ... */}
          <Image
            src="/images/logoMobile.png"
            alt="노래로 답해줘"
            width={2000}
            height={2000}
            priority
            className="h-auto w-[80%] max-w-[420px] -mt-5"
          />
          {isAuthenticated ? (
            <Link
              href={ROUTES.ALBUM.LIST}
              onClick={() =>
                trackEvent(
                  { event: "select_content", content_type: "cta", item_id: "landing_album_list" },
                  { category: "navigation", action: "click_button", label: "landing_album_list" }
                )
              }
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
      </div>


      {/* PC */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 items-center max-w-[1440px] mx-auto py-12 gap-12 lg:gap-8">
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
              onClick={() =>
                trackEvent(
                  { event: "select_content", content_type: "cta", item_id: "landing_album_list" },
                  { category: "navigation", action: "click_button", label: "landing_album_list" }
                )
              }
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
        <div className="flex justify-center lg:justify-end ml-20">
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

"use client";

import { useEffect, useState, useRef } from "react";
import { HiChevronDown, HiMail } from "react-icons/hi";
import { FaStepBackward, FaStepForward, FaPlay, FaPause, FaList } from "react-icons/fa";
import { LP } from "@/shared/ui";

// 상수
const MARQUEE_GAP = 80;
const MARQUEE_DURATION = '25s';
const TEXT_CONTAINER_WIDTH = '80%';
const ARTIST_FONT_SIZE = '20px';
const DATE_FONT_SIZE = '20px';
const NICKNAME_FONT_SIZE = '20px';
const MESSAGE_HEADER_FONT_SIZE = '18px';
const MESSAGE_BODY_FONT_SIZE = '20px';

// 반응형 크기 계산 상수
const LP_SIZE_RATIO = 0.75;
const LP_MAX_SIZE = 400;
const ICON_SIZE_RATIO = 0.12;
const ICON_MIN_SIZE = 40;
const ICON_MAX_SIZE = 56;
const YOUTUBE_ICON_SIZE_MULTIPLIER = 1.25; // 유튜브 아이콘만 더 크게
const TITLE_SIZE_RATIO = 0.03;
const TITLE_MIN_SIZE = 20;
const TITLE_MAX_SIZE = 32;
const SPACING_SMALL_RATIO = 0.01;
const SPACING_MEDIUM_RATIO = 0.02;
const SPACING_LARGE_RATIO = 0.04;
const SPACING_SMALL_MIN = 4;
const SPACING_SMALL_MAX = 12;
const SPACING_MEDIUM_MIN = 8;
const SPACING_MEDIUM_MAX = 20;
const SPACING_LARGE_MIN = 16;
const SPACING_LARGE_MAX = 40;

type MusicPlayerExpandedViewProps = {
  title: string;
  artist: string;
  imageUrl?: string | null;
  message?: string;
  nickname?: string;
  backgroundColor?: string;
  isOwner?: boolean | null; // 앨범 소유자 여부
  isPlaying: boolean;
  notice?: string | null;
  videoId?: string;
  showMiniVideo?: boolean;
  onPlayPause: (e: React.MouseEvent) => void;
  isPlayButtonDisabled?: boolean; // 3초 대기 중 등 재생 버튼 비활성화
  onClose: () => void;
  isClosing?: boolean; // 접히는 애니메이션 중인지 여부
  isOpening?: boolean; // 열리는 애니메이션 중인지 여부
  onPrevious?: () => void; // 이전곡
  onNext?: () => void; // 다음곡
  onOpenYouTubeModal?: () => void; // 유튜브 모달 열기(상위에서 처리)
};

export default function MusicPlayerExpandedView({
  title,
  artist,
  imageUrl,
  message,
  nickname,
  backgroundColor,
  isOwner = null,
  isPlaying,
  notice,
  videoId,
  showMiniVideo,
  onPlayPause,
  isPlayButtonDisabled = false,
  onClose,
  isClosing = false,
  isOpening = false,
  onPrevious,
  onNext,
  onOpenYouTubeModal,
}: MusicPlayerExpandedViewProps) {
  const [lpSize, setLpSize] = useState(280);
  const [iconSize, setIconSize] = useState(48);
  const [titleSize, setTitleSize] = useState(32);
  const [spacing, setSpacing] = useState({ small: 8, medium: 16, large: 32 });
  const [titleOverflow, setTitleOverflow] = useState(false);
  const [artistOverflow, setArtistOverflow] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const artistRef = useRef<HTMLParagraphElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const artistContainerRef = useRef<HTMLDivElement>(null);

  // 반응형 크기 계산
  useEffect(() => {
    const updateSizes = () => {
      if (typeof window === 'undefined') return;
      
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;
      const isDesktop = screenWidth >= 768;

      const iconMax = isDesktop ? 52 : ICON_MAX_SIZE;
      const smallMax = isDesktop ? 10 : SPACING_SMALL_MAX;
      const mediumMax = isDesktop ? 16 : SPACING_MEDIUM_MAX;
      const largeMax = isDesktop ? 28 : SPACING_LARGE_MAX;
      // LP 크기: 세로(화면 높이) 기준으로 반응형 + 가로/최대값으로 안전하게 캡
      const lpMax = isDesktop ? 320 : LP_MAX_SIZE;
      const lpByHeight = screenHeight * (isDesktop ? 0.32 : 0.34);
      const lpByWidthCap = (isDesktop ? Math.min(screenWidth, 672) : screenWidth) * 0.8;
      
      setLpSize(Math.min(lpByHeight, lpByWidthCap, lpMax));
      setIconSize(Math.max(ICON_MIN_SIZE, Math.min(screenWidth * ICON_SIZE_RATIO, iconMax)));
      setTitleSize(Math.max(TITLE_MIN_SIZE, Math.min(screenHeight * TITLE_SIZE_RATIO, TITLE_MAX_SIZE)));
      setSpacing({
        small: Math.max(SPACING_SMALL_MIN, Math.min(screenHeight * SPACING_SMALL_RATIO, smallMax)),
        medium: Math.max(SPACING_MEDIUM_MIN, Math.min(screenHeight * SPACING_MEDIUM_RATIO, mediumMax)),
        large: Math.max(SPACING_LARGE_MIN, Math.min(screenHeight * SPACING_LARGE_RATIO, largeMax)),
      });
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  // 텍스트 overflow 감지
  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current && titleContainerRef.current) {
        setTitleOverflow(titleRef.current.scrollWidth > titleContainerRef.current.clientWidth);
      }
      if (artistRef.current && artistContainerRef.current) {
        setArtistOverflow(artistRef.current.scrollWidth > artistContainerRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [title, artist, titleSize]);

  // 마퀴 텍스트 렌더링 헬퍼 함수
  const renderMarqueeText = (text: string, overflow: boolean, fallback: string) => {
    if (isPlaying && overflow) {
      return (
        <>
          {text || fallback}
          <span style={{ marginLeft: `${MARQUEE_GAP}px` }}>{text || fallback}</span>
        </>
      );
    }
    return text || fallback;
  };

  // 마퀴 스타일 생성 헬퍼 함수
  const getMarqueeStyle = (overflow: boolean, fontSize: string | number) => ({
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    overflow: 'hidden' as const,
    textOverflow: isPlaying && overflow ? ('clip' as const) : ('ellipsis' as const),
    whiteSpace: 'nowrap' as const,
    width: isPlaying && overflow ? 'max-content' : '100%',
    display: 'inline-block' as const,
    textAlign: (isPlaying && overflow ? 'left' : 'center') as 'left' | 'center',
    paddingRight: isPlaying && overflow ? `${MARQUEE_GAP}px` : '0',
    ["--marquee-duration" as any]: MARQUEE_DURATION,
  });

  // 컨트롤 버튼 공통 스타일
  const controlButtonClassName = "flex items-center justify-center hover:opacity-80 active:opacity-70 focus:outline-none transition-opacity";
  const iconStyle = { width: `${iconSize}px`, height: `${iconSize}px` };
  const controlIconStyle = { width: `${iconSize * 0.75}px`, height: `${iconSize * 0.75}px` }; // 재생/이전/다음 아이콘은 75% 크기
  const listIconStyle = { width: `${iconSize * 0.6}px`, height: `${iconSize * 0.6}px` }; // 리스트 아이콘만 더 작게
  const youtubeIconSize = Math.round(iconSize * YOUTUBE_ICON_SIZE_MULTIPLIER);

  // 아이콘 컨테이너 높이 계산 (paddingTop + iconSize + paddingBottom)
  const controlContainerHeight = spacing.medium + iconSize + spacing.large;

  const resolvedLpImageUrl =
    typeof imageUrl === "string" && imageUrl.trim().length > 0
      ? imageUrl.trim()
      : "https://placehold.co/256x256";

  return (
    <>
      {/* 위쪽 콘텐츠 부분 (슬라이드 애니메이션 적용) */}
      <div 
        className={`fixed top-0 left-0 right-0 flex flex-col ${isClosing ? 'animate-slide-content-down' : 'animate-slide-content-up'} md:left-1/2 md:right-auto md:w-[672px] md:-translate-x-1/2 md:rounded-t-3xl md:overflow-hidden`}
        style={{
          background: backgroundColor || 'white',
          zIndex: 50,
          bottom: `${controlContainerHeight}px`, // 아이콘 컨테이너 위까지만
        }}
        onClick={onClose}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
          aria-label="닫기"
        >
          <HiChevronDown className="w-6 h-6 text-gray-700" />
        </button>

        <div
          className="flex-1 min-h-0 flex flex-col items-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        {/* 제목/아티스트/LP (고정) */}
        <div
          className="flex-shrink-0 flex flex-col items-center w-full"
          style={{
            // 상단 여백을 조금 더 줘서 내용이 아래로 내려오게
            paddingTop: `${spacing.large + 28}px`,
            paddingBottom: `${spacing.medium}px`,
          }}
        >
          {/* 노래 제목 */}
          <div 
            ref={titleContainerRef}
            className="relative overflow-hidden"
            style={{ 
              width: TEXT_CONTAINER_WIDTH,
              marginBottom: `${spacing.small}px`, 
            }}
          >
            <h2 
              ref={titleRef}
              className={`font-bold text-white ${isPlaying && titleOverflow ? 'animate-marquee' : 'truncate'}`}
              style={getMarqueeStyle(titleOverflow, titleSize)}
              title={title || "노래 제목"}
            >
              {renderMarqueeText(title, titleOverflow, "노래 제목")}
            </h2>
          </div>

          {/* 아티스트 */}
          <div 
            ref={artistContainerRef}
            className="relative overflow-hidden"
            style={{ 
              width: TEXT_CONTAINER_WIDTH,
              marginBottom: `${spacing.medium}px`, 
            }}
          >
            <p 
              ref={artistRef}
              className={`text-white ${isPlaying && artistOverflow ? 'animate-marquee' : 'truncate'}`}
              style={getMarqueeStyle(artistOverflow, ARTIST_FONT_SIZE)}
              title={artist || "아티스트"}
            >
              {renderMarqueeText(artist, artistOverflow, "아티스트")}
            </p>
          </div>

          {/* LP 이미지 */}
          <div style={{ marginBottom: `${spacing.medium}px` }}>
            <LP 
              size={lpSize} 
              imageUrl={resolvedLpImageUrl}
              className={isPlaying ? 'animate-lp-rotate' : 'animate-lp-rotate-paused'}
            />
          </div>
        </div>

        {/* 날짜/닉네임/메시지: 한 덩어리로 같이 스크롤 */}
        <div
          className="flex-1 w-full overflow-y-auto min-h-0 px-4 scrollbar-hide mx-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            marginTop: `-${spacing.small}px`,
          } as React.CSSProperties & { scrollbarWidth?: string; msOverflowStyle?: string }}
        >
          <div className="w-full flex flex-col items-center">
            {/* 닉네임 */}
            {nickname && (
              <p
                className="text-white text-center font-bold"
                style={{ fontSize: NICKNAME_FONT_SIZE, marginBottom: `${spacing.medium}px` }}
              >
                From. {nickname}
              </p>
            )}

            {/* 메시지 */}
            {message ? (
              <div
                className="rounded-lg w-full"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  padding: `${spacing.medium}px ${spacing.large}px`,
                  maxWidth: "42rem",
                }}
              >
                {nickname && (
                  <p
                    className="text-gray-900 text-center flex items-center justify-center gap-1.5"
                    style={{ fontSize: MESSAGE_HEADER_FONT_SIZE, marginBottom: `${spacing.medium}px` }}
                  >
                    <HiMail className="w-4 h-4" />
                    <span>{nickname}님이 보낸 메시지</span>
                  </p>
                )}
                <p
                  className="text-gray-700 leading-relaxed text-center whitespace-pre-line"
                  style={{ fontSize: MESSAGE_BODY_FONT_SIZE }}
                >
                  {message}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        </div>
      </div>

      {/* 하단 컨트롤 버튼 (고정 위치, 뮤직플레이어바와 같은 위치) */}
      <div 
        className="fixed bottom-0 left-0 right-0 px-6 flex items-center justify-between md:left-1/2 md:right-auto md:w-[672px] md:-translate-x-1/2"
        style={{ 
          paddingTop: `${spacing.medium}px`, 
          paddingBottom: `${spacing.large}px`,
          zIndex: 50,
          background: backgroundColor || 'white',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 안내 문구 */}
        {notice && (
          <div className="absolute -top-12 left-0 right-0 flex justify-center px-6">
            <div className="text-white text-sm bg-black/40 px-3 py-2 rounded-full">
              {notice}
            </div>
          </div>
        )}
        {/* 유튜브 버튼 + 재생 중 태그 오버레이 */}
        <div
          className="relative flex shrink-0 items-center justify-center overflow-hidden"
          style={{
            width: youtubeIconSize,
            height: youtubeIconSize,
            minWidth: youtubeIconSize,
            minHeight: youtubeIconSize,
            maxWidth: youtubeIconSize,
            maxHeight: youtubeIconSize,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenYouTubeModal?.();
            }}
            className={`${controlButtonClassName} p-0`}
            style={{ width: youtubeIconSize, height: youtubeIconSize }}
            aria-label="유튜브"
          >
            <svg
              width={youtubeIconSize}
              height={youtubeIconSize}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-red-500"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2" fill="#EF4444" />
              <polygon points="9,8 9,16 16,12" fill="white" />
            </svg>
          </button>
          {isPlaying && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenYouTubeModal?.();
              }}
              className="absolute inset-0 flex flex-col items-center justify-center p-0 text-[9px] font-medium text-black leading-tight cursor-pointer hover:opacity-80 active:opacity-70 focus:outline-none transition-opacity"
              style={{ width: youtubeIconSize, height: youtubeIconSize }}
              aria-label="유튜브 재생 중 - 클릭하여 열기"
            >
              <span className="block pl-1">Youtube</span>
              <span className="block">재생 중</span>
            </button>
          )}
        </div>

        {/* 이전곡 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious?.();
          }}
          className={controlButtonClassName}
          aria-label="이전곡"
        >
          <FaStepBackward className="text-white" style={controlIconStyle} />
        </button>

        {/* 재생/일시정지 버튼 */}
        <button
          onClick={onPlayPause}
          disabled={isPlayButtonDisabled}
          className={`${controlButtonClassName} ${isPlayButtonDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            <FaPause className="text-white" style={controlIconStyle} />
          ) : (
            <FaPlay className="text-white" style={controlIconStyle} />
          )}
        </button>

        {/* 다음곡 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          className={controlButtonClassName}
          aria-label="다음곡"
        >
          <FaStepForward className="text-white" style={controlIconStyle} />
        </button>

        {/* 리스트 버튼 - 버튼 영역은 플레이어바 오른쪽(썸네일)과 동일하게 iconSize로 고정, 아이콘만 작게 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`${controlButtonClassName} shrink-0`}
          style={{ width: iconSize, height: iconSize }}
          aria-label="리스트"
        >
          <FaList className="text-white" style={listIconStyle} />
        </button>
      </div>
    </>
  );
}

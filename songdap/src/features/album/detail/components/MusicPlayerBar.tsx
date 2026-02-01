"use client";

import { useEffect, useState } from "react";
import { FaStepBackward, FaStepForward, FaPlay, FaPause } from "react-icons/fa";

// 반응형 크기 계산 상수
const ICON_SIZE_RATIO = 0.12;
const ICON_MIN_SIZE = 40;
const ICON_MAX_SIZE = 56;
const SPACING_SMALL_RATIO = 0.01;
const SPACING_MEDIUM_RATIO = 0.02;
const SPACING_LARGE_RATIO = 0.04;
const SPACING_SMALL_MIN = 4;
const SPACING_SMALL_MAX = 12;
const SPACING_MEDIUM_MIN = 8;
const SPACING_MEDIUM_MAX = 20;
const SPACING_LARGE_MIN = 16;
const SPACING_LARGE_MAX = 40;

type MusicPlayerBarProps = {
  title: string;
  artist: string;
  imageUrl?: string | null;
  isPlaying: boolean;
  notice?: string | null;
  videoId?: string;
  showMiniVideo?: boolean;
  onPlayPause: (e: React.MouseEvent) => void;
  onExpand: () => void;
  onOpenYouTubeModal?: () => void;
  onPrevious?: () => void; // 이전곡
  onNext?: () => void; // 다음곡
  backgroundColor?: string;
};

export default function MusicPlayerBar({
  imageUrl,
  isPlaying,
  notice,
  videoId,
  showMiniVideo,
  onPlayPause,
  onExpand,
  onOpenYouTubeModal,
  onPrevious,
  onNext,
  backgroundColor,
}: MusicPlayerBarProps) {
  const [iconSize, setIconSize] = useState(48);
  const [spacing, setSpacing] = useState({ small: 8, medium: 16, large: 32 });

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

      setIconSize(Math.max(ICON_MIN_SIZE, Math.min(screenWidth * ICON_SIZE_RATIO, iconMax)));
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

  // 컨트롤 버튼 공통 스타일
  const controlButtonClassName = "flex items-center justify-center hover:opacity-80 active:opacity-70 focus:outline-none transition-opacity";
  const iconStyle = { width: `${iconSize}px`, height: `${iconSize}px` };
  const controlIconStyle = { width: `${iconSize * 0.75}px`, height: `${iconSize * 0.75}px` }; // 재생/이전/다음 아이콘은 75% 크기

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-[20px] md:left-1/2 md:right-auto md:w-[672px] md:-translate-x-1/2 md:rounded-t-[20px]"
      style={{
        background: backgroundColor || 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {notice && (
        <div className="w-full flex justify-center px-6 pt-3">
          <div className="text-white text-sm bg-black/40 px-3 py-2 rounded-full">
            {notice}
          </div>
        </div>
      )}
      {/* 하단 컨트롤 버튼 (유튜브, 이전곡, 재생/일시정지, 다음곡, 리스트) */}
      <div 
        className="flex-shrink-0 w-full max-w-2xl mx-auto px-6 flex items-center justify-between"
        style={{ paddingTop: `${spacing.medium}px`, paddingBottom: `${spacing.large}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 유튜브 / 작게 보기 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenYouTubeModal?.();
          }}
          className={controlButtonClassName}
          aria-label="유튜브"
        >
          {showMiniVideo && videoId ? (
            <div
              className="relative overflow-hidden rounded-lg"
              style={iconStyle}
              aria-hidden
            >
              <img
                src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                alt="유튜브 미리보기"
                className="w-full h-full object-cover"
                style={iconStyle}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ) : (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-red-500"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2" fill="#EF4444" />
              <polygon points="9,8 9,16 16,12" fill="white" />
            </svg>
          )}
        </button>

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
          className={controlButtonClassName}
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

        {/* 노래 이미지 */}
        <div
          className="flex items-center justify-center overflow-hidden rounded-lg cursor-pointer hover:opacity-80 active:opacity-70 transition-opacity"
          style={iconStyle}
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          aria-label="확장 뷰 열기"
        >
          <img
            src={imageUrl || "https://placehold.co/56x56"}
            alt="노래 이미지"
            className="w-full h-full object-cover"
            style={iconStyle}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { HiLockClosed } from "react-icons/hi";

type SongLetterProps = {
  nickname?: string;
  message?: string;
  title?: string;
  artist?: string;
  imageUrl?: string | null;
  date?: string;
  className?: string;
  tapeColor?: string; // 테이프 색상 (앨범 커버 색상)
  isOwner?: boolean | null; // 앨범 소유자 여부
};

export default function SongLetter({
  nickname,
  message,
  title,
  artist,
  imageUrl,
  date,
  className = "",
  tapeColor,
  isOwner = null,
}: SongLetterProps) {
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isArtistExpanded, setIsArtistExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 편지 카드 가로폭 기준 반응형(모바일) 크기
  const [uiScale, setUiScale] = useState(() => ({
    imageSize: 96, // px
    titleSize: 20, // px
    artistSize: 16, // px
    gap: 16, // px
  }));

  const MAX_LENGTH = 20; // 말줄임표 표시 기준 길이
  const resolvedImageUrl =
    typeof imageUrl === "string" && imageUrl.trim().length > 0
      ? imageUrl.trim()
      : "https://placehold.co/256x256";

  // 편지 카드의 실제 가로폭을 기준으로 이미지/텍스트 크기 계산
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max));

    const update = (width: number) => {
      // width: padding 포함한 카드 폭
      const imageSize = Math.round(clamp(width * 0.22, 56, 96));
      const titleSize = clamp(width * 0.048, 18, 22);
      const artistSize = clamp(width * 0.036, 13, 16);
      const gap = Math.round(clamp(width * 0.04, 12, 16));
      setUiScale({ imageSize, titleSize, artistSize, gap });
    };

    // 초기 1회
    update(el.getBoundingClientRect().width);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      update(entry.contentRect.width);
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // 테두리 색상 (앨범 커버 색상, 30% 투명도)
  const getBorderColor = () => {
    if (tapeColor) {
      let hex = tapeColor.replace('#', '');
      
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `rgba(${r}, ${g}, ${b}, 0.3)`;
      }
    }
    return 'rgba(229, 231, 235, 1)'; // border-gray-200
  };

  return (
    <div 
      ref={containerRef}
      className={`rounded-lg shadow-lg p-6 w-full relative ${className}`}
      style={{
        backgroundColor: 'white',
        border: `1px solid ${getBorderColor()}`,
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.01) 0px,
            transparent 1px,
            transparent 3px,
            rgba(0, 0, 0, 0.01) 4px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.008) 0px,
            transparent 1px,
            transparent 3px,
            rgba(0, 0, 0, 0.008) 4px
          )
        `,
        backgroundSize: '8px 8px, 8px 8px',
      }}
    >
      {/* 둥근 테이프 */}
      {tapeColor && (
        <div 
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 rounded-full"
          style={{
            backgroundColor: tapeColor,
          }}
        />
      )}
      {/* 노래 이미지와 정보 */}
      {(imageUrl || title || artist) && (
        <div className="mb-4 flex items-center" style={{ gap: `${uiScale.gap}px` }}>
          {/* 노래 이미지 */}
          <div
            className="relative rounded-lg overflow-hidden flex-shrink-0"
            style={{ width: `${uiScale.imageSize}px`, height: `${uiScale.imageSize}px` }}
          >
            <img
              src={resolvedImageUrl}
              alt={title || "노래 이미지"}
              className="w-full h-full object-cover"
              style={{ width: `${uiScale.imageSize}px`, height: `${uiScale.imageSize}px` }}
            />
          </div>
          
          {/* 노래 제목과 아티스트 */}
          <div className="flex-1 min-w-0">
            {/* 노래 제목 */}
            {title && (
              <div className="mb-1">
                {title.length > MAX_LENGTH ? (
                  <h3 
                    onClick={() => setIsTitleExpanded(!isTitleExpanded)}
                    className={`font-bold text-gray-900 cursor-pointer hover:opacity-80 transition-opacity ${
                      !isTitleExpanded ? 'truncate' : ''
                    }`}
                    style={{ fontSize: `${uiScale.titleSize}px`, lineHeight: 1.2 }}
                  >
                    {isTitleExpanded ? title : `${title.substring(0, MAX_LENGTH)}...`}
                  </h3>
                ) : (
                  <h3 className="font-bold text-gray-900" style={{ fontSize: `${uiScale.titleSize}px`, lineHeight: 1.2 }}>
                    {title}
                  </h3>
                )}
              </div>
            )}

            {/* 아티스트 */}
            {artist && (
              <div>
                {artist.length > MAX_LENGTH ? (
                  <p 
                    onClick={() => setIsArtistExpanded(!isArtistExpanded)}
                    className={`text-gray-600 cursor-pointer hover:opacity-80 transition-opacity ${
                      !isArtistExpanded ? 'truncate' : ''
                    }`}
                    style={{ fontSize: `${uiScale.artistSize}px`, lineHeight: 1.3 }}
                  >
                    {isArtistExpanded ? artist : `${artist.substring(0, MAX_LENGTH)}...`}
                  </p>
                ) : (
                  <p className="text-gray-600" style={{ fontSize: `${uiScale.artistSize}px`, lineHeight: 1.3 }}>
                    {artist}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 메시지 */}
      {message && isOwner === true && (
        <div className="mb-4 max-w-2xl mx-auto">
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line text-center">
            {message}
          </p>
        </div>
      )}
      {message && isOwner !== true && (
        <div className="mb-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <HiLockClosed className="w-4 h-4" />
            <p className="text-base">비공개입니다.</p>
          </div>
        </div>
      )}

      {/* 닉네임 */}
      {nickname && (
        <div 
          className="pt-4 border-t"
          style={{
            borderColor: getBorderColor(),
          }}
        >
          <p className="text-sm text-gray-600">
            From. {nickname}
          </p>
        </div>
      )}
    </div>
  );
}

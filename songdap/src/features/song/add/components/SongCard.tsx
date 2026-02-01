"use client";

import { HiPencil, HiTrash } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";

type SongCardProps = {
  title: string;
  artist: string;
  imageUrl?: string | null;
  onEdit?: () => void;
  onCardClick?: () => void; // 카드 전체 클릭
  onPlay?: () => void;
  onDelete?: () => void; // 삭제 버튼 클릭
  backgroundOpacity?: number; // 배경 투명도 (기본값: 0.85)
  fullWidth?: boolean; // 전체 너비 사용 여부 (기본값: false)
  showPlayButton?: boolean; // 재생 버튼 표시 여부 (기본값: false)
  showDeleteButton?: boolean; // 삭제 버튼 표시 여부 (기본값: false)
  isActive?: boolean; // 선택된 노래인지 여부 (기본값: false)
  showBorder?: boolean; // 테두리 표시 여부 (기본값: true)
  separatorPlacement?: "none" | "all" | "top" | "bottom" | "topBottom"; // 구분선 위치 (기본값: "all")
  separatorColor?: string; // 구분선 색상(예: 앨범 커버 색상)
};

export default function SongCard({
  title,
  artist,
  imageUrl,
  onEdit,
  onCardClick,
  onPlay,
  onDelete,
  backgroundOpacity = 0.85,
  fullWidth = false,
  showPlayButton = false,
  showDeleteButton = false,
  isActive = false,
  showBorder = true,
  separatorPlacement = "all",
  separatorColor,
}: SongCardProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    }
  };

  const handleCardClick = () => {
    // 기본: 카드 클릭은 선택(하단 바 변경)만
    // (onCardClick 미지정인 기존 사용처는 하위 호환으로 onPlay 실행)
    if (onCardClick) return onCardClick();
    if (onPlay) return onPlay();
  };

  const toRgbaIfHex = (color: string, alpha: number) => {
    // #RRGGBB만 처리
    if (!/^#([0-9a-fA-F]{6})$/.test(color)) return color;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const effectivePlacement: "none" | "all" | "top" | "bottom" | "topBottom" =
    showBorder ? separatorPlacement : "none";
  const effectiveColor = separatorColor
    ? toRgbaIfHex(separatorColor, 0.35)
    : "rgba(0, 111, 255, 0.15)";

  const cardContent = (
    <div 
      className={`group relative min-h-[72px] px-4 py-3 flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:bg-white/90 cursor-pointer ${
        fullWidth ? "w-full rounded-none" : "rounded-[12px]"
      }`}
      style={{
        background: `rgba(255, 255, 255, ${backgroundOpacity})`,
        border:
          effectivePlacement === "all"
            ? `1px solid ${effectiveColor}`
            : "1px solid transparent",
        borderTop:
          effectivePlacement === "top" || effectivePlacement === "topBottom"
            ? `1px solid ${effectiveColor}`
            : "1px solid transparent",
        borderBottom:
          effectivePlacement === "bottom" || effectivePlacement === "topBottom"
            ? `1px solid ${effectiveColor}`
            : "1px solid transparent",
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
      onClick={handleCardClick}
    >
        {/* 노래 이미지 */}
        {imageUrl && (
          <div className="flex-shrink-0 relative overflow-hidden rounded-lg">
            <img
              src={imageUrl}
              alt={title || "노래 이미지"}
              className="w-14 h-14 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg pointer-events-none" />
          </div>
        )}

        {/* 노래 정보 */}
        <div className="flex flex-col justify-center items-start gap-1 flex-1 min-w-0">
          {/* 노래 제목 */}
          <div className={`text-base font-semibold leading-tight truncate w-full transition-colors ${
            isActive ? 'text-[#006FFF]' : 'text-gray-900 group-hover:text-[#006FFF]'
          }`}>
            {title || "노래 제목"}
          </div>
          {/* 아티스트 */}
          <div className="text-gray-600 text-sm font-medium leading-tight truncate w-full">
            {artist || "아티스트"}
          </div>
        </div>

        {/* 재생/삭제 버튼 */}
        {showPlayButton ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (showDeleteButton && onDelete) {
                onDelete();
              } else if (onPlay) {
                handlePlay();
              }
            }}
            className={`flex-shrink-0 transition-opacity w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-90 active:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              showDeleteButton
                ? "bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500 opacity-100"
                : `bg-[#006FFF] hover:bg-[#0056CC] active:bg-[#0044AA] focus:ring-[#006FFF] ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`
            }`}
            aria-label={showDeleteButton ? "삭제" : "재생"}
          >
            {showDeleteButton ? (
              <HiTrash className="w-4 h-4 text-white" />
            ) : (
              <FaPlay className="w-4 h-4 text-white" />
            )}
          </button>
        ) : onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            className="flex-shrink-0 transition-opacity w-10 h-10 rounded-full bg-[#006FFF] flex items-center justify-center hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2"
            aria-label="편집"
          >
            <HiPencil className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
  );

  if (fullWidth) {
    return cardContent;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {cardContent}
    </div>
  );
}

"use client";

import { HiPencil } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";

type SongCardProps = {
  title: string;
  artist: string;
  imageUrl?: string | null;
  onEdit?: () => void;
  onPlay?: () => void;
  backgroundOpacity?: number; // 배경 투명도 (기본값: 0.85)
  fullWidth?: boolean; // 전체 너비 사용 여부 (기본값: false)
  showPlayButton?: boolean; // 재생 버튼 표시 여부 (기본값: false)
  isActive?: boolean; // 선택된 노래인지 여부 (기본값: false)
};

export default function SongCard({ title, artist, imageUrl, onEdit, onPlay, backgroundOpacity = 0.85, fullWidth = false, showPlayButton = false, isActive = false }: SongCardProps) {
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
    // 노래 카드를 클릭하면 항상 익스팬드뷰 열기
    if (onPlay) {
      onPlay();
    }
  };

  const cardContent = (
    <div 
      className={`group relative min-h-[72px] px-4 py-3 flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:bg-white/90 cursor-pointer ${
        fullWidth ? "w-full rounded-none" : "rounded-[12px]"
      }`}
      style={{
        background: `rgba(255, 255, 255, ${backgroundOpacity})`,
        border: '1px solid rgba(0, 111, 255, 0.15)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
      onClick={handleCardClick}
    >
        {/* 노래 이미지 */}
        <div className="flex-shrink-0 relative overflow-hidden rounded-lg">
          <img
            src={imageUrl || "https://placehold.co/56x56"}
            alt={title || "노래 이미지"}
            className="w-14 h-14 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg pointer-events-none" />
        </div>

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

        {/* 호버 시 버튼 (재생 또는 편집) */}
        {showPlayButton ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            className={`flex-shrink-0 transition-opacity w-10 h-10 rounded-full bg-[#006FFF] flex items-center justify-center hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2 ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            aria-label="재생"
          >
            <FaPlay className="w-4 h-4 text-white" />
          </button>
        ) : onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-[#006FFF] flex items-center justify-center hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2"
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

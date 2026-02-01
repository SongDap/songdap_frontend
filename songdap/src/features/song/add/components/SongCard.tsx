"use client";

import { useState, useRef, useEffect } from "react";
import { HiPencil, HiTrash } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { HiEllipsisVertical } from "react-icons/hi2";

type SongCardProps = {
  title: string;
  artist: string;
  imageUrl?: string | null;
  onEdit?: () => void;
  onCardClick?: () => void;
  onPlay?: () => void;
  onDelete?: () => void;
  backgroundOpacity?: number;
  fullWidth?: boolean;
  showPlayButton?: boolean;
  isActive?: boolean;
  showBorder?: boolean;
  separatorPlacement?: "none" | "all" | "top" | "bottom" | "topBottom";
  separatorColor?: string;
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
  isActive = false,
  showBorder = true,
  separatorPlacement = "all",
  separatorColor,
}: SongCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

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
    if (onCardClick) return onCardClick();
    if (onPlay) return onPlay();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowMenu(false);
  };

  const toRgbaIfHex = (color: string, alpha: number) => {
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

        {/* 재생 버튼 및 메뉴 */}
        <div className="flex items-center gap-2">
          {showPlayButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
              className={`flex-shrink-0 w-10 h-10 rounded-full bg-[#006FFF] flex items-center justify-center hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2 transition-opacity ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              aria-label="재생"
            >
              <FaPlay className="w-4 h-4 text-white" />
            </button>
          )}

          {/* 3점 메뉴 */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-opacity ${
                onEdit || onDelete ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              aria-label="메뉴"
            >
              <HiEllipsisVertical className="w-5 h-5 text-gray-700" />
            </button>

            {/* 드롭다운 메뉴 */}
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg"
                  >
                    <HiPencil className="w-4 h-4" />
                    수정
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 last:rounded-b-lg"
                  >
                    <HiTrash className="w-4 h-4" />
                    삭제
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
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

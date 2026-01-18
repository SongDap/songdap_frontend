"use client";

import { HiPencil } from "react-icons/hi";

type SongCardProps = {
  title: string;
  artist: string;
  imageUrl?: string | null;
  onEdit?: () => void;
};

export default function SongCard({ title, artist, imageUrl, onEdit }: SongCardProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div 
        className="group relative min-h-[72px] rounded-[12px] px-4 py-3 flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:bg-white/90 cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(0, 111, 255, 0.15)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
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
          <div className="text-gray-900 text-base font-semibold leading-tight truncate w-full group-hover:text-[#006FFF] transition-colors">
            {title || "노래 제목"}
          </div>
          {/* 아티스트 */}
          <div className="text-gray-600 text-sm font-medium leading-tight truncate w-full">
            {artist || "아티스트"}
          </div>
        </div>

        {/* 호버 시 편집 버튼 */}
        <button
          onClick={handleEdit}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-[#006FFF] flex items-center justify-center hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2"
          aria-label="편집"
        >
          <HiPencil className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { FaSpotify } from "react-icons/fa";

type SpotifySearchButtonProps = {
  onClick?: () => void;
  className?: string;
};

export default function SpotifySearchButton({ onClick, className = "" }: SpotifySearchButtonProps) {
  return (
    <div className={`flex justify-center md:justify-start ${className}`}>
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-white rounded-lg text-base font-medium hover:bg-[#1ed760] active:bg-[#1aa34a] transition-colors"
      >
        <span>노래 검색하기</span>
        <FaSpotify className="w-5 h-5" />
      </button>
    </div>
  );
}

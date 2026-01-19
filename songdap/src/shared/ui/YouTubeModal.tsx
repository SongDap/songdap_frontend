"use client";

import { HiX } from "react-icons/hi";

type YouTubeModalProps = {
  isOpen: boolean;
  videoId?: string; // 유튜브 영상 ID
  onClose: () => void;
};

export default function YouTubeModal({
  isOpen,
  videoId,
  onClose,
}: YouTubeModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 백드롭 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-[100]"
        onClick={onClose}
      />
      {/* 모달 */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-4">
        <div 
          className="w-full h-1/2 md:h-1/2 md:max-w-lg bg-white md:rounded-lg overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="relative bg-white px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 text-center">노래 동영상</h2>
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="닫기"
            >
              <HiX className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* 빈 컨텐츠 영역 */}
          <div className="p-8 min-h-[200px] flex items-center justify-center">
            {/* 나중에 유튜브 영상이 여기에 들어갈 예정 */}
          </div>
        </div>
      </div>
    </>
  );
}

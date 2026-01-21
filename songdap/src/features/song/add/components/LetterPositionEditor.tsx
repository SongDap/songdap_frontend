"use client";

import { useState, useEffect } from "react";
import { SongLetter } from "@/features/song/components";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

type LetterPosition = {
  x: number; // 컨테이너 너비 기준 백분율 (0-65)
  y: number; // 컨테이너 너비 기준 백분율 (보드 높이 내)
  pageNumber: number; // 페이지 번호
};

type LetterPositionEditorProps = {
  title: string;
  artist: string;
  imageUrl?: string | null;
  message?: string;
  nickname?: string;
  tapeColor?: string;
  initialPosition?: LetterPosition;
  totalPages?: number; // 전체 페이지 수
  onSave: (position: LetterPosition) => void;
  onCancel?: () => void;
};

export default function LetterPositionEditor({
  title,
  artist,
  imageUrl,
  message,
  nickname,
  tapeColor,
  initialPosition,
  totalPages = 1,
  onSave,
  onCancel,
}: LetterPositionEditorProps) {
  const [position, setPosition] = useState<LetterPosition>(() => ({
    x: initialPosition?.x ?? 10,
    y: initialPosition?.y ?? 2,
    pageNumber: initialPosition?.pageNumber ?? 1,
  }));

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [letterRef, setLetterRef] = useState<HTMLDivElement | null>(null);

  // 보드 비율 계산
  const boardHeightRatio = 9 / 16; // 보드 높이 비율 (너비 대비)
  
  // 위치를 높이 기준 백분율로 변환 (너비 기준 백분율을 높이 기준 백분율로)
  const yInHeightPercent = (position.y / boardHeightRatio);

  // 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef || !letterRef) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const containerRect = containerRef.getBoundingClientRect();
    const letterRect = letterRef.getBoundingClientRect();
    
    // 현재 편지 위치 (픽셀)
    const letterLeft = letterRect.left - containerRect.left;
    const letterTop = letterRect.top - containerRect.top;
    
    // 마우스 위치 (픽셀)
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    // 오프셋 계산 (편지 내에서 클릭한 위치)
    setDragOffset({
      x: mouseX - letterLeft,
      y: mouseY - letterTop,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef || !letterRef) return;
    const rect = containerRef.getBoundingClientRect();
    
    // 마우스 위치 (픽셀)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 오프셋을 고려하여 새 위치 계산 (픽셀)
    let newXPixel = mouseX - dragOffset.x;
    let newYPixel = mouseY - dragOffset.y;
    
    // 편지 너비 (컨테이너 너비의 35%)
    const letterWidth = rect.width * 0.35;
    
    // X 범위 제한 (0 ~ 컨테이너 너비 - 편지 너비)
    newXPixel = Math.max(0, Math.min(rect.width - letterWidth, newXPixel));
    
    // 편지의 실제 높이 (내용에 따라 결정, 테이프 포함)
    const letterHeight = letterRef.offsetHeight;
    
    // 보드 높이 (컨테이너 너비 * 9/16)
    const boardHeight = rect.width * boardHeightRatio;
    
    // Y 범위 제한 (0 ~ 보드 높이 - 편지 높이)
    newYPixel = Math.max(0, Math.min(boardHeight - letterHeight, newYPixel));
    
    // 픽셀을 백분율로 변환 (너비 기준)
    const newX = (newXPixel / rect.width) * 100;
    const newY = (newYPixel / rect.width) * 100; // 너비 기준 백분율로 저장 (보드 높이 = 너비 * 9/16)
    
    setPosition((prev) => ({
      ...prev,
      x: newX,
      y: newY,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPosition((prev) => ({
        ...prev,
        pageNumber: newPage,
      }));
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, containerRef, dragOffset, letterRef]);

  return (
    <div className="w-full">
      {/* 버튼 영역 - 보드 위 */}
      <div className="relative w-full mb-4 flex justify-between items-center">
        {/* 페이지 선택 - 왼쪽 위 */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(position.pageNumber - 1)}
              disabled={position.pageNumber === 1}
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="이전 페이지"
            >
              <HiChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <span className="px-2 text-sm font-semibold text-gray-700">
              {position.pageNumber}
            </span>

            <button
              onClick={() => handlePageChange(position.pageNumber + 1)}
              disabled={position.pageNumber === totalPages}
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="다음 페이지"
            >
              <HiChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}

        {/* 버튼들 - 오른쪽 위 */}
        <div className="flex gap-3 items-center">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors border border-gray-300"
            >
              취소
            </button>
          )}
          <button
            type="button"
            onClick={() => onSave(position)}
            className="px-4 py-2 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] transition-colors"
          >
            저장
          </button>
        </div>
      </div>

      {/* 보드 영역 */}
      <div className="w-full mb-6">
          <div
            ref={setContainerRef}
            className="relative w-full rounded-lg"
            style={{
              aspectRatio: '16 / 9',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
          {/* 편지 */}
          <div
            ref={setLetterRef}
            className="absolute select-none"
            style={{
              left: `${position.x}%`,
              top: `${yInHeightPercent}%`,
              width: '35%',
              zIndex: isDragging ? 50 : 10,
              opacity: isDragging ? 0.8 : 1,
            }}
          >
            <div
              className={`w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
            >
              <SongLetter
                title={title}
                artist={artist}
                imageUrl={imageUrl}
                message={message}
                nickname={nickname}
                date={new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                tapeColor={tapeColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

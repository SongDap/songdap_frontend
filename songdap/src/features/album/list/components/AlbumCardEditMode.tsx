"use client";

import { useState } from "react";
import { HiTrash, HiInformationCircle } from "react-icons/hi";
import { BottomConfirmModal } from "@/shared/ui";

type AlbumCardEditModeProps = {
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  id: string;
  albumName: string;
};

export default function AlbumCardEditMode({
  onDelete,
  onEdit,
  id,
  albumName,
}: AlbumCardEditModeProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 모바일에서는 모달 표시, PC에서는 window.confirm 사용
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setShowDeleteModal(true);
    } else {
      if (window.confirm(`"${albumName}" 앨범을 삭제하시겠습니까?`)) {
        if (onDelete) onDelete(id);
      }
    }
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    if (onDelete) onDelete(id);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      {/* 편집 모드일 때 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-[20px] z-20"></div>

      {/* 편집 모드일 때 삭제/앨범 정보 버튼 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-30">
        <button
          onClick={handleDeleteClick}
          className="px-4 py-1.5 bg-white/70 text-red-500 rounded-lg shadow-md hover:bg-white/80 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          aria-label="앨범 삭제"
        >
          <HiTrash className="w-4 h-4" />
          <span className="text-sm font-medium">앨범 삭제</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onEdit) onEdit(id);
          }}
          className="px-4 py-1.5 bg-white/70 text-black rounded-lg shadow-md hover:bg-white/80 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          aria-label="앨범 정보"
        >
          <HiInformationCircle className="w-4 h-4" />
          <span className="text-sm font-medium">앨범 정보</span>
        </button>
      </div>

      {/* 앨범 삭제 확인 모달 (모바일) */}
      <BottomConfirmModal
        isOpen={showDeleteModal}
        message={`"${albumName}" 앨범을 삭제하시겠습니까?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="삭제"
        cancelText="취소"
      />
    </>
  );
}

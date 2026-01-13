"use client";

import { useRef, useEffect } from "react";
import { HiShare, HiInformationCircle, HiTrash } from "react-icons/hi";
import { responsive, COLORS, FONTS } from "@/features/album/create/constants";

interface AlbumDetailMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  onViewInfo: () => void;
  onDelete: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * 앨범 상세 페이지 메뉴 모달 컴포넌트
 */
export default function AlbumDetailMenu({
  isOpen,
  onClose,
  onShare,
  onViewInfo,
  onDelete,
  menuButtonRef,
}: AlbumDetailMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        menuButtonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, menuButtonRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        marginTop: "8px",
        backgroundColor: COLORS.WHITE,
        border: "2px solid #000000",
        borderRadius: "8px",
        minWidth: "160px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => {
          onShare();
          onClose();
        }}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "none",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "transparent",
          fontFamily: FONTS.KYOBO_HANDWRITING,
          fontSize: responsive.fontSize(14, 16, 18, 18),
          color: COLORS.BLACK,
          textAlign: "left",
          cursor: "pointer",
          transition: "background-color 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f5f5f5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <HiShare size={20} />
        <span>앨범 공유하기</span>
      </button>
      <button
        onClick={() => {
          onViewInfo();
          onClose();
        }}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "none",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "transparent",
          fontFamily: FONTS.KYOBO_HANDWRITING,
          fontSize: responsive.fontSize(14, 16, 18, 18),
          color: COLORS.BLACK,
          textAlign: "left",
          cursor: "pointer",
          transition: "background-color 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f5f5f5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <HiInformationCircle size={20} />
        <span>앨범 정보 보기</span>
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "none",
          backgroundColor: "transparent",
          fontFamily: FONTS.KYOBO_HANDWRITING,
          fontSize: responsive.fontSize(14, 16, 18, 18),
          color: "#ff4444",
          textAlign: "left",
          cursor: "pointer",
          transition: "background-color 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#fff5f5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <HiTrash size={20} />
        <span>앨범 삭제하기</span>
      </button>
    </div>
  );
}


"use client";

import { ReactNode } from "react";
import { COLORS, responsive } from "@/features/album/create/constants";
import { MODAL_CONFIG } from "@/features/song/constants";

interface AlbumDetailModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  padding?: string;
}

/**
 * 앨범 상세 페이지 모달 기본 래퍼 컴포넌트
 * 공통 모달 스타일과 구조를 제공
 */
export default function AlbumDetailModalBase({
  isOpen,
  onClose,
  children,
  maxWidth = "400px",
  padding,
}: AlbumDetailModalBaseProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: MODAL_CONFIG.OVERLAY_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          backgroundColor: COLORS.BACKGROUND,
          borderRadius: "20px",
          padding: padding || responsive.sizeVh(20, 30, 40, 40),
          maxWidth,
          width: `min(${maxWidth}, 92vw)`,
          maxHeight: MODAL_CONFIG.MAX_HEIGHT,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          position: "relative",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}


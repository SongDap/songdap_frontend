"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { responsive } from "@/features/album/create/constants";
import AlbumDetailMenu from "./AlbumDetailMenu";

interface AlbumDetailHeaderProps {
  onShare: () => void;
  onViewInfo: () => void;
  onDelete: () => void;
}

export default function AlbumDetailHeader({
  onShare,
  onViewInfo,
  onDelete,
}: AlbumDetailHeaderProps) {
  const router = useRouter();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${responsive.min(32)}`,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        backgroundColor: "transparent",
      }}
    >
      {/* 뒤로 가기 버튼 */}
      <button
        onClick={() => router.back()}
        style={{
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "24px",
          color: "#000000",
          transition: "all 0.2s",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        }}
      >
        <FaArrowLeft />
      </button>

      {/* 메뉴 버튼 (점 세 개) */}
      <div style={{ position: "relative" }}>
        <button
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "24px",
            color: "#000000",
            transition: "all 0.2s",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          <HiDotsVertical />
        </button>

        {/* 메뉴 모달 */}
        <AlbumDetailMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onShare={onShare}
          onViewInfo={onViewInfo}
          onDelete={onDelete}
          menuButtonRef={menuButtonRef}
        />
      </div>
    </div>
  );
}


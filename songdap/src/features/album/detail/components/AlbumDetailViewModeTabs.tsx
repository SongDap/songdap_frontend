"use client";

import { FaList } from "react-icons/fa";
import { HiMusicNote } from "react-icons/hi";
import { responsive } from "@/features/album/create/constants";

type ViewMode = "lp" | "list";

interface AlbumDetailViewModeTabsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function AlbumDetailViewModeTabs({
  viewMode,
  onViewModeChange,
}: AlbumDetailViewModeTabsProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: responsive.sizeVh(20, 24, 28, 28),
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: responsive.sizeVh(8, 10, 12, 12),
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: responsive.sizeVh(4, 5, 6, 6),
        borderRadius: "20px",
        border: "2px solid #000000",
        zIndex: 20,
      }}
    >
      {/* LP 버전 탭 */}
      <button
        onClick={() => onViewModeChange("lp")}
        style={{
          width: responsive.sizeVh(36, 40, 44, 44),
          height: responsive.sizeVh(36, 40, 44, 44),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          backgroundColor: viewMode === "lp" ? "#98d9d4" : "transparent",
          borderRadius: "16px",
          cursor: "pointer",
          fontSize: responsive.fontSize(20, 22, 24, 24),
          color: viewMode === "lp" ? "#ffffff" : "#999999",
          transition: "background-color 0.2s, color 0.2s",
        }}
      >
        <HiMusicNote />
      </button>

      {/* 리스트 버전 탭 */}
      <button
        onClick={() => onViewModeChange("list")}
        style={{
          width: responsive.sizeVh(36, 40, 44, 44),
          height: responsive.sizeVh(36, 40, 44, 44),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          backgroundColor: viewMode === "list" ? "#98d9d4" : "transparent",
          borderRadius: "16px",
          cursor: "pointer",
          fontSize: responsive.fontSize(20, 22, 24, 24),
          color: viewMode === "list" ? "#ffffff" : "#999999",
          transition: "background-color 0.2s, color 0.2s",
        }}
      >
        <FaList />
      </button>
    </div>
  );
}


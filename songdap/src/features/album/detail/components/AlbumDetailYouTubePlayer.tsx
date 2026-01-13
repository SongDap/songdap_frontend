"use client";

import { responsive, COLORS, FONTS } from "@/features/album/create/constants";

interface AlbumDetailYouTubePlayerProps {
  videoId: string | null;
  onClose?: () => void;
}

/**
 * 유튜브 플레이어 컴포넌트
 * 재생 버튼을 눌렀을 때 영상을 표시하는 프레임
 */
export default function AlbumDetailYouTubePlayer({ videoId, onClose }: AlbumDetailYouTubePlayerProps) {
  // 영상이 없으면 표시하지 않음
  if (!videoId) return null;

  return (
    <div
      style={{
        width: "100%",
        marginBottom: responsive.sizeVh(16, 20, 24, 24),
        padding: responsive.sizeVh(8, 10, 12, 12),
        backgroundColor: COLORS.WHITE,
        border: "2px solid #000000",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      {/* 닫기 버튼 (프레임 외부 우측 상단) */}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: responsive.sizeVh(4, 5, 6, 6),
            right: responsive.sizeVh(4, 5, 6, 6),
            width: responsive.sizeVh(40, 44, 48, 48),
            height: responsive.sizeVh(40, 44, 48, 48),
            border: "3px solid #000000",
            backgroundColor: COLORS.WHITE,
            borderRadius: "50%",
            color: COLORS.BLACK,
            fontSize: responsive.fontSize(22, 24, 26, 26),
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            transition: "background-color 0.2s, transform 0.2s",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ff4444";
            e.currentTarget.style.color = COLORS.WHITE;
            e.currentTarget.style.transform = "scale(1.15)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.WHITE;
            e.currentTarget.style.color = COLORS.BLACK;
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
          }}
          aria-label="영상 닫기"
        >
          ×
        </button>
      )}
      
      {/* 영상 프레임 (나중에 영상 플레이어가 들어갈 공간) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9 비율
          height: 0,
          overflow: "hidden",
          backgroundColor: "#000000",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.KYOBO_HANDWRITING,
            fontSize: responsive.fontSize(18, 20, 22, 22),
            color: COLORS.WHITE,
            textAlign: "center",
          }}
        >
          영상이 재생됩니다
        </div>
      </div>
    </div>
  );
}

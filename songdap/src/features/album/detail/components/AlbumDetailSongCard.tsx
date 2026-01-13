"use client";

import { FaPlay } from "react-icons/fa";
import { responsive, COLORS, FONTS } from "@/features/album/create/constants";

interface AlbumDetailSongCardProps {
  index: number;
  isLast: boolean;
  songTitle: string;
  artistName: string;
  onCardClick: () => void;
  onPlayClick: (e: React.MouseEvent) => void;
  isLPView?: boolean; // LP 버전 여부
}

export default function AlbumDetailSongCard({
  index,
  isLast,
  songTitle,
  artistName,
  onCardClick,
  onPlayClick,
  isLPView = false,
}: AlbumDetailSongCardProps) {
  // LP 버전에서는 모든 카드에 동일한 borderRadius와 테두리 적용
  const borderRadius = isLPView ? "8px" : (index === 0 ? "8px 8px 0 0" : isLast ? "0 0 8px 8px" : "0");
  const borderTop = isLPView ? "2px solid #000000" : (index === 0 ? "2px solid #000000" : "none");
  const borderBottom = isLPView ? "2px solid #000000" : (isLast ? "2px solid #000000" : "none");
  const borderLeft = isLPView ? "2px solid #000000" : "2px solid #000000";
  const borderRight = isLPView ? "2px solid #000000" : "2px solid #000000";
  const marginTop = isLPView ? 0 : (index > 0 ? "-2px" : 0);

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={onCardClick}
        style={{
          width: "100%",
          height: "70px",
          display: "flex",
          gap: responsive.sizeVh(12, 14, 16, 16),
          alignItems: "center",
          borderRadius,
          borderTop,
          borderBottom,
          borderLeft,
          borderRight,
          padding: responsive.sizeVh(8, 10, 12, 12),
          boxSizing: "border-box",
          backgroundColor: COLORS.WHITE,
          cursor: "pointer",
          marginTop,
          position: "relative",
        }}
      >
        {/* 노래 이미지 */}
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "4px",
            overflow: "hidden",
            border: "2px solid #000000",
            flexShrink: 0,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 이미지가 없으면 빈 박스만 표시 */}
        </div>
        
        {/* 노래 제목 및 가수 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: responsive.sizeVh(4, 5, 6, 6),
            flex: 1,
            justifyContent: "center",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: responsive.fontSize(16, 18, 20, 20),
              color: COLORS.BLACK,
              fontWeight: "bold",
              whiteSpace: isLPView ? "nowrap" : "normal",
              overflow: isLPView ? "hidden" : "visible",
              textOverflow: isLPView ? "ellipsis" : "clip",
            }}
          >
            {songTitle}
          </div>
          <div
            style={{
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: responsive.fontSize(14, 16, 18, 18),
              color: COLORS.BLACK,
              whiteSpace: isLPView ? "nowrap" : "normal",
              overflow: isLPView ? "hidden" : "visible",
              textOverflow: isLPView ? "ellipsis" : "clip",
            }}
          >
            {artistName}
          </div>
        </div>
        
        {/* 재생 버튼 */}
        <button
          onClick={onPlayClick}
          style={{
            width: responsive.sizeVh(40, 44, 48, 48),
            height: responsive.sizeVh(40, 44, 48, 48),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: "50%",
            backgroundColor: "transparent",
            cursor: "pointer",
            flexShrink: 0,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FaPlay
            style={{
              fontSize: responsive.fontSize(14, 16, 18, 18),
              color: COLORS.BLACK,
              marginLeft: "2px",
            }}
          />
        </button>
      </div>
      
      {/* 구분선 (마지막 카드가 아닐 때만) */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "2px",
            right: "2px",
            height: "1px",
            backgroundColor: "#cccccc",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}


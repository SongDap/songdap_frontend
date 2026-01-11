"use client";

import { useRef } from "react";
import { FONTS, responsive } from "../constants";

interface AlbumDescriptionPaperProps {
  albumDescription: string;
  lpSize: number;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * 앨범 설명 종이 컴포넌트
 * 
 * @description
 * - 접혀있을 때: 세모 띠만 보임 (bottom: -70%)
 * - 펼쳐질 때: 세모 띠와 종이가 함께 위로 슬라이드 (bottom: 0)
 * - 앨범 커버 하단에 위치 (zIndex: 15)
 * - 종이 느낌의 베이지색 배경 + 줄무늬 패턴
 * 
 * @param albumDescription - 표시할 앨범 설명 텍스트
 * @param lpSize - LP 크기 (종이 크기 계산 기준)
 * @param isExpanded - 펼침/접힘 상태
 * @param onToggle - 상태 토글 콜백
 */
export default function AlbumDescriptionPaper({
  albumDescription,
  lpSize,
  isExpanded,
  onToggle,
}: AlbumDescriptionPaperProps) {
  const descriptionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: isExpanded ? 0 : `-${lpSize * 0.7}px`,
        left: 0,
        width: `${lpSize}px`,
        zIndex: 15,
        transition: 'bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* 세모 띠: 클릭하여 종이를 펼치거나 접을 수 있음 */}
      <div
        onClick={onToggle}
        style={{
          width: '100%',
          minHeight: responsive.sizeVh(28, 32, 36, 40),
          backgroundColor: 'rgba(255, 254, 249, 0.95)',
          border: '2px solid #d4d0c8',
          borderBottom: isExpanded ? '1px solid #e8e4dc' : '2px solid #d4d0c8',
          borderRadius: '6px 6px 0 0',
          boxShadow: '0 -2px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: responsive.sizeVh(4, 6, 8, 8),
          boxSizing: 'border-box',
          padding: `${responsive.sizeVh(4, 6, 8, 8)} 0`,
        }}
      >
        <div
          style={{
            fontSize: responsive.fontSize(12, 13, 14, 15),
            color: '#888',
            fontFamily: FONTS.CAFE24_PROSLIM,
            transform: isExpanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease',
          }}
        >
          ▲
        </div>
        <span
          style={{
            fontSize: responsive.fontSize(11, 12, 13, 14),
            color: '#666',
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontWeight: 'bold',
          }}
        >
          앨범 설명
        </span>
      </div>

      {/* 종이 본체 */}
      <div
        style={{
          width: '100%',
          height: `${lpSize * 0.7}px`,
          backgroundColor: 'rgba(255, 254, 249, 0.95)',
          border: '2px solid #d4d0c8',
          borderTop: 'none',
          borderRadius: '0',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
          overflow: 'hidden',
          boxSizing: 'border-box',
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 24px,
              rgba(200, 200, 200, 0.1) 24px,
              rgba(200, 200, 200, 0.1) 25px
            )
          `,
        }}
      >
        {/* 종이 내용 */}
        <div
          ref={descriptionRef}
          style={{
            padding: `${lpSize * 0.08}px ${lpSize * 0.06}px`,
            height: '100%',
            overflowY: 'auto',
            fontSize: responsive.fontSize(20, 28, 32, 35),
            fontFamily: FONTS.KYOBO_HANDWRITING,
            color: '#2c2c2c',
            textAlign: 'center',
            lineHeight: '1.7',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
          className="album-description-card-scroll"
        >
          {albumDescription}
        </div>
      </div>
    </div>
  );
}


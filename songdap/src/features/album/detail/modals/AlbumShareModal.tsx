"use client";

import { useState, useEffect } from "react";
import { FaComment, FaLink } from "react-icons/fa";
import { COLORS, FONTS, TEXT_SIZES, responsive } from "@/features/album/create/constants";
import { MODAL_CONFIG } from "@/features/song/constants";
import type { AlbumData } from "@/features/song/components/types";
import AlbumDetailModalBase from "./AlbumDetailModalBase";

interface AlbumShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: AlbumData;
}

/**
 * 앨범 공유 모달 컴포넌트
 * 앨범 생성 페이지의 링크 공유 섹션을 모달로 표시
 */
export default function AlbumShareModal({
  isOpen,
  onClose,
  album,
}: AlbumShareModalProps) {
  const [albumLink, setAlbumLink] = useState("");

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      // 앨범 상세 페이지 링크 생성 (현재 페이지 URL 사용)
      const link = window.location.href;
      setAlbumLink(link);
    }
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(albumLink);
      alert("링크가 복사되었습니다!");
    } catch (err) {
      console.error("링크 복사 실패:", err);
      // 폴백: 텍스트 선택 방식
      const textArea = document.createElement("textarea");
      textArea.value = albumLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("링크가 복사되었습니다!");
    }
  };

  const handleKakaoShare = () => {
    // TODO: 카카오톡 공유 기능 구현
    console.log("카카오톡 공유");
  };

  return (
    <AlbumDetailModalBase 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth={`${MODAL_CONFIG.MAX_WIDTH}px`}
    >
        {/* 상단 닫기(X) 버튼 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: "absolute",
            top: responsive.sizeVh(10, 12, 14, 14),
            right: responsive.sizeVh(10, 12, 14, 14),
            width: responsive.sizeVh(32, 36, 40, 44),
            height: responsive.sizeVh(32, 36, 40, 44),
            border: "none",
            background: "transparent",
            color: COLORS.BLACK,
            fontSize: responsive.fontSize(24, 26, 28, 30),
            lineHeight: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* 제목 */}
        <div
          style={{
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontSize: responsive.fontSize(22, 26, 30, 32),
            color: COLORS.BLACK,
            fontWeight: "bold",
            marginBottom: responsive.sizeVh(24, 28, 32, 32),
            textAlign: "left",
            paddingTop: responsive.sizeVh(10, 12, 14, 14),
          }}
        >
          앨범 공유하기
        </div>

        {/* 공유 버튼 섹션 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: responsive.sizeVh(16, 20, 24, 24),
          }}
        >
          {/* 카카오톡 공유 버튼 */}
          <button
            onClick={handleKakaoShare}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: responsive.sizeVh(4, 6, 8, 8),
              padding: `clamp(8px, calc(12 * 100vh / 1024), 12px) clamp(16px, calc(24 * 100vh / 1024), 24px)`,
              border: "3px solid #000000",
              borderRadius: "10px",
              backgroundColor: COLORS.WHITE,
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: TEXT_SIZES.INPUT,
              color: COLORS.BLACK,
              cursor: "pointer",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <FaComment size={20} />
            <span>카카오톡에 공유하기</span>
          </button>

          {/* 링크 복사 버튼 */}
          <button
            onClick={handleCopyLink}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: responsive.sizeVh(4, 6, 8, 8),
              padding: `clamp(8px, calc(12 * 100vh / 1024), 12px) clamp(16px, calc(24 * 100vh / 1024), 24px)`,
              border: "3px solid #000000",
              borderRadius: "10px",
              backgroundColor: COLORS.WHITE,
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: TEXT_SIZES.INPUT,
              color: COLORS.BLACK,
              cursor: "pointer",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <FaLink size={20} />
            <span>링크 복사하기</span>
          </button>

          {/* 링크 표시 영역 */}
          <div
            style={{
              padding: responsive.sizeVh(12, 16, 20, 20),
              border: "2px solid #000000",
              borderRadius: "10px",
              backgroundColor: COLORS.WHITE,
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: TEXT_SIZES.INPUT,
              color: COLORS.BLACK,
              wordBreak: "break-all",
              boxSizing: "border-box",
            }}
          >
            {albumLink || "링크를 생성하는 중..."}
          </div>
        </div>
    </AlbumDetailModalBase>
  );
}

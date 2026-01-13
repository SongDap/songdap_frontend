"use client";

import { useRef, useEffect } from "react";
import { responsive, COLORS, FONTS } from "@/features/album/create/constants";
import MemoPaperFrame from "@/features/song/components/MemoPaperFrame";

interface LetterData {
  toNickname: string;
  content: string;
  fromNickname: string;
  date: string;
  time: string;
}

interface AlbumDetailSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSongIndex: number | null;
  letterData: LetterData | null;
  modalWidth: number;
  onModalWidthChange: (width: number) => void;
  songTitle?: string;
  songArtist?: string;
  songImageUrl?: string;
}

export default function AlbumDetailSongModal({
  isOpen,
  onClose,
  selectedSongIndex,
  letterData,
  modalWidth,
  onModalWidthChange,
  songTitle,
  songArtist,
  songImageUrl,
}: AlbumDetailSongModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 모달 너비 계산
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const updateModalWidth = () => {
        if (modalRef.current) {
          onModalWidthChange(modalRef.current.offsetWidth);
        }
      };
      
      setTimeout(updateModalWidth, 0);
      
      const resizeObserver = new ResizeObserver(updateModalWidth);
      resizeObserver.observe(modalRef.current);
      
      window.addEventListener("resize", updateModalWidth);
      
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", updateModalWidth);
      };
    }
  }, [isOpen, onModalWidthChange]);

  if (!isOpen || selectedSongIndex === null || !letterData) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        overflow: "auto",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          maxWidth: "min(90vw, 600px)",
          maxHeight: "85vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
          position: "relative",
        }}
      >
        {/* 메모장 내용 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "visible",
            display: "flex",
            flexDirection: "column",
            paddingBottom: responsive.sizeVh(20, 24, 28, 28),
          }}
        >
          <MemoPaperFrame serviceFrameWidth={modalWidth}>
            {/* 편지지 스타일 */}
            <div
              style={{
                position: "relative",
                minHeight: responsive.sizeVh(300, 400, 500, 500),
                padding: responsive.sizeVh(16, 20, 24, 24),
                paddingLeft: responsive.sizeVh(16, 20, 24, 24),
                paddingRight: responsive.sizeVh(16, 20, 24, 24),
                border: "none",
                borderRadius: "8px",
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* 노래 정보 (제목, 가수, 이미지) */}
              <div
                style={{
                  display: "flex",
                  gap: responsive.sizeVh(12, 14, 16, 16),
                  alignItems: "center",
                  marginBottom: responsive.sizeVh(20, 24, 28, 28),
                  paddingBottom: responsive.sizeVh(16, 20, 24, 24),
                  borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* 노래 이미지 */}
                <div
                  style={{
                    width: responsive.sizeVh(50, 60, 70, 70),
                    height: responsive.sizeVh(50, 60, 70, 70),
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "2px solid #000000",
                    flexShrink: 0,
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {songImageUrl ? (
                    <img
                      src={songImageUrl}
                      alt={songTitle || "노래 이미지"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  )}
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
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: responsive.fontSize(18, 20, 22, 22),
                      color: COLORS.BLACK,
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {songTitle || "노래 제목"}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: responsive.fontSize(16, 18, 20, 20),
                      color: COLORS.BLACK,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {songArtist || "가수명"}
                  </div>
                </div>
              </div>

              {/* TO. 닉네임 */}
              <div
                style={{
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: responsive.fontSize(18, 20, 22, 22),
                  color: COLORS.BLACK,
                  fontWeight: "bold",
                  marginBottom: responsive.sizeVh(16, 20, 24, 24),
                  lineHeight: "28px",
                }}
              >
                TO. {letterData.toNickname}
              </div>

              {/* 편지 내용 */}
              <div
                style={{
                  flex: 1,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: responsive.fontSize(18, 20, 22, 22),
                  color: COLORS.BLACK,
                  lineHeight: "28px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  backgroundImage: `
                    repeating-linear-gradient(
                      to bottom,
                      transparent 0,
                      transparent calc(28px - 1px),
                      rgba(0, 0, 0, 0.08) calc(28px - 1px),
                      rgba(0, 0, 0, 0.08) 28px
                    )
                  `,
                  backgroundPosition: "0 0",
                  backgroundSize: "100% 28px",
                  backgroundRepeat: "repeat-y",
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  minHeight: responsive.sizeVh(200, 250, 300, 300),
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.KYOBO_HANDWRITING,
                    fontSize: responsive.fontSize(18, 20, 22, 22),
                    color: COLORS.BLACK,
                    lineHeight: "28px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    paddingTop: "4px",
                    minHeight: "100%",
                  }}
                >
                  {letterData.content || "친구에게 전하고 싶은 한 마디가 있나요?"}
                </div>
              </div>

              {/* FROM. 보낸사람 닉네임 및 날짜/시간 */}
              <div
                style={{
                  marginTop: responsive.sizeVh(24, 32, 40, 40),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: responsive.sizeVh(4, 5, 6, 6),
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: responsive.fontSize(16, 18, 20, 20),
                  color: COLORS.BLACK,
                  lineHeight: "28px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>
                  FROM. {letterData.fromNickname}
                </div>
                <div>
                  {letterData.date} {letterData.time}
                </div>
              </div>
            </div>
          </MemoPaperFrame>
          
          {/* 닫기 버튼 (아래) */}
          <button
            onClick={onClose}
            style={{
              alignSelf: "center",
              marginTop: responsive.sizeVh(8, 10, 12, 12),
              width: responsive.sizeVh(32, 36, 40, 40),
              height: responsive.sizeVh(32, 36, 40, 40),
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              fontSize: responsive.fontSize(28, 32, 36, 36),
              color: COLORS.BLACK,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              lineHeight: 1,
              padding: 0,
              margin: 0,
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}


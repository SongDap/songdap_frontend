"use client";

import Image from "next/image";
import { responsive, FONTS, TEXT_SIZES, COLORS } from "@/features/album/create/constants";

interface MemoPaperContentProps {
  songImagePreview: string | null;
  songTitle: string;
  artistName: string;
  description: string;
  nickname: string;
  serviceFrameWidth: number;
  onDescriptionChange: (value: string) => void;
  onNicknameChange: (value: string) => void;
}

/**
 * 메모장 내용 컴포넌트
 * - 노래 정보 (사진, 제목, 가수)
 * - 설명 입력 (편지지 디자인)
 * - 닉네임 입력
 */
export default function MemoPaperContent({
  songImagePreview,
  songTitle,
  artistName,
  description,
  nickname,
  serviceFrameWidth,
  onDescriptionChange,
  onNicknameChange,
}: MemoPaperContentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: responsive.sizeVh(20, 24, 28, 28),
      }}
    >
      {/* 닉네임 입력 영역 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: responsive.sizeVh(8, 10, 12, 12),
        }}
      >
        <div
          style={{
            fontFamily: FONTS.KYOBO_HANDWRITING,
            fontSize: responsive.fontSize(18, 20, 22, 22),
            color: COLORS.BLACK,
          }}
        >
          프로듀서님을 뭐라고 부를까요? 닉네임을 알려주세요(필수)
        </div>
        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 16) {
                onNicknameChange(value);
              }
            }}
            placeholder="닉네임을 입력하세요"
            maxLength={16}
            style={{
              width: "100%",
              border: "none",
              borderBottom: "2px solid #000000",
              outline: "none",
              backgroundColor: "transparent",
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: responsive.fontSize(16, 18, 20, 20),
              color: COLORS.BLACK,
              paddingBottom: responsive.sizeVh(4, 5, 6, 6),
              paddingRight: responsive.sizeVh(50, 60, 70, 70),
              boxSizing: "border-box",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 0,
              bottom: responsive.sizeVh(4, 5, 6, 6),
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: responsive.fontSize(14, 16, 18, 18),
              color: COLORS.BLACK,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {nickname.length}/16
          </span>
        </div>
      </div>

      {/* 노래 정보 영역 */}
      <div
        style={{
          width: "100%",
          height: "70px",
          display: "flex",
          gap: responsive.sizeVh(12, 14, 16, 16),
          alignItems: "center",
          border: "2px solid #000000",
          borderRadius: "8px",
          padding: responsive.sizeVh(8, 10, 12, 12),
          boxSizing: "border-box",
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
          {songImagePreview ? (
            <Image
              src={songImagePreview}
              alt="노래 이미지"
              width={50}
              height={50}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : null}
        </div>
        
        {/* 노래 제목 및 가수 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: responsive.sizeVh(4, 5, 6, 6),
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: responsive.fontSize(16, 18, 20, 20),
              color: COLORS.BLACK,
              fontWeight: "bold",
            }}
          >
            {songTitle || "노래 제목"}
          </div>
          <div
            style={{
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: responsive.fontSize(14, 16, 18, 18),
              color: COLORS.BLACK,
            }}
          >
            {artistName || "가수명"}
          </div>
        </div>
      </div>

      {/* 편지지 스타일 설명 입력 영역 */}
      <div
        style={{
          position: "relative",
          minHeight: responsive.sizeVh(120, 150, 180, 180),
          padding: responsive.sizeVh(16, 20, 24, 24),
          paddingLeft: responsive.sizeVh(16, 20, 24, 24),
          paddingRight: responsive.sizeVh(16, 20, 24, 24),
          border: "2px solid #000000",
          borderRadius: "8px",
          boxSizing: "border-box",
          marginTop: "auto",
        }}
      >
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="친구에게 전하고 싶은 한 마디가 있나요?"
          style={{
            width: "100%",
            minHeight: responsive.sizeVh(120, 150, 180, 180),
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontFamily: FONTS.KYOBO_HANDWRITING,
            fontSize: responsive.fontSize(18, 20, 22, 22),
            color: COLORS.BLACK,
            lineHeight: "28px",
            resize: "none",
            padding: 0,
            margin: 0,
            boxSizing: "border-box",
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
            verticalAlign: "top",
          }}
        />
      </div>
    </div>
  );
}


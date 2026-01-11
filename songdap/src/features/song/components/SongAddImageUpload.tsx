"use client";

import Image from "next/image";
import { FaImages } from "react-icons/fa";
import { INPUT_BOX_STYLE, FONTS, COLORS, TEXT_SIZES } from "@/features/album/create/constants";

interface SongAddImageUploadProps {
  songImagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 노래 이미지 업로드 컴포넌트
 */
export default function SongAddImageUpload({
  songImagePreview,
  onImageChange,
}: SongAddImageUploadProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: FONTS.CAFE24_PROSLIM,
          fontSize: TEXT_SIZES.LABEL,
          color: COLORS.BLACK,
        }}
      >
        노래 이미지(선택)
      </label>
      <div
        style={{
          ...INPUT_BOX_STYLE,
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          style={{ display: "none" }}
          id="song-image-input"
        />
        <label
          htmlFor="song-image-input"
          style={{
            cursor: "pointer",
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontSize: TEXT_SIZES.INPUT,
            color: COLORS.BLACK,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <FaImages size={20} />
          이미지 업로드
        </label>
        {songImagePreview && (
          <div
            style={{
              width: "100%",
              maxWidth: 120,
              aspectRatio: "1 / 1",
              borderRadius: 8,
              overflow: "hidden",
              border: "2px solid #000000",
              alignSelf: "flex-start",
            }}
          >
            <Image
              src={songImagePreview}
              alt="노래 이미지 미리보기"
              width={120}
              height={120}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}


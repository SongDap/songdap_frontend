"use client";

import { INPUT_BOX_STYLE, FONTS, COLORS, TEXT_SIZES } from "@/features/album/create/constants";

interface SongAddInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 노래 추가 페이지의 입력 필드 컴포넌트
 */
export default function SongAddInputField({
  label,
  value,
  onChange,
  placeholder,
}: SongAddInputFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: FONTS.CAFE24_PROSLIM,
          fontSize: TEXT_SIZES.LABEL,
          color: COLORS.BLACK,
        }}
      >
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...INPUT_BOX_STYLE,
          width: "100%",
          boxSizing: "border-box",
          fontFamily: FONTS.KYOBO_HANDWRITING,
          fontSize: TEXT_SIZES.INPUT,
          color: COLORS.BLACK,
          outline: "none",
        }}
        placeholder={placeholder}
      />
    </div>
  );
}





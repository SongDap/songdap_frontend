"use client";

import { useEffect, useState } from "react";
import { COLORS, FONTS, TEXT_SIZES, INPUT_BOX_STYLE } from "../constants";

interface AlbumNameInputProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

const LABEL_STYLE = {
  fontFamily: FONTS.CAFE24_PROSLIM,
  fontSize: TEXT_SIZES.LABEL,
  marginBottom: 8,
  color: COLORS.BLACK,
} as const;

export default function AlbumNameInput({
  value = "",
  onChange,
  maxLength = 16,
}: AlbumNameInputProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    // 외부에서 value가 변경될 때도 길이 제한 적용
    if (value.length > maxLength) {
      const limitedValue = value.slice(0, maxLength);
      setInputValue(limitedValue);
      onChange?.(limitedValue);
    } else {
      setInputValue(value);
    }
  }, [value, maxLength]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // 길이 제한 적용
    const limitedValue = newValue.length > maxLength ? newValue.slice(0, maxLength) : newValue;
    setInputValue(limitedValue);
    onChange?.(limitedValue);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={LABEL_STYLE}>앨범명(필수)</label>
        <span
          style={{
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontSize: TEXT_SIZES.LABEL,
            color: COLORS.BLACK,
          }}
        >
          {inputValue.length}/{maxLength}
        </span>
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        maxLength={maxLength}
        style={{
          ...INPUT_BOX_STYLE,
          fontFamily: FONTS.KYOBO_HANDWRITING,
          fontSize: TEXT_SIZES.INPUT,
          color: COLORS.BLACK,
          outline: "none",
        }}
      />
    </div>
  );
}


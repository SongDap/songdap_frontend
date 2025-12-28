"use client";

import { useState } from "react";
import { COLORS, FONTS, TEXT_SIZES, responsive } from "../constants";

interface AlbumNameInputProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

const INPUT_STYLE = {
  width: '100%',
  border: '3px solid #000000',
  borderRadius: '10px',
  backgroundColor: COLORS.WHITE,
  paddingLeft: responsive.vh(30),
  paddingRight: responsive.vw(16),
  boxSizing: 'border-box' as const,
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  outline: 'none',
  color: COLORS.BLACK,
};

const LABEL_STYLE = {
  fontFamily: FONTS.CAFE24_PROSLIM,
  fontSize: TEXT_SIZES.LABEL,
  marginBottom: responsive.vh(6),
  color: COLORS.BLACK,
  fontWeight: 'bold' as const,
};

const CHAR_COUNT_STYLE = {
  position: 'absolute' as const,
  top: '0',
  right: '0',
  fontFamily: FONTS.CAFE24_PROSLIM,
  fontSize: TEXT_SIZES.LABEL,
  color: COLORS.BLACK,
};

export default function AlbumNameInput({ 
  value = "", 
  onChange,
  maxLength = 16 
}: AlbumNameInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setInputValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={LABEL_STYLE}>앨범명(필수)</div>
      <div style={CHAR_COUNT_STYLE}>{inputValue.length}/{maxLength}</div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        maxLength={maxLength}
        style={{
          ...INPUT_STYLE,
          height: responsive.vh(80),
        }}
      />
    </div>
  );
}


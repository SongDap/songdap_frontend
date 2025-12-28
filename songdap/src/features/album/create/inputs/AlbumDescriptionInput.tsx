"use client";

import { useState, useEffect } from "react";
import { COLORS, FONTS, TEXT_SIZES, responsive } from "../constants";

interface AlbumDescriptionInputProps {
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
  paddingTop: responsive.vh(16),
  paddingBottom: responsive.vh(16),
  boxSizing: 'border-box' as const,
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  outline: 'none',
  resize: 'none' as const,
  overflowY: 'auto' as const,
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

export default function AlbumDescriptionInput({ 
  value = "", 
  onChange,
  maxLength = 200 
}: AlbumDescriptionInputProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setInputValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={LABEL_STYLE}>앨범설명</div>
      <div style={CHAR_COUNT_STYLE}>{inputValue.length}/{maxLength}</div>
      <textarea
        className="album-description-scroll"
        value={inputValue}
        onChange={handleChange}
        maxLength={maxLength}
        style={{
          ...INPUT_STYLE,
          height: responsive.vh(140),
        }}
      />
    </div>
  );
}


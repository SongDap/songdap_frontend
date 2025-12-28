"use client";

import { useState, useEffect } from "react";
import { COLORS, FONTS, TEXT_SIZES, responsive, INPUT_BOX_STYLE, LABEL_STYLE } from "../constants";

interface AlbumDescriptionInputProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

const INPUT_STYLE = {
  ...INPUT_BOX_STYLE,
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  outline: 'none',
  resize: 'none' as const,
  overflowY: 'auto' as const,
  color: COLORS.BLACK,
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
          height: responsive.sizeVh(100, 140, 140, 140),
        }}
      />
    </div>
  );
}


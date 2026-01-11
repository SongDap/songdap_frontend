"use client";

import { useState } from "react";
import { COLORS, FONTS, TEXT_SIZES, responsive, INPUT_BOX_STYLE, LABEL_STYLE } from "../constants";

interface CategoryInputProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

const INPUT_STYLE = {
  ...INPUT_BOX_STYLE,
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  outline: 'none',
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

export default function CategoryInput({ 
  value = "", 
  onChange,
  maxLength = 20 
}: CategoryInputProps) {
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
      <div style={LABEL_STYLE}>카테고리</div>
      <div style={CHAR_COUNT_STYLE}>{inputValue.length}/{maxLength}</div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        maxLength={maxLength}
        style={{
          ...INPUT_STYLE,
          height: responsive.sizeVh(48, 80, 80, 80),
        }}
      />
    </div>
  );
}


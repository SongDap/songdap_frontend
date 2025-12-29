"use client";

import { COLORS, FONTS, TEXT_SIZES } from "../constants";

interface CategoryRadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
}

const RADIO_OPTIONS = [
  { label: "기분", value: "mood" },
  { label: "상황", value: "situation" },
] as const;

export default function CategoryRadioGroup({
  value,
  onChange,
}: CategoryRadioGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
      {RADIO_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange?.(option.value)}
          style={{
            padding: '8px 24px',
            border: '3px solid #000000',
            borderRadius: '25px',
            backgroundColor: value === option.value ? COLORS.BUTTON_ENABLED_OUTER : COLORS.WHITE,
            fontFamily: FONTS.KYOBO_HANDWRITING,
            fontSize: TEXT_SIZES.INPUT,
            color: COLORS.BLACK,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: value === option.value ? 'translateY(-2px)' : 'none',
            boxShadow: value === option.value ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = value === option.value ? COLORS.BUTTON_ENABLED_INNER : '#f0f0f0';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = value === option.value ? COLORS.BUTTON_ENABLED_OUTER : COLORS.WHITE;
            e.currentTarget.style.transform = value === option.value ? 'translateY(-2px)' : 'none';
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}



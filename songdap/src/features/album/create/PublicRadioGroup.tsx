"use client";

import { COLORS, FONTS, TEXT_SIZES } from "./constants";

interface PublicRadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
}

const RADIO_OPTIONS = [
  { label: "공개", value: "public" },
  { label: "비공개", value: "private" },
] as const;

export default function PublicRadioGroup({
  value,
  onChange,
}: PublicRadioGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      {RADIO_OPTIONS.map((option) => (
        <label
          key={option.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            fontFamily: FONTS.KYOBO_HANDWRITING,
            fontSize: TEXT_SIZES.INPUT,
            color: COLORS.BLACK,
          }}
        >
          <input
            type="radio"
            name="public"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            style={{
              marginRight: '10px',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
            }}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}


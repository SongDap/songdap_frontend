"use client";

import { useState } from "react";
import {
  COLORS,
  LABEL_STYLE,
  CATEGORY_INPUT_BOX_STYLE,
  CHECKBOX_LABEL_STYLE,
  CHECKBOX_INPUT_STYLE,
  SONG_COUNT_CONTAINER_STYLE,
  SONG_COUNT_BUTTON_STYLE,
  SONG_COUNT_INPUT_STYLE,
  SONG_COUNT_TEXT_STYLE,
  responsive,
} from "../constants";
import PublicRadioGroup from "../components/PublicRadioGroup";

interface AlbumInputSectionStep3Props {
  isPublic?: string;
  onPublicChange?: (value: string) => void;
  songCount?: number;
  onSongCountChange?: (value: number) => void;
}

export default function AlbumInputSectionStep3({
  isPublic = "",
  onPublicChange,
  songCount = 15,
  onSongCountChange,
}: AlbumInputSectionStep3Props) {
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [customCount, setCustomCount] = useState(songCount);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustomCount(e.target.checked);
    if (!e.target.checked) {
      // 체크박스 해제 시 기본값 15로 복귀
      setCustomCount(15);
      onSongCountChange?.(15);
    }
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === "") {
      setCustomCount(0);
      onSongCountChange?.(0);
      return;
    }
    
    // 앞에 붙은 0 제거 및 숫자로 변환
    const value = parseInt(rawValue, 10);
    if (!isNaN(value)) {
    setCustomCount(value);
    onSongCountChange?.(value);
    }
  };

  const handleDecrease = () => {
    const newValue = Math.max(1, customCount - 1);
    setCustomCount(newValue);
    onSongCountChange?.(newValue);
  };

  const handleIncrease = () => {
    const newValue = customCount + 1;
    setCustomCount(newValue);
    onSongCountChange?.(newValue);
  };

  return (
    <div>
      <div style={LABEL_STYLE}>공개 여부</div>
      <div
        style={{
          ...CATEGORY_INPUT_BOX_STYLE,
          height: responsive.vh(80),
          marginBottom: responsive.vh(20),
        }}
      >
        <PublicRadioGroup
          value={isPublic}
          onChange={onPublicChange}
        />
      </div>

      <div style={LABEL_STYLE}>추천 곡 개수 설정</div>
      <div style={SONG_COUNT_CONTAINER_STYLE}>
        <label style={CHECKBOX_LABEL_STYLE}>
          <input
            type="checkbox"
            checked={isCustomCount}
            onChange={handleCheckboxChange}
            style={CHECKBOX_INPUT_STYLE}
          />
          곡 개수 설정하기
        </label>
        {!isCustomCount && (
          <div style={SONG_COUNT_TEXT_STYLE}>
            기본 개수: {songCount}곡
          </div>
        )}
        {isCustomCount && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              type="button"
              onClick={handleDecrease}
              style={SONG_COUNT_BUTTON_STYLE}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.WHITE;
                e.currentTarget.style.transform = 'none';
              }}
            >
              -
            </button>
              <input
                type="number"
              value={customCount === 0 ? "" : customCount}
                onChange={handleCountChange}
                min="1"
                className="number-input-no-spinner"
                style={SONG_COUNT_INPUT_STYLE}
                onWheel={(e) => e.currentTarget.blur()}
              />
            <button
              type="button"
              onClick={handleIncrease}
              style={SONG_COUNT_BUTTON_STYLE}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.WHITE;
                e.currentTarget.style.transform = 'none';
              }}
            >
              +
            </button>
            <span style={{ ...SONG_COUNT_TEXT_STYLE, fontSize: responsive.fontSize(20, 26, 26, 26) }}>곡</span>
          </div>
        )}
      </div>
    </div>
  );
}



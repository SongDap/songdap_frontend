"use client";

import { useState } from "react";
import { COLORS, FONTS, TEXT_SIZES } from "./constants";

interface MoodTagListProps {
  selectedTag?: string;
  onTagChange?: (tag: string) => void;
  showTitle?: boolean;
}

const MOOD_TAGS = ["행복", "설렘", "평온", "감성", "힐링", "우울", "외로움"] as const;

export default function MoodTagList({
  selectedTag,
  onTagChange,
  showTitle = true,
}: MoodTagListProps) {
  const [customInput, setCustomInput] = useState("");
  const [customTag, setCustomTag] = useState<string | null>(null); // 하나만 저장
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const isDirectInputSelected = selectedTag === "+ 직접 입력";

  const handleTagClick = (clickedTag: string) => {
    const newTag = selectedTag === clickedTag ? "" : clickedTag;
    onTagChange?.(newTag);
    if (clickedTag !== "+ 직접 입력") {
      setCustomInput("");
      setEditingTag(null);
    }
  };

  const handleCustomTagClick = (tag: string) => {
    // 커스텀 태그 클릭 시 수정 모드로 전환
    setEditingTag(tag);
    setCustomInput(tag);
    onTagChange?.(tag);
  };

  const handleConfirm = () => {
    if (customInput.trim()) {
      // 커스텀 태그는 하나만 저장
      setCustomTag(customInput.trim());
      onTagChange?.(customInput.trim());
      setCustomInput("");
      setEditingTag(null);
    }
  };

  const handleReset = () => {
    // 초기화: 커스텀 태그 삭제하고 "+ 직접 입력" 태그로 복귀
    setCustomTag(null);
    setCustomInput("");
    setEditingTag(null);
    onTagChange?.("");
  };

  const handleCancel = () => {
    // 취소: 입력 취소하고 "+ 직접 입력" 태그로 복귀
    setCustomInput("");
    setEditingTag(null);
    onTagChange?.("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <div>
      {showTitle && (
        <div
          style={{
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontSize: '25px',
            color: COLORS.BLACK,
            marginBottom: '10px',
          }}
        >
          무엇을 추억하려고 만드시나요?
        </div>
      )}
      
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {MOOD_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            style={{
              padding: '5px 10px',
              border: '3px solid #000000',
              borderRadius: '20px',
              backgroundColor: selectedTag === tag ? COLORS.BUTTON_ENABLED_OUTER : COLORS.WHITE,
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: TEXT_SIZES.INPUT,
              color: COLORS.BLACK,
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            {tag}
          </button>
        ))}
        {customTag && (
          editingTag === customTag ? (
            // 수정 모드: 입력창으로 표시
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                minWidth: '150px',
              }}
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="기분을 입력하세요"
                autoFocus
                style={{
                  padding: '5px 130px 5px 10px',
                  border: '3px solid #000000',
                  borderRadius: '20px',
                  backgroundColor: COLORS.WHITE,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: TEXT_SIZES.INPUT,
                  color: COLORS.BLACK,
                  outline: 'none',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              />
              <button
                type="button"
                onClick={handleReset}
                style={{
                  position: 'absolute',
                  right: '70px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '5px 15px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: COLORS.BUTTON_DISABLED_OUTER,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: TEXT_SIZES.INPUT,
                  color: COLORS.BLACK,
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                삭제
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '5px 15px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: TEXT_SIZES.INPUT,
                  color: COLORS.BLACK,
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                확인
              </button>
            </div>
          ) : (
            // 일반 모드: 버튼으로 표시
            <button
              type="button"
              onClick={() => handleCustomTagClick(customTag)}
              style={{
                padding: '5px 10px',
                border: '3px solid #000000',
                borderRadius: '20px',
                backgroundColor: selectedTag === customTag ? COLORS.BUTTON_ENABLED_OUTER : COLORS.WHITE,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: TEXT_SIZES.INPUT,
                color: COLORS.BLACK,
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              {customTag}
            </button>
          )
        )}
        {!customTag && isDirectInputSelected && !editingTag ? (
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              minWidth: '150px',
            }}
          >
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="기분을 입력하세요"
              autoFocus
              style={{
                padding: '5px 130px 5px 10px',
                border: '3px solid #000000',
                borderRadius: '20px',
                backgroundColor: COLORS.WHITE,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: TEXT_SIZES.INPUT,
                color: COLORS.BLACK,
                outline: 'none',
                boxSizing: 'border-box',
                width: '100%',
              }}
            />
            <button
              type="button"
              onClick={handleCancel}
              style={{
                position: 'absolute',
                right: '70px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '5px 15px',
                border: 'none',
                borderRadius: '15px',
                backgroundColor: COLORS.BUTTON_DISABLED_OUTER,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: TEXT_SIZES.INPUT,
                color: COLORS.BLACK,
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                position: 'absolute',
                right: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '5px 15px',
                border: 'none',
                borderRadius: '15px',
                backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: TEXT_SIZES.INPUT,
                color: COLORS.BLACK,
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              확인
            </button>
          </div>
        ) : !customTag ? (
          <button
            type="button"
            onClick={() => handleTagClick("+ 직접 입력")}
            style={{
              padding: '5px 10px',
              border: '3px solid #000000',
              borderRadius: '20px',
              backgroundColor: COLORS.WHITE,
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: TEXT_SIZES.INPUT,
              color: COLORS.BLACK,
              cursor: 'pointer',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span style={{ fontSize: TEXT_SIZES.INPUT, lineHeight: '1' }}>+</span>
            <span>직접 입력</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}


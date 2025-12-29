"use client";

import { useState } from "react";
import { COLORS, FONTS, TEXT_SIZES } from "../constants";

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
  const [customTag, setCustomTag] = useState<string | null>(null);
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
    setEditingTag(tag);
    setCustomInput(tag);
    onTagChange?.(tag);
  };

  const handleConfirm = () => {
    if (customInput.trim()) {
      setCustomTag(customInput.trim());
      onTagChange?.(customInput.trim());
      setCustomInput("");
      setEditingTag(null);
    }
  };

  const handleReset = () => {
    setCustomTag(null);
    setCustomInput("");
    setEditingTag(null);
    onTagChange?.("");
  };

  const handleCancel = () => {
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
    <div style={{ width: '100%' }}>
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
          gap: '12px',
          alignItems: 'center',
        }}
      >
        {MOOD_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            style={{
              padding: '8px 16px',
              border: '3px solid #000000',
              borderRadius: '25px',
              backgroundColor: selectedTag === tag ? COLORS.BUTTON_ENABLED_OUTER : COLORS.WHITE,
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: TEXT_SIZES.INPUT,
              color: COLORS.BLACK,
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              transform: selectedTag === tag ? 'translateY(-2px)' : 'none',
              boxShadow: selectedTag === tag ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = selectedTag === tag ? COLORS.BUTTON_ENABLED_INNER : '#f0f0f0';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = selectedTag === tag ? COLORS.BUTTON_ENABLED_OUTER : COLORS.WHITE;
              e.currentTarget.style.transform = selectedTag === tag ? 'translateY(-2px)' : 'none';
            }}
          >
            {tag}
          </button>
        ))}
        {customTag && (
          editingTag === customTag ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                maxWidth: '450px',
                minWidth: '280px',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
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
                    padding: '8px 45px 8px 16px',
                    border: '3px solid #000000',
                    borderRadius: '25px',
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
                    right: '15px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '26px',
                    color: '#999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    width: '32px',
                    height: '32px',
                  }}
                >
                  ✕
                </button>
              </div>
              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  padding: '8px 20px',
                  border: '3px solid #000000',
                  borderRadius: '25px',
                  backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: TEXT_SIZES.INPUT,
                  color: COLORS.BLACK,
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.BUTTON_ENABLED_INNER;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.BUTTON_ENABLED_OUTER;
                  e.currentTarget.style.transform = 'none';
                }}
              >
                확인
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleCustomTagClick(customTag)}
              style={{
                padding: '8px 16px',
                border: '3px solid #000000',
                borderRadius: '25px',
                backgroundColor: selectedTag === customTag ? COLORS.BUTTON_ENABLED_OUTER : COLORS.WHITE,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: TEXT_SIZES.INPUT,
                color: COLORS.BLACK,
                cursor: 'pointer',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                transform: selectedTag === customTag ? 'translateY(-2px)' : 'none',
                boxShadow: selectedTag === customTag ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = selectedTag === customTag ? COLORS.BUTTON_ENABLED_INNER : '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = selectedTag === customTag ? COLORS.BUTTON_ENABLED_OUTER : COLORS.WHITE;
                e.currentTarget.style.transform = selectedTag === customTag ? 'translateY(-2px)' : 'none';
              }}
            >
              {customTag}
            </button>
          )
        )}
        {!customTag && isDirectInputSelected && !editingTag ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              maxWidth: '450px',
              minWidth: '280px',
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
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
                  padding: '8px 45px 8px 16px',
                  border: '3px solid #000000',
                  borderRadius: '25px',
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
                  right: '15px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '26px',
                  color: '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  width: '32px',
                  height: '32px',
                }}
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                padding: '8px 20px',
                border: '3px solid #000000',
                borderRadius: '25px',
                backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: TEXT_SIZES.INPUT,
                color: COLORS.BLACK,
                cursor: 'pointer',
                boxSizing: 'border-box',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.BUTTON_ENABLED_INNER;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.BUTTON_ENABLED_OUTER;
                e.currentTarget.style.transform = 'none';
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
              padding: '8px 16px',
              border: '3px solid #000000',
              borderRadius: '25px',
              backgroundColor: COLORS.WHITE,
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: TEXT_SIZES.INPUT,
              color: COLORS.BLACK,
              cursor: 'pointer',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.WHITE;
              e.currentTarget.style.transform = 'none';
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



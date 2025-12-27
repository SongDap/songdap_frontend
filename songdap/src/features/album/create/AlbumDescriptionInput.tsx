"use client";

import { useState, useEffect } from "react";

interface AlbumDescriptionInputProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

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
      {/* 라벨 */}
      <div
        className="font-[var(--font-galmuri9)] font-bold"
        style={{
          fontSize: 'calc(30 * 100vh / 1024)',
          marginBottom: 'calc(6 * 100vh / 1024)',
        }}
      >
        앨범설명
      </div>

      {/* 글자 제한 표시 */}
      <div
        className="font-[var(--font-galmuri9)]"
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          fontSize: 'calc(30 * 100vh / 1024)',
        }}
      >
        {inputValue.length}/{maxLength}
      </div>

      {/* 입력창 */}
      <textarea
        className="album-description-scroll"
        value={inputValue}
        onChange={handleChange}
        maxLength={maxLength}
        style={{
          width: '100%',
          height: 'calc(140 * 100vh / 1024)',
          border: '3px solid #000000',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          paddingLeft: 'calc(30 * 100vh / 1024)',
          paddingRight: 'calc(16 * 100vw / 768)',
          paddingTop: 'calc(16 * 100vh / 1024)',
          paddingBottom: 'calc(16 * 100vh / 1024)',
          boxSizing: 'border-box',
          fontFamily: 'var(--font-kyobo-handwriting)',
          fontSize: 'calc(30 * 100vh / 1024)',
          outline: 'none',
          resize: 'none',
          overflowY: 'auto',
        }}
      />
    </div>
  );
}


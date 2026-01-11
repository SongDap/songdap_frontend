"use client";

import { useState } from "react";
import { AlbumData } from "./types";
import { COLORS, FONTS, responsive } from "@/features/album/create/constants";
import {
  TEXT_LIMITS,
  PUBLIC_STATUS_OPTIONS,
  INPUT_LABEL_STYLE,
  INPUT_BASE_STYLE,
  INPUT_PADDING,
  limitText,
  extractNumeric,
} from "../constants";

interface AlbumDetailEditFormProps {
  form: AlbumData;
  onChange: (field: keyof AlbumData, value: string | number) => void;
}

/**
 * 앨범 상세 정보 수정 폼 컴포넌트
 */
export default function AlbumDetailEditForm({ form, onChange }: AlbumDetailEditFormProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleAlbumNameChange = (value: string) => {
    const limitedValue = limitText(value, TEXT_LIMITS.ALBUM_NAME_MAX);
    onChange("albumName", limitedValue);
  };

  const handleAlbumDescriptionChange = (value: string) => {
    const limitedValue = limitText(value, TEXT_LIMITS.ALBUM_DESCRIPTION_MAX);
    onChange("albumDescription", limitedValue);
  };

  const handleSongCountChange = (value: string) => {
    const numeric = extractNumeric(value);
    onChange("songCount", numeric === "" ? 0 : Number(numeric));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: responsive.sizeVh(20, 24, 28, 30),
      }}
    >
      {/* 앨범명 입력 */}
      <label style={INPUT_LABEL_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>앨범명</span>
          <span style={{ fontSize: 16, color: COLORS.BLACK }}>
            {form.albumName.length}/{TEXT_LIMITS.ALBUM_NAME_MAX}
          </span>
        </div>
        <input
          value={form.albumName}
          onChange={(e) => handleAlbumNameChange(e.target.value)}
          maxLength={TEXT_LIMITS.ALBUM_NAME_MAX}
          style={{ ...INPUT_BASE_STYLE, ...INPUT_PADDING }}
        />
      </label>

      {/* 앨범 설명 입력 */}
      <label style={INPUT_LABEL_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>앨범 설명</span>
          <span style={{ fontSize: 16, color: COLORS.BLACK }}>
            {form.albumDescription.length}/{TEXT_LIMITS.ALBUM_DESCRIPTION_MAX}
          </span>
        </div>
        <textarea
          value={form.albumDescription}
          onChange={(e) => handleAlbumDescriptionChange(e.target.value)}
          maxLength={TEXT_LIMITS.ALBUM_DESCRIPTION_MAX}
          rows={3}
          style={{
            ...INPUT_BASE_STYLE,
            ...INPUT_PADDING,
            height: "auto",
            minHeight: 96,
            resize: "vertical",
          }}
        />
      </label>

      {/* 카테고리 태그 입력 */}
      <label style={INPUT_LABEL_STYLE}>
        카테고리 태그
        <input
          value={form.categoryTag || ""}
          onChange={(e) => onChange("categoryTag", e.target.value)}
          style={{ ...INPUT_BASE_STYLE, ...INPUT_PADDING }}
        />
      </label>

      {/* 공개 여부 선택 */}
      <label style={INPUT_LABEL_STYLE}>
        공개 여부
        <div
          style={{ position: "relative", minWidth: 0 }}
          tabIndex={-1}
          onBlur={() => setIsSelectOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsSelectOpen((prev) => !prev)}
            aria-expanded={isSelectOpen}
            aria-haspopup="listbox"
            style={{
              ...INPUT_BASE_STYLE,
              ...INPUT_PADDING,
              width: "100%",
              backgroundColor: "#fff",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              borderBottomLeftRadius: isSelectOpen ? 0 : INPUT_BASE_STYLE.borderRadius,
              borderBottomRightRadius: isSelectOpen ? 0 : INPUT_BASE_STYLE.borderRadius,
            }}
          >
            <span>
              {PUBLIC_STATUS_OPTIONS.find((opt) => opt.value === (form.isPublic ?? "public"))?.label ?? "공개"}
            </span>
            <span
              style={{
                display: "inline-block",
                transition: "transform 0.15s ease",
                transform: isSelectOpen ? "rotate(180deg)" : "rotate(0deg)",
                fontSize: 12,
                lineHeight: "12px",
              }}
            >
              ▾
            </span>
          </button>
          {isSelectOpen && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                margin: 0,
                padding: 0,
                listStyle: "none",
                backgroundColor: "#fff",
                border: "2px solid #000",
                borderTop: "0",
                borderRadius: "0 0 10px 10px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                overflow: "hidden",
                maxHeight: 220,
                overflowY: "auto",
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
                zIndex: 10,
              }}
            >
              {PUBLIC_STATUS_OPTIONS.map((opt, idx) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange("isPublic", opt.value);
                      setIsSelectOpen(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      backgroundColor: opt.value === (form.isPublic ?? "public") ? "#f0f0f0" : "#fff",
                      border: "none",
                      borderBottom: idx === PUBLIC_STATUS_OPTIONS.length - 1 ? "none" : "1px solid #e0e0e0",
                      fontFamily: FONTS.CAFE24_PROSLIM,
                      fontSize: 16,
                      lineHeight: "24px",
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </label>

      {/* 곡 개수 입력 */}
      <label style={INPUT_LABEL_STYLE}>
        곡 개수
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={() => onChange("songCount", Math.max(0, (form.songCount || 0) - 1))}
            style={{
              width: 44,
              height: 44,
              border: "2px solid #000",
              borderRadius: 10,
              backgroundColor: "#fff",
              fontFamily: FONTS.CAFE24_PROSLIM,
              fontSize: 22,
              lineHeight: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
            }}
          >
            −
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.songCount}
            onChange={(e) => handleSongCountChange(e.target.value)}
            style={{
              ...INPUT_BASE_STYLE,
              ...INPUT_PADDING,
              textAlign: "center",
            }}
          />
          <button
            type="button"
            onClick={() => onChange("songCount", (form.songCount || 0) + 1)}
            style={{
              width: 44,
              height: 44,
              border: "2px solid #000",
              borderRadius: 10,
              backgroundColor: "#fff",
              fontFamily: FONTS.CAFE24_PROSLIM,
              fontSize: 22,
              lineHeight: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
            }}
          >
            +
          </button>
        </div>
      </label>

      {/* 이미지/색상 수정 영역 제거 요청으로 비워둠 */}
    </div>
  );
}


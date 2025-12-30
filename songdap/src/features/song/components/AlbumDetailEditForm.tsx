"use client";

import { AlbumData } from "./types";
import { COLORS, FONTS, responsive } from "@/features/album/create/constants";

interface AlbumDetailEditFormProps {
  form: AlbumData;
  onChange: (field: keyof AlbumData, value: string | number) => void;
}

export default function AlbumDetailEditForm({ form, onChange }: AlbumDetailEditFormProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: responsive.sizeVh(20, 24, 28, 30),
      }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: FONTS.CAFE24_PROSLIM, color: COLORS.BLACK }}>
        앨범명
        <input
          value={form.albumName}
          onChange={(e) => onChange("albumName", e.target.value)}
          style={{
            padding: "10px 12px",
            border: "2px solid #000",
            borderRadius: 8,
            fontFamily: FONTS.CAFE24_PROSLIM,
          }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: FONTS.CAFE24_PROSLIM, color: COLORS.BLACK }}>
        앨범 설명
        <textarea
          value={form.albumDescription}
          onChange={(e) => onChange("albumDescription", e.target.value)}
          rows={3}
          style={{
            padding: "10px 12px",
            border: "2px solid #000",
            borderRadius: 8,
            fontFamily: FONTS.CAFE24_PROSLIM,
            resize: "vertical",
          }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: FONTS.CAFE24_PROSLIM, color: COLORS.BLACK }}>
        카테고리 태그
        <input
          value={form.categoryTag || ""}
          onChange={(e) => onChange("categoryTag", e.target.value)}
          style={{
            padding: "10px 12px",
            border: "2px solid #000",
            borderRadius: 8,
            fontFamily: FONTS.CAFE24_PROSLIM,
          }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: FONTS.CAFE24_PROSLIM, color: COLORS.BLACK }}>
        공개 여부
        <select
          value={form.isPublic ?? "public"}
          onChange={(e) => onChange("isPublic", e.target.value)}
          style={{
            padding: "10px 12px",
            border: "2px solid #000",
            borderRadius: 8,
            fontFamily: FONTS.CAFE24_PROSLIM,
          }}
        >
          <option value="public">공개</option>
          <option value="private">비공개</option>
        </select>
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: FONTS.CAFE24_PROSLIM, color: COLORS.BLACK }}>
        곡 개수
        <input
          type="number"
          min={0}
          value={form.songCount}
          onChange={(e) => onChange("songCount", Number(e.target.value))}
          style={{
            padding: "10px 12px",
            border: "2px solid #000",
            borderRadius: 8,
            fontFamily: FONTS.CAFE24_PROSLIM,
          }}
        />
      </label>

      {/* 이미지/색상 수정 영역 제거 요청으로 비워둠 */}
    </div>
  );
}


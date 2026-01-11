"use client";

import { HiLockClosed, HiLockOpen } from "react-icons/hi2";
import { TAG_STYLE, TEXT_LIMITS } from "../constants";
import { responsive } from "@/features/album/create/constants";

interface AlbumDetailTagProps {
  isPublic?: string;
  songCount?: number;
}

/**
 * 앨범 상세 모달의 태그 컴포넌트 (공개 여부, 곡 개수)
 */
export default function AlbumDetailTag({ isPublic, songCount }: AlbumDetailTagProps) {
  return (
    <>
      {isPublic && (
        <div
          style={{
            ...TAG_STYLE,
            display: "inline-flex",
            alignItems: "center",
            gap: responsive.sizeVh(4, 5, 5, 5),
          }}
        >
          {isPublic === "public" ? (
            <HiLockOpen size={parseInt(responsive.fontSize(14, 18, 20, 22))} />
          ) : (
            <HiLockClosed size={parseInt(responsive.fontSize(14, 18, 20, 22))} />
          )}
          <span>{isPublic === "public" ? "공개" : "비공개"}</span>
        </div>
      )}

      <div style={TAG_STYLE}>
        {songCount || 0}/{TEXT_LIMITS.SONG_COUNT_MAX}곡
      </div>
    </>
  );
}


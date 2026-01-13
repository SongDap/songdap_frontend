"use client";

import { responsive, COLORS, FONTS } from "@/features/album/create/constants";
import AlbumDetailSongCard from "./AlbumDetailSongCard";
import type { AlbumData } from "@/features/song/components/types";

interface AlbumDetailSongListProps {
  album: AlbumData;
  onSongClick: (index: number) => void;
  onPlayClick: (index: number) => void;
}

export default function AlbumDetailSongList({
  album,
  onSongClick,
  onPlayClick,
}: AlbumDetailSongListProps) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: responsive.sizeVh(12, 16, 20, 20),
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: "16px",
        padding: responsive.sizeVh(16, 20, 24, 24),
        boxSizing: "border-box",
      }}
    >
      {/* 노래 목록 제목 */}
      <div
        style={{
          fontFamily: FONTS.CAFE24_SSURROUND,
          fontSize: responsive.fontSize(24, 28, 32, 36),
          color: COLORS.BLACK,
          fontWeight: "900",
          WebkitTextStroke: "1.5px #ffffff",
          textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
          paddingBottom: responsive.sizeVh(8, 12, 16, 16),
        }}
      >
        수록곡 ({album.songCount}곡)
      </div>

      {/* 노래 목록 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {Array.from({ length: album.songCount || 0 }).map((_, index) => {
          const isLast = index === (album.songCount || 0) - 1;
          return (
            <AlbumDetailSongCard
              key={index}
              index={index}
              isLast={isLast}
              songTitle={album.songs?.[index]?.title || `노래 제목 ${index + 1}`}
              artistName={album.songs?.[index]?.artist || `아티스트명 ${index + 1}`}
              onCardClick={() => onSongClick(index)}
              onPlayClick={(e) => {
                e.stopPropagation();
                onPlayClick(index);
              }}
            />
          );
        })}

        {/* 노래가 없을 때 */}
        {(!album.songCount || album.songCount === 0) && (
          <div
            style={{
              padding: responsive.sizeVh(40, 60, 80, 80),
              textAlign: "center",
              border: "2px dashed #000000",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: responsive.fontSize(18, 20, 22, 24),
                color: "#999999",
              }}
            >
              아직 추가된 노래가 없어요
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


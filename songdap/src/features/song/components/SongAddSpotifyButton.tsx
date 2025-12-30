"use client";

import Image from "next/image";
import { responsive } from "@/features/album/create/constants";

interface SongAddSpotifyButtonProps {
  coverSize: number;
}

/**
 * Spotify 검색 버튼 컴포넌트
 */
export default function SongAddSpotifyButton({ coverSize }: SongAddSpotifyButtonProps) {
  return (
    <div
      style={{
        marginTop: Math.max(12, coverSize * 0.05),
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <button
        type="button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: `${Math.max(8, coverSize * 0.05)}px 10px`,
          border: "3px solid #1ED760",
          borderRadius: `${Math.max(10, coverSize * 0.07)}px`,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.16)",
        }}
      >
        <Image
          src="/images/spotify.png"
          alt="Spotify"
          width={35}
          height={35}
          style={{
            width: "clamp(24px, calc(35 * 100vw / 768), 35px)",
            height: "clamp(24px, calc(35 * 100vw / 768), 35px)",
            objectFit: "contain",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-cafe24-proslim)",
            fontSize: "clamp(20px, calc(30 * 100vw / 768), 30px)",
            color: "#ffffff",
            lineHeight: 1.2,
            fontWeight: 700,
            whiteSpace: "nowrap",
            WebkitTextStroke: "0px transparent",
          }}
        >
          노래 검색하기
        </span>
      </button>
    </div>
  );
}


"use client";

import { responsive } from "@/features/album/create/constants";
import SongAddSpotifyButton from "./SongAddSpotifyButton";
import SongAddInputField from "./SongAddInputField";
import SongAddImageUpload from "./SongAddImageUpload";

interface SongAddFormProps {
  coverSize: number;
  sidePadding: string;
  songTitle: string;
  artistName: string;
  songImagePreview: string | null;
  onSongTitleChange: (value: string) => void;
  onArtistNameChange: (value: string) => void;
  onSongImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpotifyButtonClick?: () => void;
}

/**
 * 노래 추가 폼 컴포넌트
 * Spotify 검색 버튼과 입력 필드들을 포함
 */
export default function SongAddForm({
  coverSize,
  sidePadding,
  songTitle,
  artistName,
  songImagePreview,
  onSongTitleChange,
  onArtistNameChange,
  onSongImageChange,
  onSpotifyButtonClick,
}: SongAddFormProps) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto" as const,
        overflowX: "hidden" as const,
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        paddingBottom: "clamp(12px, calc(24 * 100vh / 1024), 24px)",
      }}
    >
      {/* Spotify 검색 버튼 */}
      <SongAddSpotifyButton coverSize={coverSize} onClick={onSpotifyButtonClick} />

      {/* 곡 입력 섹션 */}
      <div
        style={{
          marginTop: Math.max(16, coverSize * 0.06),
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingBottom: "clamp(20px, calc(40 * 100vh / 1024), 40px)",
          boxSizing: "border-box",
        }}
      >
        {/* 노래 제목 입력 */}
        <SongAddInputField
          label="노래 제목"
          value={songTitle}
          onChange={onSongTitleChange}
          placeholder="노래 제목을 입력해주세요"
        />

        {/* 가수명 입력 */}
        <SongAddInputField
          label="가수명"
          value={artistName}
          onChange={onArtistNameChange}
          placeholder="가수명을 입력해주세요"
        />

        {/* 노래 이미지 업로드 (선택) */}
        <SongAddImageUpload
          songImagePreview={songImagePreview}
          onImageChange={onSongImageChange}
        />
      </div>
    </div>
  );
}


"use client";

import Image from "next/image";

const FONTS = {
  CAFE24_PROSLIM: 'var(--font-cafe24-proslim)',
} as const;

interface NicknameTagProps {
  nickname: string;
  profileImageUrl?: string;
  coverSize: number;
}

/**
 * 닉네임 태그 컴포넌트
 * 
 * @description
 * - 프로필 이미지 + 닉네임을 태그 형태로 표시
 * - 앨범 커버 크기에 비례하여 반응형으로 조정
 * - 흰색 배경 + 검은 테두리 + 그림자 스타일
 * - 프로필 이미지가 없으면 기본 아이콘(👤) 표시
 * 
 * @param nickname - 표시할 닉네임
 * @param profileImageUrl - 프로필 이미지 URL (선택)
 * @param coverSize - 앨범 커버 크기 (태그 크기 계산 기준)
 */
export default function NicknameTag({
  nickname,
  profileImageUrl,
  coverSize,
}: NicknameTagProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${coverSize * 0.02}px`,
        alignSelf: "flex-start",
        padding: `${coverSize * 0.015}px ${coverSize * 0.04}px`,
        border: "1.5px solid #000",
        borderRadius: `${coverSize * 0.1}px`,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* 프로필 이미지 */}
      <div
        style={{
          width: `${coverSize * 0.08}px`,
          height: `${coverSize * 0.08}px`,
          borderRadius: "50%",
          overflow: "hidden",
          border: "1px solid #ddd",
          backgroundColor: "#f0f0f0",
          flexShrink: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt="Profile"
            fill
            className="object-cover"
          />
        ) : (
          <div style={{ fontSize: `${coverSize * 0.04}px`, color: "#999" }}>👤</div>
        )}
      </div>
      
      {/* 닉네임 텍스트 */}
      <span
        style={{
          fontFamily: FONTS.CAFE24_PROSLIM,
          fontSize: `${coverSize * 0.07}px`,
          color: "#000",
          fontWeight: "bold",
        }}
      >
        {nickname}
      </span>
    </div>
  );
}


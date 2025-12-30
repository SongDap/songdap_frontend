"use client";

interface AlbumInfoButtonProps {
  coverSize: number;
  onClick: () => void;
}

/**
 * 앨범 정보 버튼 컴포넌트
 * 앨범 커버 내부 또는 외부에 표시되는 "앨범정보" 버튼
 */
export default function AlbumInfoButton({ coverSize, onClick }: AlbumInfoButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="앨범 정보"
      style={{
        padding: `${Math.max(8, coverSize * 0.06)}px ${Math.max(10, coverSize * 0.08)}px`,
        backgroundColor: "#ffffff",
        border: "3px solid #000",
        borderRadius: `${Math.max(8, coverSize * 0.06)}px`,
        fontSize: `${Math.max(12, coverSize * 0.08)}px`,
        cursor: "pointer",
        fontWeight: "bold",
        color: "#000",
        boxShadow: "0 4px 10px rgba(0,0,0,0.16)",
        width: "clamp(140px, 75%, 200px)",
        maxWidth: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: Math.max(6, coverSize * 0.04),
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: Math.max(18, coverSize * 0.1),
          height: Math.max(18, coverSize * 0.1),
          borderRadius: "50%",
          border: "2px solid #000",
          backgroundColor: "#fff",
          color: "#000",
          fontSize: Math.max(10, coverSize * 0.07),
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        i
      </span>
      앨범정보
    </button>
  );
}


"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { COLORS, FONTS, responsive } from "@/features/album/create/constants";

interface SongAddCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 노래 추가 완료 모달 컴포넌트
 */
export default function SongAddCompleteModal({
  isOpen,
  onClose,
}: SongAddCompleteModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleCreateAlbum = () => {
    router.push("/");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: COLORS.BACKGROUND,
          borderRadius: "20px",
          padding: responsive.sizeVh(30, 40, 50, 50),
          maxWidth: "min(520px, 92vw)",
          width: "min(520px, 92vw)",
          boxSizing: "border-box",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 메시지 */}
        <div
          style={{
            fontFamily: FONTS.KYOBO_HANDWRITING,
            fontSize: responsive.fontSize(20, 24, 28, 28),
            color: COLORS.BLACK,
            textAlign: "center",
            marginBottom: responsive.sizeVh(30, 40, 50, 50),
          }}
        >
          노래를 추가했어요~
        </div>

        {/* 버튼 */}
        <Button
          outerColor={COLORS.BUTTON_ENABLED_OUTER}
          onClick={handleCreateAlbum}
        >
          나도 앨범 만들기
        </Button>
      </div>
    </div>
  );
}


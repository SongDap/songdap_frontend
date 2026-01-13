"use client";

import { Button } from "@/shared/ui";
import { COLORS, FONTS, responsive } from "@/features/album/create/constants";
import AlbumDetailModalBase from "./AlbumDetailModalBase";

interface AlbumDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 앨범 삭제 확인 모달 컴포넌트
 */
export default function AlbumDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: AlbumDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlbumDetailModalBase isOpen={isOpen} onClose={onClose} maxWidth="400px">
        {/* 제목 */}
        <div
          style={{
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontSize: responsive.fontSize(22, 26, 30, 32),
            color: COLORS.BLACK,
            fontWeight: "bold",
            marginBottom: responsive.sizeVh(24, 28, 32, 32),
            textAlign: "center",
            paddingTop: responsive.sizeVh(10, 12, 14, 14),
          }}
        >
          앨범을 삭제하시겠습니까?
        </div>

        {/* 버튼 영역 */}
        <div
          style={{
            display: "flex",
            gap: responsive.sizeVh(12, 16, 20, 20),
            marginTop: responsive.sizeVh(30, 40, 50, 50),
          }}
        >
          {/* 취소 버튼 */}
          <Button
            onClick={onClose}
            outerColor={COLORS.WHITE}
            style={{
              flex: 1,
              height: responsive.sizeVh(48, 64, 80, 80),
              fontSize: responsive.fontSize(16, 18, 20, 22),
            }}
          >
            취소
          </Button>

          {/* 확인 버튼 */}
          <Button
            onClick={handleConfirm}
            outerColor="#ff4444"
            style={{
              flex: 1,
              height: responsive.sizeVh(48, 64, 80, 80),
              fontSize: responsive.fontSize(16, 18, 20, 22),
            }}
          >
            삭제
          </Button>
        </div>
    </AlbumDetailModalBase>
  );
}


"use client";

import { useEffect, useState } from "react";
import { HiLockClosed, HiLockOpen, HiPencilSquare } from "react-icons/hi2";
import { AlbumCoverWithLP, Button } from "@/shared/ui";
import NicknameTag from "@/shared/ui/NicknameTag";
import { COLORS, FONTS, TEXT_SIZES, responsive } from "@/features/album/create/constants";
import AlbumDetailEditForm from "./AlbumDetailEditForm";
import { AlbumData } from "./types";

/**
 * 앨범 상세 정보 모달 (편집 가능)
 * - 부모에서 내려준 앨범 데이터를 표시/수정
 * - onSave 콜백으로 상위 상태 연동 (백엔드 준비 전까지 클라이언트 상태용)
 */

interface AlbumDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updated: AlbumData) => void;
  albumData: AlbumData;
}

export default function AlbumDetailModal({
  isOpen,
  onClose,
  onSave,
  albumData,
}: AlbumDetailModalProps) {
  const [form, setForm] = useState<AlbumData>(albumData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setForm(albumData);
  }, [albumData]);

  const handleChange = (field: keyof AlbumData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.(form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(albumData);
    setIsEditing(false);
  };

  const applied = isEditing ? form : albumData;
  const appliedCoverImage = applied.coverImageUrl || undefined;
  const appliedCoverColor = appliedCoverImage ? undefined : applied.coverColor ?? COLORS.WHITE;
  const appliedLpImage = applied.lpCircleImageUrl || undefined;
  const appliedLpColor = appliedLpImage ? undefined : applied.lpColor ?? COLORS.WHITE;

  const lpSize = 200; // 모달용 고정 크기

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
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
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: COLORS.BACKGROUND,
          borderRadius: "20px",
          padding: responsive.sizeVh(20, 30, 40, 40),
          maxWidth: "520px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* 제목 + 편집 버튼(비편집 시) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
            marginBottom: responsive.sizeVh(16, 20, 24, 24),
          }}
        >
          <h2
            style={{
              fontFamily: FONTS.DUNG_GEUN_MO,
              fontSize: responsive.fontSize(20, 24, 28, 30),
              color: COLORS.BLACK,
              margin: 0,
            }}
          >
            앨범 정보
          </h2>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              outerColor="transparent"
              style={{
                width: "auto",
                minWidth: 80,
                height: "clamp(36px, calc(48 * 100vh / 1024), 48px)",
                padding: "0 12px",
                fontFamily: FONTS.DUNG_GEUN_MO,
                fontSize: responsive.fontSize(12, 14, 16, 16),
                border: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
                display: "inline-flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              <HiPencilSquare size={18} />
              수정
            </Button>
          )}
        </div>

        {/* 앨범 커버 미리보기 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: responsive.sizeVh(12, 16, 20, 20),
          }}
        >
          <AlbumCoverWithLP
            lpSize={Math.round(lpSize * 0.9)}
            coverSize={lpSize}
            lpCircleColor={appliedLpColor}
            lpCircleImageUrl={appliedLpImage}
            coverColor={appliedCoverColor}
            coverImageUrl={appliedCoverImage}
            albumName={applied.albumName}
            tag={applied.categoryTag}
            bottomContent={
              <NicknameTag
                nickname={albumData.nickname}
                profileImageUrl={albumData.profileImageUrl}
                coverSize={lpSize}
              />
            }
            date={applied.createdDate}
            showCoverText={true}
          />
        </div>

        {/* 태그들 (공개여부, 곡 개수) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: responsive.sizeVh(6, 8, 10, 10),
            alignItems: "center",
            justifyContent: "center",
            marginBottom: responsive.sizeVh(16, 20, 24, 24),
          }}
        >
          {applied.isPublic && (
            <div
              style={{
                padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(8, 10, 10, 10)}`,
                border: "3px solid #000000",
                borderRadius: responsive.sizeVh(12, 20, 20, 20),
                backgroundColor: COLORS.WHITE,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: responsive.fontSize(14, 18, 20, 22),
                color: COLORS.BLACK,
                boxSizing: "border-box",
                display: "inline-flex",
                alignItems: "center",
                gap: responsive.sizeVh(4, 5, 5, 5),
              }}
            >
              {applied.isPublic === "public" ? (
                <HiLockOpen size={parseInt(responsive.fontSize(14, 18, 20, 22))} />
              ) : (
                <HiLockClosed size={parseInt(responsive.fontSize(14, 18, 20, 22))} />
              )}
              <span>{applied.isPublic === "public" ? "공개" : "비공개"}</span>
            </div>
          )}

          <div
            style={{
              padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(8, 10, 10, 10)}`,
              border: "3px solid #000000",
              borderRadius: responsive.sizeVh(12, 20, 20, 20),
              backgroundColor: COLORS.WHITE,
              fontFamily: FONTS.KYOBO_HANDWRITING,
              fontSize: responsive.fontSize(14, 18, 20, 22),
              color: COLORS.BLACK,
              boxSizing: "border-box",
            }}
          >
            {applied.songCount}곡
          </div>
        </div>

        {/* 앨범 설명 */}
        {applied.albumDescription && (
          <div
            style={{
              padding: responsive.sizeVh(12, 16, 20, 20),
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: "10px",
              marginBottom: responsive.sizeVh(20, 24, 28, 30),
            }}
          >
            <div
              style={{
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: responsive.fontSize(14, 16, 18, 20),
                color: COLORS.BLACK,
                lineHeight: "1.6",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              앨범 설명: {applied.albumDescription}
            </div>
          </div>
        )}

        {/* 편집 폼 */}
        {isEditing && (
          <AlbumDetailEditForm form={form} onChange={handleChange} />
        )}

        {/* 하단 버튼: 편집 여부에 따라 닫기 / 취소·저장 */}
        {!isEditing ? (
          <Button
            onClick={onClose}
            outerColor={COLORS.BUTTON_ENABLED_OUTER}
            style={{
              width: "100%",
              height: "clamp(48px, calc(96 * 100vh / 1024), 96px)",
              fontFamily: FONTS.DUNG_GEUN_MO,
              fontSize: responsive.fontSize(16, 18, 20, 22),
            }}
          >
            닫기
          </Button>
        ) : (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <Button
              onClick={handleCancel}
              outerColor={COLORS.WHITE}
              style={{
                flex: 1,
                height: "clamp(48px, calc(96 * 100vh / 1024), 96px)",
                fontFamily: FONTS.DUNG_GEUN_MO,
                fontSize: responsive.fontSize(16, 18, 20, 22),
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              outerColor={COLORS.BUTTON_ENABLED_OUTER}
              style={{
                flex: 1,
                height: "clamp(48px, calc(96 * 100vh / 1024), 96px)",
                fontFamily: FONTS.DUNG_GEUN_MO,
                fontSize: responsive.fontSize(16, 18, 20, 22),
              }}
            >
              저장
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


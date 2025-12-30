"use client";

import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { AlbumCoverWithLP, Button } from "@/shared/ui";
import NicknameTag from "@/shared/ui/NicknameTag";
import { COLORS, FONTS, responsive } from "@/features/album/create/constants";
import { MODAL_CONFIG } from "../constants";
import AlbumDetailEditForm from "./AlbumDetailEditForm";
import AlbumDetailTag from "./AlbumDetailTag";
import { AlbumData } from "./types";

/**
 * 앨범 상세 정보 모달 컴포넌트
 *
 * @description
 * - 앨범 정보를 표시하고 수정할 수 있는 모달
 * - 편집 모드와 보기 모드를 지원
 * - onSave 콜백으로 상위 컴포넌트에 변경사항 전달
 * - editable prop으로 편집 가능 여부 제어
 */
interface AlbumDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updated: AlbumData) => void;
  albumData: AlbumData;
  editable?: boolean;
}

export default function AlbumDetailModal({
  isOpen,
  onClose,
  onSave,
  albumData,
  editable = true,
}: AlbumDetailModalProps) {
  const [form, setForm] = useState<AlbumData>(albumData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setForm(albumData);
  }, [albumData]);

  // 모달이 닫히면 편집 상태와 폼을 초기화
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setForm(albumData);
    }
  }, [isOpen, albumData]);

  // 편집 불가 모드에서는 항상 보기 모드 유지
  useEffect(() => {
    if (!editable) {
      setIsEditing(false);
    }
  }, [editable]);

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

  // 표시할 데이터 결정 (편집 중이면 폼 데이터, 아니면 원본 데이터)
  const applied = isEditing ? form : albumData;
  
  // 커버 이미지/색상 우선순위 처리 (이미지가 있으면 색상 무시)
  const appliedCoverImage = applied.coverImageUrl || undefined;
  const appliedCoverColor = appliedCoverImage ? undefined : applied.coverColor ?? COLORS.WHITE;
  
  // LP 이미지/색상 우선순위 처리 (이미지가 있으면 색상 무시)
  const appliedLpImage = applied.lpCircleImageUrl || undefined;
  const appliedLpColor = appliedLpImage ? undefined : applied.lpColor ?? COLORS.WHITE;

  const lpSize = MODAL_CONFIG.LP_SIZE;

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
          backgroundColor: MODAL_CONFIG.OVERLAY_BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: COLORS.BACKGROUND,
            borderRadius: "20px",
            padding: responsive.sizeVh(20, 30, 40, 40),
            paddingBottom: responsive.sizeVh(20, 30, 40, 40),
            maxWidth: `${MODAL_CONFIG.MAX_WIDTH}px`,
            width: `min(${MODAL_CONFIG.MAX_WIDTH}px, 92vw)`,
            maxHeight: MODAL_CONFIG.MAX_HEIGHT,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            position: "relative",
          }}
        >
        {/* 상단 닫기(X) 버튼 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: "absolute",
            top: responsive.sizeVh(10, 12, 14, 14),
            right: responsive.sizeVh(10, 12, 14, 14),
            width: responsive.sizeVh(32, 36, 40, 44),
            height: responsive.sizeVh(32, 36, 40, 44),
            border: "none",
            background: "transparent",
            color: COLORS.BLACK,
            fontSize: responsive.fontSize(24, 26, 28, 30),
            lineHeight: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* 제목 + 편집 버튼(비편집 시) - 고정 영역 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
            flexWrap: "wrap",
            rowGap: 8,
            marginBottom: responsive.sizeVh(12, 14, 16, 16),
          }}
        >
          <h2
            style={{
              fontFamily: FONTS.DUNG_GEUN_MO,
              fontSize: responsive.fontSize(22, 26, 30, 32),
              color: COLORS.BLACK,
              margin: 0,
            }}
          >
            {isEditing ? "앨범 정보 수정" : "앨범 정보"}
          </h2>
          {editable && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              outerColor="transparent"
              style={{
                width: "auto",
                minWidth: 96,
                height: "clamp(40px, calc(52 * 100vh / 1024), 52px)",
                padding: "0 14px",
                fontFamily: FONTS.DUNG_GEUN_MO,
                fontSize: responsive.fontSize(14, 16, 18, 18),
                border: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
                display: "inline-flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <HiPencilSquare size={20} />
              수정
            </Button>
          )}
        </div>

        {/* 본문 스크롤 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: responsive.sizeVh(12, 14, 16, 16),
            overflowY: "auto",
            overscrollBehavior: "contain",
            paddingRight: 2,
            flex: 1,
          }}
        >
          {/* 앨범 커버 미리보기 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
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
            }}
          >
            <AlbumDetailTag isPublic={applied.isPublic} songCount={applied.songCount} />
          </div>

          {/* 앨범 설명 */}
          {applied.albumDescription && (
            <div
              style={{
                padding: responsive.sizeVh(12, 16, 20, 20),
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: "10px",
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
          {editable && isEditing && (
            <AlbumDetailEditForm form={form} onChange={handleChange} />
          )}
        </div>

        {/* 하단 버튼: 편집 모드일 때만 취소/저장 */}
        {editable && isEditing && (
          <div
            style={{
              display: "flex",
              gap: 8,
              width: "100%",
              paddingTop: responsive.sizeVh(10, 12, 14, 14),
              paddingBottom: responsive.sizeVh(6, 8, 8, 8),
            }}
          >
            <Button
              onClick={handleCancel}
              outerColor={COLORS.WHITE}
              style={{
                flex: 1,
                height: "clamp(40px, calc(64 * 100vh / 1024), 72px)",
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
                height: "clamp(40px, calc(64 * 100vh / 1024), 72px)",
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


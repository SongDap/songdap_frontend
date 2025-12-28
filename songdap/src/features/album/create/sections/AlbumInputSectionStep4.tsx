"use client";

import React, { useState, useEffect } from "react";
import { AlbumCoverWithLP } from "@/shared/ui";
import { FaPalette, FaPaintBrush, FaImages, FaRedo } from "react-icons/fa";
import {
  LABEL_STYLE,
  CATEGORY_INPUT_BOX_STYLE,
  responsive,
  COLORS,
  FONTS,
  TEXT_SIZES,
} from "../constants";

const COLOR_OPTIONS = [
  { label: "흰색", value: "#ffffff" },
  { label: "회색", value: "#808080" },
  { label: "빨강", value: "#ff0000" },
  { label: "파랑", value: "#0000ff" },
  { label: "초록", value: "#00ff00" },
  { label: "노랑", value: "#ffff00" },
  { label: "보라", value: "#800080" },
  { label: "분홍", value: "#ffc0cb" },
];

interface AlbumInputSectionStep4Props {
  lpColor?: string;
  onLpColorChange?: (color: string) => void;
  lpCircleImageUrl?: string;
  onLpCircleImageUrlChange?: (url: string | undefined) => void;
  coverColor?: string;
  onCoverColorChange?: (color: string) => void;
  coverImageUrl?: string;
  onCoverImageUrlChange?: (url: string | undefined) => void;
  isSyncEnabled?: boolean;
  onSyncEnabledChange?: (enabled: boolean, source: "cover" | "lp") => void;
}

export default function AlbumInputSectionStep4({
  lpColor = "#ffffff",
  onLpColorChange,
  lpCircleImageUrl,
  onLpCircleImageUrlChange,
  coverColor = "#ffffff",
  onCoverColorChange,
  coverImageUrl,
  onCoverImageUrlChange,
  isSyncEnabled = false,
  onSyncEnabledChange,
}: AlbumInputSectionStep4Props) {
  // 앨범 커버 관련 상태
  const [isCoverColorModalOpen, setIsCoverColorModalOpen] = useState(false);
  const [isCoverImageModalOpen, setIsCoverImageModalOpen] = useState(false);
  const [previewCoverColor, setPreviewCoverColor] = useState(coverColor);
  const [previewCoverImageUrl, setPreviewCoverImageUrl] = useState<string | undefined>(coverImageUrl);
  
// LP 관련 상태
  const [isLpColorModalOpen, setIsLpColorModalOpen] = useState(false);
  const [isLpImageModalOpen, setIsLpImageModalOpen] = useState(false);
  const [previewLpColor, setPreviewLpColor] = useState(lpColor);
  const [previewLpImageUrl, setPreviewLpImageUrl] = useState<string | undefined>(lpCircleImageUrl);
  
  // 색상 추가 관련 상태
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [customColorInput, setCustomColorInput] = useState("");
  const [customColor, setCustomColor] = useState<{ label: string; value: string } | null>(null);
  const [currentColorModalType, setCurrentColorModalType] = useState<'cover' | 'lp'>('cover');
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  // 앨범 커버 preview 업데이트
  useEffect(() => {
    setPreviewCoverColor(coverColor);
  }, [coverColor]);

  useEffect(() => {
    setPreviewCoverImageUrl(coverImageUrl);
  }, [coverImageUrl]);

  // LP preview 업데이트 (동기화 여부에 따라)
  useEffect(() => {
    if (isSyncEnabled) {
      setPreviewLpColor(coverColor);
      setPreviewLpImageUrl(coverImageUrl);
    } else {
      setPreviewLpColor(lpColor);
      setPreviewLpImageUrl(lpCircleImageUrl);
    }
  }, [isSyncEnabled, coverColor, coverImageUrl, lpColor, lpCircleImageUrl]);

  const handleColorClick = (color: string, isCustom: boolean = false) => {
    if (isCustom && customColor) {
      setIsAddingColor(true);
      setCustomColorInput(customColor.value);
      if (currentColorModalType === 'cover') {
        setPreviewCoverColor(customColor.value);
    } else {
        setPreviewLpColor(customColor.value);
      }
    } else {
      if (currentColorModalType === 'cover') {
        setPreviewCoverColor(color);
      } else {
        setPreviewLpColor(color);
      }
    }
  };

  const handleAddColorClick = () => {
    setIsAddingColor(true);
    // 색상 입력 필드 클릭 트리거
    setTimeout(() => {
      colorInputRef.current?.click();
    }, 0);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColorInput(color);
    if (currentColorModalType === 'cover') {
      setPreviewCoverColor(color);
    } else {
      setPreviewLpColor(color);
    }
  };

  const handleCustomColorConfirm = () => {
    if (customColorInput) {
      const newColor = {
        label: "사용자 지정",
        value: customColorInput,
      };
      setCustomColor(newColor);
      if (currentColorModalType === 'cover') {
        setPreviewCoverColor(customColorInput);
      } else {
        setPreviewLpColor(customColorInput);
      }
      setCustomColorInput("");
      setIsAddingColor(false);
    }
  };

  const handleCustomColorCancel = () => {
    setCustomColorInput("");
    setIsAddingColor(false);
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewCoverImageUrl(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLpImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLpImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 전체 초기화 핸들러
  const handleResetAll = () => {
    onCoverColorChange?.(COLORS.WHITE);
    onCoverImageUrlChange?.(undefined);
    onLpColorChange?.(COLORS.WHITE);
    onLpCircleImageUrlChange?.(undefined);
    onSyncEnabledChange?.(false); // 동기화 체크박스 해제
    setPreviewCoverColor(COLORS.WHITE);
    setPreviewCoverImageUrl(undefined);
    setPreviewLpColor(COLORS.WHITE);
    setPreviewLpImageUrl(undefined);
  };

  // 앨범 커버 초기화 핸들러
  const handleResetCover = () => {
    onCoverColorChange?.(COLORS.WHITE);
    onCoverImageUrlChange?.(undefined);
    setPreviewCoverColor(COLORS.WHITE);
    setPreviewCoverImageUrl(undefined);
    // 동기화가 켜져있으면 LP도 함께 초기화
    if (isSyncEnabled) {
      onLpColorChange?.(COLORS.WHITE);
      onLpCircleImageUrlChange?.(undefined);
      setPreviewLpColor(COLORS.WHITE);
      setPreviewLpImageUrl(undefined);
    }
  };

  // LP 원 초기화 핸들러
  const handleResetLp = () => {
    onLpColorChange?.(COLORS.WHITE);
    onLpCircleImageUrlChange?.(undefined);
    setPreviewLpColor(COLORS.WHITE);
    setPreviewLpImageUrl(undefined);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: responsive.sizeVh(10, 15, 15, 15),
      }}
    >
      {/* 전체 초기화 버튼 */}
      <div
        style={{
          marginBottom: responsive.sizeVh(8, 10, 10, 10),
        }}
      >
        <button
          onClick={handleResetAll}
          style={{
            padding: `${responsive.sizeVh(6, 10, 10, 10)} ${responsive.sizeVh(12, 16, 16, 16)}`,
            border: "2px solid #000",
            borderRadius: "8px",
            backgroundColor: COLORS.BACKGROUND,
            cursor: "pointer",
          display: "flex",
          alignItems: "center",
            gap: responsive.sizeVh(4, 6, 6, 6),
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontSize: responsive.fontSize(14, 18, 18, 18),
            color: COLORS.BLACK,
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f5f5f0";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.BACKGROUND;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          <FaRedo size={responsive.sizeVh(14, 18, 18, 18)} />
          전체 초기화
        </button>
      </div>

      {/* 앨범 커버 섹션 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: responsive.sizeVh(8, 10, 10, 10),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: responsive.sizeVh(8, 10, 10, 10) }}>
            <div style={LABEL_STYLE}>{isSyncEnabled ? "앨범 커버 & LP" : "앨범 커버"}</div>
            <label
          style={{
                display: "flex",
                alignItems: "center",
                gap: responsive.sizeVh(4, 6, 6, 6),
                cursor: "pointer",
                fontFamily: FONTS.CAFE24_PROSLIM,
                fontSize: responsive.fontSize(12, 16, 18, 20),
                color: COLORS.BLACK,
              }}
            >
              <input
                type="checkbox"
                checked={isSyncEnabled}
                onChange={(e) => onSyncEnabledChange?.(e.target.checked, "cover")}
                style={{
                  width: responsive.sizeVh(16, 18, 18, 18),
                  height: responsive.sizeVh(16, 18, 18, 18),
                  cursor: "pointer",
                  accentColor: COLORS.BLACK,
                  transition: "all 0.2s ease",
                }}
              />
              <span>앨범커버 & LP 동일하게 설정</span>
            </label>
          </div>
          {!isSyncEnabled && (
            <button
              onClick={handleResetCover}
          style={{
                padding: `${responsive.sizeVh(5, 7, 7, 7)} ${responsive.sizeVh(10, 12, 12, 12)}`,
            border: "2px solid #000",
                borderRadius: "6px",
            backgroundColor: COLORS.BACKGROUND,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
                gap: responsive.sizeVh(4, 5, 5, 5),
            fontFamily: FONTS.CAFE24_PROSLIM,
                fontSize: responsive.fontSize(12, 16, 16, 16),
            color: COLORS.BLACK,
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f0";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.BACKGROUND;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            >
              <FaRedo size={responsive.sizeVh(12, 14, 14, 14)} />
          초기화
        </button>
          )}
      </div>
      <div
        style={{
          ...CATEGORY_INPUT_BOX_STYLE,
          display: "flex",
            gap: responsive.sizeVh(10, 15, 15, 15),
            padding: responsive.sizeVh(12, 16, 16, 16),
          }}
        >
        <button
          onClick={() => {
              setCurrentColorModalType('cover');
              setIsCoverColorModalOpen(true);
          }}
          style={{
            flex: 1,
            padding: `${responsive.sizeVh(12, 14, 14, 14)} ${responsive.sizeVh(18, 22, 22, 22)}`,
            border: "3px solid #000000",
            borderRadius: "12px",
            backgroundColor: COLORS.WHITE,
            cursor: "pointer",
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontSize: responsive.fontSize(16, 20, 24, 25),
            color: COLORS.BLACK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: responsive.sizeVh(6, 8, 8, 8),
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fafafa";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.WHITE;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
            <FaPaintBrush size={responsive.sizeVh(18, 20, 22, 25)} />
            색상 선택
          </button>
          <button
            onClick={() => setIsCoverImageModalOpen(true)}
            style={{
            flex: 1,
              padding: `${responsive.sizeVh(12, 14, 14, 14)} ${responsive.sizeVh(18, 22, 22, 22)}`,
              border: "3px solid #000000",
              borderRadius: "12px",
              backgroundColor: COLORS.WHITE,
              cursor: "pointer",
              fontFamily: FONTS.CAFE24_PROSLIM,
              fontSize: responsive.fontSize(16, 20, 24, 25),
              color: COLORS.BLACK,
              display: "flex",
              alignItems: "center",
            justifyContent: "center",
              gap: responsive.sizeVh(6, 8, 8, 8),
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fafafa";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.WHITE;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
            }}
          >
            <FaImages size={responsive.sizeVh(18, 20, 22, 25)} />
            이미지 선택
          </button>
      </div>
        </div>

      {/* LP 섹션 (동기화가 꺼져있을 때만 표시) */}
      {!isSyncEnabled && (
        <div
            style={{
            display: "flex",
            flexDirection: "column",
            gap: responsive.sizeVh(8, 10, 10, 10),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: responsive.sizeVh(8, 10, 10, 10) }}>
              <div style={LABEL_STYLE}>LP</div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: responsive.sizeVh(4, 6, 6, 6),
                  cursor: "pointer",
              fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(12, 16, 18, 20),
              color: COLORS.BLACK,
                }}
              >
                <input
                  type="checkbox"
                  checked={isSyncEnabled}
                  onChange={(e) => onSyncEnabledChange?.(e.target.checked, "lp")}
                  style={{
                    width: responsive.sizeVh(16, 18, 18, 18),
                    height: responsive.sizeVh(16, 18, 18, 18),
                    cursor: "pointer",
                    accentColor: COLORS.BLACK,
                    transition: "all 0.2s ease",
                  }}
                />
                <span>앨범커버 & LP 동일하게 설정</span>
              </label>
        </div>
          <button
              onClick={handleResetLp}
          style={{
                padding: `${responsive.sizeVh(5, 7, 7, 7)} ${responsive.sizeVh(10, 12, 12, 12)}`,
            border: "2px solid #000",
                borderRadius: "6px",
            backgroundColor: COLORS.BACKGROUND,
              cursor: "pointer",
            display: "flex",
            alignItems: "center",
                gap: responsive.sizeVh(4, 5, 5, 5),
              fontFamily: FONTS.CAFE24_PROSLIM,
                fontSize: responsive.fontSize(12, 16, 16, 16),
            color: COLORS.BLACK,
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f0";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.BACKGROUND;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            >
              <FaRedo size={responsive.sizeVh(12, 14, 14, 14)} />
          초기화
        </button>
      </div>
      <div
        style={{
          ...CATEGORY_INPUT_BOX_STYLE,
              display: "flex",
              gap: responsive.sizeVh(10, 15, 15, 15),
              padding: responsive.sizeVh(12, 16, 16, 16),
          }}
        >
          <button
              onClick={() => {
                setCurrentColorModalType('lp');
                setIsLpColorModalOpen(true);
              }}
            style={{
            flex: 1,
                padding: `${responsive.sizeVh(12, 14, 14, 14)} ${responsive.sizeVh(18, 22, 22, 22)}`,
                border: "3px solid #000000",
                borderRadius: "12px",
                backgroundColor: COLORS.WHITE,
              cursor: "pointer",
              fontFamily: FONTS.CAFE24_PROSLIM,
                fontSize: responsive.fontSize(16, 20, 24, 25),
              color: COLORS.BLACK,
              display: "flex",
              alignItems: "center",
            justifyContent: "center",
                gap: responsive.sizeVh(6, 8, 8, 8),
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fafafa";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.WHITE;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
        >
              <FaPaintBrush size={responsive.sizeVh(18, 20, 22, 25)} />
            색상 선택
          </button>
          <button
              onClick={() => setIsLpImageModalOpen(true)}
            style={{
            flex: 1,
                padding: `${responsive.sizeVh(12, 14, 14, 14)} ${responsive.sizeVh(18, 22, 22, 22)}`,
                border: "3px solid #000000",
                borderRadius: "12px",
                backgroundColor: COLORS.WHITE,
              cursor: "pointer",
              fontFamily: FONTS.CAFE24_PROSLIM,
                fontSize: responsive.fontSize(16, 20, 24, 25),
              color: COLORS.BLACK,
              display: "flex",
              alignItems: "center",
                justifyContent: "center",
                gap: responsive.sizeVh(6, 8, 8, 8),
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fafafa";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.WHITE;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
          >
              <FaImages size={responsive.sizeVh(18, 20, 22, 25)} />
            이미지 선택
          </button>
        </div>
      </div>
      )}

      {/* 앨범 커버 색상 선택 모달 */}
      {isCoverColorModalOpen && (
        <>
          <div
            onClick={() => setIsCoverColorModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: COLORS.WHITE,
              borderTop: "3px solid #000",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              padding: responsive.sizeVh(20, 30, 30, 30),
              zIndex: 1001,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            {/* 모달 제목 */}
            <div
              style={{
                marginBottom: responsive.sizeVh(12, 20, 20, 20),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: responsive.sizeVh(6, 10, 10, 10),
                  marginBottom: responsive.sizeVh(6, 10, 10, 10),
                }}
              >
                <FaPalette size={responsive.sizeVh(20, 25, 25, 25)} color={COLORS.BLACK} />
                <span
                  style={{
                    fontFamily: FONTS.CAFE24_PROSLIM,
                    fontSize: responsive.fontSize(18, 22, 24, 25),
                    color: COLORS.BLACK,
                  }}
                >
                  색상 선택
                </span>
              </div>
              <span
                style={{
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(14, 16, 18, 18),
                  color: COLORS.BLACK,
                }}
              >
                앨범 커버의 색상을 선택해주세요
              </span>
            </div>

            {/* 왼쪽: 앨범 컴포넌트 미리보기, 오른쪽: 색상 태그 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: responsive.sizeVh(15, 30, 30, 30),
                marginBottom: responsive.sizeVh(12, 20, 20, 20),
              }}
            >
              {/* 왼쪽: 앨범 컴포넌트 미리보기 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <AlbumCoverWithLP
                  coverImageUrl={undefined}
                  coverColor={previewCoverColor}
                  lpCircleColor={isSyncEnabled ? previewCoverColor : previewLpColor}
                  lpCircleImageUrl={isSyncEnabled ? undefined : previewLpImageUrl}
                  lpSize={typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.15) : 180}
                  coverSize={typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.18) : 200}
                />
              </div>

              {/* 오른쪽: 색상 태그 나열 */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: responsive.sizeVh(8, 15, 15, 15),
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                {[...COLOR_OPTIONS, ...(customColor ? [customColor] : [])].map((color) => {
                  const isCustom = color.label === "사용자 지정";
                  return (
                  <div
                    key={color.value}
                    onClick={() => handleColorClick(color.value, isCustom)}
                    style={{
                      padding: `${responsive.sizeVh(6, 10, 10, 10)} ${responsive.sizeVh(12, 20, 20, 20)}`,
                      border: `3px solid ${color.value === previewCoverColor ? COLORS.BLACK : "#ccc"}`,
                      borderRadius: responsive.sizeVh(12, 20, 20, 20),
                      backgroundColor: color.value === previewCoverColor ? color.value : COLORS.WHITE,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: responsive.sizeVh(6, 10, 10, 10),
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: responsive.sizeVh(16, 20, 20, 20),
                        height: responsive.sizeVh(16, 20, 20, 20),
                        borderRadius: "50%",
                        backgroundColor: color.value,
                        border: "2px solid #000",
                      }}
                    />
                    <span
                      style={{
                        fontSize: responsive.fontSize(14, 18, 20, 20),
                        color: COLORS.BLACK,
                        fontFamily: FONTS.CAFE24_PROSLIM,
                      }}
                    >
                      {color.label}
                    </span>
                  </div>
                  );
                })}
                {/* 색상 추가/수정 모드 UI */}
                {isAddingColor ? (
                  <div
                    style={{
                      padding: `${responsive.vh(10)} ${responsive.vh(20)}`,
                      border: "3px solid #000",
                      borderRadius: "20px",
                      backgroundColor: COLORS.WHITE,
                      display: "flex",
                      alignItems: "center",
                      gap: responsive.vh(10),
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: responsive.vh(60),
                        height: responsive.vh(60),
                        borderRadius: "50%",
                        backgroundColor: customColorInput || previewCoverColor,
                        border: "2px solid #000",
                        overflow: "hidden",
                      }}
                    >
                      <input
                        ref={colorInputRef}
                        type="color"
                        value={customColorInput || previewCoverColor}
                        onChange={handleCustomColorChange}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          outline: "none",
                          padding: 0,
                          opacity: 0,
                        }}
                      />
                    </div>
                    <button
                      onClick={handleCustomColorConfirm}
                      style={{
                        padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(10, 15, 15, 15)}`,
                        border: "3px solid #000000",
                        borderRadius: responsive.sizeVh(6, 10, 10, 10),
                        backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                        cursor: "pointer",
                        fontFamily: FONTS.CAFE24_PROSLIM,
                        fontSize: responsive.fontSize(14, 18, 20, 20),
                        color: COLORS.BLACK,
                      }}
                    >
                      확인
                    </button>
                    <button
                      onClick={handleCustomColorCancel}
                      style={{
                        padding: `${responsive.vh(5)} ${responsive.vh(15)}`,
                        border: "3px solid #000000",
                        borderRadius: "10px",
                        backgroundColor: COLORS.BACKGROUND,
                        cursor: "pointer",
                        fontFamily: FONTS.CAFE24_PROSLIM,
                        fontSize: responsive.vh(20),
                        color: COLORS.BLACK,
                      }}
                    >
                      취소
                    </button>
                    </div>
                ) : !customColor ? (
                  <div
                    onClick={handleAddColorClick}
                    style={{
                      padding: `${responsive.vh(10)} ${responsive.vh(20)}`,
                      border: "3px solid #ccc",
                      borderRadius: "20px",
                      backgroundColor: COLORS.WHITE,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: responsive.vh(10),
                      transition: "all 0.2s",
                    }}
                  >
                    <span
                      style={{
                        fontSize: responsive.vh(20),
                        color: COLORS.BLACK,
                        fontFamily: FONTS.CAFE24_PROSLIM,
                      }}
                    >
                      + 색상 추가
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: responsive.sizeVh(10, 15, 15, 15),
              }}
            >
              <button
                onClick={() => setIsCoverColorModalOpen(false)}
                style={{
                  flex: 1,
                  padding: responsive.sizeVh(10, 15, 15, 15),
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(8, 10, 10, 10),
                  backgroundColor: COLORS.BACKGROUND,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(16, 22, 24, 25),
                  color: COLORS.BLACK,
                }}
              >
                닫기
              </button>
              <button
                onClick={() => {
                  onCoverColorChange?.(previewCoverColor);
                  onCoverImageUrlChange?.(undefined);
                  setIsCoverColorModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: responsive.sizeVh(10, 15, 15, 15),
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(8, 10, 10, 10),
                  backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(16, 22, 24, 25),
                  color: COLORS.BLACK,
                }}
              >
                확인
              </button>
            </div>
          </div>
        </>
      )}

      {/* 앨범 커버 이미지 선택 모달 */}
      {isCoverImageModalOpen && (
        <>
          <div
            onClick={() => setIsCoverImageModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: COLORS.WHITE,
              borderTop: "3px solid #000",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              padding: responsive.sizeVh(20, 30, 30, 30),
              zIndex: 1001,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            {/* 모달 제목 */}
            <div
              style={{
                marginBottom: responsive.sizeVh(12, 20, 20, 20),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: responsive.sizeVh(6, 10, 10, 10),
                  marginBottom: responsive.sizeVh(6, 10, 10, 10),
                }}
              >
                <FaImages size={responsive.vh(25)} />
                <span
                  style={{
                    fontFamily: FONTS.CAFE24_PROSLIM,
                    fontSize: responsive.fontSize(18, 22, 24, 25),
                    color: COLORS.BLACK,
                  }}
                >
                  이미지 선택
                </span>
              </div>
              <span
                style={{
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.vh(18),
                  color: COLORS.BLACK,
                }}
              >
                앨범 커버 이미지를 선택해주세요
              </span>
            </div>

            {/* 본문: 왼쪽 미리보기, 오른쪽 이미지 업로드 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: responsive.sizeVh(15, 30, 30, 30),
                marginBottom: responsive.sizeVh(12, 20, 20, 20),
              }}
            >
              {/* 왼쪽: 앨범 컴포넌트 미리보기 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <AlbumCoverWithLP
                  coverImageUrl={previewCoverImageUrl}
                  coverColor={COLORS.WHITE}
                  lpCircleColor={isSyncEnabled ? COLORS.WHITE : previewLpColor}
                  lpCircleImageUrl={isSyncEnabled ? previewCoverImageUrl : previewLpImageUrl}
                  lpSize={typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.15) : 180}
                  coverSize={typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.18) : 200}
                />
              </div>

              {/* 오른쪽: 이미지 업로드 */}
              <div
                style={{
            width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: responsive.sizeVh(10, 15, 15, 15),
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  style={{
                    display: "none",
                  }}
                  id="cover-image-input"
                />
                <label
                  htmlFor="cover-image-input"
                  style={{
                    padding: `${responsive.sizeVh(10, 15, 15, 15)} ${responsive.sizeVh(20, 30, 30, 30)}`,
                    border: "3px solid #000000",
              borderRadius: responsive.sizeVh(8, 10, 10, 10),
                    backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                    cursor: "pointer",
                    fontFamily: FONTS.CAFE24_PROSLIM,
              fontSize: responsive.fontSize(16, 22, 24, 25),
                    color: COLORS.BLACK,
                    display: "flex",
                    alignItems: "center",
              gap: responsive.sizeVh(6, 10, 10, 10),
                  }}
                >
            <FaImages size={responsive.sizeVh(20, 25, 25, 25)} />
                  이미지 업로드
                </label>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: responsive.sizeVh(10, 15, 15, 15),
              }}
            >
              <button
                onClick={() => {
                  setPreviewCoverImageUrl(coverImageUrl);
                  setIsCoverImageModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: responsive.sizeVh(10, 15, 15, 15),
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(8, 10, 10, 10),
                  backgroundColor: COLORS.BACKGROUND,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(16, 22, 24, 25),
                  color: COLORS.BLACK,
                }}
              >
                닫기
              </button>
              <button
                onClick={() => {
                  onCoverImageUrlChange?.(previewCoverImageUrl);
                  onCoverColorChange?.(COLORS.WHITE);
                  setIsCoverImageModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: responsive.sizeVh(10, 15, 15, 15),
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(8, 10, 10, 10),
                  backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(16, 22, 24, 25),
                  color: COLORS.BLACK,
                }}
              >
                확인
              </button>
            </div>
          </div>
        </>
      )}

      {/* 색상 선택 모달 */}
      {isLpColorModalOpen && (
        <>
          <div
            onClick={() => setIsLpColorModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: COLORS.WHITE,
              borderTop: "3px solid #000",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              padding: responsive.sizeVh(20, 30, 30, 30),
              zIndex: 1001,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <div style={{ marginBottom: responsive.vh(20) }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: responsive.sizeVh(6, 10, 10, 10),
                  marginBottom: responsive.sizeVh(6, 10, 10, 10),
                }}
              >
                <FaPalette size={responsive.sizeVh(20, 25, 25, 25)} color={COLORS.BLACK} />
                <span
                  style={{
                    fontFamily: FONTS.CAFE24_PROSLIM,
                    fontSize: responsive.fontSize(18, 22, 24, 25),
                    color: COLORS.BLACK,
                  }}
                >
                  색상 선택
                </span>
              </div>
              <span
                style={{
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(14, 16, 18, 18),
                  color: COLORS.BLACK,
                }}
              >
                LP의 색상을 선택해주세요
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: responsive.sizeVh(15, 30, 30, 30),
                marginBottom: responsive.sizeVh(12, 20, 20, 20),
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <AlbumCoverWithLP
                  coverImageUrl={coverImageUrl}
                  coverColor={coverColor}
                  lpCircleColor={previewLpColor}
                  lpCircleImageUrl={null as any}
                  lpSize={typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.15) : 180}
                  coverSize={typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.18) : 200}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: responsive.sizeVh(8, 15, 15, 15),
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                {[...COLOR_OPTIONS, ...(customColor ? [customColor] : [])].map((color) => {
                  const isCustom = color.label === "사용자 지정";
                  return (
                  <div
                    key={color.value}
                    onClick={() => handleColorClick(color.value, isCustom)}
                    style={{
                      padding: `${responsive.sizeVh(6, 10, 10, 10)} ${responsive.sizeVh(12, 20, 20, 20)}`,
                      border: `3px solid ${color.value === previewLpColor ? COLORS.BLACK : "#ccc"}`,
                      borderRadius: responsive.sizeVh(12, 20, 20, 20),
                      backgroundColor: color.value === previewLpColor ? color.value : COLORS.WHITE,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: responsive.sizeVh(6, 10, 10, 10),
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: responsive.sizeVh(16, 20, 20, 20),
                        height: responsive.sizeVh(16, 20, 20, 20),
                        borderRadius: "50%",
                        backgroundColor: color.value,
                        border: "2px solid #000",
                      }}
                    />
                    <span
                      style={{
                        fontSize: responsive.fontSize(14, 18, 20, 20),
                        color: COLORS.BLACK,
                        fontFamily: FONTS.CAFE24_PROSLIM,
                      }}
                    >
                      {color.label}
                    </span>
    </div>
  );
                })}
                {isAddingColor ? (
                  <div
                    style={{
                      padding: `${responsive.sizeVh(6, 10, 10, 10)} ${responsive.sizeVh(12, 20, 20, 20)}`,
                      border: "3px solid #000",
                      borderRadius: responsive.sizeVh(12, 20, 20, 20),
                      backgroundColor: COLORS.WHITE,
                      display: "flex",
                      alignItems: "center",
                      gap: responsive.sizeVh(6, 10, 10, 10),
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: responsive.sizeVh(40, 60, 60, 60),
                        height: responsive.sizeVh(40, 60, 60, 60),
                        borderRadius: "50%",
                        backgroundColor: customColorInput || previewLpColor,
                        border: "2px solid #000",
                        overflow: "hidden",
                      }}
                    >
                      <input
                        ref={colorInputRef}
                        type="color"
                        value={customColorInput || previewLpColor}
                        onChange={handleCustomColorChange}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          outline: "none",
                          padding: 0,
                          opacity: 0,
                        }}
                      />
                    </div>
                    <button
                      onClick={handleCustomColorConfirm}
                      style={{
                        padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(10, 15, 15, 15)}`,
                        border: "3px solid #000000",
                        borderRadius: responsive.sizeVh(6, 10, 10, 10),
                        backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                        cursor: "pointer",
                        fontFamily: FONTS.CAFE24_PROSLIM,
                        fontSize: responsive.fontSize(14, 18, 20, 20),
                        color: COLORS.BLACK,
                      }}
                    >
                      확인
                    </button>
                    <button
                      onClick={handleCustomColorCancel}
                      style={{
                        padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(10, 15, 15, 15)}`,
                        border: "3px solid #000000",
                        borderRadius: responsive.sizeVh(6, 10, 10, 10),
                        backgroundColor: COLORS.BACKGROUND,
                        cursor: "pointer",
                        fontFamily: FONTS.CAFE24_PROSLIM,
                        fontSize: responsive.fontSize(14, 18, 20, 20),
                        color: COLORS.BLACK,
                      }}
                    >
                      취소
                    </button>
                    </div>
                ) : !customColor ? (
                  <div
                    onClick={handleAddColorClick}
                    style={{
                      padding: `${responsive.sizeVh(6, 10, 10, 10)} ${responsive.sizeVh(12, 20, 20, 20)}`,
                      border: "3px solid #ccc",
                      borderRadius: responsive.sizeVh(12, 20, 20, 20),
                      backgroundColor: COLORS.WHITE,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: responsive.sizeVh(6, 10, 10, 10),
                      transition: "all 0.2s",
                    }}
                  >
                    <span
                      style={{
                        fontSize: responsive.fontSize(14, 18, 20, 20),
                        color: COLORS.BLACK,
                        fontFamily: FONTS.CAFE24_PROSLIM,
                      }}
                    >
                      + 색상 추가
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: responsive.sizeVh(10, 15, 15, 15),
              }}
            >
              <button
                onClick={() => setIsLpColorModalOpen(false)}
                style={{
                  flex: 1,
                  padding: responsive.sizeVh(10, 15, 15, 15),
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(8, 10, 10, 10),
                  backgroundColor: COLORS.BACKGROUND,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(16, 22, 24, 25),
                  color: COLORS.BLACK,
                }}
              >
                닫기
              </button>
              <button
                onClick={() => {
                  if (isSyncEnabled) {
                    onSyncEnabledChange?.(false);
                  }
                  onLpColorChange?.(previewLpColor);
                  onLpCircleImageUrlChange?.(undefined);
                  setIsLpColorModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: responsive.sizeVh(10, 15, 15, 15),
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(8, 10, 10, 10),
                  backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(16, 22, 24, 25),
                  color: COLORS.BLACK,
                }}
              >
                확인
              </button>
            </div>
          </div>
        </>
      )}

      {/* 이미지 선택 모달 */}
      {isLpImageModalOpen && (
        <>
          <div
            onClick={() => setIsLpImageModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: COLORS.WHITE,
              borderTop: "3px solid #000",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              padding: responsive.sizeVh(20, 30, 30, 30),
              zIndex: 1001,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <div style={{ marginBottom: responsive.sizeVh(12, 20, 20, 20) }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: responsive.sizeVh(6, 10, 10, 10),
                  marginBottom: responsive.sizeVh(6, 10, 10, 10),
                }}
              >
                <FaImages size={responsive.sizeVh(20, 25, 25, 25)} />
                <span
                  style={{
                    fontFamily: FONTS.CAFE24_PROSLIM,
                    fontSize: responsive.fontSize(18, 22, 24, 25),
                    color: COLORS.BLACK,
                  }}
                >
                이미지 선택
                </span>
              </div>
              <span
                style={{
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(14, 16, 18, 18),
                  color: COLORS.BLACK,
                }}
              >
                LP 이미지를 선택해주세요
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: responsive.sizeVh(15, 30, 30, 30),
                marginBottom: responsive.sizeVh(12, 20, 20, 20),
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <AlbumCoverWithLP
                  coverImageUrl={coverImageUrl}
                  coverColor={coverColor}
                  lpCircleColor={previewLpColor}
                  lpCircleImageUrl={previewLpImageUrl}
                  lpSize={typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.15) : 180}
                  coverSize={typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.18) : 200}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: responsive.sizeVh(10, 15, 15, 15),
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLpImageChange}
                  style={{ display: "none" }}
                  id="lp-image-input"
                />
                <label
                  htmlFor="lp-image-input"
                  style={{
                    padding: `${responsive.sizeVh(10, 15, 15, 15)} ${responsive.sizeVh(20, 30, 30, 30)}`,
                    border: "3px solid #000000",
                    borderRadius: responsive.sizeVh(8, 10, 10, 10),
                    backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                    cursor: "pointer",
                    fontFamily: FONTS.CAFE24_PROSLIM,
                    fontSize: responsive.fontSize(16, 22, 24, 25),
                    color: COLORS.BLACK,
                    display: "flex",
                    alignItems: "center",
                    gap: responsive.sizeVh(6, 10, 10, 10),
                  }}
                >
                  <FaImages size={responsive.sizeVh(20, 25, 25, 25)} />
                  이미지 업로드
                </label>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: responsive.sizeVh(10, 15, 15, 15),
              }}
            >
              <button
                onClick={() => {
                  setPreviewLpImageUrl(lpCircleImageUrl);
                  setIsLpImageModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: responsive.sizeVh(10, 15, 15, 15),
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(8, 10, 10, 10),
                  backgroundColor: COLORS.BACKGROUND,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(16, 22, 24, 25),
                  color: COLORS.BLACK,
                }}
              >
                닫기
              </button>
              <button
                onClick={() => {
                  if (isSyncEnabled) {
                    onSyncEnabledChange?.(false);
                  }
                  onLpCircleImageUrlChange?.(previewLpImageUrl);
                  onLpColorChange?.(COLORS.WHITE);
                  setIsLpImageModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: responsive.sizeVh(10, 15, 15, 15),
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(8, 10, 10, 10),
                  backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.fontSize(16, 22, 24, 25),
                  color: COLORS.BLACK,
                }}
              >
                확인
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


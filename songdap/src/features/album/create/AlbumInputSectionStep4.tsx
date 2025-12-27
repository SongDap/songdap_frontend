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
} from "./constants";

const COLOR_OPTIONS = [
  { label: "흰색", value: "#ffffff" },
  { label: "검정", value: "#000000" },
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
  coverImageUrl?: string;
  onCoverImageUrlChange?: (url: string | undefined) => void;
  onCoverColorChange?: (color: string) => void;
}

export default function AlbumInputSectionStep4({
  lpColor = "#ffffff",
  onLpColorChange,
  coverImageUrl,
  onCoverImageUrlChange,
  onCoverColorChange,
}: AlbumInputSectionStep4Props) {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewColor, setPreviewColor] = useState(lpColor);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [customColorInput, setCustomColorInput] = useState("");
  const [customColor, setCustomColor] = useState<{ label: string; value: string } | null>(null);
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewColor(lpColor);
  }, [lpColor]);

  const handleColorClick = (color: string, isCustom: boolean = false) => {
    if (isCustom && customColor) {
      // 사용자 지정 색상 클릭 시 수정 모드로 전환
      setIsAddingColor(true);
      setCustomColorInput(customColor.value);
      setPreviewColor(customColor.value);
    } else {
      setPreviewColor(color);
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
    setPreviewColor(color);
  };

  const handleCustomColorConfirm = () => {
    if (customColorInput) {
      // 사용자 지정 색상 태그 추가 (하나만 유지)
      const newColor = {
        label: "사용자 지정",
        value: customColorInput,
      };
      setCustomColor(newColor);
      setPreviewColor(customColorInput);
      setCustomColorInput("");
      setIsAddingColor(false);
    }
  };

  const handleCustomColorCancel = () => {
    setCustomColorInput("");
    setIsAddingColor(false);
  };

  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(coverImageUrl);

  useEffect(() => {
    setPreviewImageUrl(coverImageUrl);
  }, [coverImageUrl]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          ...LABEL_STYLE,
          display: "flex",
          alignItems: "center",
          gap: responsive.vh(10),
        }}
      >
        <span>앨범 커버</span>
        <button
          onClick={() => {
            // 초기화: 하얀색으로 변경, 이미지 제거
            onCoverColorChange?.(COLORS.WHITE);
            onLpColorChange?.(COLORS.WHITE);
            onCoverImageUrlChange?.(undefined);
          }}
          style={{
            padding: `${responsive.vh(5)} ${responsive.vh(10)}`,
            border: "2px solid #000",
            borderRadius: "8px",
            backgroundColor: COLORS.BACKGROUND,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: responsive.vh(5),
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontSize: responsive.vh(18),
            color: COLORS.BLACK,
          }}
        >
          <FaRedo size={responsive.vh(18)} />
          초기화
        </button>
      </div>
      <div
        style={{
          ...CATEGORY_INPUT_BOX_STYLE,
          flex: 1,
          minHeight: 0,
          marginBottom: 0,
          display: "flex",
          gap: responsive.vh(10),
          padding: responsive.vh(10),
        }}
      >
        {/* 왼쪽: 색상 선택 부분 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRight: `1px solid ${COLORS.BLACK}`,
            paddingRight: responsive.vh(10),
            gap: responsive.vh(10),
          }}
        >
          <button
            onClick={() => setIsColorModalOpen(true)}
            style={{
              padding: `${responsive.vh(10)} ${responsive.vh(20)}`,
              border: "none",
              borderRadius: "10px",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontFamily: FONTS.CAFE24_PROSLIM,
              fontSize: responsive.vh(25),
              color: COLORS.BLACK,
              display: "flex",
              alignItems: "center",
              gap: responsive.vh(10),
            }}
          >
            <FaPaintBrush size={responsive.vh(25)} />
            색상 선택
          </button>
          <span
            style={{
              fontFamily: FONTS.CAFE24_PROSLIM,
              fontSize: responsive.vh(18),
              color: COLORS.BLACK,
              textAlign: "center",
            }}
          >
            선택한 색상으로 앨범 커버를 만들어요
          </span>
        </div>
        {/* 오른쪽: 이미지 선택 부분 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: responsive.vh(10),
            gap: responsive.vh(10),
          }}
        >
          <button
            onClick={() => setIsImageModalOpen(true)}
            style={{
              padding: `${responsive.vh(10)} ${responsive.vh(20)}`,
              border: "none",
              borderRadius: "10px",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontFamily: FONTS.CAFE24_PROSLIM,
              fontSize: responsive.vh(25),
              color: COLORS.BLACK,
              display: "flex",
              alignItems: "center",
              gap: responsive.vh(10),
            }}
          >
            <FaImages size={responsive.vh(25)} />
            이미지 선택
          </button>
          <span
            style={{
              fontFamily: FONTS.CAFE24_PROSLIM,
              fontSize: responsive.vh(18),
              color: COLORS.BLACK,
              textAlign: "center",
            }}
          >
            선택한 이미지로 앨범 커버를 만들어요
          </span>
        </div>
      </div>

      {/* 색상 선택 모달 */}
      {isColorModalOpen && (
        <>
          <div
            onClick={() => setIsColorModalOpen(false)}
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
              padding: responsive.vh(30),
              zIndex: 1001,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            {/* 모달 제목 */}
            <div
              style={{
                marginBottom: responsive.vh(20),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: responsive.vh(10),
                }}
              >
                <FaPalette size={25} color={COLORS.BLACK} />
                <span
                  style={{
                    fontFamily: FONTS.CAFE24_PROSLIM,
                    fontSize: responsive.vh(25),
                    color: COLORS.BLACK,
                  }}
                >
                  색상 선택
                </span>
              </div>
            </div>

            {/* 왼쪽: 앨범 컴포넌트 미리보기, 오른쪽: 색상 태그 */}
            <div
              style={{
                display: "flex",
                gap: responsive.vh(30),
                marginBottom: responsive.vh(20),
              }}
            >
              {/* 왼쪽: 앨범 컴포넌트 미리보기 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: responsive.vw(250),
                }}
              >
                <AlbumCoverWithLP
                  coverImageUrl={undefined}
                  coverColor={previewColor}
                  lpCircleColor={previewColor}
                  lpCircleImageUrl={undefined}
                  lpSize={180}
                  coverSize={200}
                />
              </div>

              {/* 오른쪽: 색상 태그 나열 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: responsive.vh(15),
                  alignItems: "flex-start",
                }}
              >
                {[...COLOR_OPTIONS, ...(customColor ? [customColor] : [])].map((color) => {
                  const isCustom = color.label === "사용자 지정";
                  return (
                  <div
                    key={color.value}
                    onClick={() => handleColorClick(color.value, isCustom)}
                    style={{
                      padding: `${responsive.vh(10)} ${responsive.vh(20)}`,
                      border: `3px solid ${color.value === previewColor ? COLORS.BLACK : "#ccc"}`,
                      borderRadius: "20px",
                      backgroundColor: color.value === previewColor ? color.value : COLORS.WHITE,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: responsive.vh(10),
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: responsive.vh(20),
                        height: responsive.vh(20),
                        borderRadius: "50%",
                        backgroundColor: color.value,
                        border: "2px solid #000",
                      }}
                    />
                    <span
                      style={{
                        fontSize: responsive.vh(20),
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
                        backgroundColor: customColorInput || previewColor,
                        border: "2px solid #000",
                        overflow: "hidden",
                      }}
                    >
                      <input
                        ref={colorInputRef}
                        type="color"
                        value={customColorInput || previewColor}
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
                        padding: `${responsive.vh(5)} ${responsive.vh(15)}`,
                        border: "3px solid #000000",
                        borderRadius: "10px",
                        backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                        cursor: "pointer",
                        fontFamily: FONTS.CAFE24_PROSLIM,
                        fontSize: responsive.vh(20),
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
                gap: responsive.vh(15),
              }}
            >
              <button
                onClick={() => setIsColorModalOpen(false)}
                style={{
                  flex: 1,
                  padding: responsive.vh(15),
                  border: "3px solid #000000",
                  borderRadius: "10px",
                  backgroundColor: COLORS.BACKGROUND,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.vh(25),
                  color: COLORS.BLACK,
                }}
              >
                닫기
              </button>
              <button
                onClick={() => {
                  // 색상만 업데이트, 이미지 제거
                  onCoverColorChange?.(previewColor);
                  onLpColorChange?.(previewColor);
                  onCoverImageUrlChange?.(undefined);
                  setIsColorModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: responsive.vh(15),
                  border: "3px solid #000000",
                  borderRadius: "10px",
                  backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.vh(25),
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
      {isImageModalOpen && (
        <>
          <div
            onClick={() => setIsImageModalOpen(false)}
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
              padding: responsive.vh(30),
              zIndex: 1001,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            {/* 모달 제목 */}
            <div
              style={{
                marginBottom: responsive.vh(20),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: responsive.vh(10),
                }}
              >
                <FaImages size={responsive.vh(25)} />
                <span
                  style={{
                    fontFamily: FONTS.CAFE24_PROSLIM,
                    fontSize: responsive.vh(25),
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
                gap: responsive.vh(30),
                marginBottom: responsive.vh(20),
              }}
            >
              {/* 왼쪽: 앨범 컴포넌트 미리보기 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: responsive.vw(250),
                }}
              >
                <AlbumCoverWithLP
                  coverImageUrl={previewImageUrl}
                  coverColor={COLORS.WHITE}
                  lpCircleColor={COLORS.WHITE}
                  lpCircleImageUrl={previewImageUrl}
                  lpSize={180}
                  coverSize={200}
                />
              </div>

              {/* 오른쪽: 이미지 업로드 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: responsive.vh(15),
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
                    padding: `${responsive.vh(15)} ${responsive.vh(30)}`,
                    border: "3px solid #000000",
                    borderRadius: "10px",
                    backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                    cursor: "pointer",
                    fontFamily: FONTS.CAFE24_PROSLIM,
                    fontSize: responsive.vh(25),
                    color: COLORS.BLACK,
                    display: "flex",
                    alignItems: "center",
                    gap: responsive.vh(10),
                  }}
                >
                  <FaImages size={responsive.vh(25)} />
                  이미지 업로드
                </label>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: responsive.vh(15),
              }}
            >
              <button
                onClick={() => {
                  setPreviewImageUrl(coverImageUrl);
                  setIsImageModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: responsive.vh(15),
                  border: "3px solid #000000",
                  borderRadius: "10px",
                  backgroundColor: COLORS.BACKGROUND,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.vh(25),
                  color: COLORS.BLACK,
                }}
              >
                닫기
              </button>
              <button
                onClick={() => {
                  // 이미지만 업데이트 (색상은 그대로 유지)
                  onCoverImageUrlChange?.(previewImageUrl);
                  setIsImageModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: responsive.vh(15),
                  border: "3px solid #000000",
                  borderRadius: "10px",
                  backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.vh(25),
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


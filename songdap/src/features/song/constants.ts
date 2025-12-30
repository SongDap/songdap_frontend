/**
 * 노래 관련 상수 정의
 */

import { COLORS, FONTS, responsive } from "@/features/album/create/constants";

// ==================== 텍스트 길이 제한 ====================
export const TEXT_LIMITS = {
  ALBUM_NAME_MAX: 16,
  ALBUM_DESCRIPTION_MAX: 200,
  SONG_COUNT_MAX: 15,
} as const;

// ==================== 앨범 상세 모달 상수 ====================
export const MODAL_CONFIG = {
  LP_SIZE: 200,
  MAX_WIDTH: 520,
  MAX_HEIGHT: "80vh",
  OVERLAY_BG: "rgba(0, 0, 0, 0.7)",
} as const;

// ==================== 공개 여부 옵션 ====================
export const PUBLIC_STATUS_OPTIONS = [
  { value: "public", label: "공개" },
  { value: "private", label: "비공개" },
] as const;

// ==================== 공통 스타일 ====================
export const TAG_STYLE = {
  padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(8, 10, 10, 10)}`,
  border: "3px solid #000000",
  borderRadius: responsive.sizeVh(12, 20, 20, 20),
  backgroundColor: COLORS.WHITE,
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: responsive.fontSize(14, 18, 20, 22),
  color: COLORS.BLACK,
  boxSizing: "border-box" as const,
} as const;

export const INPUT_LABEL_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontFamily: FONTS.CAFE24_PROSLIM,
  color: COLORS.BLACK,
  fontSize: 16,
};

export const INPUT_BASE_STYLE: React.CSSProperties = {
  border: "2px solid #000",
  borderRadius: 10,
  fontFamily: FONTS.CAFE24_PROSLIM,
  fontSize: 16,
  lineHeight: "24px",
  height: 48,
  boxSizing: "border-box",
  width: "100%",
};

export const INPUT_PADDING: React.CSSProperties = {
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 14,
  paddingRight: 14,
};

// ==================== 유틸리티 함수 ====================
/**
 * 텍스트 길이 제한 적용
 */
export const limitText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) : text;
};

/**
 * 숫자만 추출
 */
export const extractNumeric = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};


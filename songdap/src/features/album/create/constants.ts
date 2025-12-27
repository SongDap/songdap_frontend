// 공통 스타일 상수
export const COLORS = {
  BLACK: '#000000',
  WHITE: '#ffffff',
  BACKGROUND: '#fefaf0',
  BUTTON_DISABLED_OUTER: '#D1d1d1',
  BUTTON_DISABLED_INNER: '#c4c4c4',
  BUTTON_ENABLED_OUTER: '#98d9d4',
  BUTTON_ENABLED_INNER: '#8BC9C4',
} as const;

export const FONTS = {
  DUNG_GEUN_MO: 'var(--font-dung-geun-mo)',
  GALMURI9: 'var(--font-galmuri9)',
  CAFE24_PROSLIM: 'var(--font-cafe24-proslim)',
  KYOBO_HANDWRITING: 'var(--font-kyobo-handwriting)',
} as const;

// 반응형 계산 유틸리티
export const responsive = {
  vh: (value: number) => `calc(${value} * 100vh / 1024)`,
  vw: (value: number) => `calc(${value} * 100vw / 768)`,
  min: (value: number, base: number = 768) => `min(calc(${value} * 100% / ${base}), ${value}px)`,
} as const;

// 공통 패딩/마진
export const SPACING = {
  SIDE_PADDING: responsive.min(32),
  LP_PADDING: '10px',
  LP_SPACING: 'calc(20 * min(100vw, 768px) / 768)',
} as const;

// 텍스트 크기
export const TEXT_SIZES = {
  LABEL: responsive.vh(30),
  INPUT: responsive.vh(30),
  ALBUM_TEXT: 'calc(35 * min(100vw, 768px) / 768)',
  MESSAGE_TEXT: 'calc(30 * min(100vw, 768px) / 768)',
} as const;

// 앨범 영역 상수
export const ALBUM_AREA = {
  HEIGHT: responsive.vh(270),
  LP_SIZE: `calc(${responsive.vh(270)} - ${SPACING.LP_PADDING} * 2)`,
} as const;

// 공통 텍스트 스타일
export const TEXT_STYLES = {
  WORD_BREAK: {
    wordBreak: 'break-word' as const,
    overflowWrap: 'break-word' as const,
    whiteSpace: 'normal' as const,
  },
} as const;

// 메시지 스타일
export const MESSAGE_STYLE = {
  position: 'absolute' as const,
  top: '50%',
  left: '0',
  right: '0',
  transform: 'translateY(-50%)',
  padding: '10px',
  border: `1px solid ${COLORS.BLACK}`,
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  fontFamily: FONTS.CAFE24_PROSLIM,
  fontSize: TEXT_SIZES.MESSAGE_TEXT,
  maxWidth: '100%',
  maxHeight: '100%',
  textAlign: 'center' as const,
  overflow: 'hidden' as const,
  lineHeight: '1.4',
  boxSizing: 'border-box' as const,
  color: COLORS.BLACK,
  whiteSpace: 'normal' as const,
} as const;

// 입력창 공통 스타일
export const INPUT_BOX_STYLE = {
  width: '100%',
  border: '3px solid #000000',
  borderRadius: '10px',
  backgroundColor: COLORS.WHITE,
  paddingLeft: responsive.vh(30),
  paddingRight: responsive.vw(16),
  paddingTop: responsive.vh(16),
  paddingBottom: responsive.vh(16),
  boxSizing: 'border-box' as const,
} as const;

// 카테고리 입력 박스 스타일
export const CATEGORY_INPUT_BOX_STYLE = {
  ...INPUT_BOX_STYLE,
  display: 'flex',
  alignItems: 'center',
} as const;

// 기분 태그 컨테이너 스타일
export const MOOD_TAG_CONTAINER_STYLE = {
  ...INPUT_BOX_STYLE,
  minHeight: responsive.vh(140),
  overflowY: 'auto' as const,
} as const;

// 상황 입력창 스타일
export const SITUATION_INPUT_STYLE = {
  ...INPUT_BOX_STYLE,
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  outline: 'none',
  resize: 'none' as const,
  overflowY: 'auto' as const,
  color: COLORS.BLACK,
  height: responsive.vh(80),
} as const;

// 라벨 스타일
export const LABEL_STYLE = {
  fontFamily: FONTS.CAFE24_PROSLIM,
  fontSize: TEXT_SIZES.LABEL,
  marginBottom: responsive.vh(6),
  color: COLORS.BLACK,
  fontWeight: 'bold' as const,
} as const;


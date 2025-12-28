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
  // vh 기반 계산 (1024px 기준)
  vh: (value: number) => `calc(${value} * 100vh / 1024)`,
  // vw 기반 계산 (768px 기준)
  vw: (value: number) => `calc(${value} * 100vw / 768)`,
  // 최소값 제한 (기본 768px 기준)
  min: (value: number, base: number = 768) => `min(calc(${value} * 100% / ${base}), ${value}px)`,
  // 반응형 폰트 크기 (모바일 ~ 데스크탑)
  fontSize: (mobile: number, tablet: number, laptop: number, desktop: number) => 
    `clamp(${mobile}px, calc(${tablet} * 100vw / 768), ${desktop}px)`,
  // 반응형 크기 (vh 기반, 모바일 ~ 데스크탑)
  sizeVh: (mobile: number, tablet: number, laptop: number, desktop: number) =>
    `clamp(${mobile}px, calc(${tablet} * 100vh / 1024), ${desktop}px)`,
  // 반응형 크기 (vw 기반, 모바일 ~ 데스크탑)
  sizeVw: (mobile: number, tablet: number, laptop: number, desktop: number) =>
    `clamp(${mobile}px, calc(${tablet} * 100vw / 768), ${desktop}px)`,
  // 반응형 높이 (vh 기반)
  height: (mobile: number, tablet: number, laptop: number, desktop: number) =>
    `clamp(${mobile}px, calc(${tablet} * 100vh / 1024), ${desktop}px)`,
} as const;

// 공통 패딩/마진 (반응형)
export const SPACING = {
  SIDE_PADDING: responsive.min(32),
  LP_PADDING: responsive.sizeVh(8, 10, 10, 10),
  LP_SPACING: responsive.sizeVw(12, 20, 20, 20),
} as const;

// 텍스트 크기 (반응형)
export const TEXT_SIZES = {
  LABEL: responsive.fontSize(16, 24, 28, 30),
  INPUT: responsive.fontSize(16, 24, 28, 30),
  ALBUM_TEXT: responsive.fontSize(20, 28, 32, 35),
  MESSAGE_TEXT: responsive.fontSize(18, 24, 28, 30),
  TITLE: responsive.fontSize(32, 48, 64, 80),
  BUTTON: responsive.fontSize(20, 28, 32, 35),
} as const;

// 앨범 영역 상수 (반응형)
export const ALBUM_AREA = {
  HEIGHT: responsive.height(180, 220, 250, 270),
  // LP 크기는 동적으로 계산되므로 여기서는 최소/최대만 정의
  LP_SIZE_MIN: 150,
  LP_SIZE_MAX: 250,
  LP_SIZE_RATIO: 0.9, // 앨범 영역 높이의 90%
  COVER_SIZE_RATIO: 1.0, // LP와 동일한 크기
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

// 입력창 공통 스타일 (반응형)
export const INPUT_BOX_STYLE = {
  width: '100%',
  border: '3px solid #000000',
  borderRadius: '10px',
  backgroundColor: COLORS.WHITE,
  paddingLeft: responsive.sizeVh(16, 30, 30, 30),
  paddingRight: responsive.sizeVw(12, 16, 16, 16),
  paddingTop: responsive.sizeVh(12, 16, 16, 16),
  paddingBottom: responsive.sizeVh(12, 16, 16, 16),
  boxSizing: 'border-box' as const,
} as const;

// 카테고리 입력 박스 스타일
export const CATEGORY_INPUT_BOX_STYLE = {
  ...INPUT_BOX_STYLE,
  display: 'flex',
  alignItems: 'center',
} as const;

// 기분 태그 컨테이너 스타일 (반응형)
export const MOOD_TAG_CONTAINER_STYLE = {
  ...INPUT_BOX_STYLE,
  minHeight: responsive.sizeVh(100, 140, 140, 140),
  overflowY: 'auto' as const,
} as const;

// 상황 입력창 스타일 (반응형)
export const SITUATION_INPUT_STYLE = {
  ...INPUT_BOX_STYLE,
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  outline: 'none',
  resize: 'none' as const,
  overflowY: 'auto' as const,
  color: COLORS.BLACK,
  height: responsive.sizeVh(60, 80, 80, 80),
} as const;

// 라벨 스타일 (반응형)
export const LABEL_STYLE = {
  fontFamily: FONTS.CAFE24_PROSLIM,
  fontSize: TEXT_SIZES.LABEL,
  marginBottom: responsive.sizeVh(4, 6, 6, 6),
  color: COLORS.BLACK,
  fontWeight: 'bold' as const,
} as const;

// 체크박스 라벨 스타일
export const CHECKBOX_LABEL_STYLE = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  color: COLORS.BLACK,
} as const;

// 체크박스 입력 스타일
export const CHECKBOX_INPUT_STYLE = {
  marginRight: '10px',
  width: '20px',
  height: '20px',
  cursor: 'pointer',
} as const;

// 곡 개수 설정 컨테이너 스타일 (반응형)
export const SONG_COUNT_CONTAINER_STYLE = {
  ...CATEGORY_INPUT_BOX_STYLE,
  paddingTop: responsive.sizeVh(12, 16, 16, 16),
  paddingBottom: responsive.sizeVh(12, 16, 16, 16),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: responsive.sizeVh(8, 10, 10, 10),
} as const;

// 곡 개수 버튼 스타일 (+/-) (반응형)
export const SONG_COUNT_BUTTON_STYLE = {
  width: responsive.sizeVh(32, 40, 40, 40),
  height: responsive.sizeVh(32, 40, 40, 40),
  border: '3px solid #000000',
  borderRadius: '10px',
  backgroundColor: COLORS.WHITE,
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  color: COLORS.BLACK,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box' as const,
} as const;

// 곡 개수 입력 필드 스타일 (반응형)
export const SONG_COUNT_INPUT_STYLE = {
  width: responsive.sizeVw(80, 100, 100, 100),
  height: responsive.sizeVh(32, 40, 40, 40),
  border: '3px solid #000000',
  borderRadius: '10px',
  backgroundColor: COLORS.WHITE,
  paddingLeft: responsive.sizeVw(8, 10, 10, 10),
  paddingRight: responsive.sizeVw(8, 10, 10, 10),
  boxSizing: 'border-box' as const,
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  outline: 'none',
  color: COLORS.BLACK,
  textAlign: 'center' as const,
  MozAppearance: 'textfield' as const,
} as const;

// 곡 개수 텍스트 스타일
export const SONG_COUNT_TEXT_STYLE = {
  fontFamily: FONTS.KYOBO_HANDWRITING,
  fontSize: TEXT_SIZES.INPUT,
  color: COLORS.BLACK,
} as const;


/**
 * 반응형 크기 계산 유틸리티 함수
 */

/**
 * 앨범 커버/LP 크기 계산
 * @param frameWidth 서비스 프레임의 너비
 * @param baseSize 기준 크기 (768px 기준)
 * @param min 최소 크기
 * @param max 최대 크기
 */
export const calculateCoverSize = (
  frameWidth: number,
  baseSize: number = 160,
  min: number = 120,
  max: number = 180
): number => {
  const base = (baseSize * frameWidth) / 768;
  return Math.min(max, Math.max(min, base));
};

/**
 * LP 크기 계산 (커버 크기의 90%)
 */
export const calculateLpSize = (coverSize: number): number => {
  return Math.round(coverSize * 0.9);
};

/**
 * 가로모드 감지
 */
export const isLandscapeMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth > window.innerHeight;
};





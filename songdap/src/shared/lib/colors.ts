/**
 * UI에서 사용하는 색상 팔레트/유틸
 * (목데이터와 분리)
 */

export const PRESET_COLORS = [
  "#00c7fc",
  "#3a88fe",
  "#5e30eb",
  "#d357fe",
  "#ed719e",
  "#ff6251",
  "#ff8647",
  "#ffb43f",
  "#fecb3e",
  "#FFD93D",
  "#e4ef65",
  "#96d35f",
  "#929292",
] as const;

export function getRandomColorFromPalette(): string {
  const randomIndex = Math.floor(Math.random() * PRESET_COLORS.length);
  return PRESET_COLORS[randomIndex];
}


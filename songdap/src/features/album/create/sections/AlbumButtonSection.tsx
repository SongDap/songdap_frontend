"use client";

import { Button } from "@/shared/ui";
import { SPACING, responsive, COLORS } from "../constants";

interface AlbumButtonSectionProps {
  onNextClick?: () => void;
  onPrevClick?: () => void;
  nextDisabled?: boolean;
  nextText?: string;
  prevText?: string;
}

export default function AlbumButtonSection({
  onNextClick,
  onPrevClick,
  nextDisabled = false,
  nextText = "다음",
  prevText = "이전",
}: AlbumButtonSectionProps) {
  return (
    <div
      style={{
        width: '100%',
        height: 'clamp(72px, calc(144 * 100vh / 1024), 144px)',
        paddingTop: 'clamp(12px, calc(24 * 100vh / 1024), 24px)',
        paddingBottom: 'clamp(12px, calc(24 * 100vh / 1024), 24px)',
        paddingLeft: SPACING.SIDE_PADDING,
        paddingRight: SPACING.SIDE_PADDING,
        boxSizing: 'border-box',
        display: 'flex',
        gap: 'clamp(8px, calc(16 * 100vh / 1024), 16px)',
      }}
    >
      <Button
        onClick={onPrevClick}
        outerColor={COLORS.BUTTON_DISABLED_OUTER}
        style={{ flex: 1 }}
      >
        {prevText}
      </Button>
      <Button
        onClick={onNextClick}
        disabled={nextDisabled}
        outerColor={nextDisabled ? COLORS.BUTTON_DISABLED_OUTER : COLORS.BUTTON_ENABLED_OUTER}
        style={{ flex: 2 }}
      >
        {nextText}
      </Button>
    </div>
  );
}


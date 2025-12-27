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
        height: responsive.vh(144),
        paddingTop: responsive.vh(24),
        paddingBottom: responsive.vh(24),
        paddingLeft: SPACING.SIDE_PADDING,
        paddingRight: SPACING.SIDE_PADDING,
        boxSizing: 'border-box',
        display: 'flex',
        gap: responsive.vh(16),
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


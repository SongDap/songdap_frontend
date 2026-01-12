"use client";

import { Button } from "@/shared/ui";
import { SPACING, responsive, COLORS } from "@/features/album/create/constants";

interface SongAddButtonProps {
  isSubmitted?: boolean;
  isCompleteDisabled?: boolean;
  onAddClick?: () => void;
  onPrevClick?: () => void;
  onCompleteClick?: () => void;
}

export default function SongAddButton({ 
  isSubmitted = false,
  isCompleteDisabled = false,
  onAddClick,
  onPrevClick,
  onCompleteClick,
}: SongAddButtonProps) {
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
      {isSubmitted ? (
        <>
          <Button
            onClick={onPrevClick}
            outerColor={COLORS.BUTTON_DISABLED_OUTER}
            style={{ flex: 1, transition: 'none' }}
          >
            이전
          </Button>
          <Button
            onClick={onCompleteClick}
            disabled={isCompleteDisabled}
            outerColor={isCompleteDisabled ? COLORS.BUTTON_DISABLED_OUTER : COLORS.BUTTON_ENABLED_OUTER}
            style={{ flex: 2, transition: 'none' }}
          >
            완료
          </Button>
        </>
      ) : (
        <Button
          outerColor="#98d9d4"
          onClick={onAddClick}
          style={{ width: "100%" }}
        >
          추가하기
        </Button>
      )}
    </div>
  );
}


"use client";

import { Button } from "@/shared/ui";
import { SPACING, responsive } from "@/features/album/create/constants";

export default function SongAddButton() {
  return (
    <div
      style={{
        flexShrink: 0,
        height: responsive.sizeVh(72, 120, 144, 144),
        paddingTop: responsive.sizeVh(12, 20, 24, 24),
        paddingBottom: responsive.sizeVh(12, 20, 24, 24),
        paddingLeft: SPACING.SIDE_PADDING,
        paddingRight: SPACING.SIDE_PADDING,
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <Button
        outerColor="#98d9d4"
        style={{
          width: "100%",
          height: responsive.sizeVh(48, 80, 96, 96),
          fontWeight: 700,
          fontSize: responsive.fontSize(18, 22, 24, 24),
        }}
      >
        추가하기
      </Button>
    </div>
  );
}


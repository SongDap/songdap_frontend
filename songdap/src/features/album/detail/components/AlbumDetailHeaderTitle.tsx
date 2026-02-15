"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** 앨범 상세 헤더용: (노래개수/허용개수) + 앨범명, 2줄일 때 앨범명 글자 크기 축소 */
export default function AlbumDetailHeaderTitle({
  musicCount,
  musicCountLimit,
  title,
}: {
  musicCount: number;
  musicCountLimit: number;
  title: string;
}) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [isTwoLines, setIsTwoLines] = useState(false);

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const height = el.getBoundingClientRect().height;
    setIsTwoLines(height > lineHeight * 1.3);
  }, [title]);

  return (
    <div className="flex flex-col items-center justify-center gap-0.5">
      <span className="text-xs text-gray-600">
        ({musicCount}/{musicCountLimit})
      </span>
      <span
        ref={titleRef}
        className={`line-clamp-2 text-center ${isTwoLines ? "text-base md:text-xl" : ""}`}
      >
        {title}
      </span>
    </div>
  );
}

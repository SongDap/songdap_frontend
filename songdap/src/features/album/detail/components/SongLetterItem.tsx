"use client";

import { SongLetter } from "@/features/song/components";
import type { MusicInfo } from "@/features/song/api";

export default function SongLetterItem({
  music,
  todayLabel,
  tapeColor,
  isOwner,
}: {
  music: MusicInfo;
  todayLabel: string;
  tapeColor: string;
  isOwner: boolean | null;
}) {
  return (
    <div className="w-full">
      <SongLetter
        title={music.title}
        artist={music.artist ?? ""}
        imageUrl={music.image ?? null}
        message={music.message ?? undefined}
        nickname={music.writer}
        date={todayLabel}
        tapeColor={tapeColor}
        isOwner={isOwner}
      />
    </div>
  );
}

import type { MusicSortOption } from "@/features/song/api";

export type ViewMode = "player" | "letter";

export type CurrentSong = {
  uuid: string;
  title: string;
  artist: string;
  imageUrl?: string | null;
  url?: string;
  videoId?: string;
  message?: string;
  nickname?: string;
};

export type MusicSortOptionType = MusicSortOption;

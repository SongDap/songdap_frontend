import type { MusicSortOption } from "@/features/song/api";

export const DESKTOP_FIXED_WIDTH_CLASS = "md:w-[672px] md:mx-auto";
export const DEFAULT_PAGE_SIZE = 10;

export const MUSIC_SORT_OPTIONS: { label: string; value: MusicSortOption }[] = [
  { label: "최신순", value: "LATEST" },
  { label: "오래된순", value: "OLDEST" },
  { label: "제목순", value: "TITLE" },
  { label: "아티스트순", value: "ARTIST" },
];

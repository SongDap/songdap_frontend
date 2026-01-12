// utils/albumListUtils.ts
import type { AlbumData } from "@/features/song/components/types";

// 공개여부체크
export function PrivacyText(isPublic: AlbumData["isPublic"]) {
  return isPublic === "public" ? "공개" : "비공개";
}
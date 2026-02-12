/**
 * "앨범 공유 링크" 생성 유틸
 * - 간단한 형식: /album?id={albumUuid}
 */

export type AlbumInfoForSongAddLink = {
  id: string;
  title: string;
  color: string;
  description?: string;
  musicCount?: number;
  musicCountLimit?: number;
  createdAt?: string;
  isPublic?: boolean;
};

export function buildAlbumShareUrl(albumId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/album?id=${albumId}`;
}

export function buildAlbumShareUrlFromAlbumInfo(info: AlbumInfoForSongAddLink): string {
  return buildAlbumShareUrl(info.id);
}


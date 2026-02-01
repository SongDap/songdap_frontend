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

/**
 * @deprecated buildSongAddUrlFromAlbumInfo 대신 buildAlbumShareUrlFromAlbumInfo 사용
 */
export function encodeAlbumInfoToAlbumDataParam(info: AlbumInfoForSongAddLink): string {
  // UTF-8 문자열을 Base64로 인코딩 (한글 지원)
  const jsonString = JSON.stringify(info);
  return btoa(unescape(encodeURIComponent(jsonString)));
}

/**
 * @deprecated buildAlbumShareUrl 사용
 */
export function buildSongAddUrl(params: {
  origin: string;
  albumId: string;
  albumDataParam: string;
}): string {
  return `${params.origin}/song/add?albumId=${params.albumId}&albumData=${encodeURIComponent(
    params.albumDataParam
  )}`;
}

/**
 * @deprecated buildAlbumShareUrlFromAlbumInfo 사용
 */
export function buildSongAddUrlFromAlbumInfo(info: AlbumInfoForSongAddLink): string {
  return buildAlbumShareUrl(info.id);
}

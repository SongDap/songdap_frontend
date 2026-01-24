/**
 * "노래 추가 링크" 생성 유틸
 * - AlbumCard / AlbumShare / AlbumInfo 등에서 동일한 방식으로 링크를 만들기 위해 공통화
 *
 * 링크 형태:
 *   /song/add?albumId={albumUuid}&albumData={base64(json)}
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

export function encodeAlbumInfoToAlbumDataParam(info: AlbumInfoForSongAddLink): string {
  // UTF-8 문자열을 Base64로 인코딩 (한글 지원)
  const jsonString = JSON.stringify(info);
  return btoa(unescape(encodeURIComponent(jsonString)));
}

export function buildSongAddUrl(params: {
  origin: string;
  albumId: string;
  albumDataParam: string;
}): string {
  return `${params.origin}/song/add?albumId=${params.albumId}&albumData=${encodeURIComponent(
    params.albumDataParam
  )}`;
}

export function buildSongAddUrlFromAlbumInfo(info: AlbumInfoForSongAddLink): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const albumDataParam = encodeAlbumInfoToAlbumDataParam(info);
  return buildSongAddUrl({ origin, albumId: info.id, albumDataParam });
}


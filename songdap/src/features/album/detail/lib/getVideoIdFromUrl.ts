/**
 * 백엔드에서 주는 유튜브 URL에서 video ID만 추출 (재생은 이 ID로 함)
 */
export function getVideoIdFromUrl(url: string): string | undefined {
  if (!url?.trim()) return undefined;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || undefined;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" && parts[1]) return parts[1];
      if (parts[0] === "embed" && parts[1]) return parts[1];
    }
  } catch {
    // ignore
  }
  return undefined;
}

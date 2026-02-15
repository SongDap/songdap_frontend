/**
 * 카카오 로그인 URL 생성 (헤더, 랜딩, 세션만료 모달 등 공통)
 * @param returnPath - 로그인 후 돌아올 경로 (예: /album?id=xxx). 없으면 쿼리 없이 생성
 */
export function getKakaoLoginUrl(returnPath?: string): string | null {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  if (!clientId || !redirectUri) return null;

  const url = new URL("https://kauth.kakao.com/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  if (returnPath?.trim()) {
    url.searchParams.set("state", encodeURIComponent(returnPath.trim()));
  }
  return url.toString();
}

/** 헤더/페이지헤더 프로필 메뉴 항목 (한 곳에서만 정의) */
export const PROFILE_MENU_ITEMS = [
  { label: "내 앨범", href: "/album/list" },
  { label: "서비스 소개", href: "/introduceService" },
  { label: "프로필 편집", href: "/profile/edit" },
] as const;

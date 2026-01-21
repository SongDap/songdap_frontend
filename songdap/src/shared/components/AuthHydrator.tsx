"use client";

import { useEffect } from "react";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";

/**
 * 앱 최초 진입 시 localStorage 기반 로그인 상태를 복구합니다.
 * (Next.js App Router에서 RootLayout은 서버 컴포넌트이므로, 클라이언트 컴포넌트로 분리)
 */
export default function AuthHydrator() {
  useEffect(() => {
    useOauthStore.getState().hydrate();
  }, []);

  return null;
}



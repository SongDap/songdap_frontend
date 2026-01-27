import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // output: 'export' 제거 - 동적 라우트(앨범 상세) 지원을 위해
  // 배포 환경에서는 서버사이드 렌더링(SSR) 사용

  /* 이미지 최적화 */
  images: {
    unoptimized: true,
  },

  /* 기존 설정 유지 */
  reactCompiler: true,

  /* Turbopack 루트 디렉토리 명시 (다중 lockfile 경고 해결) */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
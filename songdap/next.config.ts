import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* 정적 배포를 위한 설정 (빌드 시에만 적용) */
  // 개발 환경에서는 동적 라우트를 위해 비활성화
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),

  /* 정적 배포 시 이미지 최적화 오류 방지 */
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
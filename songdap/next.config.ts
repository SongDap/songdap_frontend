import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 정적 배포를 위한 설정 */
  output: 'export',

  /* 정적 배포 시 이미지 최적화 오류 방지 */
  images: {
    unoptimized: true,
  },

  /* 기존 설정 유지 */
  reactCompiler: true,
};

export default nextConfig;
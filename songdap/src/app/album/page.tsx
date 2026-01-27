"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const AlbumDetailContent = dynamic(
  () => import("@/features/album/detail/components/AlbumDetailContent"),
  { ssr: false }
);

function AlbumPageContent() {
  const searchParams = useSearchParams();
  let albumId = searchParams.get("id") ?? "";

  // UUID 형식만 추출 (다른 쿼리 파라미터가 붙어있을 경우 정리)
  // UUID 패턴: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const uuidMatch = albumId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (uuidMatch) {
    albumId = uuidMatch[0];
  }

  if (!albumId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">앨범을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return <AlbumDetailContent id={albumId} />;
}

export default function AlbumPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">로딩 중...</p>
      </div>
    }>
      <AlbumPageContent />
    </Suspense>
  );
}

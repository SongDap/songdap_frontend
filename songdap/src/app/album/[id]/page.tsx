// 동적 라우트 - 서버사이드 렌더링 사용
import { Suspense } from "react";

export default async function AlbumDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  // 실제 상세 UI 로드
  const AlbumDetailContent = (await import("@/features/album/detail/components/AlbumDetailContent"))
    .default;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">로딩 중...</p>
        </div>
      }
    >
      <AlbumDetailContent />
    </Suspense>
  );
}

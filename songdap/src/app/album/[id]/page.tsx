// 정적 생성을 위한 파라미터 생성
// output: 'export' 설정에서는 빌드 시점에 모든 경로를 생성해야 합니다.
// 실제 앨범 UUID는 런타임에만 알 수 있으므로, 샘플 데이터를 사용하여 최소한의 경로를 생성합니다.
// 실제 앨범은 클라이언트 사이드에서 동적으로 처리됩니다.
import { Suspense } from "react";

export async function generateStaticParams() {
  // 빌드 시점에 최소 1개 경로는 필요 (export 모드)
  // 실제 앨범은 런타임에 클라이언트에서 처리됨
  return [{ id: "placeholder" }];
}

// output: 'export'에서는 동적 라우트가 제한적이므로,
// generateStaticParams에 없는 경로는 클라이언트에서 처리하기 위해
// 페이지를 클라이언트 컴포넌트로 래핑
export default async function AlbumDetailPage({
  params,
}: {
  // Next.js 버전에 따라 params가 Promise로 전달될 수 있음 (sync dynamic APIs)
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  // export 빌드 시 생성되는 placeholder 경로는 "빌드 타임 프리렌더"가 수행됨.
  // 이때 클라이언트 전용 로직(React Query/axios 등)이 실행되면 빌드가 실패할 수 있으므로,
  // placeholder는 안전한 정적 마크업만 반환.
  if (resolvedParams?.id === "placeholder") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">로딩 중...잘못된 페이지입니다.</p>
      </div>
    );
  }

  // placeholder가 아닌 경우에만 실제 상세 UI를 로드/렌더
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

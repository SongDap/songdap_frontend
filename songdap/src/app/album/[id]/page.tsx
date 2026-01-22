import AlbumDetailContent from "@/features/album/detail/components/AlbumDetailContent";
import { SAMPLE_ALBUMS } from "@/shared/lib/mockData";

// 정적 생성을 위한 파라미터 생성
// output: 'export' 설정에서는 빌드 시점에 모든 경로를 생성해야 합니다.
// 실제 앨범 UUID는 런타임에만 알 수 있으므로, 샘플 데이터를 사용하여 최소한의 경로를 생성합니다.
// 실제 앨범은 클라이언트 사이드에서 동적으로 처리됩니다.
export async function generateStaticParams() {
  // 빌드 시점에 샘플 앨범 경로를 생성 (최소한 하나는 필요)
  // 실제 앨범은 런타임에 클라이언트 사이드 라우팅으로 처리됨
  return SAMPLE_ALBUMS.map((album) => ({
    id: album.uuid,
  }));
}

// output: 'export'에서는 동적 라우트가 제한적이므로,
// generateStaticParams에 없는 경로는 클라이언트에서 처리하기 위해
// 페이지를 클라이언트 컴포넌트로 래핑
export default function AlbumDetailPage() {
  return <AlbumDetailContent />;
}

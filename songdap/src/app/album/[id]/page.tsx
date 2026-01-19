import { SAMPLE_ALBUMS } from "@/shared/lib/mockData";
import AlbumDetailContent from "@/features/album/detail/components/AlbumDetailContent";

// 정적 생성을 위한 파라미터 생성
export function generateStaticParams() {
  return SAMPLE_ALBUMS.map((album) => ({
    id: album.uuid,
  }));
}

export default function AlbumDetailPage() {
  return <AlbumDetailContent />;
}

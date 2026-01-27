"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const AlbumDetailContent = dynamic(
  () => import("@/features/album/detail/components/AlbumDetailContent"),
  { ssr: false }
);

export default function AlbumDetailPageClient() {
  const params = useParams();
  const albumId = (params?.id as string | undefined) ?? "";

  if (!albumId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">로딩 중...</p>
      </div>
    );
  }

  return <AlbumDetailContent id={albumId} />;
}

"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const AlbumDetailContent = dynamic(
  () => import("@/features/album/detail/components/AlbumDetailContent"),
  { ssr: false }
);

export default function AlbumPage() {
  const searchParams = useSearchParams();
  const albumId = searchParams.get("id") ?? "";

  if (!albumId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">앨범을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return <AlbumDetailContent id={albumId} />;
}

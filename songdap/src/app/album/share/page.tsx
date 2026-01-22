"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/shared";
import { Footer } from "@/shared";
import { AlbumShareContent, AlbumInfoContent } from "@/features/album/share/components";
import { ROUTES } from "@/shared/lib/routes";

function AlbumShareContentWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  // mode가 "info"이면 "앨범 정보", 아니면 "앨범 공유"
  const headerTitle = mode === "info" ? "앨범 정보" : "앨범 공유";
  const isInfoMode = mode === "info";

  return (
    <>
      <PageHeader title={headerTitle} />
      <div className="min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 pt-8">
          {isInfoMode ? (
            <AlbumInfoContent onComplete={() => router.push(ROUTES.ALBUM.LIST)} />
          ) : (
            <AlbumShareContent onComplete={() => router.push(ROUTES.ALBUM.LIST)} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function AlbumSharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          <p className="text-sm text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <AlbumShareContentWrapper />
    </Suspense>
  );
}

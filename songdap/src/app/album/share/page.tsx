"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/shared";
import { Footer } from "@/shared";
import { AlbumShareContent, AlbumInfoContent } from "@/features/album/share/components";
import { ROUTES } from "@/shared/lib/routes";

export default function AlbumSharePage() {
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

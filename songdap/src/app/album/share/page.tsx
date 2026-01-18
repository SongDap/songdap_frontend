"use client";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared";
import { Footer } from "@/shared";
import { AlbumShareContent } from "@/features/album/share/components";
import { ROUTES } from "@/shared/lib/routes";

export default function AlbumSharePage() {
  const router = useRouter();

  return (
    <>
      <PageHeader title="앨범 공유" />
      <div className="min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 pt-8">
          <AlbumShareContent onComplete={() => router.push(ROUTES.ALBUM.LIST)} />
        </div>
      </div>
      <Footer />
    </>
  );
}

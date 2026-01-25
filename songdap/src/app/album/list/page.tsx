import { Suspense } from "react";
import AlbumListPageClient from "./AlbumListPageClient";

export default function AlbumListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="text-sm text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <AlbumListPageClient />
    </Suspense>
  );
}

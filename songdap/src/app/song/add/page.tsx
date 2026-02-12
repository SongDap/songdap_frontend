"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/shared";
import { getAlbum } from "@/features/album/api";
import { getAlbumMusics } from "@/features/song/api";
import AddSongModal from "@/features/song/add/components/AddSongModal";
import type { AlbumResponse } from "@/features/album/api";

type AlbumInfoFromUrl = {
  id: string;
  title: string;
  color: string;
  description?: string;
  musicCount?: number;
  musicCountLimit?: number;
  createdAt?: string;
  isPublic?: boolean;
};

function AddSongContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");
  const albumDataParam = searchParams.get("albumData");
  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // URL에서 앨범 정보 가져오기
  useEffect(() => {
    if (albumId) {
      setIsLoading(true);

      // URL에 albumData가 있으면 먼저 표시 (빠른 로딩)
      if (albumDataParam) {
        try {
          const decodedData = decodeURIComponent(escape(atob(decodeURIComponent(albumDataParam))));
          const albumInfo: AlbumInfoFromUrl = JSON.parse(decodedData);

          setAlbum({
            uuid: albumInfo.id,
            title: albumInfo.title,
            description: albumInfo.description || "",
            isPublic: albumInfo.isPublic !== undefined ? albumInfo.isPublic : true,
            musicCount: albumInfo.musicCount !== undefined ? albumInfo.musicCount : 0,
            musicCountLimit: albumInfo.musicCountLimit !== undefined ? albumInfo.musicCountLimit : 10,
            color: albumInfo.color,
            createdAt: albumInfo.createdAt,
          });
        } catch (error) {
          // URL에서 앨범 정보 디코딩 실패
        }
      }

      // albumData가 있으면 빠른 로드 완료, 없으면 API 호출
      if (albumDataParam) {
        setIsLoading(false);
        setIsOwner(false);
        return;
      }

      Promise.all([
        getAlbum(albumId),
        getAlbumMusics(albumId, { page: 0, size: 1 }),
      ])
        .then(([albumData, musicsData]) => {
          setAlbum(albumData);
          setIsOwner(musicsData.flag.owner);
        })
        .catch((error) => {
          setAlbum({
            uuid: albumId,
            title: "앨범",
            description: "",
            isPublic: true,
            musicCount: 0,
            musicCountLimit: 10,
            color: "#929292",
          });
          setIsOwner(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setAlbum(null);
      setIsLoading(false);
    }
  }, [albumId, albumDataParam]);

  if (!albumId) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-gray-600">앨범 정보가 없는 링크예요.</p>
        </div>
      </>
    );
  }

  if (isLoading || !album) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="text-sm text-gray-600">앨범 정보를 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (isOwner === true) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-base text-gray-600">앨범 소유자는 노래를 추가할 수 없습니다.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AddSongModal
            album={album}
            isOpen={true}
            onClose={() => {
              router.back();
            }}
            onSuccess={async () => {
              // 앨범 정보 다시 조회해서 최신 상태 반영
              if (album?.uuid) {
                try {
                  const updatedAlbum = await getAlbum(album.uuid);
                  setAlbum(updatedAlbum);
                } catch (error) {
                  // 조회 실패 시 무시
                }
              }
              const qp = new URLSearchParams();
              qp.set("albumId", album?.uuid || "");
              if (albumDataParam) qp.set("albumData", albumDataParam);
              router.push(`/song/add/completed?${qp.toString()}`);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default function AddSongPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
              <p className="text-sm text-gray-600">로딩 중...</p>
            </div>
          </div>
        </>
      }
    >
      <AddSongContent />
    </Suspense>
  );
}

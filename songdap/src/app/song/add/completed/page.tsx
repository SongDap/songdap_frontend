"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/shared";
import { AlbumCover } from "@/shared/ui";
import { SongLetter } from "@/features/song/components";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { HiLockClosed } from "react-icons/hi";
import { getAlbum } from "@/features/album/api";
import type { AlbumResponse } from "@/features/album/api";
import { useSongAddDraft } from "@/features/song/add/hooks/useSongAddDraft";
import { trackEvent } from "@/lib/gtag";

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

function SongAddCompletedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");
  const albumDataParam = searchParams.get("albumData");
  const { user } = useOauthStore();

  const { draft, reset } = useSongAddDraft(albumId || "");
  const songData = draft.song;
  const messageData = draft.message;
  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // albumId가 있으면 앨범 정보 조회
  useEffect(() => {
    if (albumId) {
      setIsLoading(true);

      // URL albumData가 있으면 그걸로 표시(공유 링크/비로그인에서 GET /albums/{uuid}가 403일 수 있음)
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
          setIsLoading(false);
          return;
        } catch (error) {
          console.warn("[Song Completed] URL에서 앨범 정보 디코딩 실패:", error);
        }
      }

      getAlbum(albumId)
        .then((albumData) => {
          setAlbum(albumData);
        })
        .catch((error) => {
          console.warn("[Song Completed] 앨범 정보 조회 실패(공유 링크일 수 있음):", error);
          setAlbum({
            uuid: albumId,
            title: "앨범",
            description: "",
            isPublic: true,
            musicCount: 0,
            musicCountLimit: 10,
            color: "#929292",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setAlbum(null);
      setIsLoading(false);
    }
  }, [albumId, albumDataParam]);

  // PC: 180x180, 모바일: 140x140
  const coverSizePC = 180;
  const coverSizeMobile = 140;
  const lpSizePC = coverSizePC * 0.8; // 144
  const lpSizeMobile = coverSizeMobile * 0.8; // 112

  const handleAddMoreSongs = () => {
    trackEvent(
      { event: "select_content", content_type: "song_add_more", item_id: albumId || "" },
      { category: "song", action: "add_more_click", label: albumId || "" }
    );
    // 다음 노래 추가를 위해 드래프트 초기화
    reset();
    // 노래 추가 페이지로 이동
    const qp = new URLSearchParams();
    if (albumId) qp.set("albumId", albumId);
    if (albumDataParam) qp.set("albumData", albumDataParam);
    router.push(`/song/add?${qp.toString()}`);
  };

  const handleCreateAlbum = () => {
    trackEvent(
      { event: "select_content", content_type: "album_create_from_completed", item_id: "album_create_from_song_completed" },
      { category: "album", action: "create_click", label: "song_add_completed_page" }
    );
    // 앨범 생성 페이지로 이동
    router.push("/album/create");
  };

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

  const hasDraft =
    songData.title.trim().length > 0 &&
    songData.artist.trim().length > 0 &&
    messageData.writer.trim().length > 0 &&
    messageData.message.trim().length > 0;

  if (isLoading || !album || !hasDraft) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="text-sm text-gray-600">
              {isLoading || !album ? "로딩 중..." : "완료 정보를 불러올 수 없어요. 다시 시도해주세요."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 pt-8">
          {/* 데스크탑에서만 보이는 타이틀 */}
          <h1 className="hidden md:block text-[40px] font-bold text-gray-900 mb-4 text-center">
            노래를 추가했습니다
          </h1>

          <div className="mt-4 md:mt-8 flex flex-col items-center">
            {/* 앨범 카드 + 정보 섹션 */}
            <section className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              {/* 앨범 카드 */}
              <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] relative flex-shrink-0">
                {/* 모바일 버전 */}
                <div className="md:hidden">
                    <AlbumCover
                      size={coverSizeMobile}
                      backgroundColorHex={album.color}
                      imageUrl={undefined}
                      lpSize={lpSizeMobile}
                      className="w-full h-full"
                    />
                </div>
                {/* PC 버전 */}
                <div className="hidden md:block">
                    <AlbumCover
                      size={coverSizePC}
                      backgroundColorHex={album.color}
                      imageUrl={undefined}
                      lpSize={lpSizePC}
                      className="w-full h-full"
                    />
                </div>

                {/* 오른쪽 위 자물쇠 아이콘 + 곡 개수 */}
                <div className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                  {!album.isPublic && (
                    <HiLockClosed className="w-4 h-4 text-gray-700" />
                  )}
                  <span className="text-sm text-gray-700">{album.musicCount}곡</span>
                </div>
              </div>

              {/* 앨범 정보 */}
              <div className="flex flex-col gap-2 text-center md:text-left">
                {/* 앨범명 */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{album.title}</h2>
                
                {/* 앨범 설명 */}
                {album.description ? (
                  <p className="text-base text-gray-700">&ldquo;{album.description}&rdquo;</p>
                ) : (
                  <p className="text-base text-gray-500">&nbsp;</p>
                )}
                
                {/* 만든 사람 닉네임 */}
                <p className="text-sm text-gray-500">{user?.nickname || "사용자"}</p>
              </div>
            </section>

            {/* 편지 컴포넌트 */}
            <div className="w-full max-w-md mb-8">
              <SongLetter
                title={songData.title}
                artist={songData.artist}
                imageUrl={songData.imageUrl}
                message={messageData.message}
                nickname={messageData.writer}
                date={new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                tapeColor={album.color}
              />
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={handleAddMoreSongs}
                className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors"
              >
                노래 추가하기
              </button>
              <button
                type="button"
                onClick={handleCreateAlbum}
                className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors border border-gray-300"
              >
                앨범 생성하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SongAddCompletedPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="text-sm text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    }>
      <SongAddCompletedContent />
    </Suspense>
  );
}

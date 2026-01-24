"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { HiMail, HiMusicNote } from "react-icons/hi";

import { getAlbum, getAlbumMusics, getMusicDetail } from "@/features/album/api";
import type { AlbumResponse, MusicListItem, MusicSortOption } from "@/features/album/api";
import { SongCard } from "@/features/song/add/components";
import { SongLetter } from "@/features/song/components";
import { PageHeader } from "@/shared";
import { makeAlbumListUrl, parseAlbumListQuery } from "@/features/album/list/lib/albumListQuery";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import MusicPlayer from "./MusicPlayer";

type ViewMode = "player" | "letter";

type CurrentSong = {
  uuid: string;
  title: string;
  artist: string;
  imageUrl?: string | null;
  url?: string;
  videoId?: string;
  message?: string;
  nickname?: string;
};

const DESKTOP_FIXED_WIDTH_CLASS = "md:w-[672px] md:mx-auto";
const DEFAULT_PAGE_SIZE = 10;

function SongLetterItem({
  music,
  todayLabel,
  tapeColor,
  enabled,
}: {
  music: MusicListItem;
  todayLabel: string;
  tapeColor: string;
  enabled: boolean;
}) {
  const detailQuery = useQuery({
    queryKey: ["musicDetail", music.uuid],
    queryFn: () => getMusicDetail(music.uuid),
    enabled,
    staleTime: 1000 * 60 * 10,
  });

  const detail = detailQuery.data;

  return (
    <div className="w-full">
      <SongLetter
        title={detail?.title ?? music.title}
        artist={(detail?.artist ?? music.artist) ?? ""}
        imageUrl={detail?.image ?? (music.image ?? null)}
        message={detail?.message ?? music.message ?? undefined}
        nickname={detail?.writer ?? music.writer}
        date={todayLabel}
        tapeColor={tapeColor}
      />
    </div>
  );
}

export default function AlbumDetailContent() {
  const params = useParams();
  const albumUuid = (params?.id as string | undefined) ?? "";
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("player");
  const [currentSong, setCurrentSong] = useState<CurrentSong | null>(null);
  // 확장뷰 트리거: 기본은 undefined (초기 진입 시 확장뷰 자동 오픈 방지)
  const [expandTrigger, setExpandTrigger] = useState<number | undefined>(undefined);

  const playerListRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const albumQuery = useQuery<AlbumResponse>({
    queryKey: ["album", albumUuid],
    queryFn: () => getAlbum(albumUuid),
    enabled: Boolean(albumUuid),
    staleTime: 1000 * 60 * 5,
  });
  const album = albumQuery.data ?? null;

  const [musicSort] = useState<MusicSortOption>("LATEST");
  const musicsQuery = useInfiniteQuery({
    queryKey: ["albumMusics", albumUuid, musicSort],
    enabled: Boolean(albumUuid),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getAlbumMusics(albumUuid, {
        sort: musicSort,
        page: Number(pageParam) || 0,
        size: DEFAULT_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => {
      const content = lastPage.items?.content ?? [];
      if (!content.length) return undefined;
      if (lastPage.items?.last) return undefined;
      const next = (lastPage.items?.number ?? 0) + 1;
      return next;
    },
    staleTime: 1000 * 30,
  });

  const musics = useMemo(() => {
    const pages = musicsQuery.data?.pages ?? [];
    return pages.flatMap((p) => p.items?.content ?? []);
  }, [musicsQuery.data]);

  // 무한 스크롤: 스크롤 컨테이너 안의 sentinel이 보이면 다음 페이지
  useEffect(() => {
    const container = playerListRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !sentinel) return;
    if (!musicsQuery.hasNextPage) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (musicsQuery.isFetchingNextPage) return;
        void musicsQuery.fetchNextPage();
      },
      { root: container, rootMargin: "200px", threshold: 0 }
    );

    io.observe(sentinel);
    return () => io.disconnect();
  }, [musicsQuery.hasNextPage, musicsQuery.isFetchingNextPage, musicsQuery.fetchNextPage]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const extractYouTubeVideoId = useCallback((url: string): string | undefined => {
    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "");

      // youtu.be/{id}
      if (host === "youtu.be") {
        const id = u.pathname.split("/").filter(Boolean)[0];
        return id || undefined;
      }

      if (host === "youtube.com" || host === "m.youtube.com") {
        // /watch?v={id}
        const v = u.searchParams.get("v");
        if (v) return v;

        // /shorts/{id}
        const parts = u.pathname.split("/").filter(Boolean);
        if (parts[0] === "shorts" && parts[1]) return parts[1];

        // /embed/{id}
        if (parts[0] === "embed" && parts[1]) return parts[1];
      }
    } catch {
      // ignore
    }
    return undefined;
  }, []);

  const toCurrentSong = useCallback((music: MusicListItem): CurrentSong => {
    const videoId = music.url ? extractYouTubeVideoId(music.url) : undefined;
    return {
      uuid: music.uuid,
      title: music.title,
      artist: music.artist ?? "",
      imageUrl: music.image ?? null,
      url: music.url,
      videoId,
      message: music.message ?? undefined,
      nickname: music.writer,
    };
  }, [extractYouTubeVideoId]);

  const handleSelectSong = useCallback(
    (music: MusicListItem, openExpanded = true) => {
      setCurrentSong(toCurrentSong(music));
      if (openExpanded) setExpandTrigger((prev) => (prev ?? 0) + 1);
    },
    [toCurrentSong]
  );

  const handlePrevious = useCallback(() => {
    if (!currentSong || musics.length === 0) return;
    const idx = musics.findIndex((m) => m.uuid === currentSong.uuid);
    if (idx < 0) return;
    const prevIdx = (idx - 1 + musics.length) % musics.length;
    handleSelectSong(musics[prevIdx], false);
  }, [currentSong, musics, handleSelectSong]);

  const handleNext = useCallback(() => {
    if (!currentSong || musics.length === 0) return;
    const idx = musics.findIndex((m) => m.uuid === currentSong.uuid);
    if (idx < 0) return;
    const nextIdx = (idx + 1) % musics.length;
    handleSelectSong(musics[nextIdx], false);
  }, [currentSong, musics, handleSelectSong]);

  // 편지 탭에서는 하단 플레이어 바만 숨김 (선택 곡은 유지해서 다시 돌아왔을 때 그대로 활성화)

  // 첫 진입/새로고침 시 첫 번째 곡을 기본 선택 상태로
  useEffect(() => {
    if (viewMode !== "player") return;
    if (currentSong) return;
    if (musics.length === 0) return;
    handleSelectSong(musics[0], false);
  }, [viewMode, currentSong, musics, handleSelectSong]);

  // 플레이어 모드에서 선택된 곡이 보이도록 자동 스크롤
  useEffect(() => {
    if (viewMode !== "player") return;
    if (!currentSong) return;
    const container = playerListRef.current;
    if (!container) return;

    const raf = requestAnimationFrame(() => {
      const row = container.querySelector<HTMLElement>(
        `[data-music-uuid="${currentSong.uuid}"]`
      );
      if (!row) return;

      const containerRect = container.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const currentTop = container.scrollTop;

      const targetTop =
        currentTop +
        (rowRect.top - containerRect.top) -
        container.clientHeight / 2 +
        rowRect.height / 2;

      const maxTop = container.scrollHeight - container.clientHeight;
      const nextTop = Math.max(0, Math.min(targetTop, maxTop));
      container.scrollTo({ top: nextTop, behavior: "smooth" });
    });

    return () => cancelAnimationFrame(raf);
  }, [viewMode, currentSong?.uuid]);

  if (albumQuery.isLoading) {
    return (
      <>
        <PageHeader title="로딩 중..." />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">앨범 정보를 불러오는 중...</p>
        </div>
      </>
    );
  }

  if (!album) {
    return (
      <>
        <PageHeader title="앨범을 찾을 수 없습니다" />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">
            {albumQuery.isError ? "앨범을 불러오는데 실패했습니다." : "앨범을 찾을 수 없습니다."}
          </p>
        </div>
      </>
    );
  }

  // 리스트에서 넘어온 정렬/페이지를 유지해서 되돌아갈 수 있도록 backHref 구성
  const backHref = makeAlbumListUrl(parseAlbumListQuery(searchParams));

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 헤더 (고정 영역) */}
      <div className="flex-shrink-0">
        <PageHeader
          title={album.title}
          backButtonText="내 앨범"
          backgroundColor={album.color}
          hideTextOnMobile={true}
          isPublic={album.isPublic}
          showBackButton={true}
          backHref={backHref}
        />
      </div>

      {/* 앨범 상세: 탭 아래만 스크롤 */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div
          className="flex-1 min-h-0 overflow-hidden flex flex-col"
          style={{
            background: `linear-gradient(to bottom, ${album.color}, ${album.color})`,
          }}
        >
          <div
            className="flex-1 min-h-0 overflow-hidden flex flex-col"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
            }}
          >
            {/* 콘텐츠 가로폭: 모바일=반응형, 데스크탑=고정 */}
            <div
              className={`w-full flex-1 min-h-0 overflow-hidden flex flex-col ${DESKTOP_FIXED_WIDTH_CLASS}`}
            >
              {/* 뷰 모드 토글 (모바일/데스크탑 공통) */}
              <div className="flex items-center justify-center pt-4 pb-2 flex-shrink-0">
                <div className="inline-flex p-1 rounded-full bg-gray-200">
                  <button
                    onClick={() => setViewMode("player")}
                    className={`p-2.5 rounded-full transition-colors ${
                      viewMode === "player"
                        ? "bg-[#006FFF] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    aria-label="뮤직플레이어"
                  >
                    <HiMusicNote className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("letter")}
                    className={`p-2.5 rounded-full transition-colors ${
                      viewMode === "letter"
                        ? "bg-[#006FFF] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    aria-label="편지"
                  >
                    <HiMail className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 플레이어 버전 */}
              {viewMode === "player" && (
                <div
                  ref={playerListRef}
                  className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 pt-4 pb-20"
                >
                  <div className="flex flex-col -mx-4">
                    {musics.map((music) => {
                      const isActive = currentSong?.uuid === music.uuid;
                      return (
                        <div key={music.uuid} data-music-uuid={music.uuid}>
                          <SongCard
                            title={music.title}
                            artist={music.artist ?? ""}
                            imageUrl={music.image ?? null}
                            backgroundOpacity={0.4}
                            fullWidth={true}
                            showPlayButton={true}
                            isActive={isActive}
                            onCardClick={() => handleSelectSong(music, false)}
                            onPlay={() => handleSelectSong(music, true)}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div ref={sentinelRef} className="h-10" />
                </div>
              )}

              {/* 편지 버전 */}
              {viewMode === "letter" && (
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-8 md:px-0 pt-4 pb-20">
                  <div className="flex flex-col gap-8">
                    {musics.map((music) => (
                      <SongLetterItem
                        key={music.uuid}
                        music={music}
                        todayLabel={todayLabel}
                        tapeColor={album.color}
                        enabled={viewMode === "letter"}
                      />
                    ))}
                    <div ref={sentinelRef} className="h-10" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 플레이어(편지 탭에서는 숨김) */}
      {currentSong && (
        <MusicPlayer
          title={currentSong.title}
          artist={currentSong.artist}
          videoId={currentSong.videoId}
          imageUrl={currentSong.imageUrl}
          message={currentSong.message}
          nickname={currentSong.nickname}
          backgroundColor={album.color}
          hideUI={viewMode !== "player"}
          onClose={() => setCurrentSong(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          expandTrigger={expandTrigger}
        />
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HiMail, HiMusicNote, HiTrash, HiInformationCircle, HiX, HiChevronDown, HiLockOpen, HiLockClosed } from "react-icons/hi";

import { getAlbum, updateAlbumVisibility } from "@/features/album/api";
import { getAlbumMusics, deleteMusic } from "@/features/song/api";
import type { AlbumResponse } from "@/features/album/api";
import type { MusicInfo, MusicSortOption } from "@/features/song/api";
import { SongCard } from "@/features/song/add/components";
import AddSongModal from "@/features/song/add/components/AddSongModal";
import { SongLetter } from "@/features/song/components";
import { PageHeader } from "@/shared";
import { makeAlbumListUrl, parseAlbumListQuery } from "@/features/album/list/lib/albumListQuery";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AlbumCover } from "@/shared/ui";
import { trackEvent } from "@/lib/gtag";

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
  isOwner,
}: {
  music: MusicInfo;
  todayLabel: string;
  tapeColor: string;
  enabled: boolean;
  isOwner: boolean | null;
}) {
  // 이미 충분한 정보가 MusicInfo에 있으므로 추가 API 호출 제거
  return (
    <div className="w-full">
      <SongLetter
        title={music.title}
        artist={music.artist ?? ""}
        imageUrl={music.image ?? null}
        message={music.message ?? undefined}
        nickname={music.writer}
        date={todayLabel}
        tapeColor={tapeColor}
        isOwner={isOwner}
      />
    </div>
  );
}

export default function AlbumDetailContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const albumUuid = id ?? "";

  const [viewMode, setViewMode] = useState<ViewMode>("player");
  const [currentSong, setCurrentSong] = useState<CurrentSong | null>(null);
  const [isSongAddModalOpen, setIsSongAddModalOpen] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState<number | undefined>(undefined);
  const [autoPlayTrigger, setAutoPlayTrigger] = useState<number | undefined>(undefined);
  const [isAutoPlayMode, setIsAutoPlayMode] = useState(false);
  const [isAutoPlayPending, setIsAutoPlayPending] = useState(false);
  const [showAutoPlayFailedModal, setShowAutoPlayFailedModal] = useState(false);

  const playerListRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const autoPlayDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const albumQuery = useQuery<AlbumResponse>({
    queryKey: ["album", albumUuid],
    queryFn: () => getAlbum(albumUuid),
    enabled: Boolean(albumUuid),
    staleTime: 1000 * 60 * 5,
  });
  const album = albumQuery.data ?? null;

  const [musicSort, setMusicSort] = useState<MusicSortOption>("LATEST");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAlbumInfoOpen, setIsAlbumInfoOpen] = useState(false);
  const [isAlbumInfoEditMode, setIsAlbumInfoEditMode] = useState(false);
  const [tempIsPublic, setTempIsPublic] = useState(false);
  const [isVisibilityUpdating, setIsVisibilityUpdating] = useState(false);

  const sortMenuRef = useRef<HTMLDivElement | null>(null);

  const MUSIC_SORT_OPTIONS = [
    { label: "최신순", value: "LATEST" as MusicSortOption },
    { label: "오래된순", value: "OLDEST" as MusicSortOption },
    { label: "제목순", value: "TITLE" as MusicSortOption },
    { label: "아티스트순", value: "ARTIST" as MusicSortOption },
  ];

  const currentSortLabel = MUSIC_SORT_OPTIONS.find((o) => o.value === musicSort)?.label ?? "정렬";
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

  // 앨범 소유자 여부 판단
  const isOwner = useMemo(() => {
    return musicsQuery.data?.pages?.[0]?.flag?.owner ?? null;
  }, [musicsQuery.data?.pages]);

  // 노래 추가 가능 여부 판단
  const canAdd = useMemo(() => {
    return musicsQuery.data?.pages?.[0]?.flag?.canAdd ?? null;
  }, [musicsQuery.data?.pages]);

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

  // 정렬 드롭다운: 외부 클릭/ESC로 닫기
  useEffect(() => {
    if (!isSortOpen) return;

    const onPointerDownCapture = (e: PointerEvent) => {
      const el = sortMenuRef.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      setIsSortOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSortOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDownCapture, true);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDownCapture, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSortOpen]);

  // 앨범 정보 모달: ESC로 닫기 & 수정 모드 초기화
  useEffect(() => {
    if (!isAlbumInfoOpen) {
      setIsAlbumInfoEditMode(false);
      setTempIsPublic(false);
      return;
    }
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAlbumInfoOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAlbumInfoOpen]);

  // 앨범 공개 여부 수정
  const handleVisibilityToggle = useCallback(async () => {
    if (!album) return;

    setIsVisibilityUpdating(true);
    try {
      await updateAlbumVisibility(album.uuid, tempIsPublic);
      // 데이터 새로고침
      await albumQuery.refetch();
      setIsAlbumInfoEditMode(false);
    } catch (error) {
      // 공개 여부 수정 실패
    } finally {
      setIsVisibilityUpdating(false);
    }
  }, [album, tempIsPublic, albumQuery]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  // 백엔드에서 주는 유튜브 URL에서 video ID만 추출 (재생은 이 ID로 함)
  const getVideoIdFromUrl = useCallback((url: string): string | undefined => {
    if (!url?.trim()) return undefined;
    try {
      const u = new URL(url.trim());
      const host = u.hostname.replace("www.", "");

      if (host === "youtu.be") {
        const id = u.pathname.split("/").filter(Boolean)[0];
        return id || undefined;
      }

      if (host === "youtube.com" || host === "m.youtube.com") {
        const v = u.searchParams.get("v");
        if (v) return v;
        const parts = u.pathname.split("/").filter(Boolean);
        if (parts[0] === "shorts" && parts[1]) return parts[1];
        if (parts[0] === "embed" && parts[1]) return parts[1];
      }
    } catch {
      // ignore
    }
    return undefined;
  }, []);

  const toCurrentSong = useCallback((music: MusicInfo): CurrentSong => {
    const videoId = music.url ? getVideoIdFromUrl(music.url) : undefined;
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
  }, [getVideoIdFromUrl]);

  const handleSelectSong = useCallback(
    (music: MusicInfo, openExpanded = true, autoPlay = false) => {
      setCurrentSong(toCurrentSong(music));
      if (openExpanded) {
        setExpandTrigger((prev) => (prev ?? 0) + 1);
        setAutoPlayTrigger((prev) => (prev ?? 0) + 1);
      } else if (autoPlay) {
        setAutoPlayTrigger((prev) => (prev ?? 0) + 1);
      }
    },
    [toCurrentSong]
  );

  const handlePrevious = useCallback(
    (triggerAutoPlay = false) => {
      if (!currentSong || musics.length === 0) return;
      const idx = musics.findIndex((m) => m.uuid === currentSong.uuid);
      if (idx < 0) return;
      const prevIdx = (idx - 1 + musics.length) % musics.length;

      if (triggerAutoPlay) {
        if (autoPlayDelayTimerRef.current) {
          clearTimeout(autoPlayDelayTimerRef.current);
          autoPlayDelayTimerRef.current = null;
        }
        setIsAutoPlayPending(true);
        handleSelectSong(musics[prevIdx], false, false);
        autoPlayDelayTimerRef.current = setTimeout(() => {
          autoPlayDelayTimerRef.current = null;
          setIsAutoPlayPending(false);
          setAutoPlayTrigger((prev) => (prev ?? 0) + 1);
        }, 3000);
      } else {
        handleSelectSong(musics[prevIdx], false, false);
      }
    },
    [currentSong, musics, handleSelectSong]
  );

  const handleNext = useCallback(
    (triggerAutoPlay = false) => {
      if (!currentSong || musics.length === 0) return;
      const idx = musics.findIndex((m) => m.uuid === currentSong.uuid);
      if (idx < 0) return;
      const nextIdx = (idx + 1) % musics.length;

      if (triggerAutoPlay) {
        if (autoPlayDelayTimerRef.current) {
          clearTimeout(autoPlayDelayTimerRef.current);
          autoPlayDelayTimerRef.current = null;
        }
        setIsAutoPlayPending(true);
        handleSelectSong(musics[nextIdx], false, false);
        autoPlayDelayTimerRef.current = setTimeout(() => {
          autoPlayDelayTimerRef.current = null;
          setIsAutoPlayPending(false);
          setAutoPlayTrigger((prev) => (prev ?? 0) + 1);
        }, 3000);
      } else {
        handleSelectSong(musics[nextIdx], false, false);
      }
    },
    [currentSong, musics, handleSelectSong]
  );

  useEffect(() => {
    return () => {
      if (autoPlayDelayTimerRef.current) {
        clearTimeout(autoPlayDelayTimerRef.current);
        autoPlayDelayTimerRef.current = null;
      }
    };
  }, []);

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
        <PageHeader title="앨범을 찾을 수 없습니다" showLogo={true} showBackButton={false} />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">삭제된 앨범입니다.</p>
        </div>
      </>
    );
  }

  // 비공개 앨범이고 비소유자인 경우 접근 차단
  if (!album.isPublic && isOwner !== true) {
    return (
      <>
        <PageHeader title="비공개 앨범" showLogo={true} showBackButton={false} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <HiLockClosed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-800 mb-2">비공개 앨범입니다.</p>
            <p className="text-gray-600 mb-8">앨범 주인만 접근할 수 있습니다.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#006FFF] text-white font-semibold rounded-xl hover:bg-[#0056CC] active:bg-[#0044AA] transition-colors"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </>
    );
  }
  const backHref = makeAlbumListUrl(parseAlbumListQuery(searchParams));

  const currentSongIndex = currentSong
    ? musics.findIndex((m) => m.uuid === currentSong.uuid) + 1
    : 0;
  const totalSongCount = album.musicCount ?? 0;
  const headerTitle = (
    <div className="flex flex-col items-center justify-center gap-0.5">
      <span className="text-xs text-gray-600">
        ({currentSongIndex}/{totalSongCount})
      </span>
      <span className="line-clamp-2 text-center">{album.title}</span>
    </div>
  );

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden"
    >
      <div className="flex-shrink-0">
        <PageHeader
          title={headerTitle}
          isPublic={album.isPublic}
          showBackButton={isOwner === true}
          showLogo={isOwner !== true}
          backHref={backHref}
          backgroundColor={album.color}
          rightAction={
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(false);
                setIsAlbumInfoOpen(true);
              }}
              className="p-1 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors flex-shrink-0"
              aria-label="앨범 정보"
            >
              <HiInformationCircle className="w-5 h-5 text-gray-800" />
            </button>
          }
        />
      </div>

      {/* 앨범 정보 모달 (페이지 이동 없이, 재생 유지) */}
      {isAlbumInfoOpen && (
        <>
          {/* 백드롭 */}
          <div
            className="fixed inset-0 bg-black/40 z-[120]"
            onClick={() => setIsAlbumInfoOpen(false)}
          />
          {/* 모달 */}
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div
              className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative px-4 py-3 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 text-center">앨범 정보</h2>
                <button
                  type="button"
                  onClick={() => setIsAlbumInfoOpen(false)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                  aria-label="닫기"
                >
                  <HiX className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="p-5">
                {!isAlbumInfoEditMode ? (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <AlbumCover
                          size={92}
                          backgroundColorHex={album.color}
                          imageUrl={undefined}
                          lpSize={92 * 0.8}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                              album.isPublic
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }`}
                          >
                            {album.isPublic ? "공개" : "비공개"}
                          </span>
                          <span className="text-sm text-gray-600">
                            {album.musicCount}/{album.musicCountLimit}곡
                          </span>
                        </div>

                        <div className="mt-2 text-lg font-bold text-gray-900 break-words">
                          {album.title}
                        </div>

                        {album.createdAt && (
                          <div className="mt-1 text-xs text-gray-500">
                            {String(album.createdAt).slice(0, 10)}
                          </div>
                        )}
                      </div>
                    </div>

                    {album.description && (
                      <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto scrollbar-hide">
                        {album.description}
                      </div>
                    )}

                    <div className="mt-5 flex gap-2">
                      {isOwner === true && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAlbumInfoEditMode(true);
                            setTempIsPublic(album.isPublic);
                          }}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-semibold transition-colors"
                        >
                          수정하기
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsAlbumInfoOpen(false)}
                        className={`py-2.5 px-4 rounded-xl bg-[#006FFF] text-white text-sm font-semibold hover:bg-[#0056CC] active:bg-[#0044AA] transition-colors ${isOwner === true ? "flex-1" : "w-full"}`}
                      >
                        닫기
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 공개 여부 수정 폼 */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-base font-medium text-gray-900">
                          공개설정
                        </label>
                        <div className="flex items-center gap-3">
                          {tempIsPublic ? (
                            <>
                              <span className="text-base text-gray-700">공개</span>
                              <HiLockOpen className="w-5 h-5 text-gray-700" />
                            </>
                          ) : (
                            <>
                              <span className="text-base text-gray-700">비공개</span>
                              <HiLockClosed className="w-5 h-5 text-gray-700" />
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => setTempIsPublic(!tempIsPublic)}
                            disabled={isVisibilityUpdating}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                              tempIsPublic ? "bg-[#006FFF]" : "bg-gray-300"
                            }`}
                            role="switch"
                            aria-checked={tempIsPublic}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                tempIsPublic ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 text-left">
                        {tempIsPublic
                          ? "현재는 공개 상태입니다."
                          : "현재는 비공개 상태입니다."}
                      </p>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <button
                        type="button"
                        onClick={handleVisibilityToggle}
                        disabled={isVisibilityUpdating || tempIsPublic === album.isPublic}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#006FFF] text-white text-sm font-semibold hover:bg-[#0056CC] active:bg-[#0044AA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isVisibilityUpdating ? "저장 중..." : "저장"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAlbumInfoEditMode(false);
                          setTempIsPublic(album.isPublic);
                        }}
                        disabled={isVisibilityUpdating}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm font-semibold transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

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
              {/* 보드(패널) - 편지/노래카드 공통 컨테이너 */}
              <div className="flex-1 min-h-0 px-0 pb-0">
                <div className="relative h-full rounded-3xl bg-white/90 backdrop-blur-md border border-white/60 overflow-hidden flex flex-col">
                  {/* 상단 헤더: 탭(플레이어/편지) + 정렬 필터 (같은 Y축) */}
                  <div className="flex items-center justify-center px-4 pt-3 pb-2 flex-shrink-0">
                    <div className="w-full flex items-center justify-between gap-2">
                      {/* 뷰 모드 토글 + 연속 재생 */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="inline-flex p-1 rounded-full bg-gray-200">
                          <button
                            onClick={() => setViewMode("player")}
                            className={`p-2 md:p-2.5 rounded-full transition-colors ${
                              viewMode === "player"
                                ? "bg-[#006FFF] text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                            aria-label="뮤직플레이어"
                          >
                            <HiMusicNote className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => setViewMode("letter")}
                            className={`p-2 md:p-2.5 rounded-full transition-colors ${
                              viewMode === "letter"
                                ? "bg-[#006FFF] text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                            aria-label="편지"
                          >
                            <HiMail className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>

                        {/* 연속 재생 토글 */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <span className="text-xs text-gray-600 whitespace-nowrap">연속 재생</span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isAutoPlayMode}
                            onClick={() => setIsAutoPlayMode((v) => !v)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2 ${
                              isAutoPlayMode ? "bg-[#006FFF]" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${
                                isAutoPlayMode ? "left-[22px]" : "left-0.5"
                              }`}
                            />
                          </button>
                        </label>
                      </div>

                      {/* 노래 추가 버튼 및 정렬 드롭다운 */}
                      <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
                        {/* 노래 추가 버튼 (비소유자 && canAdd가 true일 때만 표시) */}
                        {isOwner !== true && canAdd === true && (
                          <button
                            onClick={() => {
                              trackEvent(
                                { event: "select_content", content_type: "song_add_from_detail", item_id: albumUuid },
                                { category: "song", action: "add_click", label: albumUuid }
                              );
                              setIsSongAddModalOpen(true);
                            }}
                            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full bg-[#006FFF] text-white hover:bg-[#0056CC] active:bg-[#0044AA] transition-colors flex-shrink-0"
                            aria-label="노래 추가"
                          >
                            + 노래 추가
                          </button>
                        )}

                        {/* 곡 개수 초과 메시지 (비소유자 && canAdd가 false일 때 표시) */}
                        {isOwner !== true && canAdd === false && (
                          <span className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full bg-gray-100 text-gray-600 flex-shrink-0 max-w-[150px] md:max-w-none text-center">
                            앨범의 곡 개수를<br className="md:hidden" /> 초과하였습니다.
                          </span>
                        )}

                        <div
                          ref={sortMenuRef}
                          className="relative w-[100px] md:w-[130px] flex-shrink-0"
                        >
                          <button
                            type="button"
                            onClick={() => setIsSortOpen((v) => !v)}
                            className="w-full px-2 py-1.5 md:px-3 md:py-2 text-xs rounded-full border border-gray-300 bg-white/90 text-gray-800 flex items-center justify-between gap-1 focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
                            aria-label="노래 목록 정렬"
                            aria-haspopup="listbox"
                            aria-expanded={isSortOpen}
                          >
                            <span className="truncate text-xs">{currentSortLabel}</span>
                            <HiChevronDown
                              className={`w-3 h-3 flex-shrink-0 transition-transform ${
                                isSortOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isSortOpen && (
                            <div
                              className="absolute right-0 top-full mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg z-30 overflow-hidden"
                              role="listbox"
                            >
                              <div className="max-h-56 overflow-y-auto scrollbar-hide py-1">
                                {MUSIC_SORT_OPTIONS.map((opt) => {
                                  const active = opt.value === musicSort;
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      role="option"
                                      aria-selected={active}
                                      onClick={() => {
                                        setMusicSort(opt.value);
                                        setIsSortOpen(false);
                                        playerListRef.current?.scrollTo({ top: 0, behavior: "auto" });
                                      }}
                                      className={`w-full px-3 py-2 text-left text-xs md:text-sm transition-colors ${
                                        active
                                          ? "bg-blue-50 text-[#006FFF]"
                                          : "text-gray-800 hover:bg-gray-50"
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 플레이어 버전 */}
                  {viewMode === "player" && (
                    <div
                      ref={playerListRef}
                      className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-0 pt-0 pb-40 md:pb-44"
                    >
                      <div className="flex flex-col">
                        {!musicsQuery.isLoading && musics.length === 0 ? (
                          <div className="py-16 px-6 text-center text-gray-600">
                            추가된 노래가 없습니다.
                          </div>
                        ) : (
                          <>
                            {musics.map((music, idx) => {
                              const isActive = currentSong?.uuid === music.uuid;
                              const isFirst = idx === 0;
                              const isLast = idx === musics.length - 1;
                              const separatorPlacement =
                                musics.length <= 1
                                  ? "bottom"
                                  : isFirst
                                    ? "none"
                                    : isLast
                                      ? "topBottom"
                                      : "top";
                              return (
                                <div key={music.uuid} data-music-uuid={music.uuid}>
                                  <SongCard
                                    title={music.title}
                                    artist={music.artist ?? ""}
                                    imageUrl={music.image ?? null}
                                    backgroundOpacity={0.4}
                                    fullWidth={true}
                                    showPlayButton={currentSong?.uuid === music.uuid}
                                    isActive={isActive}
                                    separatorPlacement={separatorPlacement}
                                    separatorColor={album.color}
                                    onCardClick={() => {
                                      handleSelectSong(music, false);
                                    }}
                                    onPlay={() => {
                                      handleSelectSong(music, true);
                                    }}
                                    onDelete={isOwner === true ? () => {
                                      if (confirm(`${music.artist}의 "${music.title}"을 삭제하시겠습니까?`)) {
                                        deleteMusic(music.uuid)
                                          .then(async () => {
                                            setCurrentSong(null);
                                            await Promise.all([albumQuery.refetch(), musicsQuery.refetch()]);
                                            // 리스트 갱신 후 포커스가 다음 카드로 넘어가며 확장뷰가 열리는 것 방지
                                            if (typeof requestAnimationFrame !== "undefined") {
                                              requestAnimationFrame(() => {
                                                (document.activeElement as HTMLElement)?.blur();
                                              });
                                            }
                                          })
                                          .catch(() => {
                                            alert("노래 삭제 중 오류가 발생했습니다.");
                                          });
                                      }
                                    } : undefined}
                                  />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                      <div ref={sentinelRef} className="h-10" />
                    </div>
                  )}

                  {/* 편지 버전 */}
                  {viewMode === "letter" && (
                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-6 md:px-4 pt-4 pb-28">
                      <div className="flex flex-col gap-8">
                        {!musicsQuery.isLoading && musics.length === 0 ? (
                          <div className="py-16 px-6 text-center text-gray-600">
                            추가된 노래가 없습니다.
                          </div>
                        ) : (
                          <>
                            {musics.map((music) => (
                              <SongLetterItem
                                key={music.uuid}
                                music={music}
                                todayLabel={todayLabel}
                                tapeColor={album.color}
                                enabled={viewMode === "letter"}
                                isOwner={isOwner}
                              />
                            ))}
                          </>
                        )}
                        <div ref={sentinelRef} className="h-10" />
                      </div>
                    </div>
                  )}

                  {/* 하단 페이드: 플레이어바 위 빈 공간 완화 */}
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/95 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3초 대기 중 토스트 */}
      {isAutoPlayPending && currentSong && viewMode === "player" && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[95] px-4 py-2.5 rounded-full bg-gray-900/90 text-white text-sm font-medium shadow-lg"
          role="status"
          aria-live="polite"
        >
          재생 중입니다. 잠시 기다려주세요.
        </div>
      )}

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
          isOwner={isOwner}
          onClose={() => setCurrentSong(null)}
          onPrevious={() => handlePrevious(isAutoPlayMode)}
          onNext={() => handleNext(isAutoPlayMode)}
          onNextAndPlay={() => handleNext(true)}
          onAutoPlayNextFailed={() => setShowAutoPlayFailedModal(true)}
          autoPlayNext={isAutoPlayMode}
          isPlayButtonDisabled={isAutoPlayPending}
          expandTrigger={expandTrigger}
          autoPlayTrigger={autoPlayTrigger}
        />
      )}

      {/* 연속 재생 중 다음 곡 재생 실패 시 모달 */}
      {showAutoPlayFailedModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[110]"
            onClick={() => {
              setShowAutoPlayFailedModal(false);
              setIsAutoPlayMode(false);
            }}
            aria-hidden
          />
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-[120] p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-gray-900 font-medium mb-5">
              다음 곡 재생에 실패했어요.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAutoPlayFailedModal(false);
                  handleNext(true);
                }}
                className="w-full py-3 rounded-xl bg-[#006FFF] text-white font-semibold hover:bg-[#0056CC]"
              >
                다음 곡 재생
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAutoPlayFailedModal(false);
                  setIsAutoPlayMode(false);
                }}
                className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              >
                연속 재생 취소
              </button>
            </div>
          </div>
        </>
      )}

      {/* 노래 추가 모달 */}
      {isSongAddModalOpen && album && (
        <AddSongModal
          album={album}
          isOpen={isSongAddModalOpen}
          onClose={() => {
            setIsSongAddModalOpen(false);
            albumQuery.refetch();
            musicsQuery.refetch();
          }}
          onRefresh={() => {
            albumQuery.refetch();
            musicsQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

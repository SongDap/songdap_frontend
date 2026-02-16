"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getAlbum, updateAlbumVisibility } from "@/features/album/api";
import { getAlbumMusics } from "@/features/song/api";
import type { AlbumResponse } from "@/features/album/api";
import type { MusicInfo, MusicSortOption } from "@/features/song/api";
import type { CurrentSong, ViewMode } from "../types";
import { DEFAULT_PAGE_SIZE, MUSIC_SORT_OPTIONS } from "../constants";
import { getVideoIdFromUrl } from "../lib/getVideoIdFromUrl";

export function useAlbumDetail(albumUuid: string) {
  const [viewMode, setViewMode] = useState<ViewMode>("player");
  const [currentSong, setCurrentSong] = useState<CurrentSong | null>(null);
  const [isSongAddModalOpen, setIsSongAddModalOpen] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState<number | undefined>(undefined);
  const [autoPlayTrigger, setAutoPlayTrigger] = useState<number | undefined>(undefined);
  const [isAutoPlayMode, setIsAutoPlayMode] = useState(false);
  const [isAutoPlayPending, setIsAutoPlayPending] = useState(false);
  const [showAutoPlayFailedModal, setShowAutoPlayFailedModal] = useState(false);

  const [musicSort, setMusicSort] = useState<MusicSortOption>("LATEST");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAlbumInfoOpen, setIsAlbumInfoOpen] = useState(false);
  const [isAlbumInfoEditMode, setIsAlbumInfoEditMode] = useState(false);
  const [tempIsPublic, setTempIsPublic] = useState(false);
  const [isVisibilityUpdating, setIsVisibilityUpdating] = useState(false);

  const playerListRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);

  const albumQuery = useQuery<AlbumResponse>({
    queryKey: ["album", albumUuid],
    queryFn: () => getAlbum(albumUuid),
    enabled: Boolean(albumUuid),
    staleTime: 1000 * 60 * 5,
  });
  const album = albumQuery.data ?? null;

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
      return (lastPage.items?.number ?? 0) + 1;
    },
    staleTime: 1000 * 30,
  });

  const musics = useMemo(() => {
    const pages = musicsQuery.data?.pages ?? [];
    const flat = pages.flatMap((p) => p.items?.content ?? []);
    // uuid 기준 중복 제거 (페이지 겹침/API 중복 시 React key 경고 방지)
    const seen = new Set<string>();
    return flat.filter((m) => {
      if (seen.has(m.uuid)) return false;
      seen.add(m.uuid);
      return true;
    });
  }, [musicsQuery.data]);

  const isOwner = useMemo(
    () => musicsQuery.data?.pages?.[0]?.flag?.owner ?? null,
    [musicsQuery.data?.pages]
  );
  const canAdd = useMemo(
    () => musicsQuery.data?.pages?.[0]?.flag?.canAdd ?? null,
    [musicsQuery.data?.pages]
  );

  const currentSortLabel =
    MUSIC_SORT_OPTIONS.find((o) => o.value === musicSort)?.label ?? "정렬";

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

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
  }, []);

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
        setIsAutoPlayPending(true);
        handleSelectSong(musics[prevIdx], false, false);
        setAutoPlayTrigger((prev) => (prev ?? 0) + 1);
      } else {
        handleSelectSong(musics[prevIdx], false, false);
        setAutoPlayTrigger((prev) => (prev ?? 0) + 1);
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
        if (nextIdx === 0) {
          handleSelectSong(musics[0], false, false);
        } else {
          setIsAutoPlayPending(true);
          handleSelectSong(musics[nextIdx], false, false);
          setAutoPlayTrigger((prev) => (prev ?? 0) + 1);
        }
      } else {
        handleSelectSong(musics[nextIdx], false, false);
        setAutoPlayTrigger((prev) => (prev ?? 0) + 1);
      }
    },
    [currentSong, musics, handleSelectSong]
  );

  const handleVisibilityToggle = useCallback(async () => {
    if (!album) return;
    setIsVisibilityUpdating(true);
    try {
      await updateAlbumVisibility(album.uuid, tempIsPublic);
      await albumQuery.refetch();
      setIsAlbumInfoEditMode(false);
    } catch {
      // 공개 여부 수정 실패
    } finally {
      setIsVisibilityUpdating(false);
    }
  }, [album, tempIsPublic, albumQuery]);

  // 무한 스크롤
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
    const onPointerDown = (e: PointerEvent) => {
      const el = sortMenuRef.current;
      if (!el?.contains(e.target as Node)) setIsSortOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSortOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
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

  // 첫 진입 시 첫 곡 선택
  useEffect(() => {
    if (viewMode !== "player") return;
    if (currentSong) return;
    if (musics.length === 0) return;
    handleSelectSong(musics[0], false);
  }, [viewMode, currentSong, musics, handleSelectSong]);

  // 선택 곡 자동 스크롤
  useEffect(() => {
    if (viewMode !== "player" || !currentSong) return;
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
      container.scrollTo({ top: Math.max(0, Math.min(targetTop, maxTop)), behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [viewMode, currentSong?.uuid]);

  return {
    albumQuery,
    album,
    musicsQuery,
    musics,
    isOwner,
    canAdd,
    todayLabel,
    viewMode,
    setViewMode,
    currentSong,
    setCurrentSong,
    isSongAddModalOpen,
    setIsSongAddModalOpen,
    expandTrigger,
    autoPlayTrigger,
    isAutoPlayMode,
    setIsAutoPlayMode,
    isAutoPlayPending,
    setIsAutoPlayPending,
    showAutoPlayFailedModal,
    setShowAutoPlayFailedModal,
    musicSort,
    setMusicSort,
    isSortOpen,
    setIsSortOpen,
    isAlbumInfoOpen,
    setIsAlbumInfoOpen,
    isAlbumInfoEditMode,
    setIsAlbumInfoEditMode,
    tempIsPublic,
    setTempIsPublic,
    isVisibilityUpdating,
    playerListRef,
    sentinelRef,
    sortMenuRef,
    handleSelectSong,
    handlePrevious,
    handleNext,
    handleVisibilityToggle,
    currentSortLabel,
  };
}

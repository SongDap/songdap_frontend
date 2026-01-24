"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { HiMail, HiMusicNote } from "react-icons/hi";

import { getAlbum } from "@/features/album/api";
import type { AlbumResponse } from "@/features/album/api";
import { SongCard } from "@/features/song/add/components";
import { SongLetter } from "@/features/song/components";
import { PageHeader } from "@/shared";
import { SAMPLE_SONGS } from "@/shared/lib/mockData";
import { YouTubeModal } from "@/shared/ui";

import MusicPlayer from "./MusicPlayer";

type ViewMode = "player" | "letter";

type CurrentSong = {
  id: number;
  title: string;
  artist: string;
  imageUrl?: string | null;
  message?: string;
  nickname?: string;
};

const DESKTOP_FIXED_WIDTH_CLASS = "md:w-[672px] md:mx-auto";
const DEFAULT_DUMMY_SONG_COUNT = 10;

export default function AlbumDetailContent() {
  const params = useParams();
  const albumUuid = (params?.id as string | undefined) ?? "";

  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("player");
  const [currentSong, setCurrentSong] = useState<CurrentSong | null>(null);
  // 확장뷰 트리거: 기본은 undefined (초기 진입 시 확장뷰 자동 오픈 방지)
  const [expandTrigger, setExpandTrigger] = useState<number | undefined>(undefined);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  const playerListRef = useRef<HTMLDivElement | null>(null);

  // 앨범 데이터는 API로 가져오기 (노래 목록은 아직 미연결 → 더미 사용)
  useEffect(() => {
    if (!albumUuid) {
      setAlbum(null);
      setError("앨범 UUID가 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getAlbum(albumUuid)
      .then((albumData) => {
        setAlbum(albumData);
      })
      .catch((err) => {
        console.error("[Album Detail] 앨범 조회 실패:", err);
        setAlbum(null);
        setError("앨범을 불러오는데 실패했습니다.");
      })
      .finally(() => setIsLoading(false));
  }, [albumUuid]);

  // 더미 노래 개수 결정: 실제 musicCount가 0이어도 더미는 보여주기
  const dummySongCount = useMemo(() => {
    if (!album) return 0;

    const fromAlbum =
      typeof album.musicCount === "number" && album.musicCount > 0
        ? album.musicCount
        : album.musicCountLimit ?? DEFAULT_DUMMY_SONG_COUNT;

    return Math.max(1, Math.min(fromAlbum, SAMPLE_SONGS.length));
  }, [album?.musicCount, album?.musicCountLimit, album]);

  const songs = useMemo(() => {
    if (dummySongCount <= 0) return [];
    return SAMPLE_SONGS.slice(0, dummySongCount);
  }, [dummySongCount]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const toCurrentSong = useCallback((song: (typeof SAMPLE_SONGS)[number]): CurrentSong => {
    return {
      id: song.id,
      title: song.title,
      artist: song.artist,
      imageUrl: song.imageUrl,
      message: song.message,
      nickname: song.nickname,
    };
  }, []);

  const handleSelectSong = useCallback(
    (song: (typeof SAMPLE_SONGS)[number], openExpanded = true) => {
      setCurrentSong(toCurrentSong(song));
      if (openExpanded) setExpandTrigger((prev) => (prev ?? 0) + 1);
    },
    [toCurrentSong]
  );

  const handlePrevious = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    if (idx < 0) return;
    const prevIdx = (idx - 1 + songs.length) % songs.length;
    handleSelectSong(songs[prevIdx], false);
  }, [currentSong, songs, handleSelectSong]);

  const handleNext = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    if (idx < 0) return;
    const nextIdx = (idx + 1) % songs.length;
    handleSelectSong(songs[nextIdx], false);
  }, [currentSong, songs, handleSelectSong]);

  // 편지 탭에서는 하단 플레이어 바만 숨김 (선택 곡은 유지해서 다시 돌아왔을 때 그대로 활성화)

  // 첫 진입/새로고침 시 첫 번째 곡을 기본 선택 상태로
  useEffect(() => {
    if (viewMode !== "player") return;
    if (currentSong) return;
    if (songs.length === 0) return;
    handleSelectSong(songs[0], false);
  }, [viewMode, currentSong, songs, handleSelectSong]);

  // 플레이어 모드에서 선택된 곡이 보이도록 자동 스크롤
  useEffect(() => {
    if (viewMode !== "player") return;
    if (!currentSong) return;
    const container = playerListRef.current;
    if (!container) return;

    const raf = requestAnimationFrame(() => {
      const row = container.querySelector<HTMLElement>(
        `[data-song-id="${currentSong.id}"]`
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
  }, [viewMode, currentSong?.id]);

  if (isLoading) {
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
          <p className="text-gray-700">{error || "앨범을 찾을 수 없습니다."}</p>
        </div>
      </>
    );
  }

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
                    {songs.map((song) => {
                      const isActive = currentSong?.id === song.id;
                      return (
                        <div key={song.id} data-song-id={song.id}>
                          <SongCard
                            title={song.title}
                            artist={song.artist}
                            imageUrl={song.imageUrl}
                            backgroundOpacity={0.4}
                            fullWidth={true}
                            showPlayButton={true}
                            isActive={isActive}
                            onCardClick={() => handleSelectSong(song, false)}
                            onPlay={() => handleSelectSong(song, true)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 편지 버전 */}
              {viewMode === "letter" && (
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-8 md:px-0 pt-4 pb-20">
                  <div className="flex flex-col gap-8">
                    {songs.map((song) => (
                      <div key={song.id} className="w-full">
                        <SongLetter
                          title={song.title}
                          artist={song.artist}
                          imageUrl={song.imageUrl}
                          message={song.message}
                          nickname={song.nickname}
                          date={todayLabel}
                          tapeColor={album.color}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 플레이어(편지 탭에서는 숨김) */}
      {viewMode === "player" && currentSong && (
        <MusicPlayer
          title={currentSong.title}
          artist={currentSong.artist}
          imageUrl={currentSong.imageUrl}
          message={currentSong.message}
          nickname={currentSong.nickname}
          backgroundColor={album.color}
          onClose={() => setCurrentSong(null)}
          onOpenYouTubeModal={() => setIsYouTubeModalOpen(true)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          expandTrigger={expandTrigger}
        />
      )}

      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
      />
    </div>
  );
}

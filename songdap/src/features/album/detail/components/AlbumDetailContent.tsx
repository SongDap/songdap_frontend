"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/shared";
import { YouTubeModal } from "@/shared/ui";
import { SAMPLE_ALBUMS, SAMPLE_SONGS } from "@/shared/lib/mockData";
import { SongCard } from "@/features/song/add/components";
import { SongLetter } from "@/features/song/components";
import { HiMusicNote, HiMail } from "react-icons/hi";
import MusicPlayer from "./MusicPlayer";
import type { AlbumResponse } from "@/features/album/api";

export default function AlbumDetailContent() {
  const params = useParams();
  const albumUuid = params?.id as string;
  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<{ id: number; title: string; artist: string; imageUrl?: string | null; message?: string; nickname?: string } | null>(null);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<"player" | "letter">("player"); // 뷰 모드: "player" 또는 "letter"
  const playerScrollRef = useRef<HTMLDivElement | null>(null);
  const activeSongRowRef = useRef<HTMLDivElement | null>(null);

  // 일단 더미 데이터 사용 (앨범 + 노래)
  useEffect(() => {
    const dummy = SAMPLE_ALBUMS.find((a) => a.uuid === albumUuid) ?? SAMPLE_ALBUMS[0];
    const albumData: AlbumResponse = {
      uuid: dummy.uuid,
      title: dummy.title,
      description: dummy.description,
      isPublic: dummy.isPublic,
      musicCount: dummy.musicCount,
      musicCountLimit: dummy.musicCountLimit,
      color: dummy.color,
      createdAt: dummy.createdAt,
    };
    setAlbum(albumData);
    setError(null);
    setIsLoading(false);
  }, [albumUuid]);

  // 더미 노래 데이터 (SAMPLE_SONGS)
  const allSongs = useMemo(() => {
    if (!album) return [];
    return SAMPLE_SONGS.slice(0, Math.min(album.musicCount, SAMPLE_SONGS.length));
  }, [album]);

  // 첫 진입/새로고침 시 첫 번째 곡을 기본 선택 상태로
  // (player 탭에서만, 이미 선택된 곡이 있으면 유지)
  useEffect(() => {
    if (viewMode !== "player") return;
    if (currentSong) return;
    if (allSongs.length === 0) return;

    const firstSong = allSongs[0];
    setCurrentSong({
      id: firstSong.id,
      title: firstSong.title,
      artist: firstSong.artist,
      imageUrl: firstSong.imageUrl,
      message: firstSong.message,
      nickname: firstSong.nickname,
    });
  }, [viewMode, currentSong, allSongs]);

  // 플레이어 모드에서 선택된 곡이 보이도록 자동 스크롤
  // (조건부 return 위에서 호출되어 Hook 순서 고정)
  useEffect(() => {
    if (viewMode !== "player") return;
    if (!currentSong) return;
    if (!playerScrollRef.current || !activeSongRowRef.current) return;

    // requestAnimationFrame으로 렌더 후 스크롤 보장
    const raf = requestAnimationFrame(() => {
      const container = playerScrollRef.current;
      const row = activeSongRowRef.current;
      if (!container || !row) return;

      // 선택된 곡이 컨테이너 중앙 근처로 오도록 스크롤
      const targetTop =
        row.offsetTop - container.clientHeight / 2 + row.clientHeight / 2;
      const maxTop = container.scrollHeight - container.clientHeight;
      const nextTop = Math.max(0, Math.min(targetTop, maxTop));

      container.scrollTo({ top: nextTop, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [viewMode, currentSong?.id]);

  // 편지 탭에서는 하단 플레이어 바 숨김(열려있으면 닫기)
  useEffect(() => {
    if (viewMode === "letter") {
      setCurrentSong(null);
    }
  }, [viewMode]);

  // 조건부 렌더링 (Hook 호출 이후에 배치)
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

  const handlePlay = (song: { id: number; title: string; artist: string; imageUrl?: string | null; message?: string; nickname?: string }) => {
    // 항상 새로운 객체를 생성하여 리렌더링 트리거 (같은 곡을 클릭해도 익스팬드뷰 열기)
    setCurrentSong({ ...song });
    setExpandTrigger(prev => prev + 1); // 익스팬드뷰 열기 트리거 증가
  };

  const handlePrevious = () => {
    if (!currentSong) return;
    const currentIndex = allSongs.findIndex((s) => s.id === currentSong.id);
    if (currentIndex > 0) {
      const previousSong = allSongs[currentIndex - 1];
      setCurrentSong({
        id: previousSong.id,
        title: previousSong.title,
        artist: previousSong.artist,
        imageUrl: previousSong.imageUrl,
        message: previousSong.message,
        nickname: previousSong.nickname,
      });
      // expandTrigger는 증가시키지 않음 (내용만 변경)
    } else {
      // 첫 번째 곡이면 마지막 곡으로
      const lastSong = allSongs[allSongs.length - 1];
      setCurrentSong({
        id: lastSong.id,
        title: lastSong.title,
        artist: lastSong.artist,
        imageUrl: lastSong.imageUrl,
        message: lastSong.message,
        nickname: lastSong.nickname,
      });
      // expandTrigger는 증가시키지 않음 (내용만 변경)
    }
  };

  const handleNext = () => {
    if (!currentSong) return;
    const currentIndex = allSongs.findIndex((s) => s.id === currentSong.id);
    if (currentIndex < allSongs.length - 1) {
      const nextSong = allSongs[currentIndex + 1];
      setCurrentSong({
        id: nextSong.id,
        title: nextSong.title,
        artist: nextSong.artist,
        imageUrl: nextSong.imageUrl,
        message: nextSong.message,
        nickname: nextSong.nickname,
      });
      // expandTrigger는 증가시키지 않음 (내용만 변경)
    } else {
      // 마지막 곡이면 첫 번째 곡으로
      const firstSong = allSongs[0];
      setCurrentSong({
        id: firstSong.id,
        title: firstSong.title,
        artist: firstSong.artist,
        imageUrl: firstSong.imageUrl,
        message: firstSong.message,
        nickname: firstSong.nickname,
      });
      // expandTrigger는 증가시키지 않음 (내용만 변경)
    }
  };

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
          showBackButton={false}
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
            <div className="w-full flex-1 min-h-0 overflow-hidden flex flex-col md:w-[672px] md:mx-auto">
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

              {/* 뮤직플레이어 버전: 모바일 UI 그대로 (모바일/데스크탑 공통) */}
              {viewMode === "player" && (
                <div
                  ref={playerScrollRef}
                  className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 pt-4 pb-20"
                >
                  <div className="flex flex-col -mx-4">
                    {allSongs.map((song) => {
                      const isActive = currentSong?.id === song.id;
                      return (
                        <div
                          key={song.id}
                          ref={isActive ? (el) => { activeSongRowRef.current = el; } : undefined}
                        >
                        <SongCard
                          title={song.title}
                          artist={song.artist}
                          imageUrl={song.imageUrl}
                          backgroundOpacity={0.4}
                          fullWidth={true}
                          showPlayButton={true}
                          isActive={isActive}
                          onPlay={() =>
                            handlePlay({
                              id: song.id,
                              title: song.title,
                              artist: song.artist,
                              imageUrl: song.imageUrl,
                              message: song.message,
                              nickname: song.nickname,
                            })
                          }
                        />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 편지 버전: 데스크탑 편지 UI 그대로 (모바일/데스크탑 공통) */}
              {viewMode === "letter" && (
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-0 pt-4 pb-20">
                  <div className="flex flex-col gap-8">
                    {allSongs.map((song) => (
                      <div key={song.id} className="w-full">
                        <SongLetter
                          title={song.title}
                          artist={song.artist}
                          imageUrl={song.imageUrl}
                          message={song.message}
                          nickname={song.nickname}
                          date={new Date().toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
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

      {/* 음악 플레이어 */}
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

      {/* 유튜브 모달 */}
      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
      />
    </div>
  );
}

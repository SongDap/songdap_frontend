"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/shared";
import { YouTubeModal } from "@/shared/ui";
import { SAMPLE_ALBUMS, SAMPLE_SONGS } from "@/shared/lib/mockData";
import { SongCard } from "@/features/song/add/components";
import MusicPlayer from "./MusicPlayer";

export default function AlbumDetailContent() {
  const params = useParams();
  const albumId = params?.id as string;
  const [currentSong, setCurrentSong] = useState<{ title: string; artist: string; imageUrl?: string | null; message?: string; nickname?: string } | null>(null);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState(0);

  // TODO: API에서 앨범 데이터 가져오기
  const album = SAMPLE_ALBUMS.find((a) => a.uuid === albumId);

  if (!album) {
    return (
      <>
        <PageHeader title="앨범을 찾을 수 없습니다" />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">앨범을 찾을 수 없습니다.</p>
        </div>
      </>
    );
  }

  // TODO: API에서 노래 목록 가져오기
  const songs = SAMPLE_SONGS.slice(0, album.musicCount);

  const handlePlay = (song: { title: string; artist: string; imageUrl?: string | null; message?: string; nickname?: string }) => {
    // 항상 새로운 객체를 생성하여 리렌더링 트리거 (같은 곡을 클릭해도 익스팬드뷰 열기)
    setCurrentSong({ ...song });
    setExpandTrigger(prev => prev + 1); // 익스팬드뷰 열기 트리거 증가
  };

  const handlePrevious = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(s => s.title === currentSong.title && s.artist === currentSong.artist);
    if (currentIndex > 0) {
      const previousSong = songs[currentIndex - 1];
      setCurrentSong({
        title: previousSong.title,
        artist: previousSong.artist,
        imageUrl: previousSong.imageUrl,
        message: previousSong.message,
        nickname: previousSong.nickname,
      });
      // expandTrigger는 증가시키지 않음 (내용만 변경)
    } else {
      // 첫 번째 곡이면 마지막 곡으로
      const lastSong = songs[songs.length - 1];
      setCurrentSong({
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
    const currentIndex = songs.findIndex(s => s.title === currentSong.title && s.artist === currentSong.artist);
    if (currentIndex < songs.length - 1) {
      const nextSong = songs[currentIndex + 1];
      setCurrentSong({
        title: nextSong.title,
        artist: nextSong.artist,
        imageUrl: nextSong.imageUrl,
        message: nextSong.message,
        nickname: nextSong.nickname,
      });
      // expandTrigger는 증가시키지 않음 (내용만 변경)
    } else {
      // 마지막 곡이면 첫 번째 곡으로
      const firstSong = songs[0];
      setCurrentSong({
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
    <>
      <div className="flex flex-col h-screen md:hidden overflow-hidden">
        <PageHeader title={album.title} backButtonText="내 앨범" backgroundColor={album.color} hideTextOnMobile={true} isPublic={album.isPublic} showBackButton={false} />
        <div 
          className="flex-1 overflow-hidden flex flex-col"
          style={{
            background: `linear-gradient(to bottom, ${album.color}, ${album.color})`,
          }}
        >
          <div 
            className="flex-1 overflow-hidden flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {/* 모바일 버전 */}
            <div className="flex flex-col h-full overflow-hidden">
              {/* 총 노래 개수 (고정) */}
              <div className="flex-shrink-0 px-4 pt-8 pb-6">
                <span className="text-2xl font-bold text-gray-900">{album.musicCount}</span>
                <span className="text-2xl font-bold text-gray-900 ml-1">곡</span>
              </div>

              {/* 노래 카드 목록 (스크롤 가능) */}
              <div className="flex-1 overflow-y-auto px-4 pb-20">
                <div className="flex flex-col -mx-4">
                  {songs.map((song) => {
                    const isActive = currentSong?.title === song.title && currentSong?.artist === song.artist;
                    return (
                      <SongCard
                        key={song.id}
                        title={song.title}
                        artist={song.artist}
                        imageUrl={song.imageUrl}
                        backgroundOpacity={0.4}
                        fullWidth={true}
                        showPlayButton={true}
                        isActive={isActive}
                        onPlay={() => handlePlay({ title: song.title, artist: song.artist, imageUrl: song.imageUrl, message: song.message, nickname: song.nickname })}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 음악 플레이어 */}
      {currentSong && (
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
    </>
  );
}

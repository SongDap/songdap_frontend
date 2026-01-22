"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/shared";
import { YouTubeModal } from "@/shared/ui";
import { SAMPLE_SONGS } from "@/shared/lib/mockData";
import { SongCard } from "@/features/song/add/components";
import { SongLetter } from "@/features/song/components";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import MusicPlayer from "./MusicPlayer";
import { getAlbum } from "@/features/album/api";
import type { AlbumResponse } from "@/features/album/api";

export default function AlbumDetailContent() {
  const params = useParams();
  const albumUuid = params?.id as string;
  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<{ title: string; artist: string; imageUrl?: string | null; message?: string; nickname?: string } | null>(null);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [letterPositions, setLetterPositions] = useState<Array<{ x: number; y: number; height?: number }>>([]); // x, y, height는 모두 백분율(%)

  // API에서 앨범 데이터 가져오기
  useEffect(() => {
    if (!albumUuid) {
      setError("앨범 UUID가 없습니다.");
      setIsLoading(false);
      return;
    }

    getAlbum(albumUuid)
      .then((albumData) => {
        setAlbum(albumData);
        setError(null);
      })
      .catch((err) => {
        console.error("[Album Detail] 앨범 조회 실패:", err);
        setError("앨범을 불러오는데 실패했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [albumUuid]);

  // TODO: API에서 노래 목록 가져오기
  // Hook은 항상 같은 순서로 호출되어야 하므로 조건문 이전에 배치
  const allSongs = useMemo(() => {
    if (!album) return [];
    return SAMPLE_SONGS.slice(0, album.musicCount);
  }, [album?.musicCount]);
  
  // 현재 페이지의 노래만 필터링
  const songs = useMemo(() => 
    allSongs.filter(song => (song.pageNumber || 1) === currentPage),
    [allSongs, currentPage]
  );
  
  // 전체 페이지 수 계산
  const totalPages = useMemo(() => 
    Math.max(...allSongs.map(song => song.pageNumber || 1), 1),
    [allSongs]
  );

  // 편지 위치 초기화 (백엔드 데이터 또는 기본값) - 백분율로 저장
  useEffect(() => {
    if (songs.length > 0) {
      const positions: Array<{ x: number; y: number; height?: number }> = [];
      
      songs.forEach((song) => {
        // 백엔드에서 받은 위치 데이터가 있으면 사용 (이미 백분율)
        if (song.positionX !== undefined && song.positionY !== undefined) {
          positions.push({ 
            x: song.positionX, 
            y: song.positionY,
            height: song.height || 87.5 // 기본값: 87.5% (350px / 400px * 100)
          });
        } else {
          // 기본값: 무작위 위치 생성 (백분율로)
          const estimatedLetterHeightPercent = 87.5; // 350px / 400px * 100 = 87.5%
          const x = (Math.random() * 100 - 50);
          const maxY = 75 - estimatedLetterHeightPercent;
          const y = Math.random() * Math.max(0, maxY);
          
          positions.push({ x, y, height: estimatedLetterHeightPercent });
        }
      });
      
      setLetterPositions(positions);
    } else {
      setLetterPositions([]);
    }
  }, [songs]);

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

  if (error || !album) {
    return (
      <>
        <PageHeader title="앨범을 찾을 수 없습니다" />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">{error || "앨범을 찾을 수 없습니다."}</p>
        </div>
      </>
    );
  }

  const handlePlay = (song: { title: string; artist: string; imageUrl?: string | null; message?: string; nickname?: string }) => {
    // 항상 새로운 객체를 생성하여 리렌더링 트리거 (같은 곡을 클릭해도 익스팬드뷰 열기)
    setCurrentSong({ ...song });
    setExpandTrigger(prev => prev + 1); // 익스팬드뷰 열기 트리거 증가
  };

  const handlePrevious = () => {
    if (!currentSong) return;
    const currentIndex = allSongs.findIndex(s => s.title === currentSong.title && s.artist === currentSong.artist);
    if (currentIndex > 0) {
      const previousSong = allSongs[currentIndex - 1];
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
      const lastSong = allSongs[allSongs.length - 1];
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
    const currentIndex = allSongs.findIndex(s => s.title === currentSong.title && s.artist === currentSong.artist);
    if (currentIndex < allSongs.length - 1) {
      const nextSong = allSongs[currentIndex + 1];
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
      const firstSong = allSongs[0];
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
      {/* 헤더 (모바일/데스크탑 공통) */}
      <PageHeader title={album.title} backButtonText="내 앨범" backgroundColor={album.color} hideTextOnMobile={true} isPublic={album.isPublic} showBackButton={false} />

      {/* 모바일 버전 */}
      <div className="flex flex-col h-screen md:hidden overflow-hidden">
        <div 
          className="flex-1 overflow-hidden flex flex-col"
          style={{
            background: `linear-gradient(to bottom, ${album.color}, ${album.color})`,
          }}
        >
          <div 
            className="flex-1 overflow-hidden flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
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

      {/* 데스크탑 버전 */}
      <div className="hidden md:block min-h-screen">
        <div 
          className="min-h-screen"
          style={{
            background: `linear-gradient(to bottom, ${album.color}, ${album.color})`,
          }}
        >
          <div 
            className="min-h-screen"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <div className="w-full px-4 md:px-8 pt-8 pb-20">
              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-6 w-fit mx-auto">
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="이전 페이지"
                  >
                    <HiChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* 페이지 번호 */}
                  <span className="px-2 text-sm font-semibold text-gray-700">
                    {currentPage}/{totalPages}
                  </span>

                  {/* 다음 페이지 버튼 */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="다음 페이지"
                  >
                    <HiChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              )}

              {/* 노래 편지 목록 - 롤링페이퍼 스타일 */}
              {/* 편지 영역: 반응형 가로 길이, 세로는 동적 */}
              <div 
                className="relative letter-container w-full rounded-lg" 
                style={{ 
                  aspectRatio: '16 / 9',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {letterPositions.length > 0 && songs.map((song, index) => {
                  const pos = letterPositions[index];
                  if (!pos) return null;
                  
                  // 백분율 위치 계산
                  // x는 컨테이너 너비의 백분율, y와 height는 컨테이너 너비 기준 백분율
                  // 하지만 top과 minHeight는 컨테이너 높이 기준이므로, 16:9 비율을 고려하여 변환
                  // 보드 높이 = 너비 * (9/16) = 너비 * 0.5625
                  // 너비 기준 백분율을 높이 기준 백분율로 변환: (너비 기준 백분율) / 0.5625 = (너비 기준 백분율) * (16/9)
                  // 단, 높이 기준에서 보드 높이는 100%이므로 변환된 값이 100%를 넘지 않도록 해야 함
                  // 테이프는 편지 위로 올라가 있으므로 (absolute -top-3, h-6 = 약 12px + 24px = 36px), 
                  // 편지의 실제 상단 위치는 테이프 높이만큼 위로 올라가 있음
                  // 편지 너비가 컨테이너의 35%이므로, 테이프 높이를 컨테이너 너비 기준으로 계산하면 약 1.5% 정도
                  const boardHeightRatio = 9 / 16; // 보드 높이 비율 (너비 대비)
                  const tapeHeightPercent = 1.5; // 테이프 높이 (컨테이너 너비 기준 백분율, 대략적 추정)
                  const tapeHeightInHeightPercent = tapeHeightPercent / boardHeightRatio; // 높이 기준으로 변환
                  
                  // positionY는 편지의 왼쪽 상단(테이프 포함) 기준이므로, 테이프 높이를 고려
                  const yInHeightPercent = Math.min((pos.y / boardHeightRatio), 100 - tapeHeightInHeightPercent); // 너비 기준 백분율을 높이 기준으로 변환 (테이프 공간 확보)
                  const heightInHeightPercent = pos.height ? Math.min((pos.height / boardHeightRatio), 100 - yInHeightPercent - tapeHeightInHeightPercent) : undefined; // 높이도 변환하고 보드 영역을 넘지 않도록 제한
                  
                  return (
                    <div
                      key={song.id}
                      className="absolute select-none"
                      style={{
                        left: `${pos.x}%`,
                        top: `${yInHeightPercent}%`,
                        width: '35%',
                        minHeight: heightInHeightPercent ? `${heightInHeightPercent}%` : 'auto',
                      }}
                    >
                      <SongLetter
                        title={song.title}
                        artist={song.artist}
                        imageUrl={song.imageUrl}
                        message={song.message}
                        nickname={song.nickname}
                        date={new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        tapeColor={album.color}
                      />
                    </div>
                  );
                })}
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

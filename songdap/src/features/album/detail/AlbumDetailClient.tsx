"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { responsive, COLORS } from "@/features/album/create/constants";
import { AlbumDetailModal } from "@/features/song";
import type { AlbumData } from "@/features/song/components/types";
import AlbumDetailHeader from "./components/AlbumDetailHeader";
import AlbumDetailViewModeTabs from "./components/AlbumDetailViewModeTabs";
import AlbumDetailLPView from "./views/AlbumDetailLPView";
import AlbumDetailListView from "./views/AlbumDetailListView";
import AlbumShareModal from "./modals/AlbumShareModal";
import AlbumDeleteModal from "./modals/AlbumDeleteModal";
import AlbumDetailSongModal from "./modals/AlbumDetailSongModal";

interface AlbumDetailClientProps {
  album: AlbumData;
}

type ViewMode = "lp" | "list";

export default function AlbumDetailClient({ album }: AlbumDetailClientProps) {
  const router = useRouter();
  const [lpSize, setLpSize] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("lp");
  const [isMobile, setIsMobile] = useState(false);
  const [isSongDetailModalOpen, setIsSongDetailModalOpen] = useState(false);
  const [selectedSongIndex, setSelectedSongIndex] = useState<number | null>(null);
  const [modalWidth, setModalWidth] = useState(600);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  
  // 편지 데이터 (예시 - 나중에 실제 데이터로 교체)
  const getLetterData = (index: number) => {
    // TODO: 실제 노래 데이터에서 가져오기
    return {
      toNickname: album.nickname || "프로듀서",
      content: "친구에게 전하고 싶은 한 마디가 있나요?",
      fromNickname: "보낸사람",
      date: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  useEffect(() => {
    // 모바일 감지 (768px 미만)
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // 모바일이면 리스트 모드로 자동 전환
      if (mobile) {
        setViewMode("list");
      }
    };

    // LP 크기 계산 (화면 세로 크기의 35% 정도로 제한)
    const updateLpSize = () => {
      // 뷰포트 높이의 35% 정도로 설정 (헤더 공간 고려)
      const maxSize = Math.min(window.innerHeight * 0.3, window.innerWidth * 0.3);
      setLpSize(maxSize);
    };

    checkMobile();
    updateLpSize();
    window.addEventListener("resize", () => {
      checkMobile();
      updateLpSize();
    });

    return () => {
      window.removeEventListener("resize", () => {
        checkMobile();
        updateLpSize();
      });
    };
  }, []);


  // 메뉴 핸들러
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleViewInfo = () => {
    setIsInfoModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: 앨범 삭제 로직 구현
    console.log("앨범 삭제 확인:", album);
    // 삭제 후 앨범 저장소 페이지로 이동
    router.push("/album");
  };

  // 재생 버튼 클릭 핸들러
  const handlePlaySong = (index: number) => {
    // TODO: 나중에 영상 재생 로직 구현
    // 임시로 videoId를 설정하여 플레이어 프레임 표시
    setYoutubeVideoId(`temp-video-${index}`);
  };


  // 배경 스타일 결정 (앨범 커버 이미지 또는 색상)
  const backgroundStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 1,
    ...(album.coverImageUrl
      ? {
          backgroundImage: `url(${album.coverImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {
          backgroundColor: album.coverColor || "#ffffff",
        }),
  };

  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: "#ffffff" }}>
      {/* 배경 (앨범 커버 이미지 또는 색상) */}
      <div style={backgroundStyle} />
      
      {/* 투명 프레임 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          zIndex: 2,
        }}
      />
      
      {/* 컨텐츠 */}
      <div className="relative z-10 flex min-h-screen flex-col items-center">
        {/* 서비스 프레임 */}
        <div
          style={{
            width: "min(clamp(100vw, calc(768 * 100vw / 1820), 900px), 900px)",
            maxWidth: "100%",
            height: "100vh",
            maxHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            ...(album.coverImageUrl
              ? {
                  backgroundImage: `url(${album.coverImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : {
                  backgroundColor: album.coverColor || "#ffffff",
                }),
          }}
        >
          {/* 헤더 */}
          <AlbumDetailHeader
            onShare={handleShare}
            onViewInfo={handleViewInfo}
            onDelete={handleDelete}
          />

          {/* 뷰 모드 탭 (화면 하단, 데스크탑만 표시) */}
          {!isMobile && (
            <AlbumDetailViewModeTabs
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          )}

          {/* LP 버전 */}
          {viewMode === "lp" && (
            <AlbumDetailLPView
              album={album}
              lpSize={lpSize}
              onSongClick={(index) => {
                setSelectedSongIndex(index);
                setIsSongDetailModalOpen(true);
              }}
              onPlayClick={handlePlaySong}
            />
          )}

          {/* 리스트 버전 */}
          {viewMode === "list" && (
            <AlbumDetailListView
              album={album}
              lpSize={lpSize}
              youtubeVideoId={youtubeVideoId}
              onSongClick={(index) => {
                setSelectedSongIndex(index);
                setIsSongDetailModalOpen(true);
              }}
              onPlayClick={handlePlaySong}
              onCloseVideo={() => setYoutubeVideoId(null)}
            />
          )}
        </div>
      </div>

      {/* 앨범 공유 모달 */}
      <AlbumShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        album={album}
      />

      {/* 앨범 정보 모달 */}
      <AlbumDetailModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        albumData={album}
        editable={true}
      />

          {/* 앨범 삭제 확인 모달 */}
          <AlbumDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
          />

          {/* 노래 상세 모달 (메모장 스타일) */}
          <AlbumDetailSongModal
            isOpen={isSongDetailModalOpen}
            onClose={() => setIsSongDetailModalOpen(false)}
            selectedSongIndex={selectedSongIndex}
            letterData={selectedSongIndex !== null ? getLetterData(selectedSongIndex) : null}
            modalWidth={modalWidth}
            onModalWidthChange={setModalWidth}
            songTitle={selectedSongIndex !== null ? album.songs?.[selectedSongIndex]?.title : undefined}
            songArtist={selectedSongIndex !== null ? album.songs?.[selectedSongIndex]?.artist : undefined}
            songImageUrl={selectedSongIndex !== null ? album.songs?.[selectedSongIndex]?.imageUrl : undefined}
          />
        </div>
      );
    }


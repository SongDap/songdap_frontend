"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AlbumCoverWithLP } from "@/shared/ui";
import { AlbumDetailModal, AlbumInfoButton } from "@/features/song";
import type { AlbumData } from "@/features/song/components/types";

// 예시 데이터 (하나만)
const EXAMPLE_ALBUM: AlbumData = {
  albumName: "겨울 감성 플레이리스트",
  albumDescription: "추운 겨울날 듣기 좋은 따뜻한 노래들을 모아봤어요. 함께 들어요!",
  category: "mood",
  categoryTag: "감성적인",
  isPublic: "public",
  songCount: 5,
  coverColor: "#98d9d4",
  lpColor: "#98d9d4",
  coverImageUrl: undefined,
  lpCircleImageUrl: undefined,
  nickname: "음악러버",
  createdDate: "2025.12.30",
};

export default function AlbumListPage() {
  const [albums, setAlbums] = useState<AlbumData[]>([EXAMPLE_ALBUM]);

  // 로컬 스토리지에서 생성한 앨범 데이터 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAlbums = JSON.parse(localStorage.getItem("albums") || "[]");
      // 예시 데이터와 생성한 앨범 데이터 합치기
      setAlbums([EXAMPLE_ALBUM, ...savedAlbums]);
    }
  }, []);

  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (album: AlbumData) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  const handleSaveAlbum = (updatedAlbum: AlbumData) => {
    // 앨범 수정 시 로컬 스토리지 업데이트
    if (typeof window !== "undefined") {
      const savedAlbums = JSON.parse(localStorage.getItem("albums") || "[]");
      const albumIndex = savedAlbums.findIndex(
        (album: AlbumData) => album.albumName === updatedAlbum.albumName
      );
      
      if (albumIndex !== -1) {
        savedAlbums[albumIndex] = updatedAlbum;
        localStorage.setItem("albums", JSON.stringify(savedAlbums));
        // 예시 데이터와 생성한 앨범 데이터 합치기
        setAlbums([EXAMPLE_ALBUM, ...savedAlbums]);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* 배경 이미지 - subBackground */}
      <div className="relative min-h-screen">
        <Image
          src="/images/subBackground.png"
          alt="Album list background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* 컨텐츠 */}
        <div className="relative z-10 min-h-screen w-full">
          {/* 서비스 프레임 - 배경 투명 */}
          <div className="service-frame" style={{ backgroundColor: "transparent" }}>
            <div style={{ padding: "20px" }}>
              <h1 style={{ marginBottom: "40px", fontSize: "32px", fontWeight: "bold" }}>
                앨범 저장소
              </h1>

              {/* 앨범 목록 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "30px",
                  padding: "20px 0",
                }}
              >
                {albums.map((album, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    {/* 앨범 커버 & LP */}
                    <div style={{ position: "relative" }}>
                      <AlbumCoverWithLP
                        coverSize={160}
                        lpSize={144}
                        coverColor={album.coverColor}
                        lpCircleColor={album.lpColor}
                        coverImageUrl={album.coverImageUrl}
                        lpCircleImageUrl={album.lpCircleImageUrl}
                        albumName={album.albumName}
                        tag={album.categoryTag}
                        date={album.createdDate}
                        showCoverText={true}
                      />
                    </div>

                    {/* 앨범 정보 버튼 */}
                    <AlbumInfoButton
                      coverSize={160}
                      onClick={() => handleOpenModal(album)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 앨범 상세 정보 모달 */}
      {selectedAlbum && (
        <AlbumDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAlbum}
          albumData={selectedAlbum}
          editable={true}
        />
      )}
    </div>
  );
}


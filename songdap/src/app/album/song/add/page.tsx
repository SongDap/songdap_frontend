"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AlbumDetailModal, SongAddHeader, SongAddForm, SongAddButton } from "@/features/song";
import { responsive } from "@/features/album/create/constants";
import { calculateCoverSize, calculateLpSize, isLandscapeMode } from "@/features/song/utils/resizeUtils";
import { fileToDataURL } from "@/features/song/utils/imageUtils";

/**
 * 노래 등록 페이지
 *
 * @description
 * - 다른 사용자가 앨범 공유 링크로 접속하여 노래를 추가하는 페이지
 * - 백엔드 구현 전까지 임시로 하드코딩된 albumId 사용
 * - TODO: 백엔드 완성 후 동적 라우트로 변경 예정 (/album/[id]/song/add)
 */
export default function AddSongPage() {
  // TODO: 나중에 URL 파라미터에서 받아올 예정
  const TEMP_ALBUM_ID = "temp-album-123";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverSize, setCoverSize] = useState(140);
  const [lpSize, setLpSize] = useState(126);
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [songImage, setSongImage] = useState<File | null>(null);
  const [songImagePreview, setSongImagePreview] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const serviceFrameRef = useRef<HTMLDivElement>(null);

  // 반응형 크기 계산
  useEffect(() => {
    const computeSizes = () => {
      if (typeof window === "undefined" || !serviceFrameRef.current) return;
      
      setIsLandscape(isLandscapeMode());
      
      const frameWidth = serviceFrameRef.current.offsetWidth;
      const size = calculateCoverSize(frameWidth);
      setCoverSize(size);
      setLpSize(calculateLpSize(size));
    };

    computeSizes();
    
    const resizeObserver = new ResizeObserver(computeSizes);
    if (serviceFrameRef.current) {
      resizeObserver.observe(serviceFrameRef.current);
    }
    
    window.addEventListener("resize", computeSizes);
    window.addEventListener("orientationchange", computeSizes);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", computeSizes);
      window.removeEventListener("orientationchange", computeSizes);
    };
  }, []);

  // 노래 이미지 업로드 핸들러
  const handleSongImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSongImage(file);
      try {
        const dataURL = await fileToDataURL(file);
        setSongImagePreview(dataURL);
      } catch (error) {
        console.error("이미지 로드 실패:", error);
      }
    }
  };

  // TODO: 백엔드에서 받아올 더미 데이터
  const dummyAlbumData = {
    albumName: "겨울 감성 플레이리스트",
    albumDescription: "추운 겨울날 듣기 좋은 따뜻한 노래들을 모아봤어요. 함께 들어요!",
    category: "mood",
    categoryTag: "감성적인",
    isPublic: "public",
    songCount: 5,
    coverColor: "#98d9d4",
    lpColor: "#98d9d4",
    coverImageUrl: undefined as string | undefined,
    lpCircleImageUrl: undefined as string | undefined,
    nickname: "음악러버",
    createdDate: "2025.12.30",
  };

  // 서비스 프레임 스타일: 앨범 생성 페이지와 동일한 반응형 폭/패딩
  const serviceFrameStyle = {
    width: "min(clamp(100vw, calc(768 * 100vw / 1820), 900px), 900px)",
    maxWidth: "100%",
    display: "flex" as const,
    flexDirection: "column" as const,
    position: "relative" as const,
    height: "100vh",
    maxHeight: "100vh",
    overflow: "hidden" as const,
  };

  const sidePadding = responsive.min(32);
  // 가로모드일 때는 상단 패딩을 줄여서 입력 영역 확보
  const topPadding = isLandscape 
    ? responsive.sizeVh(40, 50, 60, 60)
    : responsive.sizeVh(80, 90, 100, 100);

  return (
    <div className="relative min-h-screen w-full">
      {/* 배경 이미지 */}
      <div className="relative min-h-screen">
        <Image
          src="/images/mainBackground.png"
          alt="Add song background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* 컨텐츠 */}
        <div className="relative z-10 flex min-h-screen flex-col items-center p-4">
          <div 
            ref={serviceFrameRef}
            className="bg-[#fefaf0] relative service-frame service-frame-scroll" 
            style={serviceFrameStyle}
          >
            {/* 상단 고정 영역: 텍스트 + 앨범 커버/LP */}
            <SongAddHeader
              nickname={dummyAlbumData.nickname}
              albumName={dummyAlbumData.albumName}
              coverColor={dummyAlbumData.coverColor}
              lpColor={dummyAlbumData.lpColor}
              coverImageUrl={dummyAlbumData.coverImageUrl}
              lpCircleImageUrl={dummyAlbumData.lpCircleImageUrl}
              coverSize={coverSize}
              lpSize={lpSize}
              sidePadding={sidePadding}
              topPadding={topPadding}
              onOpenModal={() => setIsModalOpen(true)}
            />

            {/* 스크롤 가능한 중간 영역 */}
            <SongAddForm
              coverSize={coverSize}
              sidePadding={sidePadding}
              songTitle={songTitle}
              artistName={artistName}
              songImagePreview={songImagePreview}
              onSongTitleChange={setSongTitle}
              onArtistNameChange={setArtistName}
              onSongImageChange={handleSongImageChange}
            />

            {/* 하단 고정 영역: 추가하기 버튼 */}
            <SongAddButton />
          </div>
        </div>
      </div>

      {/* 앨범 상세 정보 모달 */}
      <AlbumDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        albumData={dummyAlbumData}
        editable={false}
      />
    </div>
  );
}


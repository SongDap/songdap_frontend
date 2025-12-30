"use client";

import { useState } from "react";
import Image from "next/image";
import { AlbumDetailModal } from "@/features/song";

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
    nickname: "음악러버",
    createdDate: "2025.12.30",
  };

  // 서비스 프레임 스타일 (앨범 생성 페이지와 동일)
  const serviceFrameStyle = {
    width: 'min(clamp(100vw, calc(768 * 100vw / 1820), 900px), 900px)',
    maxWidth: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
  };

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
            className="bg-[#fefaf0] relative service-frame service-frame-scroll"
            style={serviceFrameStyle}
          >
            {/* 노래 등록 폼이 여기에 들어갈 예정 */}
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
              <div className="text-black text-2xl text-center">
                <div>노래 등록 페이지</div>
                <div className="text-sm mt-4">앨범 ID: {TEMP_ALBUM_ID}</div>
              </div>
              
              {/* 테스트용 버튼 */}
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#98d9d4",
                  border: "3px solid #000",
                  borderRadius: "10px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                앨범 정보 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 앨범 상세 정보 모달 */}
      <AlbumDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        albumData={dummyAlbumData}
      />
    </div>
  );
}


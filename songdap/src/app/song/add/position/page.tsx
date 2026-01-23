"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/shared";
import { useTempDataStore } from "@/shared/store/tempDataStore";
import { LetterPositionEditor, SaveConfirmPopup } from "@/features/song/add/components";
import { SAMPLE_ALBUMS } from "@/shared/lib/mockData";
import { getAlbum, addMusicToAlbum } from "@/features/album/api";
import type { AlbumResponse } from "@/features/album/api";

type SongData = {
  title: string;
  artist: string;
  imageUrl: string;
};

type MessageData = {
  nickname: string;
  message: string;
};

type LetterPosition = {
  x: number;
  y: number;
  pageNumber: number;
};

function SongPositionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");
  
  const [songData, setSongData] = useState<SongData | null>(null);
  const [messageData, setMessageData] = useState<MessageData | null>(null);
  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [savedPageNumber, setSavedPageNumber] = useState<number | null>(null);

  const songAddData = useTempDataStore((state) => state.songAddData);
  const songMessageData = useTempDataStore((state) => state.songMessageData);
  
  // albumId가 있으면 앨범 정보 조회
  useEffect(() => {
    if (albumId) {
      setIsLoading(true);
      getAlbum(albumId)
        .then((albumData) => {
          setAlbum(albumData);
        })
        .catch((error) => {
          console.error("[Song Position] 앨범 정보 조회 실패:", error);
          // 에러 발생 시 기본값 사용
          setAlbum({
            uuid: albumId,
            title: "앨범",
            description: "",
            isPublic: true,
            musicCount: 0,
            musicCountLimit: 10,
            color: "#929292",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // albumId가 없으면 샘플 데이터 사용
      setAlbum({
        uuid: "",
        title: SAMPLE_ALBUMS[0].title,
        description: SAMPLE_ALBUMS[0].description || "",
        isPublic: SAMPLE_ALBUMS[0].isPublic,
        musicCount: SAMPLE_ALBUMS[0].musicCount,
        musicCountLimit: SAMPLE_ALBUMS[0].musicCountLimit,
        color: SAMPLE_ALBUMS[0].color,
      });
    }
  }, [albumId]);

  useEffect(() => {
    // 임시 데이터 저장소에서 노래 데이터 가져오기
    if (songAddData) {
      setSongData(songAddData);
    }
    if (songMessageData) {
      setMessageData(songMessageData);
    }

    // 데이터가 없으면 이전 페이지로 돌아가기
    if (!songAddData || !songMessageData) {
      router.push(`/song/add${albumId ? `?albumId=${albumId}` : ""}`);
    }
  }, [router, songAddData, songMessageData, albumId]);

  if (isLoading || !album || !songData || !messageData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="text-sm text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  const handleSave = async (position: LetterPosition) => {
    if (!albumId || !songData || !messageData) {
      console.error("[Song Position] 저장 실패: 필수 데이터가 없습니다.");
      return;
    }

    try {
      // 노래 추가 API 호출
      await addMusicToAlbum(albumId, {
        title: songData.title,
        artist: songData.artist,
        imageUrl: songData.imageUrl || undefined,
        message: messageData.message,
        nickname: messageData.nickname,
        positionX: position.x,
        positionY: position.y,
        pageNumber: position.pageNumber,
      });

      console.log("[Song Position] 노래 추가 성공:", {
        albumId,
        title: songData.title,
        position,
      });

      // 팝업 표시
      setSavedPageNumber(position.pageNumber);
      setShowPopup(true);
    } catch (error: any) {
      console.error("[Song Position] 노래 추가 실패:", error);
      alert("노래 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleConfirm = () => {
    // 중간 빈 페이지로 이동 (해당 페이지에서 앨범 상세로 리다이렉트)
    router.push(`/song/add/completed?albumId=${albumId}`);
  };

  const handleCancel = () => {
    // 팝업만 닫고 페이지에 그대로 있음
    setShowPopup(false);
  };

  const setShowMessageForm = useTempDataStore((state) => state.setShowMessageForm);
  
  const handleEditorCancel = () => {
    // 메시지 입력 화면으로 돌아가기 위해 플래그 설정
    setShowMessageForm(true);
    router.push("/song/add");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 pt-8">
          {/* 데스크탑에서만 보이는 타이틀 */}
          <h1 className="hidden md:block text-[40px] font-bold text-gray-900 mb-4 text-center">편지 위치 조정</h1>

          {/* 편지 위치 조정 */}
          <div className="mt-4 md:mt-8 pb-20">
            <LetterPositionEditor
              title={songData.title}
              artist={songData.artist}
              imageUrl={songData.imageUrl}
              message={messageData.message}
              nickname={messageData.nickname}
              tapeColor={album.color}
              totalPages={Math.ceil(album.musicCountLimit / 4) || 1} // 노래 개수 제한 기준으로 페이지 수 계산 (페이지당 4개 편지 가정)
              onSave={handleSave}
              onCancel={handleEditorCancel}
            />
          </div>
        </div>
      </div>

      {/* 저장 확인 팝업 */}
      {showPopup && savedPageNumber && (
        <SaveConfirmPopup
          pageNumber={savedPageNumber}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

export default function SongPositionPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="text-sm text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    }>
      <SongPositionContent />
    </Suspense>
  );
}

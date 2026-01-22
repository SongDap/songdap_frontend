"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/shared";
import { useTempDataStore } from "@/shared/store/tempDataStore";
import { LetterPositionEditor, SaveConfirmPopup } from "@/features/song/add/components";
import { SAMPLE_ALBUMS } from "@/shared/lib/mockData";

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
  const [album, setAlbum] = useState(SAMPLE_ALBUMS.find(a => a.uuid === albumId) || SAMPLE_ALBUMS[0]);
  const [showPopup, setShowPopup] = useState(false);
  const [savedPageNumber, setSavedPageNumber] = useState<number | null>(null);

  const songAddData = useTempDataStore((state) => state.songAddData);
  const songMessageData = useTempDataStore((state) => state.songMessageData);
  
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
      router.push("/song/add");
    }
  }, [router, songAddData, songMessageData]);

  if (!songData || !messageData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">데이터를 불러오는 중...</p>
        </div>
      </>
    );
  }

  const handleSave = (position: LetterPosition) => {
    // TODO: API에 노래 데이터와 위치 정보 저장
    console.log("저장할 데이터:", {
      albumId: albumId,
      song: songData,
      message: messageData,
      position: position,
    });

    // 팝업 표시
    setSavedPageNumber(position.pageNumber);
    setShowPopup(true);
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

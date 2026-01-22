"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/shared";
import { AlbumCover } from "@/shared/ui";
import { SongLetter } from "@/features/song/components";
import { useTempDataStore } from "@/shared/store/tempDataStore";
import { SAMPLE_ALBUMS } from "@/shared/lib/mockData";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { HiLockClosed } from "react-icons/hi";

type SongData = {
  title: string;
  artist: string;
  imageUrl: string;
};

type MessageData = {
  nickname: string;
  message: string;
};

export default function SongAddCompletedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");
  const { user } = useOauthStore();

  const songAddData = useTempDataStore((state) => state.songAddData);
  const songMessageData = useTempDataStore((state) => state.songMessageData);
  
  const [songData, setSongData] = useState<SongData | null>(null);
  const [messageData, setMessageData] = useState<MessageData | null>(null);
  const [album, setAlbum] = useState(SAMPLE_ALBUMS.find(a => a.uuid === albumId) || SAMPLE_ALBUMS[0]);

  useEffect(() => {
    // 임시 데이터 저장소에서 노래 데이터 가져오기
    if (songAddData) {
      setSongData(songAddData);
    }
    if (songMessageData) {
      setMessageData(songMessageData);
    }
  }, [songAddData, songMessageData]);

  // PC: 180x180, 모바일: 140x140
  const coverSizePC = 180;
  const coverSizeMobile = 140;
  const lpSizePC = coverSizePC * 0.8; // 144
  const lpSizeMobile = coverSizeMobile * 0.8; // 112

  const handleAddMoreSongs = () => {
    // 노래 추가 페이지로 이동
    router.push(`/song/add?albumId=${albumId}`);
  };

  const handleCreateAlbum = () => {
    // 앨범 생성 페이지로 이동
    router.push("/album/create");
  };

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

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 pt-8">
          {/* 데스크탑에서만 보이는 타이틀 */}
          <h1 className="hidden md:block text-[40px] font-bold text-gray-900 mb-4 text-center">
            노래를 추가했습니다
          </h1>

          <div className="mt-4 md:mt-8 flex flex-col items-center">
            {/* 앨범 카드 + 정보 섹션 */}
            <section className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              {/* 앨범 카드 */}
              <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] relative flex-shrink-0">
                {/* 모바일 버전 */}
                <div className="md:hidden">
                  <AlbumCover
                    size={coverSizeMobile}
                    backgroundColorHex={album.color}
                    imageUrl={album.imageUrl}
                    lpSize={lpSizeMobile}
                    className="w-full h-full"
                  />
                </div>
                {/* PC 버전 */}
                <div className="hidden md:block">
                  <AlbumCover
                    size={coverSizePC}
                    backgroundColorHex={album.color}
                    imageUrl={album.imageUrl}
                    lpSize={lpSizePC}
                    className="w-full h-full"
                  />
                </div>

                {/* 오른쪽 위 자물쇠 아이콘 + 곡 개수 */}
                <div className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                  {!album.isPublic && (
                    <HiLockClosed className="w-4 h-4 text-gray-700" />
                  )}
                  <span className="text-sm text-gray-700">{album.musicCount}곡</span>
                </div>
              </div>

              {/* 앨범 정보 */}
              <div className="flex flex-col gap-2 text-center md:text-left">
                {/* 앨범명 */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{album.title}</h2>
                
                {/* 앨범 설명 */}
                {album.description ? (
                  <p className="text-base text-gray-700">&ldquo;{album.description}&rdquo;</p>
                ) : (
                  <p className="text-base text-gray-500">&nbsp;</p>
                )}
                
                {/* 만든 사람 닉네임 */}
                <p className="text-sm text-gray-500">{user?.nickname || "사용자"}</p>
              </div>
            </section>

            {/* 편지 컴포넌트 */}
            <div className="w-full max-w-md mb-8">
              <SongLetter
                title={songData.title}
                artist={songData.artist}
                imageUrl={songData.imageUrl}
                message={messageData.message}
                nickname={messageData.nickname}
                date={new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                tapeColor={album.color}
              />
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={handleAddMoreSongs}
                className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors"
              >
                노래 추가하기
              </button>
              <button
                type="button"
                onClick={handleCreateAlbum}
                className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors border border-gray-300"
              >
                앨범 생성하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/shared";
import { AlbumCover } from "@/shared/ui";
import { HiLockClosed } from "react-icons/hi";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { useTempDataStore } from "@/shared/store/tempDataStore";
import { SAMPLE_ALBUMS } from "@/shared/lib/mockData";
import { SpotifySearchButton, SongCard } from "@/features/song/add/components";
import { getAlbum, addMusicToAlbum } from "@/features/album/api";
import type { AlbumResponse } from "@/features/album/api";

type AlbumInfoFromUrl = {
  id: string;
  title: string;
  color: string;
  description?: string;
  musicCount?: number;
  musicCountLimit?: number;
  createdAt?: string;
  isPublic?: boolean;
};

function AddSongContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");
  const albumDataParam = searchParams.get("albumData");
  const { user } = useOauthStore();
  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    imageUrl: "",
  });
  const [messageData, setMessageData] = useState({
    nickname: "",
    message: "",
  });
  const [showSongCard, setShowSongCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showMessageForm = useTempDataStore((state) => state.showMessageForm);
  const songAddData = useTempDataStore((state) => state.songAddData);
  const songMessageData = useTempDataStore((state) => state.songMessageData);
  const setShowMessageForm = useTempDataStore((state) => state.setShowMessageForm);
  
  // URL에서 앨범 정보 가져오기
  useEffect(() => {
    // albumId가 있으면 항상 API로 최신 정보 조회 (URL의 albumData는 초기 로딩용으로만 사용)
    if (albumId) {
      setIsLoading(true);
      
      // URL에 albumData가 있으면 먼저 표시 (빠른 로딩)
      if (albumDataParam) {
        try {
          const decodedData = decodeURIComponent(escape(atob(decodeURIComponent(albumDataParam))));
          const albumInfo: AlbumInfoFromUrl = JSON.parse(decodedData);
          
          setAlbum({
            uuid: albumInfo.id,
            title: albumInfo.title,
            description: albumInfo.description || "",
            isPublic: albumInfo.isPublic !== undefined ? albumInfo.isPublic : true,
            musicCount: albumInfo.musicCount !== undefined ? albumInfo.musicCount : 0,
            musicCountLimit: albumInfo.musicCountLimit !== undefined ? albumInfo.musicCountLimit : 10,
            color: albumInfo.color,
            createdAt: albumInfo.createdAt,
          });
        } catch (error) {
          console.error("[Song Add] URL에서 앨범 정보 디코딩 실패:", error);
        }
      }
      
      // API로 최신 정보 조회
      getAlbum(albumId)
        .then((albumData) => {
          setAlbum(albumData);
        })
        .catch((error) => {
          console.error("[Song Add] 앨범 정보 조회 실패:", error);
          // 에러 발생 시 URL 정보가 있으면 그대로 사용, 없으면 기본값
          if (!albumDataParam) {
            setAlbum({
              uuid: albumId,
              title: "앨범",
              description: "",
              isPublic: true,
              musicCount: 0,
              musicCountLimit: 10,
              color: "#929292",
            });
          }
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
  }, [albumId, albumDataParam]);
  
  // 취소 버튼으로 돌아왔을 때 메시지 입력 화면 표시
  useEffect(() => {
    if (showMessageForm) {
      // 임시 데이터 저장소에서 노래 데이터 복원
      if (songAddData) {
        setSongData(songAddData);
      }
      if (songMessageData) {
        setMessageData(songMessageData);
      }
      
      setShowSongCard(true);
      setShowMessageForm(false);
    }
  }, [showMessageForm, songAddData, songMessageData, setShowMessageForm]);

  // PC: 180x180, 모바일: 140x140
  const coverSizePC = 180;
  const coverSizeMobile = 140;
  const lpSizePC = coverSizePC * 0.8; // 144
  const lpSizeMobile = coverSizeMobile * 0.8; // 112

  const handleSongDataChange = (field: string, value: string) => {
    setSongData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMessageDataChange = (field: string, value: string) => {
    setMessageData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: 이미지 업로드 처리
      const reader = new FileReader();
      reader.onloadend = () => {
        setSongData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 로딩 중이거나 앨범 정보가 없으면 로딩 표시
  if (isLoading || !album) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="text-sm text-gray-600">앨범 정보를 불러오는 중...</p>
          </div>
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
          <h1 className="hidden md:block text-[40px] font-bold text-gray-900 mb-4 text-center">노래 추가</h1>
          
          <div className="mt-4 md:mt-8 flex flex-col items-center">
            {/* 앨범 카드 + 정보 + 버튼을 묶는 컨테이너 */}
            <div className="flex flex-col items-center md:items-start">
              {/* 앨범 카드 + 정보 섹션 */}
              <section className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                {/* 앨범 카드 */}
                <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] relative flex-shrink-0">
                  {/* 모바일 버전 */}
                  <div className="md:hidden">
                    <AlbumCover
                      size={coverSizeMobile}
                      backgroundColorHex={album.color}
                      imageUrl={undefined}
                      lpSize={lpSizeMobile}
                      className="w-full h-full"
                    />
                  </div>
                  {/* PC 버전 */}
                  <div className="hidden md:block">
                    <AlbumCover
                      size={coverSizePC}
                      backgroundColorHex={album.color}
                      imageUrl={undefined}
                      lpSize={lpSizePC}
                      className="w-full h-full"
                    />
                  </div>

                  {/* 오른쪽 위 자물쇠 아이콘 + 곡 개수 */}
                  <div className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                    {!album.isPublic && (
                      <HiLockClosed className="w-4 h-4 text-gray-700" />
                    )}
                    <span className="text-sm text-gray-700">
                      {album.musicCount !== undefined ? album.musicCount : 0}곡
                      {album.musicCountLimit !== undefined && ` / ${album.musicCountLimit}곡`}
                    </span>
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
                  
                  {/* 생성일 */}
                  {album.createdAt && (
                    <p className="text-sm text-gray-500">
                      {new Date(album.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  
                  {/* 만든 사람 닉네임 */}
                  <p className="text-sm text-gray-500">{user?.nickname || "사용자"}</p>
                </div>
              </section>
            </div>
          </div>

          {/* 노래 추가 폼 */}
          {!showSongCard && (
              <div className="max-w-2xl mx-auto mt-8">
                {/* 노래 검색하기 버튼 */}
                <div className="mb-6">
                  <SpotifySearchButton />
                </div>
                
                <form className="space-y-6">
                  {/* 노래 제목 */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">
                      노래 제목
                    </label>
                    <input
                      type="text"
                      value={songData.title}
                      onChange={(e) => handleSongDataChange("title", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
                      placeholder="노래 제목을 입력하세요"
                    />
                  </div>

                  {/* 아티스트 */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">
                      아티스트
                    </label>
                    <input
                      type="text"
                      value={songData.artist}
                      onChange={(e) => handleSongDataChange("artist", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
                      placeholder="아티스트를 입력하세요"
                    />
                  </div>

                  {/* 노래 이미지 */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">
                      노래 이미지
                    </label>
                    {/* 업로드된 이미지 미리보기 */}
                    {songData.imageUrl && (
                      <div className="mb-4 flex justify-center">
                        <div className="w-[150px] h-[150px] rounded-lg border border-gray-300 overflow-hidden relative">
                          <img
                            src={songData.imageUrl}
                            alt="노래 이미지 미리보기"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* TODO: 정사각형 부분 선택 (크롭) 기능 추가 */}
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006FFF] inline-flex items-center justify-center text-base text-gray-700 transition-colors"
                      >
                        업로드
                      </label>
                    </div>
                  </div>
                </form>

                {/* 다음 버튼 */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowSongCard(true)}
                    className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors"
                  >
                    다음
                  </button>
                </div>
              </div>
          )}

          {/* 노래 카드 */}
          {showSongCard && (
            <>
              <SongCard
                title={songData.title}
                artist={songData.artist}
                imageUrl={songData.imageUrl}
                onEdit={() => setShowSongCard(false)}
              />

              {/* 닉네임 및 메시지 입력 */}
              <div className="max-w-2xl mx-auto mt-8">
                <form className="space-y-6">
                  {/* 닉네임 */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">
                      닉네임
                    </label>
                    <input
                      type="text"
                      value={messageData.nickname}
                      onChange={(e) => handleMessageDataChange("nickname", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
                      placeholder="닉네임을 입력하세요"
                    />
                  </div>

                  {/* 전하고 싶은 메시지 */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">
                      전하고 싶은 메시지
                    </label>
                    <textarea
                      value={messageData.message}
                      onChange={(e) => handleMessageDataChange("message", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006FFF] resize-none"
                      rows={4}
                      placeholder="전하고 싶은 메시지를 입력하세요"
                    />
                  </div>
                </form>

                {/* 다음 버튼 */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!album?.uuid && !albumId) {
                        alert("앨범 정보를 불러올 수 없습니다.");
                        return;
                      }

                      // 필수 입력 검증
                      if (!songData.title.trim() || !songData.artist.trim()) {
                        alert("노래 제목과 아티스트를 입력해주세요.");
                        return;
                      }

                      if (!messageData.nickname.trim() || !messageData.message.trim()) {
                        alert("닉네임과 메시지를 입력해주세요.");
                        return;
                      }

                      setIsSubmitting(true);
                      const targetAlbumId = album?.uuid || albumId || "";

                      try {
                        // 노래 추가 API 호출
                        await addMusicToAlbum(targetAlbumId, {
                          title: songData.title,
                          artist: songData.artist,
                          imageUrl: songData.imageUrl || undefined,
                          message: messageData.message,
                          nickname: messageData.nickname,
                        });

                        // 임시 데이터 저장소에 데이터 저장 (완료 페이지에서 사용)
                        const { useTempDataStore } = require("@/shared/store/tempDataStore");
                        useTempDataStore.getState().setSongAddData(songData);
                        useTempDataStore.getState().setSongMessageData(messageData);

                        // 완료 페이지로 이동
                        router.push(`/song/add/completed?albumId=${targetAlbumId}`);
                      } catch (error: any) {
                        console.error("[Song Add] 노래 추가 실패:", error);
                        alert("노래 추가에 실패했습니다. 다시 시도해주세요.");
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "저장 중..." : "완료"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function AddSongPage() {
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
      <AddSongContent />
    </Suspense>
  );
}

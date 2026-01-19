"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared";
import { AlbumCover } from "@/shared/ui";
import { HiLockClosed } from "react-icons/hi";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { SAMPLE_ALBUMS } from "@/shared/lib/mockData";
import { SpotifySearchButton, SongCard } from "@/features/song/add/components";

export default function AddSongPage() {
  const router = useRouter();
  const { user } = useOauthStore();
  const [album, setAlbum] = useState(SAMPLE_ALBUMS[0]); // TODO: URL 파라미터나 세션에서 앨범 데이터 가져오기
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

  // 취소 버튼으로 돌아왔을 때 메시지 입력 화면 표시
  useEffect(() => {
    const showMessageForm = sessionStorage.getItem("showMessageForm");
    if (showMessageForm === "true") {
      // sessionStorage에서 노래 데이터 복원
      const storedSongData = sessionStorage.getItem("songAddData");
      const storedMessageData = sessionStorage.getItem("songMessageData");
      
      if (storedSongData) {
        setSongData(JSON.parse(storedSongData));
      }
      if (storedMessageData) {
        setMessageData(JSON.parse(storedMessageData));
      }
      
      setShowSongCard(true);
      sessionStorage.removeItem("showMessageForm");
    }
  }, []);

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
                    onClick={() => {
                      // sessionStorage에 데이터 저장
                      sessionStorage.setItem("songAddData", JSON.stringify(songData));
                      sessionStorage.setItem("songMessageData", JSON.stringify(messageData));
                      // 위치 조정 페이지로 이동
                      router.push(`/song/add/position?albumId=${album.uuid}`);
                    }}
                    className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors"
                  >
                    다음
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

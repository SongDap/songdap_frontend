"use client";

import { useState, useEffect, useRef } from "react";
import { HiX, HiLockClosed } from "react-icons/hi";
import { FiImage } from "react-icons/fi";
import { AlbumCover } from "@/shared/ui";
import { SpotifySearchButton, SongCard } from "@/features/song/add/components";
import { addMusicToAlbum } from "@/features/song/api";
import { getAlbum } from "@/features/album/api";
import { useSongAddDraft } from "@/features/song/add/hooks/useSongAddDraft";
import { trackEvent } from "@/lib/gtag";
import type { AlbumResponse } from "@/features/album/api";

interface AddSongModalProps {
  album: AlbumResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddSongModal({
  album,
  isOpen,
  onClose,
  onSuccess,
}: AddSongModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const albumId = album.uuid;
  const { draft, setSong, setMessage, setStep } = useSongAddDraft(albumId);
  const songData = draft.song;
  const messageData = draft.message;
  const showSongCard = draft.step === "message";

  // 제목, 아티스트, 이미지가 모두 추가되면 다음 버튼으로 스크롤
  useEffect(() => {
    if (songData.title.trim() && songData.artist.trim() && songData.imageUrl) {
      setTimeout(() => {
        nextButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
    }
  }, [songData.title, songData.artist, songData.imageUrl]);

  // PC: 180x180, 모바일: 140x140
  const coverSizePC = 180;
  const coverSizeMobile = 140;
  const lpSizePC = coverSizePC * 0.8; // 144
  const lpSizeMobile = coverSizeMobile * 0.8; // 112

  const handleSongDataChange = (field: "title" | "artist", value: string) => {
    setSong({ [field]: value });
  };

  const handleMessageDataChange = (field: "writer" | "message", value: string) => {
    setMessage({ [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSong({
          imageUrl: reader.result as string,
          imageFile: file,
        });
      };
      reader.readAsDataURL(file);
      trackEvent(
        { event: "upload_song_image", file_size_kb: Math.round(file.size / 1024) },
        { category: "song", action: "upload_image", label: albumId }
      );
    }
  };

  const handleClose = () => {
    setStep("form");
    setImageFile(null);
    setSong({ title: "", artist: "", imageUrl: "" });
    setMessage({ writer: "", message: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      {/* 모달 배경 클릭 시 닫기 */}
      <div
        className="absolute inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 모달 콘텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide max-w-2xl w-full">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">노래 추가</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <HiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="px-4 md:px-6 py-6">
          {/* 앨범 카드 + 정보 섹션 */}
          <section className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-6 border-b border-gray-200">
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
              <h3 className="text-lg md:text-xl font-bold text-gray-900">{album.title}</h3>

              {/* 앨범 설명 */}
              {album.description ? (
                <p className="text-base text-gray-700">&ldquo;{album.description}&rdquo;</p>
              ) : (
                <p className="text-base text-gray-500">&nbsp;</p>
              )}

              {/* 생성일 */}
              {album.createdAt && (
                <p className="text-sm text-gray-500">
                  {new Date(album.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </section>

          {/* 노래 추가 폼 */}
          {!showSongCard && (
            <div>
              {/* 노래 검색하기 버튼 */}
              <div className="mb-6">
                <SpotifySearchButton
                  onClick={() =>
                    trackEvent(
                      { event: "select_content", content_type: "spotify_search", item_id: albumId },
                      { category: "song", action: "search_click", label: albumId }
                    )
                  }
                />
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
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setSong({ imageUrl: "" });
                            if (imageInputRef.current) {
                              imageInputRef.current.value = "";
                            }
                          }}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-black rounded-full p-1 transition-colors"
                          aria-label="이미지 삭제"
                        >
                          <HiX className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-modal"
                    />
                    <label
                      htmlFor="image-upload-modal"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006FFF] inline-flex items-center justify-center gap-2 text-base text-gray-700 transition-colors"
                    >
                      <FiImage className="w-5 h-5" />
                      업로드
                    </label>
                  </div>
                </div>
              </form>

              {/* 다음 버튼 */}
              <div className="mt-8">
                <button
                  ref={nextButtonRef}
                  type="button"
                  onClick={() => {
                    if (!songData.title.trim()) {
                      alert("노래 제목을 입력해주세요.");
                      return;
                    }
                    if (!songData.artist.trim()) {
                      alert("아티스트를 입력해주세요.");
                      return;
                    }
                    trackEvent(
                      { event: "select_content", content_type: "song_add_next", item_id: albumId },
                      { category: "song", action: "next_step", label: albumId }
                    );
                    setStep("message");
                  }}
                  disabled={!songData.title.trim() || !songData.artist.trim()}
                  className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
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
                onEdit={() => {
                  setStep("form");
                  setTimeout(() => {
                    nextButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 0);
                }}
              />

              {/* 닉네임 및 메시지 입력 */}
              <div className="mt-8">
                <form className="space-y-6">
                  {/* 닉네임 */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">
                      닉네임 <span className="text-sm font-normal text-gray-500">(선택)</span>
                    </label>
                    <input
                      type="text"
                      value={messageData.writer}
                      onChange={(e) => handleMessageDataChange("writer", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
                      placeholder="닉네임을 입력하세요"
                    />
                  </div>

                  {/* 전하고 싶은 메시지 */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">
                      전하고 싶은 메시지 <span className="text-sm font-normal text-gray-500">(선택)</span>
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

                {/* 버튼 그룹 */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={async () => {
                      trackEvent(
                        { event: "select_content", content_type: "song_add_submit", item_id: albumId },
                        { category: "song", action: "add_click", label: albumId }
                      );

                      // 필수 입력 검증
                      if (!songData.title.trim() || !songData.artist.trim()) {
                        alert("노래 제목과 아티스트를 입력해주세요.");
                        return;
                      }

                      setIsSubmitting(true);

                      try {
                        // 앨범 정보 다시 조회해서 최신값 확인
                        let updatedAlbum;
                        try {
                          updatedAlbum = await getAlbum(albumId);
                        } catch (error) {
                          alert("앨범 정보를 불러올 수 없습니다. 다시 시도해주세요.");
                          setIsSubmitting(false);
                          return;
                        }
                        
                        // 1. 공개/비공개 여부 확인 (우선순위 높음)
                        if (updatedAlbum.isPublic === false) {
                          alert("앨범이 비공개로 전환되어 노래를 추가할 수 없습니다.");
                          setIsSubmitting(false);
                          return;
                        }

                        // 2. 곡 개수 초과 확인
                        if (updatedAlbum.canAdd === false) {
                          alert("앨범의 곡 개수가 초과되어 노래를 추가할 수 없습니다.");
                          setIsSubmitting(false);
                          return;
                        }

                        // 3. 노래 추가 API 호출
                        await addMusicToAlbum(albumId, {
                          title: songData.title,
                          artist: songData.artist,
                          message: messageData.message.trim() || undefined,
                          writer: messageData.writer.trim() || undefined,
                          imageFile: imageFile || undefined,
                        });

                        // 완료 이벤트 추적
                        const songKey = `song:${albumId}:${songData.title.trim()}-${songData.artist.trim()}`;
                        trackEvent(
                          { event: "add_to_cart", items: [{ item_id: songKey }] },
                          { category: "song", action: "add", label: albumId }
                        );

                        // 성공 콜백
                        handleClose();
                        if (onSuccess) {
                          onSuccess();
                        }

                        alert("노래가 추가되었습니다!");

                      } finally {
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
    </div>
  );
}

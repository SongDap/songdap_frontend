"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { HiMail, HiMusicNote, HiInformationCircle, HiX, HiChevronDown, HiLockClosed } from "react-icons/hi";
import { HiArrowPath } from "react-icons/hi2";

import { getAlbumMusics, deleteMusic } from "@/features/song/api";
import type { MusicInfo } from "@/features/song/api";
import { SongCard } from "@/features/song/add/components";
import AddSongModal from "@/features/song/add/components/AddSongModal";
import { PageHeader } from "@/shared";
import { makeAlbumListUrl, parseAlbumListQuery } from "@/features/album/list/lib/albumListQuery";
import { trackEvent } from "@/lib/gtag";

import { useAlbumDetail } from "../hooks/useAlbumDetail";
import { DESKTOP_FIXED_WIDTH_CLASS, MUSIC_SORT_OPTIONS } from "../constants";
import MusicPlayer from "./MusicPlayer";
import AlbumDetailHeaderTitle from "./AlbumDetailHeaderTitle";
import SongLetterItem from "./SongLetterItem";
import AlbumInfoModal from "./AlbumInfoModal";
import AutoPlayFailedModal from "./AutoPlayFailedModal";

export default function AlbumDetailContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const albumUuid = id ?? "";

  const {
    albumQuery,
    album,
    musicsQuery,
    musics,
    isOwner,
    canAdd,
    todayLabel,
    viewMode,
    setViewMode,
    currentSong,
    setCurrentSong,
    isSongAddModalOpen,
    setIsSongAddModalOpen,
    expandTrigger,
    autoPlayTrigger,
    isAutoPlayMode,
    setIsAutoPlayMode,
    isAutoPlayPending,
    setIsAutoPlayPending,
    showAutoPlayFailedModal,
    setShowAutoPlayFailedModal,
    musicSort,
    setMusicSort,
    isSortOpen,
    setIsSortOpen,
    isAlbumInfoOpen,
    setIsAlbumInfoOpen,
    isAlbumInfoEditMode,
    tempIsPublic,
    setTempIsPublic,
    isVisibilityUpdating,
    playerListRef,
    sentinelRef,
    sortMenuRef,
    handleSelectSong,
    handlePrevious,
    handleNext,
    handleVisibilityToggle,
    currentSortLabel,
  } = useAlbumDetail(albumUuid);

  if (albumQuery.isLoading) {
    return (
      <>
        <PageHeader title="로딩 중..." />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">앨범 정보를 불러오는 중...</p>
        </div>
      </>
    );
  }

  if (!album) {
    return (
      <>
        <PageHeader title="앨범을 찾을 수 없습니다" showLogo={true} showBackButton={false} />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">삭제된 앨범입니다.</p>
        </div>
      </>
    );
  }

  if (!album.isPublic && isOwner !== true) {
    return (
      <>
        <PageHeader title="비공개 앨범" showLogo={true} showBackButton={false} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <HiLockClosed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-800 mb-2">비공개 앨범입니다.</p>
            <p className="text-gray-600 mb-8">앨범 주인만 접근할 수 있습니다.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#006FFF] text-white font-semibold rounded-xl hover:bg-[#0056CC] active:bg-[#0044AA] transition-colors"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </>
    );
  }

  const backHref = makeAlbumListUrl(parseAlbumListQuery(searchParams));
  const headerTitle = (
    <AlbumDetailHeaderTitle
      musicCount={album.musicCount ?? 0}
      musicCountLimit={album.musicCountLimit ?? 15}
      title={album.title}
    />
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <PageHeader
          title={headerTitle}
          isPublic={album.isPublic}
          showBackButton={isOwner === true}
          showLogo={isOwner !== true}
          backHref={backHref}
          backgroundColor={album.color}
          rightAction={
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(false);
                setIsAlbumInfoOpen(true);
              }}
              className="p-1 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors flex-shrink-0"
              aria-label="앨범 정보"
            >
              <HiInformationCircle className="w-5 h-5 text-gray-800" />
            </button>
          }
        />
      </div>

      {isAlbumInfoOpen && album && (
        <AlbumInfoModal
          album={album}
          isOwner={isOwner}
          isEditMode={isAlbumInfoEditMode}
          tempIsPublic={tempIsPublic}
          isVisibilityUpdating={isVisibilityUpdating}
          onClose={() => setIsAlbumInfoOpen(false)}
          onStartEdit={() => {
            setIsAlbumInfoEditMode(true);
            setTempIsPublic(album.isPublic);
          }}
          onCancelEdit={() => {
            setIsAlbumInfoEditMode(false);
            setTempIsPublic(album.isPublic);
          }}
          onTempIsPublicChange={setTempIsPublic}
          onVisibilityToggle={handleVisibilityToggle}
        />
      )}

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div
          className="flex-1 min-h-0 overflow-hidden flex flex-col"
          style={{ background: `linear-gradient(to bottom, ${album.color}, ${album.color})` }}
        >
          <div
            className="flex-1 min-h-0 overflow-hidden flex flex-col"
            style={{ background: "rgba(255, 255, 255, 0.8)" }}
          >
            <div className={`w-full flex-1 min-h-0 overflow-hidden flex flex-col ${DESKTOP_FIXED_WIDTH_CLASS}`}>
              <div className="flex-1 min-h-0 px-0 pb-0">
                <div className="relative h-full rounded-3xl bg-white/90 backdrop-blur-md border border-white/60 overflow-hidden flex flex-col">
                  {/* 상단: 탭 + 연속 재생 + 정렬 */}
                  <div className="flex items-center justify-center px-4 pt-3 pb-2 flex-shrink-0">
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="inline-flex p-1 rounded-full bg-gray-200">
                          <button
                            onClick={() => setViewMode("player")}
                            className={`p-2 md:p-2.5 rounded-full transition-colors ${
                              viewMode === "player"
                                ? "bg-[#006FFF] text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                            aria-label="뮤직플레이어"
                          >
                            <HiMusicNote className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => setViewMode("letter")}
                            className={`p-2 md:p-2.5 rounded-full transition-colors ${
                              viewMode === "letter"
                                ? "bg-[#006FFF] text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                            aria-label="편지"
                          >
                            <HiMail className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isAutoPlayMode}
                          aria-label="연속 재생"
                          onClick={() => setIsAutoPlayMode((v) => !v)}
                          className={`p-2 md:p-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2 ${
                            isAutoPlayMode
                              ? "bg-[#006FFF] text-white shadow-sm"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <HiArrowPath className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
                        {isOwner !== true && canAdd === true && (
                          <button
                            onClick={() => {
                              trackEvent(
                                {
                                  event: "select_content",
                                  content_type: "song_add_from_detail",
                                  item_id: albumUuid,
                                },
                                { category: "song", action: "add_click", label: albumUuid }
                              );
                              setIsSongAddModalOpen(true);
                            }}
                            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full bg-[#006FFF] text-white hover:bg-[#0056CC] active:bg-[#0044AA] transition-colors flex-shrink-0"
                            aria-label="노래 추가"
                          >
                            + 노래 추가
                          </button>
                        )}
                        {isOwner !== true && canAdd === false && (
                          <span className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full bg-gray-100 text-gray-600 flex-shrink-0 max-w-[150px] md:max-w-none text-center">
                            앨범의 곡 개수를<br className="md:hidden" /> 초과하였습니다.
                          </span>
                        )}

                        <div ref={sortMenuRef} className="relative w-[100px] md:w-[130px] flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsSortOpen((v) => !v)}
                            className="w-full px-2 py-1.5 md:px-3 md:py-2 text-xs rounded-full border border-gray-300 bg-white/90 text-gray-800 flex items-center justify-between gap-1 focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
                            aria-label="노래 목록 정렬"
                            aria-haspopup="listbox"
                            aria-expanded={isSortOpen}
                          >
                            <span className="truncate text-xs">{currentSortLabel}</span>
                            <HiChevronDown
                              className={`w-3 h-3 flex-shrink-0 transition-transform ${
                                isSortOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isSortOpen && (
                            <div
                              className="absolute right-0 top-full mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg z-30 overflow-hidden"
                              role="listbox"
                            >
                              <div className="max-h-56 overflow-y-auto scrollbar-hide py-1">
                                {MUSIC_SORT_OPTIONS.map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    role="option"
                                    aria-selected={opt.value === musicSort}
                                    onClick={() => {
                                      setMusicSort(opt.value);
                                      setIsSortOpen(false);
                                      playerListRef.current?.scrollTo({ top: 0, behavior: "auto" });
                                    }}
                                    className={`w-full px-3 py-2 text-left text-xs md:text-sm transition-colors ${
                                      opt.value === musicSort
                                        ? "bg-blue-50 text-[#006FFF]"
                                        : "text-gray-800 hover:bg-gray-50"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {viewMode === "player" && (
                    <div
                      ref={playerListRef}
                      className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-0 pt-0 pb-40 md:pb-44"
                    >
                      <div className="flex flex-col">
                        {!musicsQuery.isLoading && musics.length === 0 ? (
                          <div className="py-16 px-6 text-center text-gray-600">
                            추가된 노래가 없습니다.
                          </div>
                        ) : (
                          <>
                            {musics.map((music: MusicInfo, idx: number) => {
                              const isActive = currentSong?.uuid === music.uuid;
                              const isFirst = idx === 0;
                              const isLast = idx === musics.length - 1;
                              const separatorPlacement =
                                musics.length <= 1
                                  ? "bottom"
                                  : isFirst
                                    ? "none"
                                    : isLast
                                      ? "topBottom"
                                      : "top";
                              return (
                                <div key={music.uuid} data-music-uuid={music.uuid}>
                                  <SongCard
                                    title={music.title}
                                    artist={music.artist ?? ""}
                                    imageUrl={music.image ?? null}
                                    backgroundOpacity={0.4}
                                    fullWidth={true}
                                    showPlayButton={currentSong?.uuid === music.uuid}
                                    isActive={isActive}
                                    separatorPlacement={separatorPlacement}
                                    separatorColor={album.color}
                                    onCardClick={() => handleSelectSong(music, false)}
                                    onPlay={() => handleSelectSong(music, true)}
                                    onDelete={
                                      isOwner === true
                                        ? () => {
                                            if (
                                              confirm(
                                                `${music.artist}의 "${music.title}"을 삭제하시겠습니까?`
                                              )
                                            ) {
                                              deleteMusic(music.uuid)
                                                .then(async () => {
                                                  setCurrentSong(null);
                                                  await Promise.all([
                                                    albumQuery.refetch(),
                                                    musicsQuery.refetch(),
                                                  ]);
                                                  requestAnimationFrame(() => {
                                                    (document.activeElement as HTMLElement)?.blur();
                                                  });
                                                })
                                                .catch(() => {
                                                  alert("노래 삭제 중 오류가 발생했습니다.");
                                                });
                                            }
                                          }
                                        : undefined
                                    }
                                  />
                                </div>
                              );
                            })}
                          </>
                        )}
                        <div ref={sentinelRef} className="h-10" />
                      </div>
                    </div>
                  )}

                  {viewMode === "letter" && (
                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-6 md:px-4 pt-4 pb-28">
                      <div className="flex flex-col gap-8">
                        {!musicsQuery.isLoading && musics.length === 0 ? (
                          <div className="py-16 px-6 text-center text-gray-600">
                            추가된 노래가 없습니다.
                          </div>
                        ) : (
                          <>
                            {musics.map((music: MusicInfo) => (
                              <SongLetterItem
                                key={music.uuid}
                                music={music}
                                todayLabel={todayLabel}
                                tapeColor={album.color}
                                isOwner={isOwner}
                              />
                            ))}
                          </>
                        )}
                        <div ref={sentinelRef} className="h-10" />
                      </div>
                    </div>
                  )}

                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/95 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAutoPlayPending && currentSong && viewMode === "player" && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[95] px-4 py-2.5 rounded-full bg-gray-900/90 text-white text-sm font-medium shadow-lg"
          role="status"
          aria-live="polite"
        >
          재생 중입니다. 잠시 기다려주세요.
        </div>
      )}

      {currentSong && (
        <MusicPlayer
          title={currentSong.title}
          artist={currentSong.artist}
          videoId={currentSong.videoId}
          imageUrl={currentSong.imageUrl}
          message={currentSong.message}
          nickname={currentSong.nickname}
          backgroundColor={album.color}
          hideUI={viewMode !== "player"}
          isOwner={isOwner}
          onClose={() => setCurrentSong(null)}
          onPrevious={() => handlePrevious(isAutoPlayMode)}
          onNext={() => handleNext(isAutoPlayMode)}
          onNextAndPlay={() => handleNext(true)}
          onAutoPlayNextFailed={() => setShowAutoPlayFailedModal(true)}
          autoPlayNext={isAutoPlayMode}
          isPlayButtonDisabled={isAutoPlayPending}
          onPlayPending={setIsAutoPlayPending}
          playDelayMs={isAutoPlayMode ? 1000 : 500}
          expandTrigger={expandTrigger}
          autoPlayTrigger={autoPlayTrigger}
        />
      )}

      {showAutoPlayFailedModal && (
        <AutoPlayFailedModal
          onRetry={() => {
            setShowAutoPlayFailedModal(false);
            handleNext(true);
          }}
          onCancel={() => {
            setShowAutoPlayFailedModal(false);
            setIsAutoPlayMode(false);
          }}
        />
      )}

      {isSongAddModalOpen && album && (
        <AddSongModal
          album={album}
          isOpen={isSongAddModalOpen}
          onClose={() => setIsSongAddModalOpen(false)}
          onRefresh={() => {
            albumQuery.refetch();
            musicsQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

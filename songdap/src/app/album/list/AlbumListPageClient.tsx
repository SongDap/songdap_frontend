"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, Footer } from "@/shared";
import { trackEvent } from "@/lib/gtag";
import Link from "next/link";
import { ROUTES } from "@/shared/lib";
import { AlbumCard } from "@/features/album/list/components";
import { HiChevronLeft, HiChevronRight, HiPencil, HiX, HiLockOpen, HiLockClosed, HiLink } from "react-icons/hi";
import { getAlbums, getAlbum, deleteAlbum, updateAlbumVisibility, type AlbumListItem } from "@/features/album/api";
import { AlbumCover } from "@/shared/ui";
import { buildAlbumShareUrlFromAlbumInfo } from "@/shared/lib/songAddLink";
import { shareKakaoFeed } from "@/shared/lib/kakaoShare";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import {
  ALBUM_LIST_SORT_LABELS,
  makeAlbumDetailUrl,
  makeAlbumListUrl,
} from "@/features/album/list/lib/albumListQuery";
import { useAlbumListUrlState } from "@/features/album/list/hooks/useAlbumListUrlState";

type AlbumListItemEnriched = AlbumListItem & {
  description?: string;
  isPublic?: boolean;
  musicCount?: number;
  musicCountLimit?: number;
  createdAt?: string;
  color?: string; // 백엔드에서 상세값을 우선
  title?: string;
};

const isAxiosStatus = (err: unknown, status: number) => {
  const e = err as any;
  return e?.response?.status === status;
};

export default function AlbumListPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [albums, setAlbums] = useState<AlbumListItemEnriched[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlbumInfoOpen, setIsAlbumInfoOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isAlbumInfoEditMode, setIsAlbumInfoEditMode] = useState(false);
  const [tempIsPublic, setTempIsPublic] = useState(false);
  const [isVisibilityUpdating, setIsVisibilityUpdating] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const user = useOauthStore((s) => s.user);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const fetchSeqRef = useRef(0);

  const itemsPerPage = 4; // 한 페이지에 표시할 앨범 개수

  const { sortLabel, sortApi, currentPage, setCurrentPage, handleSortChange } =
    useAlbumListUrlState({
      searchParams,
      onReplaceUrl: (url) => router.replace(url),
      makeListUrl: makeAlbumListUrl,
    });

  // 앨범 데이터 포맷팅 헬퍼 함수
  const enrichAlbumData = (baseItems: AlbumListItem[], detailResults: PromiseSettledResult<any>[]): AlbumListItemEnriched[] => {
    const detailMap = new Map<string, any>();
    const forbiddenSet = new Set<string>();

    detailResults.forEach((r) => {
      if (r.status === "fulfilled" && r.value?.uuid) {
        detailMap.set(r.value.uuid, r.value);
        return;
      }
      if (r.status === "rejected") {
        const idx = detailResults.indexOf(r);
        const albumUuid = baseItems[idx]?.uuid;
        if (albumUuid && isAxiosStatus(r.reason, 403)) {
          forbiddenSet.add(albumUuid);
        }
      }
    });

    return baseItems.map((a) => {
      const d = detailMap.get(a.uuid);
      return {
        ...a,
        title: d?.title ?? a.title,
        color: d?.color ?? a.color,
        description: d?.description,
        isPublic: d?.isPublic ?? (forbiddenSet.has(a.uuid) ? false : undefined),
        musicCount: d?.musicCount,
        musicCountLimit: d?.musicCountLimit,
        createdAt: d?.createdAt,
      };
    });
  };

  // 앨범 삭제 헬퍼 함수
  const handleAlbumDelete = async (id: string) => {
    try {
      const currentSortApi = sortApi;
      const currentPageNum = currentPage;

      await deleteAlbum(id);
      setIsLoading(true);

      const pageData = await getAlbums(currentSortApi, currentPageNum - 1, itemsPerPage);
      const base = pageData.content ?? [];
      const details = await Promise.allSettled(base.map((a) => getAlbum(a.uuid)));
      
      setAlbums(enrichAlbumData(base, details));
      setTotalElements(pageData.totalElements);
      setTotalPages(pageData.totalPages);
      setIsEditMode(false);

      // 페이지가 비어있으면 이전 페이지로 이동
      if (pageData.content.length === 0 && currentPageNum > 1) {
        const prevPage = currentPageNum - 1;
        setCurrentPage(prevPage);
        await fetchAlbums(prevPage);
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error("[Album List] 앨범 삭제 실패:", error);
      setIsLoading(false);
      alert("앨범 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 앨범 목록 조회 함수 (재사용 가능)
  const fetchAlbums = useCallback(
    async (targetPage?: number) => {
      const seq = ++fetchSeqRef.current;
      const page = targetPage ?? currentPage;

      setIsLoading(true);

      try {
        // 백엔드 API는 0부터 시작하는 페이지 번호를 사용하므로 page - 1
        const pageData = await getAlbums(sortApi, page - 1, itemsPerPage);

        // 목록 API가 간소화되어 있으면, 카드 표시용으로 상세를 추가 로드
        const baseItems = pageData.content ?? [];
        const detailResults = await Promise.allSettled(baseItems.map((a) => getAlbum(a.uuid)));

        const enriched = enrichAlbumData(baseItems, detailResults);

        if (fetchSeqRef.current === seq) {
          setAlbums(enriched);
        }
        if (baseItems.length > 0) {
          trackEvent(
            {
              event: "view_item_list",
              item_list_name: "album_list",
              items: baseItems
                .filter((item) => Boolean(item.uuid))
                .map((item) => ({ item_id: item.uuid })),
            },
            { category: "album", action: "view_list", label: String(page) }
          );
        }
        setTotalElements(pageData.totalElements);
        setTotalPages(pageData.totalPages);

        // 페이지가 비어있고 첫 페이지가 아니면 이전 페이지로 이동
        if (pageData.content.length === 0 && page > 1) {
          const prevPage = page - 1;
          setCurrentPage(prevPage);
          await fetchAlbums(prevPage);
          return;
        }

        if (page !== currentPage) {
          setCurrentPage(page);
        }
      } catch (err: any) {
        console.error("[Album List] 앨범 목록 조회 실패:", err);
        setAlbums([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, sortApi, setCurrentPage]
  );

  // API에서 앨범 목록 가져오기
  useEffect(() => {
    fetchAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortApi, currentPage]);

  // 스와이프 감지 함수
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
    if (isRightSwipe && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // 페이지네이션: 페이지 번호는 최대 5개만 노출 (너무 길어지는 문제 방지)
  const PAGE_WINDOW = 5;
  const pageStart = Math.floor((currentPage - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;
  const pageEnd = Math.min(totalPages, pageStart + PAGE_WINDOW - 1);
  const visiblePages = Array.from(
    { length: Math.max(0, pageEnd - pageStart + 1) },
    (_, i) => pageStart + i
  );

  return (
    <>
      <Header />
      <div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 pt-8 pb-[100px]">
          <section className="mb-8">
            {/* PC 버전: 기존 레이아웃 */}
            <div className="hidden md:flex items-end gap-4">
              <div>
                <h1 className="text-[50px] font-bold">내 앨범</h1>
                <p className="text-[15px] mt-2">친구들의 노래가 담길 앨범을 만들어보세요.</p>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Link href={ROUTES.ALBUM.CREATE}>
                  <button
                    onClick={() =>
                      trackEvent(
                        { event: "select_content", content_type: "cta", item_id: "album_create" },
                        { category: "album", action: "create_click", label: "album_list_pc" }
                      )
                    }
                    className="px-4 py-2 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] transition-colors"
                  >
                    + 새 앨범 만들기
                  </button>
                </Link>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-colors flex items-center gap-1.5 ${
                    isEditMode
                      ? "text-[#006FFF] font-medium"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <HiPencil className="w-4 h-4" />
                  <span>편집</span>
                </button>
              </div>
            </div>

            {/* 모바일 버전: 새로운 레이아웃 */}
            <div className="flex flex-col gap-2 md:hidden">
              <p className="text-[15px]">친구들의 노래가 담길 앨범을 만들어보세요.</p>
              <div className="flex justify-end gap-2">
                <Link href={ROUTES.ALBUM.CREATE}>
                  <button
                    onClick={() =>
                      trackEvent(
                        { event: "select_content", content_type: "cta", item_id: "album_create" },
                        { category: "album", action: "create_click", label: "album_list_mobile" }
                      )
                    }
                    className="px-4 py-2 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] transition-colors"
                  >
                    + 새 앨범 만들기
                  </button>
                </Link>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-colors flex items-center gap-1.5 ${
                    isEditMode
                      ? "text-[#006FFF] font-medium"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <HiPencil className="w-4 h-4" />
                  <span>편집</span>
                </button>
              </div>
            </div>
          </section>

          {/* 앨범 리스트 섹션 */}
          <section>
            {/* 총 앨범 개수 및 정렬 옵션 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-base text-gray-900">
                총 <span className="font-bold">{totalElements}</span>개
              </p>
              <div className="flex items-center gap-1 md:gap-2">
                {ALBUM_LIST_SORT_LABELS.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm rounded-lg transition-colors ${
                      sortLabel === option
                        ? "text-[#006FFF] font-medium"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="flex items-center justify-center min-h-[540px] lg:min-h-[420px]">
                <p className="text-gray-700">앨범 목록을 불러오는 중...</p>
              </div>
            )}

            {/* 앨범 리스트 그리드 */}
            {!isLoading && (
              <div
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 min-h-[540px] lg:min-h-[420px]"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {albums.length > 0 ? (
                  albums.map((album) => (
                    <AlbumCard
                      key={album.uuid}
                      id={album.uuid}
                      albumName={album.title ?? ""}
                      albumColor={album.color ?? "#808080"}
                      isPublic={album.isPublic ?? true}
                      songCount={album.musicCount ?? 0}
                      musicCountLimit={album.musicCountLimit}
                      href={makeAlbumDetailUrl(album.uuid, { sort: sortApi, page: currentPage })}
                      imageUrl={null}
                      createdAt={album.createdAt ? String(album.createdAt).slice(0, 10) : ""}
                      description={album.description}
                      isEditMode={isEditMode}
                      onDelete={(id) => handleAlbumDelete(id)}
                      onEdit={(id) => {
                        // 앨범 정보 페이지로 이동 (앨범 상세보기 API로 데이터 조회)
                        router.push(`${ROUTES.ALBUM.SHARE}?mode=info&albumId=${id}`);
                      }}
                      onInfoClick={(id) => {
                        setSelectedAlbumId(id);
                        setIsAlbumInfoOpen(true);
                        // 선택된 앨범의 공개 여부로 초기화
                        const selectedAlbum = albums.find(a => a.uuid === id);
                        if (selectedAlbum?.isPublic !== undefined) {
                          setTempIsPublic(selectedAlbum.isPublic);
                        }
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-2 lg:col-span-4 flex items-center justify-center min-h-[540px] lg:min-h-[420px]">
                    <p className="text-gray-700">앨범이 없습니다.</p>
                  </div>
                )}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                {/* 이전 페이지 버튼 */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, pageStart - PAGE_WINDOW))}
                  disabled={pageStart === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="이전 페이지 묶음"
                >
                  <HiChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                {/* 페이지 번호 */}
                <div className="flex items-center gap-2">
                  {visiblePages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                        currentPage === page
                          ? "text-[#006FFF] font-semibold"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* 다음 페이지 버튼 */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, pageStart + PAGE_WINDOW))}
                  disabled={pageEnd === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="다음 페이지 묶음"
                >
                  <HiChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
      
      {/* 앨범 정보 모달 */}
      {isAlbumInfoOpen && selectedAlbumId && (
        <>
          {/* 백드롭 */}
          <div
            className="fixed inset-0 bg-black/40 z-[120]"
            onClick={() => setIsAlbumInfoOpen(false)}
          />
          {/* 모달 */}
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div
              className="w-full lg:max-w-md bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative px-4 py-3 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 text-center">앨범 정보</h2>
                <button
                  type="button"
                  onClick={() => setIsAlbumInfoOpen(false)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                  aria-label="닫기"
                >
                  <HiX className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="p-5">
                {!isAlbumInfoEditMode ? (
                  <>
                    {(() => {
                      const album = albums.find(a => a.uuid === selectedAlbumId);
                      if (!album) return null;
                      
                      return (
                        <>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <AlbumCover
                                size={92}
                                backgroundColorHex={album.color || "#808080"}
                                imageUrl={undefined}
                                lpSize={92 * 0.8}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    album.isPublic
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-gray-100 text-gray-700 border-gray-300"
                                  }`}
                                >
                                  {album.isPublic ? "공개" : "비공개"}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {album.musicCount || 0}/{album.musicCountLimit || 15}곡
                                </span>
                              </div>

                              <div className="mt-2 text-lg font-bold text-gray-900 break-words">
                                {album.title}
                              </div>

                              {album.createdAt && (
                                <div className="mt-1 text-xs text-gray-500">
                                  {String(album.createdAt).slice(0, 10)}
                                </div>
                              )}
                            </div>
                          </div>

                          {album.description && (
                            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto scrollbar-hide">
                              {album.description}
                            </div>
                          )}

                          {/* 공유 버튼 */}
                          <div className="mt-5 flex items-center justify-center gap-3">
                            {/* 링크 복사하기 */}
                            <button
                              onClick={() => {
                                // 비공개 앨범 체크
                                if (!album.isPublic) {
                                  setShowPrivateModal(true);
                                  return;
                                }
                                const shareUrl = buildAlbumShareUrlFromAlbumInfo({
                                  id: album.uuid,
                                  title: album.title || "",
                                  color: album.color || "#808080",
                                  description: album.description || "",
                                  musicCount: album.musicCount || 0,
                                  musicCountLimit: album.musicCountLimit || 15,
                                  createdAt: album.createdAt || "",
                                  isPublic: album.isPublic || true,
                                });
                                navigator.clipboard.writeText(shareUrl).then(() => {
                                  setIsLinkCopied(true);
                                  setTimeout(() => setIsLinkCopied(false), 2000);
                                });
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                            >
                              <HiLink className="w-4 h-4" />
                              <span>{isLinkCopied ? "복사됨!" : "복사"}</span>
                            </button>

                            {/* 카카오톡으로 공유하기 */}
                            <button
                              onClick={async () => {
                                // 비공개 앨범 체크
                                if (!album.isPublic) {
                                  setShowPrivateModal(true);
                                  return;
                                }
                                try {
                                  const shareUrl = buildAlbumShareUrlFromAlbumInfo({
                                    id: album.uuid,
                                    title: album.title || "",
                                    color: album.color || "#808080",
                                    description: album.description || "",
                                    musicCount: album.musicCount || 0,
                                    musicCountLimit: album.musicCountLimit || 15,
                                    createdAt: album.createdAt || "",
                                    isPublic: album.isPublic || true,
                                  });
                                  const nickname = user?.nickname ?? "누군가";
                                  await shareKakaoFeed({
                                    title: album.title || "",
                                    description: `"${nickname}"님의 앨범에 노래를 추가해주세요♪`,
                                    url: shareUrl,
                                    imageUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/images/logo.png`,
                                    buttonTitle: "노래 추가하기",
                                  });
                                } catch (err) {
                                  console.error("카카오 공유 실패:", err);
                                }
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FEE500] rounded-lg text-sm text-gray-900 hover:bg-[#FDD835] active:bg-[#FBC02D] transition-colors font-medium"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 0C4.48 0 0 3.84 0 8.57c0 3.04 1.92 5.72 4.8 7.28l-.96 3.6c-.16.6.48 1.04 1 .72l4.4-2.52c.48.08.96.12 1.48.12 5.52 0 10-3.84 10-8.57C20 3.84 15.52 0 10 0z"
                                  fill="#000000"
                                />
                              </svg>
                              <span>공유</span>
                            </button>
                          </div>

                          <div className="mt-5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAlbumInfoEditMode(true);
                                setTempIsPublic(album.isPublic || true);
                              }}
                              className="w-full py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-semibold transition-colors"
                            >
                              수정하기
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <>
                    {(() => {
                      const album = albums.find(a => a.uuid === selectedAlbumId);
                      if (!album) return null;
                      
                      return (
                        <>
                          {/* 공개 여부 수정 폼 */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <label className="text-base font-medium text-gray-900">
                                공개설정
                              </label>
                              <div className="flex items-center gap-3">
                                {tempIsPublic ? (
                                  <>
                                    <span className="text-base text-gray-700">공개</span>
                                    <HiLockOpen className="w-5 h-5 text-gray-700" />
                                  </>
                                ) : (
                                  <>
                                    <span className="text-base text-gray-700">비공개</span>
                                    <HiLockClosed className="w-5 h-5 text-gray-700" />
                                  </>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setTempIsPublic(!tempIsPublic)}
                                  disabled={isVisibilityUpdating}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    tempIsPublic ? "bg-[#006FFF]" : "bg-gray-300"
                                  }`}
                                  role="switch"
                                  aria-checked={tempIsPublic}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      tempIsPublic ? "translate-x-6" : "translate-x-1"
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 text-left">
                              {tempIsPublic ? "다른 사용자에게 앨범이 공개됩니다." : "다른 사용자에게 앨범이 공개되지 않습니다."}
                            </p>
                          </div>

                          <div className="mt-6 flex gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                if (!selectedAlbumId || !album) return;
                                
                                setIsVisibilityUpdating(true);
                                try {
                                  await updateAlbumVisibility(selectedAlbumId, tempIsPublic);
                                  // 앨범 목록 업데이트
                                  setAlbums(prev =>
                                    prev.map(a =>
                                      a.uuid === selectedAlbumId ? { ...a, isPublic: tempIsPublic } : a
                                    )
                                  );
                                  setIsAlbumInfoEditMode(false);
                                  setIsEditMode(false); // 수정 후 편집 모드 해제
                                } catch (error) {
                                  console.error("앨범 공개 여부 수정 실패:", error);
                                } finally {
                                  setIsVisibilityUpdating(false);
                                }
                              }}
                              disabled={isVisibilityUpdating || tempIsPublic === (albums.find(a => a.uuid === selectedAlbumId)?.isPublic)}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-[#006FFF] text-white text-sm font-semibold hover:bg-[#0056CC] active:bg-[#0044AA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isVisibilityUpdating ? "저장 중..." : "저장"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAlbumInfoEditMode(false);
                                setTempIsPublic(album.isPublic || true);
                              }}
                              disabled={isVisibilityUpdating}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm font-semibold transition-colors"
                            >
                              취소
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 비공개 앨범 모달 */}
      {showPrivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">공유 불가</h2>
            <p className="text-gray-600 mb-6">
              비공개 앨범은 공유가 불가합니다.<br />
              공개 여부를 변경해주세요.
            </p>
            <button
              onClick={() => setShowPrivateModal(false)}
              className="w-full py-2.5 px-4 bg-[#006FFF] text-white rounded-lg font-medium hover:bg-[#0056CC] active:bg-[#0044AA] transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}


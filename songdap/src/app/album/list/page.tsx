"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, Footer } from "@/shared";
import Link from "next/link";
import { ROUTES } from "@/shared/lib";
import { AlbumCard } from "@/features/album/list/components";
import { HiChevronLeft, HiChevronRight, HiPencil } from "react-icons/hi";
import { getAlbums, getAlbum, deleteAlbum, type AlbumListItem } from "@/features/album/api";
import { ALBUM_LIST_SORT_LABELS, makeAlbumDetailUrl, makeAlbumListUrl } from "@/features/album/list/lib/albumListQuery";
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

export default function AlbumListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [albums, setAlbums] = useState<AlbumListItemEnriched[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  
  // 앨범 목록 조회 함수 (재사용 가능)
  const fetchAlbums = useCallback(async (targetPage?: number) => {
    const seq = ++fetchSeqRef.current;
    const page = targetPage ?? currentPage;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 백엔드 API는 0부터 시작하는 페이지 번호를 사용하므로 page - 1
      const pageData = await getAlbums(
        sortApi,
        page - 1,
        itemsPerPage
      );
      
      // 목록 API가 간소화되어 있으면, 카드 표시용으로 상세를 추가 로드
      const baseItems = pageData.content ?? [];
      const detailResults = await Promise.allSettled(
        baseItems.map((a) => getAlbum(a.uuid))
      );

      const detailMap = new Map<string, any>();
      const forbiddenSet = new Set<string>();
      detailResults.forEach((r) => {
        if (r.status === "fulfilled" && r.value?.uuid) {
          detailMap.set(r.value.uuid, r.value);
          return;
        }
        if (r.status === "rejected") {
          // 상세 조회가 403이면(권한 없음) 해당 앨범은 비공개로 추정 가능
          // -> 자물쇠 아이콘이 안 사라지게 최소한 isPublic=false로 표시
          // NOTE: 인증 자체가 깨진 경우엔 전부 403일 수도 있으니, 그 땐 전부 잠김으로 보일 수 있음.
          // 그래도 "비공개 앨범 잠금 표시"가 사라지는 문제는 해결됨.
          const idx = detailResults.indexOf(r);
          const albumUuid = baseItems[idx]?.uuid;
          if (albumUuid && isAxiosStatus(r.reason, 403)) {
            forbiddenSet.add(albumUuid);
          }
        }
      });

      const enriched: AlbumListItemEnriched[] = baseItems.map((a) => {
        const d = detailMap.get(a.uuid);
        return {
          ...a,
          // 상세값이 있으면 우선 사용
          title: d?.title ?? a.title,
          color: d?.color ?? a.color,
          description: d?.description,
          isPublic: d?.isPublic ?? (forbiddenSet.has(a.uuid) ? false : undefined),
          musicCount: d?.musicCount,
          musicCountLimit: d?.musicCountLimit,
          createdAt: d?.createdAt,
        };
      });

      if (fetchSeqRef.current === seq) {
        setAlbums(enriched);
      }
      setTotalElements(pageData.totalElements);
      setTotalPages(pageData.totalPages);
      
      // 페이지가 비어있고 첫 페이지가 아니면 이전 페이지로 이동
      if (pageData.content.length === 0 && page > 1) {
        const prevPage = page - 1;
        setCurrentPage(prevPage);
        // 이전 페이지 데이터 조회 (재귀 호출 방지를 위해 직접 호출)
        const prevPageData = await getAlbums(
          sortApi,
          prevPage - 1,
          itemsPerPage
        );
        const prevBase = prevPageData.content ?? [];
        const prevDetails = await Promise.allSettled(prevBase.map((a) => getAlbum(a.uuid)));
        const prevDetailMap = new Map<string, any>();
        prevDetails.forEach((r) => {
          if (r.status === "fulfilled" && r.value?.uuid) {
            prevDetailMap.set(r.value.uuid, r.value);
          }
        });
        const prevEnriched: AlbumListItemEnriched[] = prevBase.map((a) => {
          const d = prevDetailMap.get(a.uuid);
          return {
            ...a,
            title: d?.title ?? a.title,
            color: d?.color ?? a.color,
            description: d?.description,
            isPublic: d?.isPublic,
            musicCount: d?.musicCount,
            musicCountLimit: d?.musicCountLimit,
            createdAt: d?.createdAt,
          };
        });
        if (fetchSeqRef.current === seq) {
          setAlbums(prevEnriched);
        }
        setTotalElements(prevPageData.totalElements);
        setTotalPages(prevPageData.totalPages);
        return;
      }
      
      // 현재 페이지 업데이트 (페이지 이동이 필요한 경우)
      if (page !== currentPage) {
        setCurrentPage(page);
      }
    } catch (err: any) {
      console.error("[Album List] 앨범 목록 조회 실패:", err);
      setError("앨범 목록을 불러오는데 실패했습니다.");
      setAlbums([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortApi, setCurrentPage]);
  
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
                  <button className="px-4 py-2 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] transition-colors">
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
                  <button className="px-4 py-2 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] transition-colors">
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

            {/* 에러 상태 */}
            {error && !isLoading && (
              <div className="flex items-center justify-center min-h-[540px] lg:min-h-[420px]">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* 앨범 리스트 그리드 */}
            {!isLoading && !error && (
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
                      onDelete={async (id) => {
                        try {
                          // 삭제 전 현재 상태 저장
                          const currentSortApi = sortApi;
                          const currentPageNum = currentPage;
                          
                          console.log("[Album List] 앨범 삭제 시작:", { id, currentPageNum, currentSortApi });
                          await deleteAlbum(id);
                          console.log("[Album List] 앨범 삭제 성공, 목록 조회 시작");
                          
                          // 삭제 성공 후 목록 새로고침 (삭제 전 sort, page, size 유지)
                          setIsLoading(true);
                          const pageData = await getAlbums(
                            currentSortApi,
                            currentPageNum - 1,
                            itemsPerPage
                          );
                          
                          console.log("[Album List] 목록 조회 성공:", pageData);
                          // 삭제 후에도 카드 표시용 상세 재로딩
                          const base = pageData.content ?? [];
                          const details = await Promise.allSettled(base.map((a) => getAlbum(a.uuid)));
                          const map = new Map<string, any>();
                          details.forEach((r) => {
                            if (r.status === "fulfilled" && r.value?.uuid) map.set(r.value.uuid, r.value);
                          });
                          setAlbums(
                            base.map((a) => {
                              const d = map.get(a.uuid);
                              return {
                                ...a,
                                title: d?.title ?? a.title,
                                color: d?.color ?? a.color,
                                description: d?.description,
                                isPublic: d?.isPublic,
                                musicCount: d?.musicCount,
                                musicCountLimit: d?.musicCountLimit,
                                createdAt: d?.createdAt,
                              };
                            })
                          );
                          setTotalElements(pageData.totalElements);
                          setTotalPages(pageData.totalPages);
                          
                          // 페이지가 비어있고 첫 페이지가 아니면 이전 페이지로 이동
                          if (pageData.content.length === 0 && currentPageNum > 1) {
                            const prevPage = currentPageNum - 1;
                            setCurrentPage(prevPage);
                            // 이전 페이지 데이터 조회
                            const prevPageData = await getAlbums(
                              currentSortApi,
                              prevPage - 1,
                              itemsPerPage
                            );
                            const prevBase = prevPageData.content ?? [];
                            const prevDetails = await Promise.allSettled(prevBase.map((a) => getAlbum(a.uuid)));
                            const prevMap = new Map<string, any>();
                            prevDetails.forEach((r) => {
                              if (r.status === "fulfilled" && r.value?.uuid) prevMap.set(r.value.uuid, r.value);
                            });
                            setAlbums(
                              prevBase.map((a) => {
                                const d = prevMap.get(a.uuid);
                                return {
                                  ...a,
                                  title: d?.title ?? a.title,
                                  color: d?.color ?? a.color,
                                  description: d?.description,
                                  isPublic: d?.isPublic,
                                  musicCount: d?.musicCount,
                                  musicCountLimit: d?.musicCountLimit,
                                  createdAt: d?.createdAt,
                                };
                              })
                            );
                            setTotalElements(prevPageData.totalElements);
                            setTotalPages(prevPageData.totalPages);
                          }
                          
                          setIsLoading(false);
                        } catch (error: any) {
                          console.error("[Album List] 앨범 삭제 실패:", error);
                          setIsLoading(false);
                          alert("앨범 삭제에 실패했습니다. 다시 시도해주세요.");
                        }
                      }}
                      onEdit={(id) => {
                        // 앨범 정보 페이지로 이동 (앨범 상세보기 API로 데이터 조회)
                        router.push(`${ROUTES.ALBUM.SHARE}?mode=info&albumId=${id}`);
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
      <Footer />
    </>
  );
}

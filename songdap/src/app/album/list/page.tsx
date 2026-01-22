"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/shared";
import Link from "next/link";
import { ROUTES } from "@/shared/lib";
import { AlbumCard } from "@/features/album/list/components";
import { HiChevronLeft, HiChevronRight, HiPencil } from "react-icons/hi";
import { getAlbums, deleteAlbum, type AlbumListItem, type AlbumSortOption } from "@/features/album/api";

type SortOption = "최신순" | "가나다순" | "인기순";

// 정렬 옵션 매핑
const sortOptionMap: Record<SortOption, AlbumSortOption> = {
  "최신순": "LATEST",
  "가나다순": "TITLE",
  "인기순": "POPULAR",
};

export default function AlbumListPage() {
  const router = useRouter();
  const [sortOption, setSortOption] = useState<SortOption>("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [albums, setAlbums] = useState<AlbumListItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  const itemsPerPage = 4; // 한 페이지에 표시할 앨범 개수
  
  // 앨범 목록 조회 함수 (재사용 가능)
  const fetchAlbums = useCallback(async (targetPage?: number, targetSort?: SortOption) => {
    const page = targetPage ?? currentPage;
    const sort = targetSort ?? sortOption;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 백엔드 API는 0부터 시작하는 페이지 번호를 사용하므로 page - 1
      const pageData = await getAlbums(
        sortOptionMap[sort],
        page - 1,
        itemsPerPage
      );
      
      setAlbums(pageData.content);
      setTotalElements(pageData.totalElements);
      setTotalPages(pageData.totalPages);
      
      // 페이지가 비어있고 첫 페이지가 아니면 이전 페이지로 이동
      if (pageData.content.length === 0 && page > 1) {
        const prevPage = page - 1;
        setCurrentPage(prevPage);
        // 이전 페이지 데이터 조회 (재귀 호출 방지를 위해 직접 호출)
        const prevPageData = await getAlbums(
          sortOptionMap[sort],
          prevPage - 1,
          itemsPerPage
        );
        setAlbums(prevPageData.content);
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
  }, [currentPage, sortOption]);
  
  // API에서 앨범 목록 가져오기
  useEffect(() => {
    fetchAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption, currentPage]);
  
  // 정렬 옵션 변경 시 첫 페이지로 이동
  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    setCurrentPage(1);
  };

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
              <div className="flex items-center gap-2">
                {(["최신순", "가나다순", "인기순"] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      sortOption === option
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
                      albumName={album.title}
                      albumColor={album.color}
                      isPublic={true} // 목록 API에서는 isPublic 정보가 없으므로 기본값
                      songCount={0} // 목록 API에서는 musicCount 정보가 없으므로 기본값
                      imageUrl={null}
                      createdAt={""}
                      isEditMode={isEditMode}
                      onDelete={async (id) => {
                        try {
                          // 삭제 전 현재 상태 저장
                          const currentSort = sortOption;
                          const currentPageNum = currentPage;
                          
                          console.log("[Album List] 앨범 삭제 시작:", { id, currentPageNum, currentSort });
                          await deleteAlbum(id);
                          console.log("[Album List] 앨범 삭제 성공, 목록 조회 시작");
                          
                          // 삭제 성공 후 목록 새로고침 (삭제 전 sort, page, size 유지)
                          setIsLoading(true);
                          const pageData = await getAlbums(
                            sortOptionMap[currentSort],
                            currentPageNum - 1,
                            itemsPerPage
                          );
                          
                          console.log("[Album List] 목록 조회 성공:", pageData);
                          setAlbums(pageData.content);
                          setTotalElements(pageData.totalElements);
                          setTotalPages(pageData.totalPages);
                          
                          // 페이지가 비어있고 첫 페이지가 아니면 이전 페이지로 이동
                          if (pageData.content.length === 0 && currentPageNum > 1) {
                            const prevPage = currentPageNum - 1;
                            setCurrentPage(prevPage);
                            // 이전 페이지 데이터 조회
                            const prevPageData = await getAlbums(
                              sortOptionMap[currentSort],
                              prevPage - 1,
                              itemsPerPage
                            );
                            setAlbums(prevPageData.content);
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
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="이전 페이지"
                >
                  <HiChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                {/* 페이지 번호 */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="다음 페이지"
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

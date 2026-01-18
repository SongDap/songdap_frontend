"use client";

import { useState, useRef } from "react";
import { Header, Footer } from "@/shared";
import Link from "next/link";
import { ROUTES } from "@/shared/lib";
import { AlbumCard } from "@/features/album/list/components";
import { HiChevronLeft, HiChevronRight, HiPencil } from "react-icons/hi";
import { SAMPLE_ALBUMS } from "@/shared/lib/mockData";

type SortOption = "최신순" | "가나다순" | "인기순";

export default function AlbumListPage() {
  const [sortOption, setSortOption] = useState<SortOption>("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  const totalAlbums = SAMPLE_ALBUMS.length;
  const itemsPerPage = 4; // 한 페이지에 표시할 앨범 개수
  const totalPages = Math.ceil(totalAlbums / itemsPerPage);
  
  // 현재 페이지에 해당하는 앨범들
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlbums = SAMPLE_ALBUMS.slice(startIndex, endIndex);

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
                총 <span className="font-bold">{totalAlbums}</span>개
              </p>
              <div className="flex items-center gap-2">
                {(["최신순", "가나다순", "인기순"] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortOption(option)}
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

            {/* 앨범 리스트 그리드 */}
            <div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 min-h-[540px] lg:min-h-[420px]"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {currentAlbums.map((album) => (
                <AlbumCard
                  key={album.uuid}
                  id={album.uuid}
                  albumName={album.title}
                  albumColor={album.color}
                  isPublic={album.isPublic}
                  songCount={album.musicCount}
                  imageUrl={album.imageUrl}
                  createdAt={album.createdAt}
                  isEditMode={isEditMode}
                  onDelete={(id) => {
                    // TODO: 앨범 삭제 API 호출
                    console.log("앨범 삭제:", id);
                  }}
                  onEdit={(id) => {
                    // 앨범 정보를 찾아서 sessionStorage에 저장하고 앨범 공유 페이지로 이동
                    const album = SAMPLE_ALBUMS.find((a) => a.uuid === id);
                    if (album) {
                      // 앨범 데이터를 sessionStorage에 저장
                      sessionStorage.setItem(
                        "albumCreateData",
                        JSON.stringify({
                          title: album.title,
                          description: album.description || "",
                          isPublic: album.isPublic,
                          musicCount: album.musicCount,
                          musicCountLimit: album.musicCountLimit,
                          color: album.color,
                        })
                      );
                      // 앨범 정보 모드로 공유 페이지로 이동
                      window.location.href = `${ROUTES.ALBUM.SHARE}?mode=info`;
                    }
                  }}
                />
              ))}
            </div>

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

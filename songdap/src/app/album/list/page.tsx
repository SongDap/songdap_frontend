"use client";

import { useState, useRef } from "react";
import { Header, Footer } from "@/shared";
import Link from "next/link";
import { ROUTES } from "@/shared/lib";
import { AlbumCard } from "@/features/album/list/components";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

// 임시 샘플 데이터
const sampleAlbums = [
  {
    id: "1",
    albumName: "2024 여름 플레이리스트",
    albumColor: "#00c7fc",
    isPublic: true,
    songCount: 15,
    imageUrl: null,
    createdAt: "2024.01.15",
  },
  {
    id: "2",
    albumName: "드라이빙 뮤직",
    albumColor: "#3a88fe",
    isPublic: true,
    songCount: 20,
    imageUrl: null,
    createdAt: "2024.02.20",
  },
  {
    id: "3",
    albumName: "나만의 음악",
    albumColor: "#5e30eb",
    isPublic: false,
    songCount: 12,
    imageUrl: null,
    createdAt: "2024.03.10",
  },
  {
    id: "4",
    albumName: "감성 밤 음악",
    albumColor: "#d357fe",
    isPublic: true,
    songCount: 18,
    imageUrl: null,
    createdAt: "2024.04.05",
  },
  {
    id: "5",
    albumName: "운동할 때 듣는 음악",
    albumColor: "#ed719e",
    isPublic: true,
    songCount: 25,
    imageUrl: null,
    createdAt: "2024.05.12",
  },
  {
    id: "6",
    albumName: "집중할 때",
    albumColor: "#ff6251",
    isPublic: false,
    songCount: 10,
    imageUrl: null,
    createdAt: "2024.06.01",
  },
];

type SortOption = "최신순" | "가나다순" | "인기순";

export default function AlbumListPage() {
  const [sortOption, setSortOption] = useState<SortOption>("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  const totalAlbums = sampleAlbums.length;
  const itemsPerPage = 4; // 한 페이지에 표시할 앨범 개수
  const totalPages = Math.ceil(totalAlbums / itemsPerPage);
  
  // 현재 페이지에 해당하는 앨범들
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlbums = sampleAlbums.slice(startIndex, endIndex);

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
      <div className="min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 pt-8">
          <section className="flex items-end gap-4 mb-8">
            <div>
              <h1 className="text-[50px] font-bold">내 앨범</h1>
              <p className="text-[15px] mt-2">친구들의 노래가 담길 앨범을 만들어보세요.</p>
            </div>
            <Link href={ROUTES.ALBUM.CREATE}>
              <button className="px-4 py-2 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] transition-colors mb-1">
                + 새 앨범 만들기
              </button>
            </Link>
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
                        ? "bg-[#006FFF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 페이지네이션 - 모바일 버전 (위) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mb-4 md:hidden">
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
                          ? "bg-[#006FFF] text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
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

            {/* 앨범 리스트 그리드 */}
            <div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-4 min-h-[540px] md:min-h-[420px]"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {currentAlbums.map((album) => (
                <AlbumCard
                  key={album.id}
                  id={album.id}
                  albumName={album.albumName}
                  albumColor={album.albumColor}
                  isPublic={album.isPublic}
                  songCount={album.songCount}
                  imageUrl={album.imageUrl}
                  createdAt={album.createdAt}
                />
              ))}
            </div>

            {/* 페이지네이션 - PC 버전 (아래) */}
            {totalPages > 1 && (
              <div className="hidden md:flex items-center justify-center gap-4">
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
                          ? "bg-[#006FFF] text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
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

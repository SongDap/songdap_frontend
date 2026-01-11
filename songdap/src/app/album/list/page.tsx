"use client"; // HTML + 메서드(JS 코드)가 같이 배달됩니다.
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, type ReactNode } from "react";

import { AlbumCoverWithLP } from "@/shared/ui";
import { AlbumDetailModal, AlbumInfoButton } from "@/features/song";
import type { AlbumData } from "@/features/song/components/types";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";

// 예시 데이터(원하면 제거 가능)
const EXAMPLE_ALBUM: AlbumData = {
  albumName: "겨울 감성 플레이리스트",
  albumDescription: "추운 겨울날 듣기 좋은 따뜻한 노래들을 모아봤어요. 함께 들어요!",
  category: "mood",
  categoryTag: "감성적인",
  isPublic: "public",
  songCount: 5,
  coverColor: "#98d9d4",
  lpColor: "#98d9d4",
  coverImageUrl: undefined,
  lpCircleImageUrl: undefined,
  nickname: "음악러버",
  createdDate: "2025.12.30",
};

// 공개여부체크(현재 미사용이면 삭제 가능)
function PrivacyText(isPublic: AlbumData["isPublic"]) {
  return isPublic === "public" ? "공개" : "비공개";
}

export default function AlbumListPage() {
  const { user } = useOauthStore();
  const [albums, setAlbums] = useState<AlbumData[]>([]);

  // hoverAlbum(현재 미사용이면 삭제 가능)
  const [hoverAlbum, setHoverAlbum] = useState<AlbumData | null>(null);

  // 드롭다운
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  // 모달
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 페이지네이션
  const [page, setPage] = useState(1);
  const PER_PAGE = 6; // 선반 2개 * 선반당 3개

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedAlbums: AlbumData[] = JSON.parse(localStorage.getItem("albums") || "[]");
    const userAlbums = user ? savedAlbums.filter((a) => a.nickname === user.nickname) : [];

    // 예시앨범 테스트용
    const list = user ? [EXAMPLE_ALBUM, ...userAlbums] : [];
    setAlbums(list);

    // 유저 바뀌면 1페이지로
    setPage(1);
  }, [user]);

  const totalCount = albums.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  const currentPageAlbums = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PER_PAGE;
    return albums.slice(start, start + PER_PAGE);
  }, [albums, page, totalPages]);

  // 선반별 쪼개기
  const shelf1 = currentPageAlbums.slice(0, 3);
  const shelf2 = currentPageAlbums.slice(3, 6);

  const handleOpenModal = (album: AlbumData) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  // 선반 위 “앨범 추가” 카드
  const AddAlbumCard = () => (
    <Link href="/album/create" className="group flex flex-col items-center justify-center gap-2">
      <div className="flex h-[140px] w-[140px] items-center justify-center rounded-xl border border-black/20 bg-white/70 shadow-sm group-hover:opacity-80">
        <span className="text-3xl leading-none">+</span>
      </div>
      <span className="text-[12px] text-black/70">앨범 추가</span>
    </Link>
  );

  // 선반 슬롯 3칸 채우기 (앨범 + 필요 시 앨범추가 + 더미)
  const renderShelfSlots = (items: AlbumData[], shelfKey: string) => {
    const slots: ReactNode[] = [];

    // 1) 앨범들
    items.forEach((album, idx) => {
      slots.push(
        <div key={`${shelfKey}-album-${idx}`} className="flex flex-col items-center gap-2">
          <button type="button" onClick={() => handleOpenModal(album)} className="cursor-pointer">
            <AlbumCoverWithLP
              coverSize={140}
              lpSize={126}
              coverColor={album.coverColor}
              lpCircleColor={album.lpColor}
              coverImageUrl={album.coverImageUrl}
              lpCircleImageUrl={album.lpCircleImageUrl}
              albumName={album.albumName}
              tag={album.categoryTag}
              date={album.createdDate}
              showCoverText={true}
            />
          </button>
          <AlbumInfoButton coverSize={140} onClick={() => handleOpenModal(album)} />
        </div>
      );
    });

    // 2) 빈칸이 있으면 첫 빈칸에 “앨범 추가”
    if (items.length < 3) {
      slots.push(<AddAlbumCard key={`${shelfKey}-add`} />);
    }

    // 3) 나머지 빈칸은 더미로 채워 정렬 유지
    while (slots.length < 3) {
      slots.push(<div key={`${shelfKey}-empty-${slots.length}`} className="h-[170px] w-[140px]" />);
    }

    return slots;
  };

  return (
    <main className="w-full px-4 pt-4 sm:pt-6 flex flex-col items-center">
      <div className="relative min-h-screen w-full">
        {/* 배경 */}
        <Image
          src="/images/subBackground.png"
          alt="Album list background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* ✅ 768*1024 프레임 (여기 안에 전부 넣어야 함) */}
        <div className="relative z-10 mx-auto flex w-full max-w-[768px] min-h-[1024px] flex-col">
          {/* 헤더 */}
          <header className="w-full flex items-start justify-between pt-6">
            <div>
              <h1
                className="text-[80px] md:text-[90px] font-extrabold tracking-tight leading-none"
                style={{ fontFamily: "hssaemaeul" }}
              >
                <span className="text-[#4A86E8]">{user?.nickname ?? "사용자"}</span> 님의 Album
              </h1>

              <h2 className="mt-4 text-[20px] text-black/70">
                {totalCount === 0 ? (
                  "아직 발매한 앨범이 없어요..."
                ) : (
                  <>
                    지금까지 총 <span className="text-red-500 font-bold">{totalCount}</span>개의 앨범을 발매했어요
                  </>
                )}
              </h2>

              <div className="mt-4 flex items-center gap-4 text-[14px] text-black/70">
                <button type="button" className="hover:opacity-70">
                  가나다순
                </button>
                <button type="button" className="hover:opacity-70">
                  최신순
                </button>
                <button type="button" className="hover:opacity-70">
                  인기순
                </button>
              </div>
            </div>

            {/* 우측 드롭다운 */}
            <div
              className="relative flex items-center gap-2 text-[14px] font-semibold text-black/70 cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/30 bg-white">
                👤
              </span>
              {user?.nickname ?? "게스트"}

              {isDropdownOpen && (
                <div className="absolute top-full right-0 pt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    <li>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        닉네임 수정
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        프로필 사진 수정
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        로그아웃
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </header>

          {/* ✅ 본문(선반/페이지네이션) */}
          {totalCount === 0 ? (
            <div className="mt-16 w-full flex flex-col items-center gap-24">
              {/* 선반 2개 */}
              <div className="relative h-[56px] w-full max-w-[640px]">
                <Image src="/images/listLine.png" alt="shelf top" fill className="object-contain" priority />
              </div>
              <div className="relative h-[56px] w-full max-w-[640px]">
                <Image src="/images/listLine.png" alt="shelf bottom" fill className="object-contain" />
              </div>

              {/* 0개일 때는 선반 영역에 앨범추가 */}
              <div className="-mt-10">
                <AddAlbumCard />
              </div>
            </div>
          ) : (
            <>
              {/* 선반 1 */}
              <section className="mt-12 w-full">
                <div className="relative mx-auto w-full max-w-[640px]">
                  <div className="absolute left-1/2 top-[-54px] -translate-x-1/2 flex items-end gap-6">
                    {renderShelfSlots(shelf1, "shelf1")}
                  </div>

                  <div className="relative h-[56px] w-full">
                    <Image src="/images/listLine.png" alt="shelf 1" fill className="object-contain" priority />
                  </div>
                </div>
              </section>

              {/* 선반 2 */}
              <section className="mt-24 w-full">
                <div className="relative mx-auto w-full max-w-[640px]">
                  <div className="absolute left-1/2 top-[-54px] -translate-x-1/2 flex items-end gap-6">
                    {renderShelfSlots(shelf2, "shelf2")}
                  </div>

                  <div className="relative h-[56px] w-full">
                    <Image src="/images/listLine.png" alt="shelf 2" fill className="object-contain" />
                  </div>
                </div>
              </section>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-3 pb-10">
                  <button
                    type="button"
                    className="rounded border border-black/20 bg-white px-3 py-1 text-sm hover:opacity-70 disabled:opacity-40"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    이전
                  </button>
                  <span className="text-sm text-black/70">
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="rounded border border-black/20 bg-white px-3 py-1 text-sm hover:opacity-70 disabled:opacity-40"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    다음
                  </button>
                </nav>
              )}
            </>
          )}
        </div>

        {/* 상세조회 모달 */}
        {selectedAlbum && (
          <AlbumDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            editable={false}
            albumData={selectedAlbum}
            onSave={() => {}}
          />
        )}
      </div>
    </main>
  );
}

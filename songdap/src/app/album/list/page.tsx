"use client"; // HTML + 메서드(JS 코드)가 같이 배달됩니다.
import Image from "next/image";
import { AlbumDetailModal } from "@/features/song";
import { useAlbumList } from "@/features/album/list";
import { AlbumListHeader, AlbumShelf, AlbumPagination, EmptyAlbumList } from "@/features/album/list";

export default function AlbumListPage() {
  const {
    user,
    selectedAlbum,
    isModalOpen,
    setIsModalOpen,
    page,
    setPage,
    totalCount,
    totalPages,
    shelf1,
    shelf2,
    handleOpenModal,
    handleCloseModal,
  } = useAlbumList();

  return (
    <div className="min-h-screen flex justify-center relative overflow-hidden">
      {/* 배경 */}
      <Image
        src="/images/subBackground.png"
        alt="Album list background"
        fill
        priority
        className="object-cover object-center -z-10 pointer-events-none"
      />

      {/* 내용 (배경 위로) */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[600px] flex-col">

        <main className="w-full max-w-[600px] flex flex-col items-center justify-start pt-10 pb-10">
          <AlbumListHeader user={user} totalCount={totalCount} />

          {/* 본문(선반/페이지네이션) */}
          {totalCount === 0 ? (
            <EmptyAlbumList />
          ) : (
            <>
              {/* 선반 1 */}
              <div className="mt-12">
                <AlbumShelf items={shelf1} shelfKey="shelf1" onOpenModal={handleOpenModal} />
              </div>

              {/* 선반 2 */}
              <div className="mt-24">
                <AlbumShelf items={shelf2} shelfKey="shelf2" onOpenModal={handleOpenModal} />
              </div>

              <AlbumPagination page={page} totalPages={totalPages} setPage={setPage} />
            </>
          )}
        </main>

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
    </div>
  );
}

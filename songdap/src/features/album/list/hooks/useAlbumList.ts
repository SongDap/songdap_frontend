// hooks/useAlbumList.ts
import { useState, useEffect, useMemo } from "react";
import type { AlbumData } from "@/features/song/components/types";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { EXAMPLE_ALBUM, PER_PAGE } from "../constants";

export function useAlbumList() {
  const { user } = useOauthStore();
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [hoverAlbum, setHoverAlbum] = useState<AlbumData | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

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

  return {
    user,
    albums,
    hoverAlbum,
    setHoverAlbum,
    selectedAlbum,
    isModalOpen,
    setIsModalOpen,
    page,
    setPage,
    totalCount,
    totalPages,
    currentPageAlbums,
    shelf1,
    shelf2,
    handleOpenModal,
    handleCloseModal,
  };
}
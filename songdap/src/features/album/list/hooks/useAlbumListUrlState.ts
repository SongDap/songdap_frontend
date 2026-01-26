import { useEffect, useRef, useState } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { AlbumSortOption } from "@/features/album/api";
import {
  parseAlbumListQuery,
  sortApiToLabel,
  sortLabelToApi,
  type AlbumListSortLabel,
} from "../lib/albumListQuery";

type UseAlbumListUrlStateArgs = {
  searchParams: ReadonlyURLSearchParams;
  onReplaceUrl: (nextUrl: string) => void;
  makeListUrl: (q: { sort?: AlbumSortOption; page?: number }) => string;
};

/**
 * 앨범 리스트의 sort/page를 URL과 동기화하는 "상태관리" 훅
 * - 최초 1회: URL 쿼리로 state 초기화
 * - 이후: state 변경 시 URL 쿼리 갱신
 */
export function useAlbumListUrlState({
  searchParams,
  onReplaceUrl,
  makeListUrl,
}: UseAlbumListUrlStateArgs) {
  const [sortLabel, setSortLabel] = useState<AlbumListSortLabel>("최신순");
  const [currentPage, setCurrentPage] = useState(1);

  const hasInitRef = useRef(false);

  // URL -> state (최초 1회)
  useEffect(() => {
    if (hasInitRef.current) return;
    const { sort, page } = parseAlbumListQuery(searchParams);
    if (sort) setSortLabel(sortApiToLabel[sort]);
    if (page) setCurrentPage(page);
    hasInitRef.current = true;
  }, [searchParams]);

  // state -> URL
  useEffect(() => {
    if (!hasInitRef.current) return;
    const sort = sortLabelToApi[sortLabel];
    onReplaceUrl(makeListUrl({ sort, page: currentPage }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortLabel, currentPage]);

  const sortApi: AlbumSortOption = sortLabelToApi[sortLabel];

  return {
    // state
    sortLabel,
    sortApi,
    currentPage,
    // setters
    setSortLabel,
    setCurrentPage,
    // handlers
    handleSortChange: (next: AlbumListSortLabel) => {
      setSortLabel(next);
      setCurrentPage(1);
    },
  };
}


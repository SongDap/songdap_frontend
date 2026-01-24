import type { ReadonlyURLSearchParams } from "next/navigation";
import type { AlbumSortOption } from "@/features/album/api";
import { ROUTES } from "@/shared/lib/routes";

/**
 * 앨범 리스트의 정렬/페이지 쿼리를 한 곳에서 관리
 * - list: /album/list?sort=LATEST&page=1
 * - detail: /album/{uuid}?sort=LATEST&page=1  (리스트로 돌아올 때 유지용)
 */

export type AlbumListSortLabel = "최신순" | "오래된순" | "가나다순" | "인기순";

export const ALBUM_LIST_SORT_LABELS: AlbumListSortLabel[] = [
  "최신순",
  "오래된순",
  "가나다순",
  "인기순",
];

export const sortLabelToApi: Record<AlbumListSortLabel, AlbumSortOption> = {
  "최신순": "LATEST",
  "오래된순": "OLDEST",
  "가나다순": "TITLE",
  "인기순": "POPULAR",
};

export const sortApiToLabel: Record<AlbumSortOption, AlbumListSortLabel> = {
  LATEST: "최신순",
  OLDEST: "오래된순",
  TITLE: "가나다순",
  POPULAR: "인기순",
};

export type AlbumListQuery = {
  sort?: AlbumSortOption;
  page?: number; // 1-based
};

export function parseAlbumListQuery(
  searchParams: ReadonlyURLSearchParams
): AlbumListQuery {
  const sortRaw = searchParams.get("sort") as AlbumSortOption | null;
  const pageRaw = searchParams.get("page");

  const sort =
    sortRaw && (sortRaw === "LATEST" || sortRaw === "OLDEST" || sortRaw === "TITLE" || sortRaw === "POPULAR")
      ? sortRaw
      : undefined;

  const pageNum = pageRaw ? Number(pageRaw) : undefined;
  const page =
    pageNum && Number.isFinite(pageNum) && pageNum >= 1 ? Math.floor(pageNum) : undefined;

  return { sort, page };
}

export function makeAlbumListUrl(query?: AlbumListQuery) {
  const qp = new URLSearchParams();
  if (query?.sort) qp.set("sort", query.sort);
  if (query?.page) qp.set("page", String(query.page));
  const qs = qp.toString();
  return qs ? `${ROUTES.ALBUM.LIST}?${qs}` : ROUTES.ALBUM.LIST;
}

export function makeAlbumDetailUrl(albumUuid: string, query?: AlbumListQuery) {
  const qp = new URLSearchParams();
  if (query?.sort) qp.set("sort", query.sort);
  if (query?.page) qp.set("page", String(query.page));
  const qs = qp.toString();
  const base = ROUTES.ALBUM.DETAIL(albumUuid);
  return qs ? `${base}?${qs}` : base;
}


"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export type SongAddDraftSong = {
  title: string;
  artist: string;
  imageUrl: string;
};

export type SongAddDraftMessage = {
  nickname: string;
  message: string;
};

export type SongAddDraftStep = "form" | "message";

export type SongAddDraft = {
  step: SongAddDraftStep;
  song: SongAddDraftSong;
  message: SongAddDraftMessage;
};

const EMPTY_DRAFT: SongAddDraft = {
  step: "form",
  song: { title: "", artist: "", imageUrl: "" },
  message: { nickname: "", message: "" },
};

function key(albumUuid: string) {
  // albumId가 없는 경우에도 안전하게 캐시 분리
  return ["songAddDraft", albumUuid || "no-album"] as const;
}

/**
 * 노래 추가 페이지 드래프트(임시 입력값) 관리
 * - 서버에 보내기 전까지 입력값을 유지해서 "다시 와서 수정" 가능
 * - 새로고침하면 Query 캐시는 사라질 수 있음(메모리 기반)
 */
export function useSongAddDraft(albumUuid: string) {
  const queryClient = useQueryClient();
  const queryKey = key(albumUuid);

  const draftQuery = useQuery({
    queryKey,
    queryFn: async () => EMPTY_DRAFT,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const draft = (draftQuery.data ?? EMPTY_DRAFT) as SongAddDraft;

  /**
   * IMPORTANT:
   * - 한글 IME 조합 중에도 입력이 자연스럽게 동작하려면
   *   "이전 draft를 기준으로 덮어쓰기"가 발생하면 안 됨.
   * - 따라서 항상 최신 캐시 값을 기준으로 함수형 업데이트를 사용.
   */
  const updateDraft = (updater: (prev: SongAddDraft) => SongAddDraft) => {
    queryClient.setQueryData(queryKey, (prev) =>
      updater(((prev as SongAddDraft) ?? EMPTY_DRAFT) as SongAddDraft)
    );
  };

  return {
    draft,
    setStep: (step: SongAddDraftStep) => updateDraft((prev) => ({ ...prev, step })),
    setSong: (partial: Partial<SongAddDraftSong>) =>
      updateDraft((prev) => ({ ...prev, song: { ...prev.song, ...partial } })),
    setMessage: (partial: Partial<SongAddDraftMessage>) =>
      updateDraft((prev) => ({ ...prev, message: { ...prev.message, ...partial } })),
    reset: () => queryClient.setQueryData(queryKey, EMPTY_DRAFT),
  };
}


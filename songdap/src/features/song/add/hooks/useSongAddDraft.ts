"use client";

import { useState, useCallback } from "react";

export type SongAddDraftSong = {
  title: string;
  artist: string;
  imageUrl: string;
  imageFile?: File;
};

export type SongAddDraftMessage = {
  writer: string;
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
  message: { writer: "", message: "" },
};

/**
 * 노래 추가 페이지 드래프트(임시 입력값) 관리
 * - useState를 사용하여 간단하고 명확한 상태 관리
 * - 입력 시 중복 업데이트 문제 해결
 */
export function useSongAddDraft(albumUuid: string) {
  const [draft, setDraft] = useState<SongAddDraft>(EMPTY_DRAFT);

  const setStep = useCallback((step: SongAddDraftStep) => {
    setDraft((prev) => ({ ...prev, step }));
  }, []);

  const setSong = useCallback((partial: Partial<SongAddDraftSong>) => {
    setDraft((prev) => ({ ...prev, song: { ...prev.song, ...partial } }));
  }, []);

  const setMessage = useCallback((partial: Partial<SongAddDraftMessage>) => {
    setDraft((prev) => ({ ...prev, message: { ...prev.message, ...partial } }));
  }, []);

  const reset = useCallback(() => {
    setDraft(EMPTY_DRAFT);
  }, []);

  return {
    draft,
    setStep,
    setSong,
    setMessage,
    reset,
  };
}


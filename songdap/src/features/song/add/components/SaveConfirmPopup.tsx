"use client";

import { useEffect, useRef } from "react";

type SaveConfirmPopupProps = {
  pageNumber: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function SaveConfirmPopup({
  pageNumber,
  onConfirm,
  onCancel,
}: SaveConfirmPopupProps) {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;
    hasShown.current = true;

    const confirmed = window.confirm(
      `${pageNumber}페이지에 노래가 추가되었습니다!\n\n확인을 누르면 노래 추가가 완료됩니다.`
    );

    if (confirmed) {
      onConfirm();
    } else {
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 한 번만 실행

  return null;
}

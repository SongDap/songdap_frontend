"use client";

import { HiX } from "react-icons/hi";

type AutoPlayFailedModalProps = {
  onRetry: () => void;
  onCancel: () => void;
};

export default function AutoPlayFailedModal({ onRetry, onCancel }: AutoPlayFailedModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[110]"
        onClick={onCancel}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-[120] p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center text-gray-900 font-medium mb-5">
          다음 곡 재생에 실패했어요.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-3 rounded-xl bg-[#006FFF] text-white font-semibold hover:bg-[#0056CC]"
          >
            다음 곡 재생
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
          >
            연속 재생 취소
          </button>
        </div>
      </div>
    </>
  );
}

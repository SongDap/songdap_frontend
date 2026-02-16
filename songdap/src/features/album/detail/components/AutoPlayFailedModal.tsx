"use client";

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
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 pointer-events-none"
        aria-hidden
      >
        <div
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 pointer-events-auto"
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
      </div>
    </>
  );
}

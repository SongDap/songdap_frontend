"use client";

type BottomConfirmModalProps = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function BottomConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}: BottomConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 백드롭 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[90] md:hidden"
        onClick={onCancel}
      />
      {/* 모달 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-[100] md:hidden animate-slide-up">
        <div className="mb-6">
          <p className="text-base text-gray-900 text-center">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}

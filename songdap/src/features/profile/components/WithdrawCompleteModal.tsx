"use client";

interface WithdrawCompleteModalProps {
  open: boolean;
  onClose: () => void;
}

export function WithdrawCompleteModal({
  open,
  onClose,
}: WithdrawCompleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[360px] rounded-lg bg-white p-6 text-center shadow-lg">
        <p className="mb-2 text-lg font-semibold">
          회원탈퇴가 완료되었습니다.
        </p>
        <p className="mb-6 text-sm text-gray-600">
          추후 꼭 다시<br />
          <span className="font-medium text-blue-900">
            노래로 답해줘
          </span>
          를 찾아주세요~!!
        </p>

        <button
          onClick={onClose}
          className="h-10 w-full rounded-md bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800"
        >
          확인
        </button>
      </div>
    </div>
  );
}

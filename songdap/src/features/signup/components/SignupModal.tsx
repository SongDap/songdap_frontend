// components/SignupModal.tsx
interface SignupModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

export function SignupModal({ showModal, setShowModal }: SignupModalProps) {
  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[520px] rounded-[16px] border-2 border-black bg-white p-6">
        <div className="flex items-start justify-between">
          <p className="text-[20px] font-bold text-black">
            새로운 앨범을 발매하시겠습니까?
          </p>

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="text-[24px] leading-none text-black"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              // TODO: "네" 선택 후 동작 (예: 라우팅)
            }}
            className="h-[52px] w-[120px] rounded-[6px] border-2 border-black bg-[#d9d9d9] font-bold"
          >
            네
          </button>

          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              // TODO: "다음에 발매" 선택 후 동작
            }}
            className="h-[52px] w-[180px] rounded-[6px] border-2 border-black bg-[#d9d9d9] font-bold"
          >
            다음에 발매
          </button>
        </div>
      </div>
    </div>
  );
}
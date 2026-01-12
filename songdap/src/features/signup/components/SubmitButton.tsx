// components/SubmitButton.tsx
interface SubmitButtonProps {
  canSubmit: boolean;
}

export function SubmitButton({ canSubmit }: SubmitButtonProps) {
  return (
    <div className="mt-12 w-full flex justify-center">
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full max-w-[704px] h-[64px] sm:h-[80px] md:h-[96px] rounded-[10px] border-[3px] border-black bg-[#d9d9d9] text-black text-[18px] sm:text-[22px] md:text-[28px] font-[var(--font-cafe24-proslim)] flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed">
        계정 만들기
      </button>
    </div>
  );
}
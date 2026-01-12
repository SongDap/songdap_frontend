// components/AgreementCheckbox.tsx
interface AgreementCheckboxProps {
  agreed: boolean;
  setAgreed: (value: boolean) => void;
}

export function AgreementCheckbox({ agreed, setAgreed }: AgreementCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        id="agreed"
        type="checkbox"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        className="h-4 w-4 rounded-[2px] border border-gray-400"
      />
      <label htmlFor="agreed" className="text-gray-800" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>
        이용약관 및 개인정보수집이용 동의{" "}
        <span className="text-red-500">(필수)</span>
      </label>
    </div>
  );
}
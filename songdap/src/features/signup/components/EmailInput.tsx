// components/EmailInput.tsx
interface EmailInputProps {
  email: string;
  setEmail: (value: string) => void;
}

export function EmailInput({ email, setEmail }: EmailInputProps) {
  return (
    <section>
      <div className="flex justify-center">
        <div style={{ width: 'clamp(300px, 80vw, 704px)' }}>
          <div className="mb-2 flex items-end justify-between">
            <label htmlFor="email" className="font-medium text-[#222]" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' }}>
              이메일(선택)
            </label>
          </div>

          <input
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[6px] border border-[#b9b1a8] bg-white px-5 outline-none focus:ring-2 focus:ring-[#4A86E8]/30"
            style={{
              height: 'clamp(44px, 6vh, 56px)',
              fontSize: 'clamp(16px, 3.5vw, 20px)'
            }}
          />
        </div>
      </div>
    </section>
  );
}
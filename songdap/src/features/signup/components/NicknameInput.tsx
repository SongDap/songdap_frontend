// components/NicknameInput.tsx
import { MAX_NICK } from "../constants";

interface NicknameInputProps {
  nickname: string;
  setNickname: (value: string) => void;
  nicknameLen: number;
}

export function NicknameInput({ nickname, setNickname, nicknameLen }: NicknameInputProps) {
  return (
    <section>
      <div className="flex justify-center">
        <div style={{ width: 'clamp(300px, 80vw, 704px)' }}>
          <div className="mb-2 flex items-end justify-between">
            <label htmlFor="nickname" className="font-medium text-[#222]" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' }}>
              닉네임(필수)
            </label>
            <span className="text-[#6b7280]" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>
              {nicknameLen}/{MAX_NICK}
            </span>
          </div>

          <input
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={MAX_NICK}
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
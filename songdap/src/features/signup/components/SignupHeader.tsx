// components/SignupHeader.tsx
export function SignupHeader() {
  return (
    <header className="text-left" style={{ fontFamily: 'YangJin' }}>
      <h1
        id="signup-title"
        className="leading-[1.05] font-extrabold tracking-tight text-[#111]"
        style={{ fontSize: 'clamp(4rem, 6vw, 2.75rem)' }}
      >
        사용할 <span className="text-[#4A86E8]">닉네임</span>을
        <br />
        입력해주세요
      </h1>
    </header>
  );
}
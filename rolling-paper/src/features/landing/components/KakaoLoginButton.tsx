// src/features/landing/components/KakaoLoginButton.tsx
import Image from "next/image";

export default function KakaoLoginButton() {
  return (
    <a href="#" className="kakao-btn">
      <Image
        src="/kakaoLoginMain.png"
        alt="카카오 로그인"
        width={340}
        height={56}
        priority
      />
    </a>
  );
}
